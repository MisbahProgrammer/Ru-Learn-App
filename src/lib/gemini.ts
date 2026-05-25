export async function chatWithTutor(messages: any[], scenario?: string) {
  const response = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, scenario }),
  });
  if (!response.ok) throw new Error('Chat failed');
  return response.json();
}

export async function chatWithTutorStream(
  messages: any[],
  scenario: string | undefined,
  onChunk: (chunk: string) => void
): Promise<string> {
  const response = await fetch('/api/gemini/chat-stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, scenario }),
  });
  
  if (!response.ok) throw new Error('Streaming failed');
  if (!response.body) throw new Error('Response body is missing');
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulatedText = '';
  let done = false;
  let buffer = '';

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      buffer += decoder.decode(value, { stream: !doneReading });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last incomplete line

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const dataContent = trimmed.substring(6);
          if (dataContent === '[DONE]') {
            continue;
          }
          try {
            const parsed = JSON.parse(dataContent);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.text) {
              accumulatedText += parsed.text;
              onChunk(parsed.text);
            }
          } catch (e: any) {
            console.warn('Could not parse SSE chunk:', dataContent, e);
            if (dataContent.includes('"error"') || e.message?.includes('AI') || e.message?.includes('API')) {
              throw e;
            }
          }
        }
      }
    }
  }
  
  return accumulatedText;
}

export async function speakRussian(text: string) {
  try {
    const response = await fetch('/api/gemini/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    
    if (response.status === 429) {
      console.warn('Gemini TTS Quota exceeded, using native fallback');
      return speakNative(text);
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      if (response.status !== 429) {
        throw new Error(err.error || 'TTS failed');
      }
      return speakNative(text);
    }
    
    const { audio, mimeType } = await response.json();
    if (!audio) throw new Error('No audio in response');
    
    const binary = atob(audio);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    if (mimeType?.includes('pcm')) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const sampleRateMatch = mimeType.match(/rate=(\d+)/);
      const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1]) : 24000;
      
      const buffer = audioCtx.createBuffer(1, bytes.length / 2, sampleRate);
      const channelData = buffer.getChannelData(0);
      
      const view = new DataView(bytes.buffer);
      for (let i = 0; i < channelData.length; i++) {
        if (i * 2 + 1 < bytes.length) {
          channelData[i] = view.getInt16(i * 2, true) / 32768.0;
        }
      }
      
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);
      source.start();
      return;
    }

    const blob = new Blob([bytes], { type: mimeType || 'audio/mp3' });
    const audioUrl = URL.createObjectURL(blob);
    const player = new Audio(audioUrl);
    
    return new Promise((resolve) => {
      player.oncanplaythrough = () => {
        player.play().then(resolve).catch((err) => {
          console.warn('Audio play failed, falling back to native:', err);
          speakNative(text).then(resolve);
        });
      };
      player.onerror = () => {
        console.warn('Audio source failed, falling back to native');
        speakNative(text).then(resolve);
      };
      player.onended = () => {
        URL.revokeObjectURL(audioUrl);
        resolve(true);
      };
    });
  } catch (error) {
    // Only log as error if it's not a common/expected failure that we have a fallback for
    if (!(error instanceof Error && error.message.includes('429'))) {
      console.warn('Speech Engine Notice:', error);
    }
    return speakNative(text);
  }
}

export function speakNative(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      console.error('Browser does not support Speech Synthesis');
      return resolve(false);
    }
    
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const russianVoice = voices.find(v => v.lang.startsWith('ru'));
    if (russianVoice) msg.voice = russianVoice;
    msg.lang = 'ru-RU';
    msg.rate = 0.9;
    
    msg.onend = () => resolve(true);
    msg.onerror = (e) => {
      console.error('Native speech error:', e);
      resolve(false);
    };
    
    window.speechSynthesis.speak(msg);
    // Resolve anyway if synthesis takes too long or hangs
    setTimeout(() => resolve(true), 5000);
  });
}
