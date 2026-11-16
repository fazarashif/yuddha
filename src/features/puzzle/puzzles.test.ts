import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Chess } from 'chess.js';
import { describe, expect, it } from 'vitest';
import { parseUci } from '../../chess/vision';
import { PUZZLE_THEMES } from './themes';

type Raw = [string, string, string, number, number[]];
const dir = join(process.cwd(), 'public/puzzles');

describe('shipped puzzles', () => {
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));

  it('covers every rating band', () => {
    expect(files.length).toBe(18);
  });

  it('every puzzle plays out legally and sits in its band', () => {
    let count = 0;
    const ids = new Set<string>();
    for (const file of files) {
      const band = Number(file.slice(1, -5));
      const rows = JSON.parse(readFileSync(join(dir, file), 'utf8')) as Raw[];
      expect(rows.length).toBeGreaterThan(300);
      for (const [id, fen, moves, rating, themes] of rows) {
        expect(ids.has(id), `duplicate ${id}`).toBe(false);
        ids.add(id);
        expect(rating).toBeGreaterThanOrEqual(band);
        expect(rating).toBeLessThan(band + 100);
        for (const i of themes) expect(PUZZLE_THEMES[i]).toBeDefined();
        const list = moves.split(' ');
        // An opponent lead-in move, then the solver has the last word.
        expect(list.length % 2).toBe(0);
        const chess = new Chess(fen);
        for (const uci of list) chess.move(parseUci(uci));
        count += 1;
      }
    }
    expect(count).toBeGreaterThan(12000);
  }, 120_000);
});
