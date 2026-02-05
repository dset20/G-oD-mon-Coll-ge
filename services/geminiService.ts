
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeDemonstration(
    exerciseStatement: string,
    studentInput: string,
    expectedSolution: any,
    isConverse: boolean
  ): Promise<string> {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `
          Tu es un professeur de mathématiques de collège français expert en géométrie.
          Ton but est d'aider l'élève à structurer sa démonstration : "Données -> Propriété -> Conclusion".

          CONTEXTE :
          - Exercice : ${exerciseStatement}
          - Solution attendue : ${JSON.stringify(expectedSolution)}
          - Réponse de l'élève (JSON) : ${studentInput}
          - Choix de l'élève : L'élève a explicitement choisi d'utiliser la ${isConverse ? "RÉCIPROQUE" : "PROPRIÉTÉ DIRECTE"}.

          DIRECTIVES CRITIQUES :
          1. Analyse si le choix "${isConverse ? "Réciproque" : "Directe"}" est LOGIQUE. 
             (Exemple : Pour prouver qu'un triangle est rectangle avec les longueurs, c'est la RÉCIPROQUE de Pythagore. Pour calculer une longueur, c'est la PROPRIÉTÉ DIRECTE).
          2. Ne donne pas la solution.
          3. Vérifie la rédaction "On sait que... Or... Donc...".
          4. Sois bienveillant mais rigoureux sur la logique.
        `,
        config: {
          temperature: 0.7,
          topP: 0.95,
        }
      });
      return response.text || "Je n'ai pas pu analyser ta réponse. Réessaie.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Erreur de connexion avec l'IA. Vérifie ta connexion.";
    }
  }

  async getGeometryTips(query: string): Promise<{ text: string; sources: { title: string; uri: string }[] }> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Donne des astuces sur : "${query}". Utilise les sources officielles : Khan Academy, Maths-et-tiques, Mon Classeur de Maths.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "Aucune astuce trouvée.";
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => ({
          title: chunk.web?.title || "Ressource",
          uri: chunk.web?.uri || "#"
        })) || [];

      return { text, sources };
    } catch (error) {
      return { text: "Erreur lors de la recherche.", sources: [] };
    }
  }
}

export const geminiService = new GeminiService();
