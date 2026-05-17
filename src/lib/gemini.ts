export async function chatWithTutor(messages: any[], scenario?: string) {
  const response = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, scenario }),
  });
  if (!response.ok) throw new Error('Chat failed');
  return response.json();
}

export async function speakRussian(text: string) {
  const response = await fetch('/api/gemini/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('TTS failed');
  const data = await response.json();
  
  const binary = atob(data.audio);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'audio/mp3' }); // Gemini TTS often returns mp3 or similar encoded chunks
  const audioUrl = URL.createObjectURL(blob);
  const audio = new Audio(audioUrl);
  return audio.play();
}
