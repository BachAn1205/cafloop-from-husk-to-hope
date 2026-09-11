import trungAudioFile from '../../assets/video/trung.mp3';

class TrungAudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private listeners: Set<(playing: boolean) => void> = new Set();

  // Dynamic Volume Profile: Giảm âm lượng đoạn đầu (0s - 4.5s) để cân bằng với đoạn sau
  private readonly INTRO_VOL = 0.26;    // Âm lượng êm ái cho đoạn mở đầu
  private readonly MAIN_VOL = 0.52;     // Âm lượng chuẩn cho phần thân bài
  private readonly INTRO_DURATION = 4.5; // Giây kết thúc đoạn đầu
  private readonly RAMP_DURATION = 8.0;  // Giây hoàn tất chuyển giao âm lượng mượt mà

  private adjustVolume() {
    if (!this.audio) return;
    const t = this.audio.currentTime;

    if (t <= this.INTRO_DURATION) {
      this.audio.volume = this.INTRO_VOL;
    } else if (t < this.RAMP_DURATION) {
      // Tăng âm lượng tuyến tính êm dịu từ INTRO_VOL -> MAIN_VOL
      const ratio = (t - this.INTRO_DURATION) / (this.RAMP_DURATION - this.INTRO_DURATION);
      this.audio.volume = this.INTRO_VOL + ratio * (this.MAIN_VOL - this.INTRO_VOL);
    } else {
      this.audio.volume = this.MAIN_VOL;
    }
  }

  private initAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;

    if (!this.audio) {
      this.audio = new Audio(trungAudioFile);
      this.audio.loop = true;
      this.audio.preload = 'auto';
      this.audio.volume = this.INTRO_VOL;

      // Cân bằng âm lượng liên tục theo tiến trình bài nhạc
      this.audio.addEventListener('timeupdate', () => {
        this.adjustVolume();
      });

      this.audio.addEventListener('play', () => {
        this.adjustVolume();
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      // Đảm bảo loop mượt và reset âm lượng đoạn đầu khi lặp lại
      this.audio.addEventListener('ended', () => {
        if (this.audio && this.isPlaying) {
          this.audio.currentTime = 0;
          this.adjustVolume();
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

    this.adjustVolume();
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
      this.audio.volume = this.INTRO_VOL;
    }
    this.isPlaying = false;
    this.notify();
  }
}

export const trungAudio = new TrungAudioPlayer();
