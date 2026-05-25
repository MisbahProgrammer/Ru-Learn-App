export const speakRussian = (text: string, slow = false) => {
  if (!('speechSynthesis' in window)) return;
  // Cancel any currently playing audio first
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ru-RU';
  utterance.rate = slow ? 0.5 : 0.85;
  utterance.pitch = 1;
  utterance.volume = 1;
  
  window.speechSynthesis.speak(utterance);
};

export const isSpeechSupported = () => {
  return 'speechSynthesis' in window;
};
