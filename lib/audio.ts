"use client";

class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  private getMasterVolume(): number {
    if (typeof window !== "undefined" && (window as any).__desktopVolume !== undefined) {
      return (window as any).__desktopVolume;
    }
    return 0.7;
  }

  public setMute(mute: boolean) {
    this.muted = mute;
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public playClick() {
    this.initCtx();
    if (!this.ctx || this.muted) return;

    const masterVol = this.getMasterVolume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.06 * masterVol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  public playWarp() {
    this.initCtx();
    if (!this.ctx || this.muted) return;

    const masterVol = this.getMasterVolume();
    const now = this.ctx.currentTime;
    const noteLength = 0.14;
    const totalDuration = 3.8;

    const bassFilter = this.ctx.createBiquadFilter();
    bassFilter.type = "lowpass";
    bassFilter.frequency.setValueAtTime(80, now);
    bassFilter.frequency.exponentialRampToValueAtTime(380, now + 2.8);

    const bassGain = this.ctx.createGain();
    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.linearRampToValueAtTime(0.28 * masterVol, now + 0.8);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + totalDuration);

    const oscBass1 = this.ctx.createOscillator();
    const oscBass2 = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();

    oscBass1.type = "sawtooth";
    oscBass1.frequency.setValueAtTime(65.41, now);
    oscBass1.frequency.linearRampToValueAtTime(65.6, now + totalDuration);

    oscBass2.type = "sawtooth";
    oscBass2.frequency.setValueAtTime(65.0, now);
    oscBass2.frequency.linearRampToValueAtTime(65.2, now + totalDuration);

    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(32.7, now);

    oscBass1.connect(bassFilter);
    oscBass2.connect(bassFilter);
    subOsc.connect(bassFilter);
    
    bassFilter.connect(bassGain);
    bassGain.connect(this.ctx.destination);

    oscBass1.start(now);
    oscBass2.start(now);
    subOsc.start(now);

    oscBass1.stop(now + totalDuration);
    oscBass2.stop(now + totalDuration);
    subOsc.stop(now + totalDuration);

    const arpNotes = [
      130.81,
      164.81,
      196.00,
      246.94,
      261.63,
      246.94,
      196.00,
      164.81
    ];

    const numNotes = Math.floor(3.2 / noteLength);
    for (let i = 0; i < numNotes; i++) {
      const noteTime = now + (i * noteLength);
      const freq = arpNotes[i % arpNotes.length];

      const noteOsc = this.ctx.createOscillator();
      noteOsc.type = "triangle";
      noteOsc.frequency.setValueAtTime(freq, noteTime);

      const noteFilter = this.ctx.createBiquadFilter();
      noteFilter.type = "lowpass";
      noteFilter.frequency.setValueAtTime(700, noteTime);
      noteFilter.frequency.exponentialRampToValueAtTime(120, noteTime + 0.32);

      const noteGain = this.ctx.createGain();
      noteGain.gain.setValueAtTime(0.001, noteTime);
      noteGain.gain.linearRampToValueAtTime(0.14 * masterVol, noteTime + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);

      noteOsc.connect(noteFilter);
      noteFilter.connect(noteGain);
      noteGain.connect(this.ctx.destination);

      noteOsc.start(noteTime);
      noteOsc.stop(noteTime + 0.32);
    }

    try {
      const bufferSize = this.ctx.sampleRate * totalDuration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.Q.setValueAtTime(3.0, now);
      noiseFilter.frequency.setValueAtTime(200, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(950, now + totalDuration * 0.85);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.05 * masterVol, now + 0.5);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + totalDuration);

      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noiseNode.start(now);
      noiseNode.stop(now + totalDuration);
    } catch (e) {
      console.warn("Stranger Things ambient noise error:", e);
    }
  }

  public playError() {
    this.initCtx();
    if (!this.ctx || this.muted) return;

    const masterVol = this.getMasterVolume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.08 * masterVol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  public playLaser() {
    this.initCtx();
    if (!this.ctx || this.muted) return;

    const masterVol = this.getMasterVolume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(900, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.14);

    gain.gain.setValueAtTime(0.05 * masterVol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public playExplosion() {
    this.initCtx();
    if (!this.ctx || this.muted) return;

    const masterVol = this.getMasterVolume();
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12 * masterVol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.38);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noiseNode.start();
    noiseNode.stop(this.ctx.currentTime + 0.4);
  }

  public playPowerUp() {
    this.initCtx();
    if (!this.ctx || this.muted) return;

    const masterVol = this.getMasterVolume();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.setValueAtTime(329, now + 0.08);
    osc.frequency.setValueAtTime(392, now + 0.16);
    osc.frequency.setValueAtTime(523, now + 0.24);

    gain.gain.setValueAtTime(0.07 * masterVol, now);
    gain.gain.setValueAtTime(0.07 * masterVol, now + 0.24);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.45);
  }

  public playSuccess() {
    this.playPowerUp();
  }
}

export const sysAudio = new ProceduralAudioEngine();
export default sysAudio;
