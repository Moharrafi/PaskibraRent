import { GoogleGenAI } from "@google/genai";
import { COSTUMES } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getCostumeRecommendation = async (userQuery: string, currentCartContext: string): Promise<string> => {
  if (!apiKey) {
    return "Maaf, fitur asisten AI sedang tidak tersedia saat ini (API Key missing).";
  }

  const catalogContext = JSON.stringify(COSTUMES.map(c => ({ 
    id: c.id, 
    name: c.name, 
    category: c.category, 
    price: c.price,
    tags: c.tags
  })));

  const systemPrompt = `
    Kamu adalah 'PaskibraBot', asisten virtual cerdas untuk website penyewaan kostum Paskibra bernama 'PaskibraRent'.
    
    Tugasmu:
    1. Merekomendasikan kostum dari katalog yang tersedia berdasarkan kebutuhan user (sekolah, lomba, upacara 17 Agustus, latihan).
    2. Menjawab pertanyaan tentang padu padan seragam (misal: aksesoris apa yang cocok untuk PDU).
    3. Memberikan saran budget.
    
    Katalog Produk Saat Ini:
    ${catalogContext}

    Konteks Keranjang Belanja User Saat Ini:
    ${currentCartContext}

    Aturan Jawaban:
    - Jawab dengan ramah, formal namun santai, dan penuh semangat nasionalisme.
    - Gunakan Bahasa Indonesia yang baik.
    - Jika merekomendasikan produk, sebutkan nama produk persis seperti di katalog.
    - Jawaban harus ringkas (maksimal 3 paragraf pendek).
    - Jika user bertanya di luar topik Paskibra/sewa kostum, alihkan kembali ke topik dengan sopan.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    return response.text || "Maaf, saya sedang berpikir keras namun tidak menemukan jawaban.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, terjadi gangguan koneksi pada markas komando AI kami. Silakan coba sesaat lagi.";
  }
};
