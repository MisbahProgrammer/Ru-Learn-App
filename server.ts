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

  // Helper to ensure messages conform to Gemini API requirements (start with 'user' and alternate roles)
  const formatMessagesForGemini = (messages: any[], scenario?: string) => {
    if (!Array.isArray(messages) || messages.length === 0) {
      return messages;
    }
    
    // Create a copy of messages and clean each message's fields
    let formatted = messages.map(m => ({
      role: m.role || 'user',
      parts: Array.isArray(m.parts) ? m.parts : [{ text: m.text || '' }]
    }));

    // Gemini requires the first message to be from 'user'.
    // If the first message is 'model', we prepend a natural user request to initiate the scenario.
    if (formatted[0].role === 'model') {
      formatted.unshift({
        role: 'user',
        parts: [
          {
            text: `Let's practice the Russian language scenario: "${scenario || 'General conversation'}". Please begin the conversation or introduce the scenario.`
          }
        ]
      });
    }

    // Consolidate consecutive messages with the same role to maintain strict alternation
    const consolidated: any[] = [];
    for (const msg of formatted) {
      if (consolidated.length > 0 && consolidated[consolidated.length - 1].role === msg.role) {
        consolidated[consolidated.length - 1].parts = [
          ...consolidated[consolidated.length - 1].parts,
          ...msg.parts
        ];
      } else {
        consolidated.push(msg);
      }
    }

    return consolidated;
  };

  // API Routes
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { messages, scenario, systemInstruction: customSystemInstruction } = req.body;
      const ai = getAi();
      const formattedMessages = formatMessagesForGemini(messages, scenario);
      
      const systemInstruction = customSystemInstruction || `You are an expert Russian tutor and cultural guide. 
      The current scenario is: ${scenario || 'General conversation'}.
      User is a student who won a scholarship to Russia.
      You must conduct the conversation primarily in Russian to help the student practice.
      Always provide your response in this exact format:
      Russian: [Clear Russian sentence in Cyrillic]
      Translation: [Concise English translation]
      
      If the user asks a question, answer it in Russian first, then provide the translation.
      Focus on being natural, like a real person in Moscow.
      Include cultural tips or student-specific advice when relevant.`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: formattedMessages,
          config: {
            systemInstruction,
            temperature: 0.3,
            maxOutputTokens: 200,
            topP: 0.8,
            topK: 20,
          },
        });
      } catch (geminiError: any) {
        console.warn('Primary model gemini-3.5-flash is busy/quota exceeded, falling back to gemini-3.1-flash-lite. Error:', geminiError.message || geminiError);
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: formattedMessages,
          config: {
            systemInstruction,
            temperature: 0.3,
            maxOutputTokens: 200,
            topP: 0.8,
            topK: 20,
          },
        });
      }

      res.status(200).json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini Chat Error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/gemini/chat-stream', async (req, res) => {
    try {
      const { messages, scenario, systemInstruction: customSystemInstruction } = req.body;
      const ai = getAi();
      const formattedMessages = formatMessagesForGemini(messages, scenario);
      
      const systemInstruction = customSystemInstruction || `You are an expert Russian tutor and cultural guide. 
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

      let stream;
      try {
        stream = await ai.models.generateContentStream({
          model: 'gemini-3.5-flash',
          contents: formattedMessages,
          config: {
            systemInstruction,
            temperature: 0.3,
            maxOutputTokens: 200,
            topP: 0.8,
            topK: 20,
          },
        });
      } catch (geminiError: any) {
        console.warn('Primary model gemini-3.5-flash busy in stream, falling back to gemini-3.1-flash-lite. Error:', geminiError.message || geminiError);
        stream = await ai.models.generateContentStream({
          model: 'gemini-3.1-flash-lite',
          contents: formattedMessages,
          config: {
            systemInstruction,
            temperature: 0.3,
            maxOutputTokens: 200,
            topP: 0.8,
            topK: 20,
          },
        });
      }

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

  app.post('/api/gemini/translate', async (req, res) => {
    try {
      const { text } = req.body;
      const ai = getAi();
      
      const prompt = `You are an expert translator. Translate the following text into English.
If the text is already in English or mostly English, return it exactly as is without translation or explanations.
Do not write any preamble, conversational greeting, explanations or quotation marks. Return ONLY the pure translation of the sentence itself.

Text to translate:
${text}`;

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
      } catch (geminiError: any) {
        console.warn('Primary model gemini-3.5-flash experienced translation error, falling back to gemini-3.1-flash-lite. Error:', geminiError.message || geminiError);
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });
      }

      res.status(200).json({ translation: (response.text || '').trim() });
    } catch (error: any) {
      console.error('Gemini Translate Error:', error);
      res.status(500).json({ error: error.message });
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

