import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 1. Initialisation sécurisée du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase URL ou Key non configurée dans les variables d\'environnement.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Interfaces TypeScript
interface BookingPayload {
  serviceId: string;
  userId: string;
  startDate: string;
  endDate?: string;
  amount: number; // Montant total brut (ex: Ar / EUR)
  currency?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingPayload = await request.json();
    const {
      serviceId,
      userId,
      startDate,
      endDate,
      amount,
      currency = 'MGA',
      customerName,
      customerEmail,
      customerPhone,
    } = body;

    // 2. Validation des champs requis
    if (!serviceId || !userId || !amount || amount <= 0 || !customerEmail) {
      return NextResponse.json(
        {
          error:
            'Champs obligatoires manquants ou invalides (serviceId, userId, amount, customerEmail).',
        },
        { status: 400 }
      );
    }

    // 3. Calcul de la commission de la plateforme (10 %) et du net prestataire (90 %)
    const COMMISSION_RATE = 0.10;
    const platformCommission = Math.round(amount * COMMISSION_RATE * 100) / 100;
    const providerPayout = Math.round((amount - platformCommission) * 100) / 100;

    // 4. Insertion initiale de la réservation dans Supabase
    const { data: booking, error: dbError } = await supabase
      .from('bookings')
      .insert([
        {
          service_id: serviceId,
          user_id: userId,
          start_date: startDate,
          end_date: endDate || null,
          total_amount: amount,
          platform_commission: platformCommission,
          provider_payout: providerPayout,
          currency: currency,
          status: 'pending', // statut initial avant paiement
          payment_status: 'unpaid',
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (dbError || !booking) {
      console.error('Erreur Supabase lors de la réservation:', dbError);
      return NextResponse.json(
        {
          error: 'Échec de la création de la réservation dans la base de données.',
          details: dbError?.message,
        },
        { status: 500 }
      );
    }

    // 5. Configuration de VanillaPay
    const vpClientId = process.env.VANILLAPAY_CLIENT_ID;
    const vpClientSecret = process.env.VANILLAPAY_CLIENT_SECRET;
    const vpApiUrl = (process.env.VANILLAPAY_API_URL || 'https://pro.ariarynet.com').replace(/\/$/, '');
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

    // Mode simulation si les identifiants VanillaPay sont absents
    if (!vpClientId || !vpClientSecret) {
      return NextResponse.json({
        success: true,
        message: 'Réservation créée avec succès (Mode simulation VanillaPay).',
        booking: {
          id: booking.id,
          totalAmount: booking.total_amount,
          commission: booking.platform_commission,
          status: booking.status,
        },
        paymentUrl: `${baseUrl}/checkout/mock-payment?bookingId=${booking.id}`,
      });
    }

    // Étape A: Obtention du Token OAuth VanillaPay
    const tokenParams = new URLSearchParams({
      client_id: vpClientId,
      client_secret: vpClientSecret,
      grant_type: 'client_credentials',
    });

    const tokenResponse = await fetch(`${vpApiUrl}/oauth/v2/token?${tokenParams.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || (!tokenData.access_token && !tokenData.Data?.Token)) {
      console.error('Erreur Token VanillaPay:', tokenData);
      return NextResponse.json(
        { error: 'Échec de la génération du jeton d\'accès VanillaPay.' },
        { status: 500 }
      );
    }

    const token = tokenData.access_token || tokenData.Data?.Token;

    // Étape B: Initialisation du Paiement VanillaPay
    const initPaymentPayload = {
      montant: amount,
      devise: currency,
      reference: booking.id,
      panier: `Réservation TRAVELIN AI - ${booking.id}`,
      notifUrl: `${baseUrl}/api/webhooks/vanillapay`,
      redirectUrl: `${baseUrl}/bookings/confirmation?bookingId=${booking.id}`,
      nom: customerName,
      email: customerEmail,
      telephone: customerPhone || '',
    };

    const initPaymentResponse = await fetch(`${vpApiUrl}/api/paiements`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(initPaymentPayload),
      cache: 'no-store',
    });

    const paymentData = await initPaymentResponse.json();

    if (!initPaymentResponse.ok) {
      console.error('Erreur Init Payment VanillaPay:', paymentData);
      return NextResponse.json(
        { error: 'Échec de l\'initialisation du lien de paiement VanillaPay.' },
        { status: 500 }
      );
    }

    // Extraction de l'URL ou ID de paiement
    const paymentUrl =
      paymentData.url ||
      paymentData.Data?.url ||
      `${vpApiUrl}/payer/${paymentData.id || paymentData.Data?.id}`;

    const vanillaPayRef = paymentData.id || paymentData.Data?.id || paymentData.Data?.reference || null;

    // Mise à jour de la référence VanillaPay dans Supabase
    if (vanillaPayRef) {
      await supabase
        .from('bookings')
        .update({ vanilla_pay_ref: vanillaPayRef })
        .eq('id', booking.id);
    }

    // 6. Réponse finale avec le lien de paiement
    return NextResponse.json({
      success: true,
      message: 'Réservation et lien de paiement créés avec succès.',
      booking: {
        id: booking.id,
        totalAmount: booking.total_amount,
        commission: booking.platform_commission,
        status: booking.status,
      },
      paymentUrl: paymentUrl,
    });
  } catch (error: any) {
    console.error('Erreur serveur lors de la réservation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne.', details: error.message },
      { status: 500 }
    );
  }
}
