
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SoundContextType {
  playSound: (soundType: 'click' | 'success' | 'error' | 'notification' | 'game' | 'powerup') => void;
  toggleMute: () => void;
  isMuted: boolean;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSounds = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSounds must be used within a SoundProvider');
  }
  return context;
};

interface SoundProviderProps {
  children: React.ReactNode;
}

export const SoundProvider: React.FC<SoundProviderProps> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);

  // Create audio context and sounds
  const createSound = (frequency: number, duration: number, type: OscillatorType = 'sine'): void => {
    if (isMuted) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Audio not supported:', error);
    }
  };

  const playComplexSound = (notes: { frequency: number; duration: number; delay: number }[]): void => {
    if (isMuted) return;

    notes.forEach(note => {
      setTimeout(() => {
        createSound(note.frequency, note.duration);
      }, note.delay);
    });
  };

  const playSound = (soundType: 'click' | 'success' | 'error' | 'notification' | 'game' | 'powerup'): void => {
    switch (soundType) {
      case 'click':
        createSound(800, 0.1, 'square');
        break;
      case 'success':
        playComplexSound([
          { frequency: 523, duration: 0.2, delay: 0 },
          { frequency: 659, duration: 0.2, delay: 100 },
          { frequency: 784, duration: 0.3, delay: 200 }
        ]);
        break;
      case 'error':
        playComplexSound([
          { frequency: 300, duration: 0.2, delay: 0 },
          { frequency: 250, duration: 0.3, delay: 150 }
        ]);
        break;
      case 'notification':
        playComplexSound([
          { frequency: 440, duration: 0.1, delay: 0 },
          { frequency: 554, duration: 0.1, delay: 100 }
        ]);
        break;
      case 'game':
        createSound(660, 0.15, 'triangle');
        break;
      case 'powerup':
        playComplexSound([
          { frequency: 392, duration: 0.1, delay: 0 },
          { frequency: 523, duration: 0.1, delay: 50 },
          { frequency: 659, duration: 0.1, delay: 100 },
          { frequency: 784, duration: 0.2, delay: 150 }
        ]);
        break;
    }
  };

  const toggleMute = (): void => {
    setIsMuted(prev => !prev);
  };

  return (
    <SoundContext.Provider value={{ playSound, toggleMute, isMuted }}>
      {children}
    </SoundContext.Provider>
  );
};
