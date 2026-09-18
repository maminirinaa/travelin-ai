import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

// Validation et initialisation du SDK Google Gen AI
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("ATTENTION: La variable d'environnement GEMINI_API_KEY n'est pas définie.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Interfaces TypeScript pour la validation du body de la requête
interface ItineraryRequestBody {
  destination: string;
  days: number;
  budget: string; // Ex: 'économique', 'moyen', 'luxe'
  preferences?: string[];
}

export async function POST(request: NextRequest) {
  try {
    // 1. Validation de l'API Key
    if (!process.env.GEMINI_API_KEY) {
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

    // 4. Prompt système et utilisateur
    const prompt = `Crée un itinéraire de voyage sur mesure de ${days} jour(s) pour ${destination}. 
Budget ciblé : ${budget}.
${preferences.length > 0 ? `Centres d'intérêt / Préférences : ${preferences.join(', ')}.` : ''}

Donne des recommandations concrètes et adaptées au lieu et au budget.`;

    // 5. Appel de l'API Gemini avec Structured Outputs via @google/genai SDK
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Tu es un expert en organisation de voyages sur-mesure. Tu réponds de manière structurée, précise et attrayante.',
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            durationDays: { type: Type.INTEGER },
            estimatedTotalBudget: { type: Type.STRING },
            summary: { type: Type.STRING },
            highlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            dailyItinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        timeSlot: {
                          type: Type.STRING,
                          description: 'Ex: Matin, Après-midi, Soir',
                        },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        estimatedCost: { type: Type.STRING },
                        location: { type: Type.STRING },
                      },
                      required: ['timeSlot', 'title', 'description'],
                    },
                  },
                },
                required: ['day', 'title', 'activities'],
              },
            },
            practicalTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
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

    // 6. Extraction du texte généré (qui est du JSON garanti par le schema)
    const jsonText = response.text;

    if (!jsonText) {
      throw new Error("L'IA n'a pas retourné de réponse valide.");
    }

    // Parsing du JSON pour s'assurer qu'il est valide
    const itineraryData = JSON.parse(jsonText);

    // 7. Envoi de la réponse JSON au client Next.js
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
