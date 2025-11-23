import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DailyPrompt } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const promptSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy, short title for the vlog challenge (max 5 words)." },
    description: { type: Type.STRING, description: "A fun, brief instruction on what to film (max 20 words)." },
    difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
  },
  required: ["title", "description", "difficulty"],
};

export const generateDailyPrompt = async (): Promise<DailyPrompt> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a fun, Gen-Z friendly daily vlog challenge idea for a group of friends. It should be spontaneous and easy to film in under 30 seconds.",
      config: {
        responseMimeType: "application/json",
        responseSchema: promptSchema,
        systemInstruction: "You are a creative director for a trendy social media app. Keep prompts short, viral-worthy, and energetic.",
        temperature: 1.2, // High temperature for creativity
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as DailyPrompt;
  } catch (error) {
    console.error("Error generating prompt:", error);
    // Fallback if API fails
    return {
      title: "Outfit Check",
      description: "Show us your fit for the day in 10 seconds or less.",
      difficulty: "Easy"
    };
  }
};

export const generateAIComment = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a very short, supportive, 1-sentence comment for a friend who just posted a vlog about: ${prompt}. Use emojis.`,
        });
        return response.text || "Love this! 🔥";
    } catch (e) {
        return "Awesome vlog! 👏";
    }
}
