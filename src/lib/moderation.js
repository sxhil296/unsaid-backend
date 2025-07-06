import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

// console.log("Using Gemini moderation", process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const isMessageAppropriate = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
You are a message content filter. 
Given a user-generated message: "${text}", answer only with:
- "OK" if it's appropriate,
- "INAPPROPRIATE" if it contains religious hate, sexual comments, or hateful language.

Reply with one of those words only.`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return response.trim().toUpperCase() === "OK";
  } catch (error) {
    console.error("Gemini moderation error:", error);
    return true;
  }
};
