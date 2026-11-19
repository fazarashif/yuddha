import type { Motif } from '../../chess/review';
import type { Repertoire } from '../../content/book';
import type { GameRecord, LukaCard } from '../../state/store';
import { openingStats } from '../cermin/openingStats';
import type { PuzzleTheme } from '../puzzle/themes';

/**
 * Turns what the player's own games and puzzles reveal into concrete practice: which lesson to
 * take, which puzzle pattern to drill, which opening to revisit.
 */

export type Action = { kind: 'lesson'; id: string } | { kind: 'puzzles'; theme: PuzzleTheme } | { kind: 'luka' };

export type Advice =
  | { kind: 'motif'; motif: Exclude<Motif['kind'], 'generic'>; n: number; actions: Action[]; weight: number }
  | { kind: 'theme'; theme: PuzzleTheme; rate: number; seen: number; actions: Action[]; weight: number }
  | { kind: 'opening'; family: string; color: 'w' | 'b'; score: number; n: number; actions: Action[]; weight: number }
  | { kind: 'luka'; n: number; actions: Action[]; weight: number };

const MOTIF_PRACTICE: Record<Exclude<Motif['kind'], 'generic' | 'book'>, { lessons: string[]; theme: PuzzleTheme }> = {
  hung: { lessons: ['b1-1', 'k-cek'], theme: 'hangingPiece' },
  missedFree: { lessons: ['b1-1'], theme: 'hangingPiece' },
  missedCapture: { lessons: ['b1-3', 'b1-4'], theme: 'hangingPiece' },
  missedMate: { lessons: ['b1-5'], theme: 'mateIn2' },
  allowedMate: { lessons: ['b1-2', 'k-cek'], theme: 'defensiveMove' },
};

/** The lesson that teaches each puzzle pattern, where there is one. */
export const THEME_LESSON: Partial<Record<PuzzleTheme, string>> = {
  mateIn1: 'b1-5',
  mateIn2: 'b1-5',
  mateIn3: 'b1-5',
  backRankMate: 'b1-5',
  smotheredMate: 'k-tercekik',
  hangingPiece: 'b1-1',
  fork: 'b2-1',
  pin: 'b2-2',
  skewer: 'b2-2',
  discoveredAttack: 'b2-3',
  doubleCheck: 'b2-3',
  deflection: 'b2-4',
  attraction: 'b2-4',
  capturingDefender: 'b2-4',
  promotion: 'b2-5',
  sacrifice: 'b4-2',
  defensiveMove: 'b1-2',
  quietMove: 'b4-1',
  endgame: 'b2-5',
};

/** The library lesson for an opening family, from the player's side of the board. */
function openingLesson(family: string, color: 'w' | 'b'): string | null {
  const white: Record<string, string> = { 'Italian Game': 'p-italian', 'Ruy Lopez': 'p-ruy', 'London System': 'p-london' };
  const black: Record<string, string> = {
    'Italian Game': 'p-e5',
    'Ruy Lopez': 'p-e5',
    'Scotch Game': 'p-e5',
    "King's Knight Opening": 'p-e5',
    "King's Pawn Game": 'p-e5',
    'Caro-Kann Defense': 'p-caro',
    'Sicilian Defense': 'p-sicilian',
    "Queen's Gambit Declined": 'p-qgd',
    "Queen's Gambit": 'p-qgd',
    "Queen's Pawn Game": 'p-qgd',
    'London System': 'p-qgd',
  };
  return (color === 'w' ? white : black)[family] ?? null;
}

const PHASES: PuzzleTheme[] = ['endgame', 'middlegame', 'opening'];

export interface Inputs {
  games: GameRecord[];
  luka: LukaCard[];
  dueLuka: number;
  themeStats: Record<string, { seen: number; solved: number }>;
  repertoire: Repertoire;
  done: Record<string, unknown>;
}

/** Practice advice, most useful first. */
export function advise({ games, luka, dueLuka, themeStats, repertoire, done }: Inputs): Advice[] {
  const out: Advice[] = [];
  // Unfinished lessons first: a lesson already taken is still offered, but after one not yet taken.
  const lessons = (ids: string[]): Action[] => [...ids].sort((a, b) => Number(Boolean(done[a])) - Number(Boolean(done[b]))).map((id) => ({ kind: 'lesson', id }));

  // Mistakes from real games (puzzle slips are counted under themes instead).
  const counts = new Map<Exclude<Motif['kind'], 'generic'>, number>();
  for (const c of luka) {
    if (c.id.startsWith('p-') || c.motif.kind === 'generic') continue;
    counts.set(c.motif.kind, (counts.get(c.motif.kind) ?? 0) + 1);
  }
  for (const [motif, n] of counts) {
    if (n < 2) continue;
    if (motif === 'book') {
      const mine = [repertoire.w, repertoire.e4, repertoire.d4].filter((x): x is string => Boolean(x));
      out.push({ kind: 'motif', motif, n, actions: lessons(mine.length ? mine : ['p-intro']), weight: n * 2 });
      continue;
    }
    const p = MOTIF_PRACTICE[motif];
    // Losing material and mates weigh most: they decide games at this level.
    out.push({ kind: 'motif', motif, n, actions: [{ kind: 'puzzles', theme: p.theme }, ...lessons(p.lessons)], weight: n * 3 });
  }

  // Puzzle patterns solved least often, once there is enough evidence.
  for (const [name, st] of Object.entries(themeStats)) {
    const theme = name as PuzzleTheme;
    if (st.seen < 4 || PHASES.includes(theme)) continue;
    const rate = st.solved / st.seen;
    if (rate >= 0.6) continue;
    const lesson = THEME_LESSON[theme];
    out.push({ kind: 'theme', theme, rate, seen: st.seen, actions: [{ kind: 'puzzles', theme }, ...(lesson ? lessons([lesson]) : [])], weight: (0.6 - rate) * 20 + st.seen / 4 });
  }

  // Openings that keep going wrong.
  for (const o of openingStats(games)) {
    if (o.n < 3 || o.score >= 0.4) continue;
    const lesson = openingLesson(o.family, o.color);
    out.push({ kind: 'opening', family: o.family, color: o.color, score: o.score, n: o.n, actions: lessons([lesson ?? 'p-intro']), weight: (0.5 - o.score) * o.n * 2 });
  }

  if (dueLuka >= 3) out.push({ kind: 'luka', n: dueLuka, actions: [{ kind: 'luka' }], weight: Math.min(dueLuka, 12) * 1.5 });

  return out.sort((a, b) => b.weight - a.weight);
}
