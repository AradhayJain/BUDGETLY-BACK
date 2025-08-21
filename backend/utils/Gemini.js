import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDy2dYTvbAcdqkbsO7t-nJCMaLiIYlTdO0" }); // Use environment variable for safety

async function googleGenAi(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  });

  // Inspect the response structure to get the generated text
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return text;
}

export default googleGenAi;
