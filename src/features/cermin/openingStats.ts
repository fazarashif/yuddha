import { Chess } from 'chess.js';
import { familyOf, nameOpening } from '../../chess/openingNames';
import type { GameRecord } from '../../state/store';

export interface OpeningStat {
  family: string;
  color: 'w' | 'b';
  n: number;
  w: number;
  d: number;
  l: number;
  /** Points per game, 0 to 1. */
  score: number;
}

const sansOf = (pgn: string): string[] => {
  try {
    const c = new Chess();
    c.loadPgn(pgn);
    return c.history();
  } catch {
    return [];
  }
};

/** Results grouped by opening family and colour, most played first. */
export function openingStats(games: GameRecord[]): OpeningStat[] {
  const groups = new Map<string, OpeningStat>();
  for (const g of games) {
    const name = nameOpening(sansOf(g.pgn));
    if (!name) continue;
    const family = familyOf(name);
    const key = `${family}|${g.color}`;
    const st = groups.get(key) ?? { family, color: g.color, n: 0, w: 0, d: 0, l: 0, score: 0 };
    st.n += 1;
    if (g.result === 'win') st.w += 1;
    else if (g.result === 'loss') st.l += 1;
    else st.d += 1;
    st.score = (st.w + st.d / 2) / st.n;
    groups.set(key, st);
  }
  return [...groups.values()].sort((a, b) => b.n - a.n || b.score - a.score);
}
