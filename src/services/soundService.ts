// Sound Service for Metta Sutta 31
// Hybrid Engine: Pre-rendered high-fidelity Kyee-zee WAV (HTML5 Audio pool)
// + Web Audio API synthesizer fallback
// Engineered for 100% mobile browser compatibility (iOS Safari, Android Chrome, in-app webviews)

class SoundService {
  private audioPool: HTMLAudioElement[] = [];
  private poolSize = 3;
  private poolIndex = 0;
  private ctx: AudioContext | null = null;
  private isUnlocked = false;
  private audioUrl: string;

  constructor() {
    this.audioUrl = this.resolveAudioUrl();
    if (typeof window !== 'undefined') {
      this.initPool();
      this.setupGlobalUnlock();
    }
  }

  private resolveAudioUrl(): string {
    if (typeof window === 'undefined') return './kyee-zee.wav';
    try {
      // Resolves absolute URL based on current origin & path
      return new URL('kyee-zee.wav', window.location.href).href;
    } catch {
      const base = import.meta.env.BASE_URL || './';
      return `${base.endsWith('/') ? base : base + '/'}kyee-zee.wav`;
    }
  }

  private initPool() {
    try {
      this.audioPool = [];
      for (let i = 0; i < this.poolSize; i++) {
        const audio = new Audio();
        audio.src = this.audioUrl;
        audio.preload = 'auto';
        // Essential mobile properties
        (audio as unknown as { playsInline: boolean }).playsInline = true;
        this.audioPool.push(audio);
      }
    } catch (e) {
      console.warn('Failed to initialize audio pool:', e);
    }
  }

  // Global unlock on first user interaction (touch/click/keydown)
  private setupGlobalUnlock() {
    if (typeof window === 'undefined') return;

    const unlockEvents = ['touchstart', 'touchend', 'click', 'keydown'];
    const handleGesture = () => {
      this.unlock();
      unlockEvents.forEach((evt) => {
        window.removeEventListener(evt, handleGesture, true);
      });
    };

    unlockEvents.forEach((evt) => {
      window.addEventListener(evt, handleGesture, { capture: true, passive: true });
    });
  }

  // Explicit unlock called on first interaction or button click
  public async unlock(): Promise<void> {
    if (this.isUnlocked) return;
    this.isUnlocked = true;

    // 1. Warm up HTML5 Audio pool
    try {
      if (this.audioPool.length > 0) {
        this.audioPool.forEach((audio) => {
          try {
            audio.load();
          } catch {}
        });
      }
    } catch {}

    // 2. Warm up Web Audio API
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx && !this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      if (this.ctx) {
        // Play 1-sample silent buffer to wake up iOS hardware audio pipeline
        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.start(0);
      }
    } catch {}
  }

  // Play Kyee-zee sound (ကြေးစည်သံ)
  public async playKyeeZee(): Promise<void> {
    // 1. Mobile haptic feedback (vibration)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([45]);
      } catch {}
    }

    // Ensure audio is primed
    if (!this.isUnlocked) {
      await this.unlock();
    }

    // 2. Try HTML5 Audio Pool first (primary and most reliable on mobile devices)
    const success = await this.playViaAudioElement();
    if (!success) {
      // 3. Fallback to Web Audio API synthesis
      await this.playViaWebAudio();
    }
  }

  private async playViaAudioElement(): Promise<boolean> {
    try {
      if (this.audioPool.length === 0) {
        this.initPool();
      }
      if (this.audioPool.length === 0) return false;

      const audio = this.audioPool[this.poolIndex];
      this.poolIndex = (this.poolIndex + 1) % this.poolSize;

      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      return true;
    } catch (e) {
      console.warn('HTML5 Audio playback note, attempting Web Audio fallback:', e);
      return false;
    }
  }

  // Web Audio API Synthesizer (Authentic spinning Kyee-zee)
  private async playViaWebAudio(): Promise<boolean> {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;

      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      // Add a small 40ms lookahead headroom for reliable mobile scheduling
      const now = Math.max(this.ctx.currentTime, 0.001) + 0.04;
      const duration = 5.5;

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.7, now);
      masterGain.connect(this.ctx.destination);

      // Rotational Tremolo (ဝီး... ဝီး... ဝီး...)
      const tremoloGain = this.ctx.createGain();
      tremoloGain.gain.setValueAtTime(0.65, now);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(3.8, now);
      lfo.frequency.exponentialRampToValueAtTime(1.8, now + duration);

      lfoGain.gain.setValueAtTime(0.35, now);
      lfoGain.gain.linearRampToValueAtTime(0.15, now + duration);

      lfo.connect(lfoGain);
      lfoGain.connect(tremoloGain.gain);
      lfo.start(now);
      lfo.stop(now + duration);

      tremoloGain.connect(masterGain);

      // Strike Transient
      const strikeOsc = this.ctx.createOscillator();
      const strikeGain = this.ctx.createGain();
      strikeOsc.type = 'triangle';
      strikeOsc.frequency.setValueAtTime(2800, now);
      strikeOsc.frequency.exponentialRampToValueAtTime(450, now + 0.035);

      strikeGain.gain.setValueAtTime(0.5, now);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      strikeOsc.connect(strikeGain);
      strikeGain.connect(masterGain);
      strikeOsc.start(now);
      strikeOsc.stop(now + 0.04);

      // Bronze Partials
      const partials = [
        { freq: 784.0,  gain: 0.45, decay: 5.2 },
        { freq: 1176.0, gain: 0.35, decay: 4.8 },
        { freq: 1568.0, gain: 0.28, decay: 4.2 },
        { freq: 2156.0, gain: 0.18, decay: 3.5 },
        { freq: 2820.0, gain: 0.12, decay: 2.8 },
        { freq: 3650.0, gain: 0.06, decay: 2.0 },
      ];

      partials.forEach((p, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const pGain = this.ctx.createGain();

        const detune = (idx % 2 === 0 ? 1 : -1) * (1.5 + idx * 0.5);
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(p.freq + detune, now);

        // Avoid starting exponential curves at zero
        pGain.gain.setValueAtTime(0.0001, now);
        pGain.gain.linearRampToValueAtTime(p.gain, now + 0.01);
        pGain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

        osc.connect(pGain);
        pGain.connect(tremoloGain);

        osc.start(now);
        osc.stop(now + p.decay);
      });

      return true;
    } catch (e) {
      console.warn('Web Audio playback error:', e);
      return false;
    }
  }
}

export const soundService = new SoundService();
