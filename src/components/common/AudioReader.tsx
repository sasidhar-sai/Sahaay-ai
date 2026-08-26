'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Language } from '@/lib/i18n';

interface AudioReaderProps {
  textToRead: string;
  lang: Language;
  label?: string;
}

export const AudioReader: React.FC<AudioReaderProps> = ({ textToRead, lang, label }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const handleTogglePlay = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any currently active speech

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95; // Slightly slower for clear accessibility comprehension

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full transition-all border ${
        isPlaying
          ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
      }`}
      title={isPlaying ? "Stop speech readout" : "Listen to scheme summary aloud"}
      aria-label={isPlaying ? "Stop audio narration" : `Listen to ${label || 'scheme details'} aloud`}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-amber-700" />
          <span>{lang === 'hi' ? 'रोकें' : 'Stop Audio'}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-govblue-600" />
          <span>{lang === 'hi' ? 'सुनें (आवाज)' : 'Listen Aloud'}</span>
        </>
      )}
    </button>
  );
};
