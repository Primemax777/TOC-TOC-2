import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key is present
export const hasApiKey = () => !!apiKey;

export const generateSmartTasks = async (childName: string, interest: string): Promise<{title: string, icon: string}[]> => {
  if (!apiKey) return [];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest 3 fun, age-appropriate household chores for a child named ${childName} who likes ${interest}. Return strictly a JSON array of objects with 'title' and 'icon' (emoji) properties.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              icon: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Task Gen Error:", error);
    return [];
  }
};

export const suggestRecipe = async (ingredients: string[]): Promise<string> => {
  if (!apiKey) return "Add your API key for magic recipes!";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I have these ingredients: ${ingredients.join(', ')}. Suggest one simple, fun family dinner idea in less than 20 words.`,
    });
    return response.text || "Could not generate recipe.";
  } catch (error) {
    return "Magic recipe machine is sleeping.";
  }
};