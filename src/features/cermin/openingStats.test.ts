import { describe, expect, it } from 'vitest';
import type { GameRecord } from '../../state/store';
import { openingStats } from './openingStats';

const game = (id: string, pgn: string, color: 'w' | 'b', result: GameRecord['result']): GameRecord => ({
  id, at: 0, botId: 'x', color, result, guided: false, pgn, plies: 0,
});

describe('opening stats', () => {
  it('groups games by family and colour', () => {
    const stats = openingStats([
      game('a', '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5', 'w', 'win'),
      game('b', '1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6', 'w', 'draw'),
      game('c', '1. e4 c5 2. Nf3 d6', 'b', 'loss'),
      game('d', '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5', 'b', 'loss'),
      game('e', '', 'w', 'win'),
    ]);
    expect(stats[0]).toEqual({ family: 'Italian Game', color: 'w', n: 2, w: 1, d: 1, l: 0, score: 0.75 });
    expect(stats.find((s) => s.family === 'Sicilian Defense')).toMatchObject({ color: 'b', n: 1, l: 1, score: 0 });
    expect(stats.find((s) => s.family === 'Italian Game' && s.color === 'b')).toMatchObject({ n: 1 });
    expect(stats).toHaveLength(3);
  });
});
