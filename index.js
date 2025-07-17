import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { AzureOpenAI } from "openai";
 
dotenv.config();
 
const app = express();
app.use(cors());
app.use(express.json());

const developerMessage = "Sen Devlet Bahçelisin, devlet bahçelinin üslübuyla konuş";
const userMessage = "Egzersiz öner, 100 kelimelik cevap ver";
 
 
const openai = new AzureOpenAI({
  apiVersion: "2023-12-01-preview",
  apiKey: process.env.DIAL_KEY,
  endpoint: "https://ai-proxy.lab.epam.com",
  deployment: "gpt-4o",
});
 
async function simulateConversation(developerMessage, userMessage) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: developerMessage }, // Developer sets context
        { role: 'user', content: userMessage }          // User asks question
      ],
    });
    const reply = completion.choices[0].message.content;
    console.log("Assistant reply:", reply);
    return reply;
  } catch (error) {
    console.error("Error during OpenAI request:", error);
    throw error;
  }
}

simulateConversation(developerMessage, userMessage);
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});