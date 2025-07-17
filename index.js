import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { AzureOpenAI } from "openai";
 
dotenv.config();
 
const app = express();
app.use(cors());
app.use(express.json());
 
 
const openai = new AzureOpenAI({
  apiVersion: "2023-12-01-preview",
  apiKey: process.env.DIAL_KEY,
  endpoint: "https://ai-proxy.lab.epam.com",
  deployment: "gpt-4o",
});
 
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
 
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Provide me advise what exercises should I do for my back pain?' },
        { role: 'user', content: message },
      ],
    });
 
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});
 
async function getBackPainExerciseAdvice(userMessage) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Provide me advise what exercises should I do for my back pain?' },
          { role: 'user', content: userMessage },
        ],
      });
      const reply = completion.choices[0].message.content;
      console.log("AI reply:", reply);
      return reply;
    } catch (error) {
      console.error("Error during OpenAI request:", error);
      throw error;
    }
  }
 
  getBackPainExerciseAdvice("I have mild back pain, what should I do?")
  .then(reply => {
    console.log("Advice from AI:", reply);
  })
  .catch(console.error);
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});