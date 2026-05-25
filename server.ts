import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  const getAi = () => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY or VITE_GEMINI_API_KEY environment variable is required. Please set it in your Vercel Environment Variables or AI Studio Secrets.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  app.use(express.json());

  // API Routes
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { messages, scenario } = req.body;
      const ai = getAi();
      
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
        model: 'gemini-3.5-flash',
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

  app.post('/api/gemini/chat-stream', async (req, res) => {
    try {
      const { messages, scenario } = req.body;
      const ai = getAi();
      
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

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = await ai.models.generateContentStream({
        model: 'gemini-3.5-flash',
        contents: messages,
        config: {
          systemInstruction,
        },
      });

      for await (const chunk of stream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error: any) {
      console.error('Gemini Chat Stream Error:', error);
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  });

  app.post('/api/gemini/tts', async (req, res) => {
    try {
      const { text } = req.body;
      console.log('Generating TTS for:', text);
      const ai = getAi();
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: [{ parts: [{ text: `Speak this: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      const base64Audio = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType;

      if (base64Audio) {
        console.log('Successfully generated audio, mimeType:', mimeType);
        res.status(200).json({ 
          audio: base64Audio, 
          mimeType: mimeType || 'audio/pcm;rate=24000' 
        });
      } else {
        console.error('No audio part in Gemini response:', JSON.stringify(response));
        res.status(500).json({ error: 'No audio generated' });
      }
    } catch (error: any) {
      const isQuotaError = error.message?.includes('429') || error.message?.includes('quota');
      if (isQuotaError) {
        console.warn('Gemini TTS Quota exceeded (429)');
      } else {
        console.error('Gemini TTS Error:', error);
      }
      res.status(isQuotaError ? 429 : 500).json({ error: error.message });
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

