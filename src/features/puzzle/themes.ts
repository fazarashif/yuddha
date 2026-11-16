import type { L } from '../../content/types';

/** Order must match THEMES in scripts/build-puzzles.py. */
export const PUZZLE_THEMES = [
  'mateIn1', 'mateIn2', 'mateIn3', 'backRankMate', 'smotheredMate', 'hangingPiece', 'fork', 'pin',
  'skewer', 'discoveredAttack', 'doubleCheck', 'deflection', 'attraction', 'capturingDefender',
  'trappedPiece', 'promotion', 'sacrifice', 'defensiveMove', 'quietMove', 'intermezzo',
  'endgame', 'middlegame', 'opening',
] as const;

export type PuzzleTheme = (typeof PUZZLE_THEMES)[number];

export const THEME_NAME: Record<PuzzleTheme, L> = {
  mateIn1: { id: 'Mat 1 langkah', en: 'Mate in 1' },
  mateIn2: { id: 'Mat 2 langkah', en: 'Mate in 2' },
  mateIn3: { id: 'Mat 3 langkah', en: 'Mate in 3' },
  backRankMate: { id: 'Mat baris belakang', en: 'Back-rank mate' },
  smotheredMate: { id: 'Mat tercekik', en: 'Smothered mate' },
  hangingPiece: { id: 'Bidak gantung', en: 'Loose piece' },
  fork: { id: 'Garpu', en: 'Fork' },
  pin: { id: 'Pin', en: 'Pin' },
  skewer: { id: 'Tusuk', en: 'Skewer' },
  discoveredAttack: { id: 'Serangan terbuka', en: 'Discovered attack' },
  doubleCheck: { id: 'Skak ganda', en: 'Double check' },
  deflection: { id: 'Pengalihan', en: 'Deflection' },
  attraction: { id: 'Pancingan', en: 'Attraction' },
  capturingDefender: { id: 'Memakan penjaga', en: 'Capturing the defender' },
  trappedPiece: { id: 'Bidak terjebak', en: 'Trapped piece' },
  promotion: { id: 'Promosi', en: 'Promotion' },
  sacrifice: { id: 'Pengorbanan', en: 'Sacrifice' },
  defensiveMove: { id: 'Langkah bertahan', en: 'Defensive move' },
  quietMove: { id: 'Langkah tenang', en: 'Quiet move' },
  intermezzo: { id: 'Langkah sela', en: 'Zwischenzug' },
  endgame: { id: 'Akhir permainan', en: 'Endgame' },
  middlegame: { id: 'Tengah permainan', en: 'Middlegame' },
  opening: { id: 'Pembukaan', en: 'Opening' },
};

/** Phase tags say little about the idea, so they are never the headline theme. */
const PHASES: PuzzleTheme[] = ['endgame', 'middlegame', 'opening'];
export const mainTheme = (themes: PuzzleTheme[]): PuzzleTheme | null => themes.find((t) => !PHASES.includes(t)) ?? null;
