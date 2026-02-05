
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeDemonstration(
    exerciseStatement: string,
    studentInput: string,
    expectedSolution: any
  ): Promise<string> {
    try {
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
          5. Base tes conseils sur les méthodes pédagogiques de référence (Khan Academy, Maths-et-tiques, Mon Classeur de Maths).
          6. Réponds en français de manière bienveillante.
        `,
      });
      return response.text || "Désolé, je n'ai pas pu analyser ta réponse.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Une erreur est survenue.";
    }
  }

  async getGeometryTips(query: string): Promise<{ text: string; sources: { title: string; uri: string }[] }> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `En tant que tuteur expert en géométrie de classe mondiale, donne des astuces concrètes, des méthodes de rédaction et des rappels de cours sur le sujet suivant : "${query}". 
        
        Tu DOIS utiliser et citer prioritairement les informations provenant des sources suivantes :
        - https://fr.khanacademy.org/math/college-geom
        - https://www.monclasseurdemaths.fr/c4
        - https://www.maths-et-tiques.fr/
        - https://pi.ac3j.fr/mathematiques-college
        - https://mathovore.fr/
        - https://www.jai20enmaths.com/
        - https://www.geogebra.org/

        Structure ta réponse avec des points clés clairs et des exemples de rédaction "On sait que... Or si... alors... Donc...".`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "Aucune astuce trouvée pour ce sujet.";
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => ({
          title: chunk.web?.title || "Source éducative",
          uri: chunk.web?.uri || "#"
        })) || [];

      return { text, sources };
    } catch (error) {
      console.error("Search Grounding Error:", error);
      return { text: "Erreur lors de la recherche d'astuces.", sources: [] };
    }
  }
}

export const geminiService = new GeminiService();
