import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface PanelInfo {
  brand: string;
  modelNumber: string;
  type: 'T-CON' | 'Panel';
  description: string;
  specs: Record<string, string>;
  sources: { uri: string; title: string }[];
  relatedModels?: string[];
}

export async function searchPanelComponents(query: string): Promise<PanelInfo[]> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Search for detailed information and real-world photos/sources for the following TV component query: "${query}".
    Focus on major Chinese brands (BOE, CSOT, HKC, Innolux, AUO).
    
    If it's a T-CON board, provide common model numbers (V-series, T-series) and their associated panels.
    If it's a Panel, provide specs like resolution, backlight type, and interface.
    
    Return the data in a structured JSON format:
    Array of objects:
    {
      "brand": string,
      "modelNumber": string,
      "type": "T-CON" | "Panel",
      "description": string,
      "specs": { "key": "value" },
      "relatedModels": string[] // e.g., for T-CON, list 3-4 compatible panels
    }
    
    Also, the search grounding will provide links to photos and datasheets. 
    Explain where to find images in the description if possible.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const jsonStr = response.text || "[]";
    const data = JSON.parse(jsonStr);
    
    // Extract grounding chunks as sources
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter(c => c.web)
      .map(c => ({ uri: c.web!.uri, title: c.web!.title }));

    return data.map((item: any) => ({
      ...item,
      sources: sources
    }));
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
}
