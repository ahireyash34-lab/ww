import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('⚠️ WARNING: GEMINI_API_KEY is not set in environment variables. Falling back to autonomous scientific agronomic diagnostic engine.');
}

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const GEMINI_MODEL_FAST = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
export const GEMINI_MODEL_PRO = process.env.GEMINI_MODEL_PRO || 'gemini-1.5-pro';
