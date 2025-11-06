import { GoogleGenAI } from "@google/genai";
import type { Dictionary } from '../types';

const MODEL_NAME = "gemini-2.5-flash";

export const detectLanguage = async (sampleText: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    if (!sampleText) return '';

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Detect the language of the following text. Respond with only the name of the language in English (e.g., "Arabic", "English", "French"). Do not add any other words or punctuation.\n\nText: """${sampleText}"""`;
    
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error detecting language:", error);
        return "Unknown";
    }
};

export const translateText = async (
  targetText: string,
  contextBefore: string[],
  contextAfter: string[],
  dictionary: Dictionary,
  sourceLanguage: string,
): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const dictionaryPrompt = Array.from(dictionary.entries())
    .map(([key, value]) => `- '${key}' -> '${value}'`)
    .join('\n');

  const prompt = `
    You are an expert translator specializing in translating subtitles from ${sourceLanguage} to Standard Moroccan Amazigh (using the Tifinagh script).
    Your task is to translate ONLY the "TARGET LINE".
    
    - Use the "CONTEXT" from surrounding subtitle lines to ensure the translation is accurate and flows naturally.
    - Strictly adhere to the "DICTIONARY" for specific word translations to maintain consistency.
    - Your response must contain only the translated text of the target line, with no extra explanations, labels, or formatting.

    ---
    DICTIONARY:
    ${dictionaryPrompt || "No custom dictionary entries provided."}
    ---
    CONTEXT (Before):
    ${contextBefore.join('\n') || "No preceding context."}
    ---
    TARGET LINE:
    ${targetText}
    ---
    CONTEXT (After):
    ${contextAfter.join('\n') || "No following context."}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error translating text:", error);
    return "Translation failed.";
  }
};