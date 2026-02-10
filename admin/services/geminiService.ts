import { GoogleGenAI, Type } from "@google/genai";
import { Category } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export interface AISuggestion {
  description: string;
  suggestedPrice: number;
  material: string;
  packageContents: string[];
  features: string[]; // Keeping for legacy or tags if needed
}

export const generateProductContent = async (
  name: string,
  category: Category
): Promise<AISuggestion> => {
  try {
    const prompt = `
      You are an expert inventory manager for 'PaskibraRent', a rental service for Paskibra (Flag Raisers) equipment in Indonesia.
      
      Generate a product listing for:
      Product Name: "${name}"
      Category: "${category}"
      
      Provide:
      1. A professional, persuasive, and SEO-friendly description (approx 2-3 sentences) in Indonesian.
      2. A suggested daily rental price in IDR (Indonesian Rupiah).
      3. The primary material used (e.g., Drill Castillo, Silk, Leather).
      4. A list of included items in the package (Kelengkapan Paket).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            suggestedPrice: { type: Type.NUMBER },
            material: { type: Type.STRING },
            packageContents: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["description", "suggestedPrice", "material", "packageContents"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    // Default values if AI misses something
    const parsed = JSON.parse(text);
    return {
      description: parsed.description || "",
      suggestedPrice: parsed.suggestedPrice || 0,
      material: parsed.material || "Standar",
      packageContents: parsed.packageContents || [],
      features: parsed.packageContents || []
    };
  } catch (error) {
    console.error("AI Generation failed:", error);
    throw new Error("Gagal membuat konten dengan AI. Pastikan API Key valid.");
  }
};