// Web Audio API generator for authentic Vietnamese Bamboo Xylophone (Đàn T'rưng) & Forest Ambience

class TrungAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private noteIndex: number = 0;
  private listeners: Set<(playing: boolean) => void> = new Set();

  // Pentatonic scale frequencies simulating bamboo pipes of Tây Nguyên (G4, A4, C5, D5, E5, G5, A5, C6)
  private melodyNotes: { freq: number; duration: number }[] = [
    { freq: 392.00, duration: 0.35 }, // G4
    { freq: 440.00, duration: 0.35 }, // A4
    { freq: 523.25, duration: 0.5 },  // C5
    { freq: 587.33, duration: 0.35 }, // D5
    { freq: 659.25, duration: 0.6 },  // E5
    { freq: 587.33, duration: 0.35 }, // D5
    { freq: 523.25, duration: 0.35 }, // C5
    { freq: 783.99, duration: 0.7 },  // G5
    { freq: 880.00, duration: 0.35 }, // A5
    { freq: 659.25, duration: 0.4 },  // E5
    { freq: 587.33, duration: 0.5 },  // D5
    { freq: 523.25, duration: 0.8 },  // C5 (resolve)
    { freq: 440.00, duration: 0.35 }, // A4
    { freq: 523.25, duration: 0.4 },  // C5
    { freq: 392.00, duration: 0.9 },  // G4
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Synthesize a bamboo mallet strike sound on a hollow wooden tube
  private playTrungNote(freq: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Fundamental oscillator (triangle wave for mellow wood chime)
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    // Slight pitch drop on strike (characteristic of wood percussion)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.99, now + 0.4);

    // Harmonic overtone oscillator (simulates hollow bamboo resonance)
    const overtone = this.ctx.createOscillator();
    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2.76, now); // Natural bamboo pipe partial

    // Gain envelopes
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.015); // Fast strike attack
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2); // Natural reverberant decay

    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.08, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    // Bamboo acoustic resonant filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, now);
    filter.Q.setValueAtTime(4.0, now);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);
    gain.connect(filter);
    filter.connect(this.ctx.destination);

    osc.start(now);
    overtone.start(now);

    osc.stop(now + 1.3);
    overtone.stop(now + 0.4);
  }

  public subscribe(fn: (playing: boolean) => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlaying));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  public play() {
    this.initContext();
    this.isPlaying = true;
    this.notify();

    const loopMelody = () => {
      if (!this.isPlaying) return;

      const currentNote = this.melodyNotes[this.noteIndex];
      this.playTrungNote(currentNote.freq);

      this.noteIndex = (this.noteIndex + 1) % this.melodyNotes.length;
      const delay = (currentNote.duration + 0.08) * 1000;

      this.timerId = window.setTimeout(loopMelody, delay);
    };

    loopMelody();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.noteIndex = 0;
    this.notify();
  }
}

export const trungAudio = new TrungAudioPlayer();
