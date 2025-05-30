
export class AudioManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private muted: boolean = false;

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds() {
    // Create audio objects with data URLs for simple sounds
    this.sounds.click = this.createBeepSound(800, 0.1);
    this.sounds.success = this.createBeepSound(1000, 0.2);
    this.sounds.error = this.createBeepSound(300, 0.3);
    this.sounds.complete = this.createMelody([523, 659, 784], 0.4);
  }

  private createBeepSound(frequency: number, duration: number): HTMLAudioElement {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    const audio = new Audio();
    
    // Create a simple beep sound programmatically
    const sampleRate = 44100;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    // Generate sine wave
    for (let i = 0; i < numSamples; i++) {
      const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.3;
      view.setInt16(44 + i * 2, sample * 32767, true);
    }

    audio.src = URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
    return audio;
  }

  private createMelody(frequencies: number[], duration: number): HTMLAudioElement {
    // For now, just return the first note
    return this.createBeepSound(frequencies[0], duration);
  }

  play(soundName: string) {
    if (this.muted || !this.sounds[soundName]) return;
    
    try {
      this.sounds[soundName].currentTime = 0;
      this.sounds[soundName].play().catch(() => {
        // Silently fail if audio can't play
      });
    } catch (error) {
      // Silently fail if audio can't play
    }
  }

  toggle() {
    this.muted = !this.muted;
    return !this.muted;
  }

  isMuted() {
    return this.muted;
  }
}

export const audioManager = new AudioManager();
