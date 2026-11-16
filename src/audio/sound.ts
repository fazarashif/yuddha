/**
 * All sound is synthesised in the browser: no audio files, nothing to license.
 * Effects imitate wood and bronze; the music is a slow generated pattern on a
 * five-note slendro-like scale.
 */

let ctx: AudioContext | null = null;
let sfxGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let sfxVol = 0.7;
let musicVol = 0.35;
let musicTimer: number | null = null;
let musicOn = false;

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    sfxGain = ctx.createGain();
    musicGain = ctx.createGain();
    sfxGain.gain.value = sfxVol;
    musicGain.gain.value = musicVol * 0.5;
    sfxGain.connect(ctx.destination);
    musicGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function setVolumes(sfx: number, music: number) {
  sfxVol = sfx;
  musicVol = music;
  if (sfxGain) sfxGain.gain.value = sfx;
  if (musicGain) musicGain.gain.value = music * 0.5;
  if (music <= 0) stopMusic();
}

/** A struck bronze key: a few inharmonic partials with a quick attack. */
function bronze(out: AudioNode, freq: number, at: number, dur: number, level: number) {
  const c = ctx!;
  const partials: [number, number][] = [[1, 1], [2.76, 0.32], [5.4, 0.12]];
  for (const [ratio, amp] of partials) {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq * ratio;
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(level * amp, at + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur / (ratio > 1 ? 2.2 : 1));
    osc.connect(g).connect(out);
    osc.start(at);
    osc.stop(at + dur + 0.05);
  }
}

/** A short wooden knock. */
function knock(out: AudioNode, at: number, pitch: number, level: number) {
  const c = ctx!;
  const len = Math.floor(c.sampleRate * 0.06);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = pitch;
  filter.Q.value = 3.5;
  const g = c.createGain();
  g.gain.value = level;
  src.connect(filter).connect(g).connect(out);
  src.start(at);

  const body = c.createOscillator();
  const bg = c.createGain();
  body.frequency.setValueAtTime(pitch / 4, at);
  body.frequency.exponentialRampToValueAtTime(pitch / 7, at + 0.08);
  bg.gain.setValueAtTime(level * 0.6, at);
  bg.gain.exponentialRampToValueAtTime(0.0001, at + 0.1);
  body.connect(bg).connect(out);
  body.start(at);
  body.stop(at + 0.12);
}

export type Sfx = 'move' | 'capture' | 'check' | 'win' | 'lose' | 'good' | 'bad' | 'tap' | 'hint';

export function play(kind: Sfx) {
  if (sfxVol <= 0) return;
  const c = audio();
  if (!c || !sfxGain) return;
  const t = c.currentTime + 0.005;
  const out = sfxGain;
  switch (kind) {
    case 'move':
      knock(out, t, 900, 0.9);
      break;
    case 'capture':
      knock(out, t, 620, 1);
      bronze(out, 587, t + 0.02, 0.5, 0.22);
      break;
    case 'check':
      bronze(out, 440, t, 0.7, 0.3);
      bronze(out, 660, t + 0.09, 0.6, 0.2);
      break;
    case 'good':
      bronze(out, 523, t, 0.5, 0.25);
      bronze(out, 784, t + 0.1, 0.7, 0.25);
      break;
    case 'bad':
      bronze(out, 196, t, 0.5, 0.3);
      bronze(out, 185, t + 0.02, 0.5, 0.2);
      break;
    case 'hint':
      bronze(out, 1046, t, 0.5, 0.14);
      break;
    case 'tap':
      knock(out, t, 1400, 0.35);
      break;
    case 'win':
      [392, 523, 587, 784].forEach((f, i) => bronze(out, f, t + i * 0.14, 1.2, 0.24));
      bronze(out, 98, t + 0.56, 3, 0.5);
      break;
    case 'lose':
      bronze(out, 98, t, 3.2, 0.5);
      bronze(out, 101, t, 3.2, 0.3);
      break;
  }
}

// Five-note scale, roughly slendro: steps of about 240 cents.
const SCALE = [0, 240, 480, 720, 960].map((cents) => 2 ** (cents / 1200));
const ROOT = 196;

function note(degree: number): number {
  const oct = Math.floor(degree / 5);
  return ROOT * SCALE[((degree % 5) + 5) % 5] * 2 ** oct;
}

function scheduleBar(startAt: number, bar: number, state: { degree: number }) {
  if (!ctx || !musicGain) return;
  const beat = 1.15;
  for (let i = 0; i < 8; i++) {
    const at = startAt + i * beat;
    // The melody wanders by small steps and rests now and then.
    if (Math.random() < 0.78) {
      state.degree = Math.max(0, Math.min(9, state.degree + [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)]));
      bronze(musicGain, note(state.degree + 5), at, 2.6, 0.1);
    }
    if (i % 4 === 3) bronze(musicGain, note(state.degree % 5), at, 3.4, 0.09);
    if (i % 2 === 1 && Math.random() < 0.5) bronze(musicGain, note(state.degree + 10), at + beat / 2, 1.6, 0.035);
  }
  // The gong marks the end of every second bar.
  if (bar % 2 === 1) {
    const at = startAt + 7 * beat;
    bronze(musicGain, ROOT / 4, at, 7, 0.34);
    bronze(musicGain, (ROOT / 4) * 1.012, at, 7, 0.2);
  }
}

export function startMusic() {
  if (musicOn || musicVol <= 0) return;
  const c = audio();
  if (!c) return;
  musicOn = true;
  const state = { degree: 2 };
  const barLen = 8 * 1.15;
  let bar = 0;
  let next = c.currentTime + 0.3;
  const tick = () => {
    if (!ctx) return;
    while (next < ctx.currentTime + 2) {
      scheduleBar(next, bar++, state);
      next += barLen;
    }
  };
  tick();
  musicTimer = window.setInterval(tick, 1000);
}

export function stopMusic() {
  musicOn = false;
  if (musicTimer !== null) window.clearInterval(musicTimer);
  musicTimer = null;
}

/** Browsers only allow sound after a gesture; call this from the first tap. */
export function unlockAudio() {
  audio();
}
