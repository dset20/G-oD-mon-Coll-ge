
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Standard implementation following Google GenAI SDK best practices
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Always use named parameter for apiKey and obtain it from process.env.API_KEY
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeDemonstration(
    exerciseStatement: string,
    studentInput: string,
    expectedSolution: any
  ): Promise<string> {
    try {
      // Use 'gemini-3-pro-preview' for complex text tasks like mathematical reasoning
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `
          Tu es un professeur de mathématiques de collège français expert en géométrie.
          Ton but est d'aider l'élève à structurer sa démonstration selon le schéma : "Données (On sait que...) -> Propriété (Or si... alors...) -> Conclusion (Donc...)".

          Exercice: ${exerciseStatement}
          Solution attendue: ${JSON.stringify(expectedSolution)}
          Réponse de l'élève: "${studentInput}"

          Directives strictes:
          1. Ne donne pas la solution directement.
          2. Analyse si l'élève a identifié les bonnes données.
          3. Vérifie si la propriété citée est correcte et complète.
          4. Encourage la rigueur rédactionnelle.
          5. Si c'est faux, donne un indice (ex: "Regarde bien les hypothèses" ou "Quelle propriété lie perpendiculaires et parallèles ?").
          6. Réponds en français de manière bienveillante.
        `,
      });
      // Direct access to .text property of GenerateContentResponse
      return response.text || "Désolé, je n'ai pas pu analyser ta réponse pour le moment.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Une erreur est survenue lors de la communication avec le tuteur IA.";
    }
  }
}

export const geminiService = new GeminiService();
