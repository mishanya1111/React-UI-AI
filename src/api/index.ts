import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);


const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const chat = model.startChat({ history: [] });

function extractJSON(text: string) {
  const cleaned = text
    .trim()
    .replace(/^```(?:json|jsob)?/i, '')
    .replace(/```$/, '')
    .trim();

  return cleaned;
}

export async function generateCode(prompt: string) {
  const result = await chat.sendMessage(prompt);
  const text = result.response.text();
  console.log(extractJSON(text));
  return extractJSON(text);
}
