import { PUZZLE_THEMES } from './themes';
import type { PuzzleTheme } from './themes';

export interface PuzzleItem {
  id: string;
  /** Position before the opponent's lead-in move. */
  fen: string;
  /** moves[0] is the opponent's move; the solver plays the odd indexes. */
  moves: string[];
  rating: number;
  themes: PuzzleTheme[];
}

type Raw = [string, string, string, number, number[]];

export const MIN_BAND = 400;
export const MAX_BAND = 2100;
const cache = new Map<number, Promise<PuzzleItem[]>>();

export const bandOf = (rating: number) => Math.max(MIN_BAND, Math.min(MAX_BAND, Math.floor(rating / 100) * 100));

/** Puzzles come from the Lichess puzzle database (CC0), one file per 100 points. */
export function loadBand(band: number): Promise<PuzzleItem[]> {
  let job = cache.get(band);
  if (!job) {
    job = fetch(`/puzzles/b${band}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`puzzles ${band}: ${r.status}`);
        return r.json() as Promise<Raw[]>;
      })
      .then((rows) => rows.map(([id, fen, moves, rating, themes]) => ({ id, fen, moves: moves.split(' '), rating, themes: themes.map((i) => PUZZLE_THEMES[i]) })));
    job.catch(() => cache.delete(band));
    cache.set(band, job);
  }
  return job;
}

/**
 * An unseen puzzle close to the solver's rating; widens the net when the band runs dry. With a theme,
 * only puzzles with that theme count, and the search may go further from the rating to find one.
 */
export async function pickPuzzle(rating: number, seen: Set<string>, rng: () => number = Math.random, theme?: PuzzleTheme): Promise<PuzzleItem | null> {
  const home = bandOf(rating);
  const steps = theme ? [0, -100, 100, -200, 200, -300, 300, -400, 400, -500, 500] : [0, -100, 100, -200, 200];
  const order = steps.map((d) => home + d).filter((b) => b >= MIN_BAND && b <= MAX_BAND);
  for (const band of order) {
    const fresh = (await loadBand(band)).filter((p) => !seen.has(p.id) && (!theme || p.themes.includes(theme)));
    if (fresh.length === 0) continue;
    const near = fresh.filter((p) => Math.abs(p.rating - rating) <= 60);
    const pool = near.length >= 5 ? near : fresh;
    return pool[Math.floor(rng() * pool.length)];
  }
  return null;
}
