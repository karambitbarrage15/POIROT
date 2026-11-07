import OpenAI from "openai";

const apiKey = process.env.OPENROUTER_API_KEY || "dummy-key";

export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "POIROT - AI Cloud Cost Detective",
  },
});

export const AI_MODEL = process.env.AI_MODEL || "meta-llama/llama-3.3-70b-instruct:free";
