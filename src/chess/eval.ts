import { MATE_CP } from './engine';

/** Winning chances in percent (0..100) for a centipawn score, Lichess model. */
export function winPercent(cp: number): number {
  const c = Math.max(-1500, Math.min(1500, cp));
  return 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * c)) - 1);
}

/** How many winning-chance points the mover gave up. Never negative. */
export function winLoss(bestCp: number, playedCp: number): number {
  return Math.max(0, winPercent(bestCp) - winPercent(playedCp));
}

export type MoveClass = 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';

export function classify(loss: number, isBest: boolean): MoveClass {
  if (isBest || loss < 2) return 'best';
  if (loss < 6) return 'good';
  if (loss < 12) return 'inaccuracy';
  if (loss < 22) return 'mistake';
  return 'blunder';
}

/** Per-move accuracy in percent, Lichess model. */
export function moveAccuracy(loss: number): number {
  return Math.max(0, Math.min(100, 103.1668 * Math.exp(-0.04354 * loss) - 3.1669));
}

export const isMateScore = (cp: number) => Math.abs(cp) > MATE_CP - 10000;
export const mateIn = (cp: number) => Math.ceil((MATE_CP - Math.abs(cp)) / 100);

/** Elo expected score and update. */
export function eloUpdate(rating: number, opponent: number, score: number, k = 32): number {
  const expected = 1 / (1 + 10 ** ((opponent - rating) / 400));
  return Math.round(rating + k * (score - expected));
}
