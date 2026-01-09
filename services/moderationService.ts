
import { FORBIDDEN_WORDS } from '../constants';
import { GoogleGenAI } from '@google/genai';

/**
 * Basic local moderation
 */
export const moderateLocalText = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return !FORBIDDEN_WORDS.some(word => lowerText.includes(word));
};

/**
 * AI-powered moderation (Gemini)
 * Use gemini-3-flash-preview for quick safety check
 */
export const moderateAIText = async (text: string): Promise<boolean> => {
  try {
    // Fixed: Always use direct process.env.API_KEY for initialization as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise se a seguinte mensagem contém ódio, assédio, spam ou conteúdo sexual explícito. Responda apenas "SAFE" ou "UNSAFE". Mensagem: "${text}"`,
    });

    // Fixed: Correctly access the .text property (not a method) from the response
    return response.text?.trim().toUpperCase() === 'SAFE';
  } catch (error) {
    console.error('Moderation error:', error);
    return true; // Fail-safe
  }
};
