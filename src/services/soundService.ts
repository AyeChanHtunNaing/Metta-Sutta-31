// Sound Service for Metta Sutta 31
// Provides authentic Burmese Kyee-zee (ကြေးစည်သံ - Spinning Triangular Bronze Gong)
// and bead click haptic feedback via Web Audio API.

class SoundService {
  private ctx: AudioContext | null = null;

  private initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Synthesize an authentic Burmese Kyee-zee (ကြေးစည်သံ)
  // Characteristic: Strike transient + Inharmonic bronze partials + Rotational spinning tremolo (ဝီး... ဝီး... ဝီး...)
  public playKyeeZee() {
    try {
      this.initAudioContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 5.5; // Long resonant decay

      // Master output for this strike
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.7, now);
      masterGain.connect(this.ctx.destination);

      // Tremolo / Rotational Wah-Wah Effect (လှည့်ပတ်ဝေ့ဝဲသံ)
      // As the triangular plate rotates on its hanging cord in the air, 
      // amplitude and phase modulate (approx 3.5 Hz slowing down to 1.8 Hz)
      const tremoloGain = this.ctx.createGain();
      tremoloGain.gain.setValueAtTime(0.65, now);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.type = 'sine';
      // Rotation starts fast (3.8 Hz) and slows down as spin decays (1.8 Hz)
      lfo.frequency.setValueAtTime(3.8, now);
      lfo.frequency.exponentialRampToValueAtTime(1.8, now + duration);

      // Tremolo depth (depth of spinning volume modulation)
      lfoGain.gain.setValueAtTime(0.35, now);
      lfoGain.gain.linearRampToValueAtTime(0.15, now + duration);

      lfo.connect(lfoGain);
      lfoGain.connect(tremoloGain.gain);
      lfo.start(now);
      lfo.stop(now + duration);

      tremoloGain.connect(masterGain);

      // 1. Initial Mallet Strike Transient (ကြေးစည်ကို သစ်သားဒုတ်ဖြင့် ခတ်သံ)
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

      // 2. Bronze Kyee-zee Acoustic Partials (ကြေးစည်၏ ကြေးသံလှိုင်းများ)
      // Triangular flat bronze plate frequency ratios:
      const partials = [
        { freq: 784.0,  gain: 0.45, decay: 5.2 }, // Fundamental (G5)
        { freq: 1176.0, gain: 0.35, decay: 4.8 }, // 1.5x partial
        { freq: 1568.0, gain: 0.28, decay: 4.2 }, // 2.0x partial
        { freq: 2156.0, gain: 0.18, decay: 3.5 }, // 2.75x inharmonic
        { freq: 2820.0, gain: 0.12, decay: 2.8 }, // 3.6x inharmonic
        { freq: 3650.0, gain: 0.06, decay: 2.0 }, // High shimmer
      ];

      partials.forEach((p, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const pGain = this.ctx.createGain();

        // Slight detune for rich bronze chorus resonance
        const detune = (idx % 2 === 0 ? 1 : -1) * (1.5 + idx * 0.5);
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(p.freq + detune, now);

        pGain.gain.setValueAtTime(0, now);
        // Sharp strike attack (8ms)
        pGain.gain.linearRampToValueAtTime(p.gain, now + 0.008);
        // Exponential bronze sustain decay
        pGain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

        osc.connect(pGain);
        pGain.connect(tremoloGain);

        osc.start(now);
        osc.stop(now + p.decay);
      });

      // Mobile haptic pulse
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([40]);
      }
    } catch {
      // AudioContext may be waiting for first user touch
    }
  }
}

export const soundService = new SoundService();
