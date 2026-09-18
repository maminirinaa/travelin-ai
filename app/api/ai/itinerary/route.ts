import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Interfaces TypeScript pour la validation du body de la requête
interface ItineraryRequestBody {
  destination: string;
  days: number;
  budget: string; // Ex: 'économique', 'moyen', 'luxe'
  preferences?: string[];
}

export async function POST(request: NextRequest) {
  try {
    // 1. Validation de la clé API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Clé API Gemini non configurée sur le serveur.' },
        { status: 500 }
      );
    }

    // 2. Extraction du corps de la requête
    const body: ItineraryRequestBody = await request.json();
    const { destination, days, budget, preferences = [] } = body;

    // 3. Validation basique des paramètres d'entrée
    if (!destination || typeof destination !== 'string') {
      return NextResponse.json(
        { error: 'La destination est requise.' },
        { status: 400 }
      );
    }

    if (!days || typeof days !== 'number' || days < 1 || days > 30) {
      return NextResponse.json(
        { error: 'Le nombre de jours doit être un nombre entre 1 et 30.' },
        { status: 400 }
      );
    }

    if (!budget || typeof budget !== 'string') {
      return NextResponse.json(
        { error: 'Le budget est requis.' },
        { status: 400 }
      );
    }

    // 4. Prompt utilisateur
    const prompt = `Crée un itinéraire de voyage sur mesure de ${days} jour(s) pour ${destination}. 
Budget ciblé : ${budget}.
${preferences.length > 0 ? `Centres d'intérêt / Préférences : ${preferences.join(', ')}.` : ''}

Donne des recommandations concrètes et adaptées au lieu et au budget.`;

    // 5. Initialisation du SDK @google/generative-ai
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction:
        'Tu es un expert en organisation de voyages sur-mesure. Tu réponds de manière structurée, précise et attrayante.',
      generationConfig: {
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            destination: { type: SchemaType.STRING },
            durationDays: { type: SchemaType.INTEGER },
            estimatedTotalBudget: { type: SchemaType.STRING },
            summary: { type: SchemaType.STRING },
            highlights: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
            dailyItinerary: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  day: { type: SchemaType.INTEGER },
                  title: { type: SchemaType.STRING },
                  activities: {
                    type: SchemaType.ARRAY,
                    items: {
                      type: SchemaType.OBJECT,
                      properties: {
                        timeSlot: {
                          type: SchemaType.STRING,
                          description: 'Ex: Matin, Après-midi, Soir',
                        },
                        title: { type: SchemaType.STRING },
                        description: { type: SchemaType.STRING },
                        estimatedCost: { type: SchemaType.STRING },
                        location: { type: SchemaType.STRING },
                      },
                      required: ['timeSlot', 'title', 'description'],
                    },
                  },
                },
                required: ['day', 'title', 'activities'],
              },
            },
            practicalTips: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.STRING },
            },
          },
          required: [
            'destination',
            'durationDays',
            'estimatedTotalBudget',
            'summary',
            'highlights',
            'dailyItinerary',
            'practicalTips',
          ],
        },
      },
    });

    // 6. Appel de l'API Gemini
    const result = await model.generateContent(prompt);
    const jsonText = result.response.text();

    if (!jsonText) {
      throw new Error("L'IA n'a pas retourné de réponse valide.");
    }

    const itineraryData = JSON.parse(jsonText);

    // 7. Envoi de la réponse JSON au client
    return NextResponse.json({
      success: true,
      data: itineraryData,
    });
  } catch (error: any) {
    console.error("Erreur lors de la génération de l'itinéraire IA :", error);

    return NextResponse.json(
      {
        error: "Échec de la génération de l'itinéraire avec l'IA.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
