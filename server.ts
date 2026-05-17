import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  app.use(express.json());

  // API Routes
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { messages, scenario } = req.body;
      
      const systemInstruction = `You are an expert Russian tutor and cultural guide. 
      The current scenario is: ${scenario || 'General conversation'}.
      User is a student who won a scholarship to Russia.
      You must conduct the conversation primarily in Russian to help the student practice.
      Always provide your response in this exact format:
      Russian: [Clear Russian sentence in Cyrillic]
      Translation: [Concise English translation]
      
      If the user asks a question, answer it in Russian first, then provide the translation.
      Focus on being natural, like a real person in Moscow.
      Include cultural tips or student-specific advice when relevant.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: messages,
        config: {
          systemInstruction,
        },
      });

      res.status(200).json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini Chat Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/gemini/tts', async (req, res) => {
    try {
      const { text } = req.body;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: [{ parts: [{ text: `Say in Russian: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        res.status(200).json({ audio: base64Audio });
      } else {
        res.status(500).json({ error: 'No audio generated' });
      }
    } catch (error: any) {
      console.error('Gemini TTS Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

