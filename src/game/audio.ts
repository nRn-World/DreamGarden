/**
 * Dream Garden audio is synthesized at runtime with the Web Audio API.
 * No external tracks are streamed or bundled, so the game stays small and
 * offline-capable. Everything is gentle: soft pads, glass bells and water.
 */

type Sfx = 'tap' | 'open' | 'plant' | 'water' | 'harvest' | 'reward' | 'level' | 'error' | 'claim';

class DreamAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private started = false;
  private musicTimer: number | null = null;
  private chordIndex = 0;
  private chordVoices: { osc: OscillatorNode; gain: GainNode }[] = [];
  private soundOn = true;
  private musicOn = true;

  configure(settings: { sound: boolean; music: boolean }): void {
    this.soundOn = settings.sound;
    this.musicOn = settings.music;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(settings.sound ? 0.9 : 0, this.ctx.currentTime, 0.2);
    }
    if (this.musicBus && this.ctx) {
      this.musicBus.gain.setTargetAtTime(settings.music ? 0.5 : 0, this.ctx.currentTime, 0.4);
    }
    if (settings.music && this.started) this.startMusicLoop();
    if (!settings.music) this.stopMusicLoop();
  }

  /** Must be called from a user gesture at least once. Safe to call repeatedly. */
  unlock(): void {
    const ctx = this.ensure();
    if (!ctx) return;
    if (ctx.state === 'suspended') void ctx.resume();
    if (!this.started) {
      this.started = true;
      this.startMusicLoop();
    }
  }

  private ensure(): AudioContext | null {
    if (this.ctx) return this.ctx;
    try {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      const ctx = new Ctor();
      const master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
      const music = ctx.createGain();
      music.gain.value = this.musicOn ? 0.5 : 0;
      music.connect(master);
      const sfx = ctx.createGain();
      sfx.gain.value = 0.9;
      sfx.connect(master);
      this.ctx = ctx;
      this.master = master;
      this.musicBus = music;
      this.sfxBus = sfx;
      return ctx;
    } catch {
      return null;
    }
  }

  private startMusicLoop(): void {
    if (!this.ctx || this.musicTimer !== null) return;
    this.chordIndex = 0;
    this.playChord();
    this.musicTimer = window.setInterval(() => {
      if (!this.musicOn) return;
      this.chordIndex = (this.chordIndex + 1) % CHORDS.length;
      this.playChord();
    }, 14_000);
  }

  private stopMusicLoop(): void {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private playChord(): void {
    const ctx = this.ctx;
    const bus = this.musicBus;
    if (!ctx || !bus) return;
    const now = ctx.currentTime;
    const chord = CHORDS[this.chordIndex % CHORDS.length];

    for (const voice of this.chordVoices) {
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setTargetAtTime(0, now, 2.2);
      voice.osc.stop(now + 8);
    }
    this.chordVoices = [];

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.Q.value = 0.4;
    filter.connect(bus);

    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      osc.detune.value = (i % 2 === 0 ? -1 : 1) * 4;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.gain.setTargetAtTime(i === 0 ? 0.05 : 0.028, now, 3.5);
      osc.connect(gain);
      gain.connect(filter);
      osc.start(now);
      this.chordVoices.push({ osc, gain });
    });

    // A sparse glass bell high above the pad, like a wind chime.
    if (Math.random() < 0.85) {
      const bell = [1046.5, 1318.5, 1568, 2093][Math.floor(Math.random() * 4)];
      this.tone(bell, 0.055, 3.4, 'sine', now + 2.5, bus);
      this.tone(bell * 1.5, 0.018, 2.2, 'sine', now + 4.2, bus);
    }
  }

  private tone(
    freq: number,
    volume: number,
    duration: number,
    type: OscillatorType,
    when: number,
    destination?: AudioNode,
  ): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const dest = destination ?? this.sfxBus;
    if (!dest) return;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(volume, when + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(when);
    osc.stop(when + duration + 0.1);
  }

  sfx(name: Sfx): void {
    if (!this.soundOn) return;
    const ctx = this.ensure();
    if (!ctx) return;
    if (ctx.state === 'suspended') void ctx.resume();
    const t = ctx.currentTime + 0.01;
    switch (name) {
      case 'tap':
        this.tone(720, 0.035, 0.09, 'sine', t);
        break;
      case 'open':
        this.tone(392, 0.04, 0.18, 'sine', t);
        this.tone(587.3, 0.03, 0.22, 'sine', t + 0.05);
        break;
      case 'plant':
        this.tone(196, 0.06, 0.25, 'sine', t);
        this.tone(523.3, 0.035, 0.3, 'triangle', t + 0.06);
        break;
      case 'water':
        for (let i = 0; i < 3; i += 1) {
          const when = t + i * 0.09;
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(900 - i * 120, when);
          osc.frequency.exponentialRampToValueAtTime(320, when + 0.14);
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.0001, when);
          gain.gain.linearRampToValueAtTime(0.05, when + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.16);
          osc.connect(gain);
          gain.connect(this.sfxBus!);
          osc.start(when);
          osc.stop(when + 0.2);
        }
        break;
      case 'harvest':
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, 0.055, 0.5, 'triangle', t + i * 0.06));
        break;
      case 'reward':
        [392, 493.88, 587.33, 783.99].forEach((f, i) => this.tone(f, 0.05, 0.7, 'sine', t + i * 0.07));
        break;
      case 'level':
        [261.63, 329.63, 392, 523.25, 659.25, 783.99].forEach((f, i) =>
          this.tone(f, 0.05, 1.1, 'triangle', t + i * 0.085),
        );
        this.tone(1567.98, 0.025, 1.8, 'sine', t + 0.5);
        break;
      case 'error':
        this.tone(174.61, 0.045, 0.25, 'sine', t);
        this.tone(146.83, 0.04, 0.3, 'sine', t + 0.08);
        break;
      case 'claim':
        [698.46, 880, 1046.5].forEach((f, i) => this.tone(f, 0.045, 0.6, 'sine', t + i * 0.05));
        break;
    }
  }
}

const CHORDS: number[][] = [
  [110, 164.81, 261.63, 329.63, 493.88], // Am9
  [87.31, 174.61, 261.63, 349.23, 440], // Fmaj9
  [130.81, 196, 329.63, 392, 587.33], // Cmaj9
  [98, 146.83, 246.94, 293.66, 392], // G/B
];

export const audio = new DreamAudio();

export function haptic(pattern: number | number[], enabled: boolean): void {
  if (!enabled) return;
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    /* Haptics are a progressive enhancement. */
  }
}
