/**
 * Dream Garden audio is synthesized at runtime with the Web Audio API.
 * No external tracks are streamed or bundled, so the game stays small and
 * offline-capable. Everything is gentle: soft pads, glass bells and water.
 */

export type AmbienceKind = 'rain' | 'wind' | 'brown';

type Sfx = 'tap' | 'open' | 'plant' | 'water' | 'harvest' | 'reward' | 'level' | 'error' | 'claim';

class DreamAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private started = false;
  private musicTimer: number | null = null;
  private chordIndex = 0;
  private track = 0;
  private ambience = new Map<AmbienceKind, { source: AudioBufferSourceNode; gain: GainNode }>();
  private fadeTimer: number | null = null;
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

  /** Looping noise layer for falling asleep. Needs a prior user gesture, like all audio. */
  setAmbience(kind: AmbienceKind, on: boolean): void {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const current = this.ambience.get(kind);
    if (!on) {
      if (current) {
        current.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
        current.source.stop(ctx.currentTime + 3);
        this.ambience.delete(kind);
      }
      return;
    }
    if (current) return;
    if (ctx.state === 'suspended') void ctx.resume();
    const length = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      // Brown noise integrates white noise; rain and wind are filtered below.
      last = kind === 'brown' ? (last + 0.02 * white) / 1.02 : white;
      data[i] = kind === 'brown' ? last * 3.5 : white;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = kind === 'rain' ? 'bandpass' : 'lowpass';
    filter.frequency.value = kind === 'rain' ? 3200 : kind === 'wind' ? 420 : 900;
    filter.Q.value = kind === 'rain' ? 0.5 : 0.7;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(kind === 'rain' ? 0.16 : kind === 'wind' ? 0.2 : 0.22, ctx.currentTime, 1.2);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    if (kind === 'wind') {
      // Slow swell so the wind breathes instead of hissing.
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12;
      const depth = ctx.createGain();
      depth.gain.value = 180;
      lfo.connect(depth);
      depth.connect(filter.frequency);
      lfo.start();
      source.addEventListener('ended', () => lfo.stop());
    }
    source.start();
    this.ambience.set(kind, { source, gain });
  }

  hasAmbience(kind: AmbienceKind): boolean {
    return this.ambience.has(kind);
  }

  /** Fade everything to silence over `minutes`, then pause the audio clock. */
  startSleepFade(minutes: number): void {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    this.cancelSleepFade();
    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0.0001, now + minutes * 60);
    this.fadeTimer = window.setTimeout(() => {
      this.fadeTimer = null;
      void ctx.suspend();
    }, minutes * 60_000 + 500);
  }

  /** Undo a sleep fade: volume back to the player's setting, audio running again. */
  cancelSleepFade(): void {
    if (this.fadeTimer !== null) {
      window.clearTimeout(this.fadeTimer);
      this.fadeTimer = null;
    }
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    if (ctx.state === 'suspended') void ctx.resume();
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setTargetAtTime(this.soundOn ? 0.9 : 0, ctx.currentTime, 0.3);
  }

  /** Each cleared night brings the next melody; the list wraps. */
  setTrack(n: number): void {
    const index = ((Math.floor(n) % TRACKS.length) + TRACKS.length) % TRACKS.length;
    if (index === this.track) return;
    this.track = index;
    if (this.started && this.musicOn) {
      this.stopMusicLoop();
      this.startMusicLoop();
    }
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
      this.chordIndex = (this.chordIndex + 1) % TRACKS[this.track].chords.length;
      this.playChord();
    }, TRACKS[this.track].every);
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
    const track = TRACKS[this.track];
    const chord = track.chords[this.chordIndex % track.chords.length];

    for (const voice of this.chordVoices) {
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setTargetAtTime(0, now, 2.2);
      voice.osc.stop(now + 8);
    }
    this.chordVoices = [];

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = track.cutoff;
    filter.Q.value = 0.4;
    filter.connect(bus);

    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : track.wave;
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
      const bell = track.bells[Math.floor(Math.random() * track.bells.length)];
      this.tone(bell, 0.055, 3.4, 'sine', now + 2.5, bus);
      this.tone(bell * 1.5, 0.018, 2.2, 'sine', now + 4.2, bus);
    }

    // Music-box notes drifting over the pad on the tracks that ask for them.
    if (track.arp) {
      chord.slice(1).forEach((freq, i) => this.tone(freq * 2, 0.02, 2.8, 'sine', now + 3 + i * 2.4, bus));
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

interface Track {
  chords: number[][];
  bells: number[];
  /** Milliseconds between chord changes. */
  every: number;
  cutoff: number;
  wave: OscillatorType;
  arp: boolean;
}

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
const fromMidi = (rows: number[][]) => rows.map((row) => row.map(hz));

/** Nine calm pads. Track 0 is the original melody; each cleared night moves one further. */
const TRACKS: Track[] = [
  {
    chords: [
      [110, 164.81, 261.63, 329.63, 493.88], // Am9
      [87.31, 174.61, 261.63, 349.23, 440], // Fmaj9
      [130.81, 196, 329.63, 392, 587.33], // Cmaj9
      [98, 146.83, 246.94, 293.66, 392], // G/B
    ],
    bells: [1046.5, 1318.5, 1568, 2093],
    every: 14_000,
    cutoff: 900,
    wave: 'triangle',
    arp: false,
  },
  {
    chords: fromMidi([[38, 45, 57, 61, 64], [35, 47, 54, 57, 62], [43, 50, 59, 62, 66], [33, 45, 52, 57, 61]]),
    bells: [81, 83, 86, 88, 90].map(hz),
    every: 15_000,
    cutoff: 800,
    wave: 'triangle',
    arp: false,
  },
  {
    chords: fromMidi([[36, 48, 55, 59, 64], [33, 45, 52, 55, 60], [41, 53, 57, 60, 64], [43, 55, 59, 62, 64]]),
    bells: [84, 86, 88, 91, 93].map(hz),
    every: 16_000,
    cutoff: 1000,
    wave: 'triangle',
    arp: true,
  },
  {
    chords: fromMidi([[40, 52, 59, 62, 66], [36, 48, 55, 59, 62], [38, 50, 57, 59, 64], [35, 47, 54, 57, 62]]),
    bells: [83, 86, 88, 91, 95].map(hz),
    every: 17_000,
    cutoff: 700,
    wave: 'sine',
    arp: false,
  },
  {
    chords: fromMidi([[33, 45, 52, 56, 61], [38, 50, 57, 61, 64], [40, 52, 56, 59, 64], [42, 54, 57, 61, 64]]),
    bells: [81, 83, 85, 88, 90].map(hz),
    every: 15_000,
    cutoff: 950,
    wave: 'triangle',
    arp: true,
  },
  {
    chords: fromMidi([[41, 53, 57, 60, 64], [43, 55, 59, 62, 64], [36, 48, 55, 59, 62], [38, 50, 57, 60, 64]]),
    bells: [84, 86, 89, 91, 93].map(hz),
    every: 16_000,
    cutoff: 850,
    wave: 'triangle',
    arp: false,
  },
  {
    chords: fromMidi([[43, 50, 58, 65, 69], [39, 51, 58, 62, 67], [34, 46, 53, 57, 62], [41, 53, 57, 62, 64]]),
    bells: [82, 86, 89, 91, 94].map(hz),
    every: 18_000,
    cutoff: 750,
    wave: 'sine',
    arp: true,
  },
  {
    chords: fromMidi([[34, 46, 53, 57, 62], [39, 51, 55, 58, 62], [43, 55, 58, 62, 65], [33, 45, 53, 57, 60]]),
    bells: [82, 84, 86, 89, 91].map(hz),
    every: 15_000,
    cutoff: 1000,
    wave: 'triangle',
    arp: true,
  },
  {
    chords: fromMidi([[33, 45, 52, 57, 60], [36, 48, 52, 55, 59], [38, 50, 53, 57, 62], [40, 52, 55, 59, 62]]),
    bells: [81, 84, 86, 88, 91].map(hz),
    every: 20_000,
    cutoff: 600,
    wave: 'sine',
    arp: false,
  },
];

export const TRACK_COUNT = TRACKS.length;

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
