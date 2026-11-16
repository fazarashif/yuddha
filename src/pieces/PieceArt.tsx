import type { ReactNode } from 'react';
import './pieces.css';

export type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';
export type PieceColor = 'w' | 'b';
export type PieceSet = 'yuddha' | 'klasik';

/**
 * Piece art, drawn on a 100 x 100 grid. Silhouettes follow Staunton so the
 * shapes transfer to any other board; the "yuddha" set adds wayang ornaments
 * inside the silhouette, the "klasik" set leaves them out.
 */

function Base({ narrow = false }: { narrow?: boolean }) {
  const x = narrow ? 29 : 24;
  const w = narrow ? 42 : 52;
  return (
    <>
      <rect className="pc-accent" x={x + 5} y={77} width={w - 10} height={7} rx={2.5} />
      <rect className="pc-body" x={x} y={83} width={w} height={10} rx={3.5} />
    </>
  );
}

const BODY_TALL =
  'M37 47 C37 56 41 59 41 63 C41 70 33 72 31 78 H69 C67 72 59 70 59 63 C59 59 63 56 63 47 Z';

const ART: Record<PieceType, (o: boolean) => ReactNode> = {
  k: (o) => (
    <>
      <Base />
      <path className="pc-body" d={BODY_TALL} />
      {o && (
        <>
          <path className="pc-body" d="M37 33 C30 32 26 26 28 19 C31 24 35 26 40 27 Z" />
          <path className="pc-body" d="M63 33 C70 32 74 26 72 19 C69 24 65 26 60 27 Z" />
        </>
      )}
      <path className="pc-body" d="M35 42 C31 31 37 21 50 21 C63 21 69 31 65 42 Z" />
      {o ? (
        <>
          <path className="pc-cut" d="M50 26 C53 30 53 34 50 37 C47 34 47 30 50 26 Z" />
          <path className="pc-accent" d="M50 3 C57 9 59 15 55 20 L50 23 L45 20 C41 15 43 9 50 3 Z" />
          <path className="pc-line" d="M50 9 V18" />
        </>
      ) : (
        <path className="pc-accent" d="M47 3 H53 V9 H59 V15 H53 V22 H47 V15 H41 V9 H47 Z" />
      )}
      <rect className="pc-accent" x={32} y={40} width={36} height={7} rx={2.5} />
    </>
  ),
  q: (o) => (
    <>
      <Base />
      <path className="pc-body" d={BODY_TALL} />
      <path
        className="pc-body"
        d="M32 44 L25 22 L35 33 L38 14 L46 31 L50 10 L54 31 L62 14 L65 33 L75 22 L68 44 Z"
      />
      {o && <path className="pc-line" d="M50 51 C46 55 54 59 50 63 C46 67 54 71 50 75" />}
      <circle className="pc-accent" cx={25} cy={21} r={3.6} />
      <circle className="pc-accent" cx={38} cy={13} r={3.6} />
      <circle className="pc-accent" cx={50} cy={9} r={4} />
      <circle className="pc-accent" cx={62} cy={13} r={3.6} />
      <circle className="pc-accent" cx={75} cy={21} r={3.6} />
      <rect className="pc-accent" x={31} y={41} width={38} height={7} rx={2.5} />
    </>
  ),
  r: (o) => (
    <>
      <Base />
      <path className="pc-body" d="M33 42 H67 L65 69 C65 74 69 75 70 78 H30 C31 75 35 74 35 69 Z" />
      <path
        className="pc-body"
        d={o ? 'M27 39 V23 H36 V29 H44 V19 H56 V29 H64 V23 H73 V39 Z' : 'M27 39 V21 H37 V28 H45 V21 H55 V28 H63 V21 H73 V39 Z'}
      />
      {o && <path className="pc-cut" d="M44 74 V59 C44 53 50 49 50 49 C50 49 56 53 56 59 V74 Z" />}
      <rect className="pc-accent" x={29} y={37} width={42} height={6} rx={2.5} />
    </>
  ),
  b: (o) => (
    <>
      <Base />
      <path className="pc-body" d="M41 57 C41 64 43 66 43 68 C43 73 34 74 32 78 H68 C66 74 57 73 57 68 C57 66 59 64 59 57 Z" />
      {o && (
        <>
          <path className="pc-accent" d="M39 54 C31 54 26 48 28 40 C30 45 34 47 40 47 Z" />
          <path className="pc-accent" d="M61 54 C69 54 74 48 72 40 C70 45 66 47 60 47 Z" />
        </>
      )}
      <path className="pc-body" d="M50 15 C61 24 66 35 62 45 C60 51 55 54 50 54 C45 54 40 51 38 45 C34 35 39 24 50 15 Z" />
      <path className="pc-slit" d="M57 26 L47 39" />
      <circle className="pc-accent" cx={50} cy={12} r={4.4} />
      <rect className="pc-accent" x={36} y={52} width={28} height={6.5} rx={3} />
    </>
  ),
  n: (o) => (
    <>
      <Base />
      <path
        className="pc-body"
        d="M32 78 C31 64 40 57 45 47 C40 51 34 55 28 54 C23 53 20 47 23 42 L35 27 C37 20 43 15 52 14 L50 5 L60 13 C72 18 78 32 78 50 C78 62 71 70 69 78 Z"
      />
      {o ? (
        <path
          className="pc-accent"
          d="M60 13 C68 17 73 24 75 32 L69 31 C72 37 76 42 77 48 L71 46 C73 53 75 59 73 66 L67 60 C68 45 64 28 55 17 Z"
        />
      ) : (
        <path className="pc-line" d="M60 15 C68 24 71 40 68 58" />
      )}
      <circle className="pc-cut" cx={40} cy={31} r={2.6} />
      <path className="pc-line" d="M25 49 L32 47" />
    </>
  ),
  p: (o) => (
    <>
      <Base narrow />
      <path className="pc-body" d="M43 52 C43 62 37 68 35 78 H65 C63 68 57 62 57 52 Z" />
      <circle className="pc-body" cx={50} cy={36} r={12.5} />
      {o && (
        <>
          <path className="pc-accent" d="M62 31 L70 26 L68 37 Z" />
          <path className="pc-accent" d="M38 31.5 C45 28 55 28 62 31.5 L62.5 37 C55 33.5 45 33.5 37.5 37 Z" />
        </>
      )}
      <rect className="pc-accent" x={38} y={48} width={24} height={6} rx={3} />
    </>
  ),
};

interface Props {
  type: PieceType;
  color: PieceColor;
  set?: PieceSet;
  className?: string;
  title?: string;
}

export function PieceArt({ type, color, set = 'yuddha', className, title }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`pc pc-${color}${className ? ` ${className}` : ''}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {ART[type](set === 'yuddha')}
    </svg>
  );
}
