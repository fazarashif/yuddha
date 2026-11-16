import type { ReactNode } from 'react';
import type { FaceSpec, Mood } from '../content/types';

/**
 * Character portraits in the manner of a carved mask (topeng): a front view
 * built from a few shapes, so every character shares one style and each of the
 * three moods only changes eyes, brows and mouth.
 */

const INK = '#1a1320';

function Eyes({ spec, mood }: { spec: FaceSpec; mood: Mood }) {
  const eye = (cx: number) => {
    if (mood === 'happy') return <path key={cx} d={`M${cx - 6} 52 Q${cx} 45 ${cx + 6} 52`} fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />;
    if (mood === 'surprised' || spec.eyes === 'round') {
      const r = mood === 'surprised' ? 6 : 4.8;
      return (
        <g key={cx}>
          <circle cx={cx} cy={51} r={r} fill="#fff8ea" stroke={INK} strokeWidth={1.6} />
          <circle cx={cx} cy={51} r={mood === 'surprised' ? 1.8 : 2.2} fill={INK} />
        </g>
      );
    }
    return (
      <g key={cx}>
        <path d={`M${cx - 7} 51 Q${cx} 46 ${cx + 7} 51 Q${cx} 54 ${cx - 7} 51 Z`} fill="#fff8ea" stroke={INK} strokeWidth={1.5} />
        <circle cx={cx} cy={50.6} r={1.7} fill={INK} />
      </g>
    );
  };
  const brow = (cx: number, dir: 1 | -1) => {
    const lift = mood === 'surprised' ? -4 : 0;
    const d =
      spec.brows === 'fierce' && mood !== 'surprised'
        ? `M${cx - 8 * dir} ${39} L${cx + 7 * dir} ${45}`
        : spec.brows === 'arched'
          ? `M${cx - 8} ${44 + lift} Q${cx} ${36 + lift} ${cx + 8} ${44 + lift}`
          : `M${cx - 8} ${43 + lift} Q${cx} ${40 + lift} ${cx + 8} ${43 + lift}`;
    return <path key={cx} d={d} fill="none" stroke={INK} strokeWidth={spec.brows === 'fierce' ? 3.4 : 2.4} strokeLinecap="round" />;
  };
  return (
    <>
      {brow(39, 1)}
      {brow(61, -1)}
      {eye(39)}
      {eye(61)}
    </>
  );
}

function Mouth({ spec, mood }: { spec: FaceSpec; mood: Mood }) {
  if (mood === 'surprised') return <ellipse cx={50} cy={71} rx={4.5} ry={5.5} fill={INK} />;
  if (spec.mouth === 'fangs') {
    return (
      <>
        <path d="M36 67 Q50 78 64 67 Q50 72 36 67 Z" fill="#7a1f1a" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        <path d="M41 68 L43.5 76 L46 69.5 Z M59 68 L56.5 76 L54 69.5 Z" fill="#fff8ea" stroke={INK} strokeWidth={1} />
      </>
    );
  }
  if (mood === 'happy') return <path d="M40 67 Q50 77 60 67 Q50 71 40 67 Z" fill="#7a1f1a" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />;
  if (spec.mouth === 'flat') return <path d="M43 70 H57" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />;
  return <path d="M42 68 Q50 74 58 68" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />;
}

function Head({ spec }: { spec: FaceSpec }): ReactNode {
  const c = spec.headColor;
  const a = spec.accent;
  const s = { stroke: INK, strokeWidth: 2, strokeLinejoin: 'round' as const };
  switch (spec.head) {
    case 'blangkon':
      return (
        <>
          <circle cx={79} cy={44} r={6} fill={c} {...s} />
          <path d="M21 46 C19 20 81 20 79 46 C62 37 38 37 21 46 Z" fill={c} {...s} />
          <path d="M22 44 C38 34 62 34 78 44" fill="none" stroke={a} strokeWidth={2.4} />
        </>
      );
    case 'tuft':
      return <path d="M44 27 C42 16 48 12 50 8 C52 12 58 16 56 27 Z" fill={c} {...s} />;
    case 'caping':
      return <path d="M14 42 L50 12 L86 42 C64 36 36 36 14 42 Z" fill={c} {...s} />;
    case 'horns':
      return (
        <>
          <path d="M27 40 C14 36 12 22 18 12 C22 24 28 28 36 30 Z" fill={a} {...s} />
          <path d="M73 40 C86 36 88 22 82 12 C78 24 72 28 64 30 Z" fill={a} {...s} />
          <path d="M26 44 C26 26 36 20 40 24 L44 18 L50 25 L56 18 L60 24 C64 20 74 26 74 44 C60 36 40 36 26 44 Z" fill={c} {...s} />
        </>
      );
    case 'veil':
      return (
        <>
          <path d="M22 86 C14 60 18 22 50 20 C82 22 86 60 78 86 L70 60 C70 40 60 34 50 34 C40 34 30 40 30 60 Z" fill={c} {...s} />
          <circle cx={50} cy={27} r={3.4} fill={a} stroke={INK} strokeWidth={1.4} />
        </>
      );
    case 'helm':
      return (
        <>
          <path d="M22 48 C20 24 34 16 50 16 C66 16 80 24 78 48 C62 40 38 40 22 48 Z" fill={c} {...s} />
          <path d="M46 17 L50 5 L54 17 Z" fill={a} {...s} />
          <path d="M23 46 C38 38 62 38 77 46" fill="none" stroke={a} strokeWidth={2.4} />
        </>
      );
    case 'bun':
      return (
        <>
          <circle cx={50} cy={17} r={9} fill={c} {...s} />
          <path d="M25 44 C25 26 38 22 50 22 C62 22 75 26 75 44 C60 37 40 37 25 44 Z" fill={c} {...s} />
          <path d="M42 22 H58" stroke={a} strokeWidth={3} strokeLinecap="round" />
        </>
      );
    case 'tiara':
      return (
        <>
          <path d="M22 80 C16 56 22 26 50 24 C78 26 84 56 78 80 L70 56 C68 40 60 36 50 36 C40 36 32 40 30 56 Z" fill={c} {...s} />
          <path d="M30 38 L33 22 L41 31 L50 14 L59 31 L67 22 L70 38 C58 33 42 33 30 38 Z" fill={a} {...s} />
        </>
      );
    case 'crown':
      return (
        <>
          <path d="M26 40 C22 30 26 22 34 20 L38 28 L44 12 L50 6 L56 12 L62 28 L66 20 C74 22 78 30 74 40 C60 33 40 33 26 40 Z" fill={a} {...s} />
          <circle cx={50} cy={24} r={3.6} fill={c} stroke={INK} strokeWidth={1.4} />
        </>
      );
    case 'rays':
      return (
        <g stroke={a} strokeWidth={3} strokeLinecap="round">
          {[-60, -40, -20, 0, 20, 40, 60].map((deg) => (
            <line key={deg} x1={50} y1={52} x2={50 + Math.sin((deg * Math.PI) / 180) * 46} y2={52 - Math.cos((deg * Math.PI) / 180) * 46} />
          ))}
        </g>
      );
  }
}

const SHAPES: Record<FaceSpec['shape'], [number, number]> = { round: [26, 28], long: [22, 31], wide: [30, 26] };

interface Props {
  spec: FaceSpec;
  mood?: Mood;
  size?: number;
  label?: string;
}

export function Avatar({ spec, mood = 'neutral', size = 64, label }: Props) {
  const [rx, ry] = SHAPES[spec.shape];
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={label} style={{ flex: 'none', display: 'block' }}>
      <circle cx={50} cy={50} r={48} fill={spec.bg} />
      <circle cx={50} cy={50} r={48} fill="none" stroke={spec.accent} strokeOpacity={0.55} strokeWidth={2} />
      {spec.head === 'rays' || spec.head === 'veil' || spec.head === 'tiara' ? <Head spec={spec} /> : null}
      <ellipse cx={50} cy={56} rx={rx} ry={ry} fill={spec.skin} stroke={INK} strokeWidth={2.2} />
      {spec.head !== 'rays' && spec.head !== 'veil' && spec.head !== 'tiara' ? <Head spec={spec} /> : null}
      {spec.head === 'tiara' && <path d="M30 38 L33 22 L41 31 L50 14 L59 31 L67 22 L70 38 C58 33 42 33 30 38 Z" fill={spec.accent} stroke={INK} strokeWidth={2} strokeLinejoin="round" />}
      <Eyes spec={spec} mood={mood} />
      <path d="M50 54 L47.5 62 H52" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      {spec.hair === 'beard' && <path d="M32 68 C36 96 64 96 68 68 C60 76 40 76 32 68 Z" fill="#efe9dc" stroke={INK} strokeWidth={2} strokeLinejoin="round" />}
      <Mouth spec={spec} mood={mood} />
      {spec.hair && <path d="M36 66 C42 60 48 62 50 65 C52 62 58 60 64 66 C58 66 54 67 50 67 C46 67 42 66 36 66 Z" fill="#efe9dc" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />}
    </svg>
  );
}

/** Nyala, the lamp spirit that carries hints. */
export function NyalaIcon({ size = 40, mood = 'neutral' }: { size?: number; mood?: Mood }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden style={{ flex: 'none', display: 'block' }}>
      <path d="M50 6 C62 24 82 36 80 60 C78 80 64 94 50 94 C36 94 22 80 20 60 C19 46 28 38 34 28 C36 38 40 42 44 42 C42 30 44 16 50 6 Z" fill="#4fd1c5" stroke="#0b3f3b" strokeWidth={3} strokeLinejoin="round" />
      <path d="M50 44 C58 54 66 60 64 72 C62 82 56 88 50 88 C44 88 38 82 36 72 C35 62 44 56 50 44 Z" fill="#e9fffb" />
      {mood === 'happy' ? (
        <path d="M41 68 Q44 63 47 68 M53 68 Q56 63 59 68" fill="none" stroke="#0b3f3b" strokeWidth={2.6} strokeLinecap="round" />
      ) : (
        <>
          <circle cx={44} cy={67} r={mood === 'surprised' ? 3.4 : 2.6} fill="#0b3f3b" />
          <circle cx={56} cy={67} r={mood === 'surprised' ? 3.4 : 2.6} fill="#0b3f3b" />
        </>
      )}
      <path d={mood === 'surprised' ? 'M48 77 a2.4 3 0 1 0 4 0 a2.4 3 0 1 0 -4 0' : 'M46 76 Q50 80 54 76'} fill={mood === 'surprised' ? '#0b3f3b' : 'none'} stroke="#0b3f3b" strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  );
}
