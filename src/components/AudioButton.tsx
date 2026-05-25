import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { isSpeechSupported } from '@/utils/pronunciation';

interface AudioButtonProps {
  text: string;
  slow?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  label?: string;
}

export function AudioButton({ 
  text, 
  slow = false, 
  size = 'md', 
  className = '', 
  label 
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isSpeechSupported());
  }, []);

  if (!supported) return null;

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Cancel any previous speaking first
    window.speechSynthesis.cancel();

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    // rate range: 0.1 to 10. Default is 1.
    utterance.rate = slow ? 0.5 : 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (event) => {
      console.error('SpeechSynthesis error:', event);
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const isSmall = size === 'sm';
  const iconSize = isSmall ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <button
      type="button"
      id={`audio-speak-${text.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${slow ? 'slow' : 'normal'}`}
      onClick={handleSpeak}
      title={slow ? "Hear slow Russian pronunciation" : "Hear Russian pronunciation"}
      className={`inline-flex items-center gap-1 hover:bg-orange-50/70 dark:hover:bg-neutral-800 rounded px-1.5 py-0.5 text-neutral-500 hover:text-orange-600 transition-all focus:outline-none cursor-pointer ${
        isPlaying ? 'animate-pulse text-orange-600 font-bold bg-orange-50' : ''
      } ${className}`}
    >
      {slow ? (
        <span className={isSmall ? "text-xs" : "text-sm"} role="img" aria-label="turtle">🐢</span>
      ) : (
        <Volume2 className={`${iconSize} ${isPlaying ? 'text-orange-600' : ''}`} />
      )}
      {label && (
        <span className={`${isSmall ? "text-[11px]" : "text-xs"} select-none`}>
          {label}
        </span>
      )}
    </button>
  );
}
