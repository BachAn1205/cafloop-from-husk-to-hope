import trungAudioFile from '../../assets/video/trung.mp3';

class TrungAudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private listeners: Set<(playing: boolean) => void> = new Set();

  private initAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;

    if (!this.audio) {
      this.audio = new Audio(trungAudioFile);
      this.audio.loop = true;
      this.audio.preload = 'auto';
      this.audio.volume = 0.65; // Pleasant background volume

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      // Extra guarantee for looping across all mobile/desktop browsers
      this.audio.addEventListener('ended', () => {
        if (this.audio && this.isPlaying) {
          this.audio.currentTime = 0;
          this.audio.play().catch(() => {});
        }
      });
    }

    return this.audio;
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
    const audio = this.initAudio();
    if (!audio) return;

    this.isPlaying = true;
    this.notify();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('Autoplay prevented by browser policy, waiting for user gesture:', error);
        this.isPlaying = false;
        this.notify();
      });
    }
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.notify();
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.isPlaying = false;
    this.notify();
  }
}

export const trungAudio = new TrungAudioPlayer();
