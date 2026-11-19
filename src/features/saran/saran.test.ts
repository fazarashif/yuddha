import { describe, expect, it } from 'vitest';
import { ALL_CONTENT } from '../../content/lessons';
import type { GameRecord, LukaCard } from '../../state/store';
import { THEME_LESSON, advise } from './saran';

const card = (id: string, kind: LukaCard['motif']['kind']): LukaCard =>
  ({ id, fen: id, best: 'e2e4', played: 'a2a3', motif: kind === 'hung' ? { kind, piece: 'n', square: 'f3' } : kind === 'missedMate' ? { kind, n: 2 } : ({ kind } as LukaCard['motif']), due: 0, interval: 0, reps: 0, lapses: 0 });
const game = (id: string, pgn: string, color: 'w' | 'b', result: GameRecord['result']): GameRecord => ({ id, at: 0, botId: 'x', color, result, guided: false, pgn, plies: 8 });
const NONE = { w: null, e4: null, d4: null };
const base = { games: [], luka: [], dueLuka: 0, themeStats: {}, repertoire: NONE, done: {} };

describe('practice advice', () => {
  it('says nothing without evidence', () => {
    expect(advise(base)).toEqual([]);
  });

  it('turns repeated loose pieces into puzzles and lessons, unfinished lessons first', () => {
    const [a] = advise({ ...base, luka: [card('g1-3', 'hung'), card('g2-5', 'hung'), card('g3-7', 'hung')], done: { 'b1-1': {} } });
    expect(a).toMatchObject({ kind: 'motif', motif: 'hung', n: 3 });
    expect(a.actions).toEqual([{ kind: 'puzzles', theme: 'hangingPiece' }, { kind: 'lesson', id: 'k-cek' }, { kind: 'lesson', id: 'b1-1' }]);
  });

  it('ignores puzzle slips and one-off mistakes when counting game mistakes', () => {
    expect(advise({ ...base, luka: [card('p-1-1', 'hung'), card('p-2-1', 'hung'), card('g1-3', 'missedMate')] })).toEqual([]);
  });

  it('points weak puzzle patterns to their lesson', () => {
    const [a] = advise({ ...base, themeStats: { fork: { seen: 10, solved: 2 }, pin: { seen: 10, solved: 9 }, endgame: { seen: 20, solved: 1 } } });
    expect(a).toMatchObject({ kind: 'theme', theme: 'fork' });
    expect(a.actions).toEqual([{ kind: 'puzzles', theme: 'fork' }, { kind: 'lesson', id: 'b2-1' }]);
    expect(advise({ ...base, themeStats: { pin: { seen: 10, solved: 9 } } })).toEqual([]);
  });

  it('flags an opening that keeps losing, with the library lesson for that side', () => {
    const caro = '1. e4 c6 2. d4 d5';
    const [a] = advise({ ...base, games: [game('a', caro, 'b', 'loss'), game('b', caro, 'b', 'loss'), game('c', caro, 'b', 'draw')] });
    expect(a).toMatchObject({ kind: 'opening', family: 'Caro-Kann Defense', color: 'b', n: 3 });
    expect(a.actions).toEqual([{ kind: 'lesson', id: 'p-caro' }]);
  });

  it('suggests the Kitab Luka when cards pile up, and ranks by weight', () => {
    const list = advise({ ...base, dueLuka: 5, luka: [card('g1-1', 'hung'), card('g2-1', 'hung')] });
    expect(list.map((a) => a.kind)).toEqual(['luka', 'motif']);
  });

  it('every lesson it can point to exists', () => {
    const ids = new Set(ALL_CONTENT.map((l) => l.id));
    for (const id of Object.values(THEME_LESSON)) expect(ids.has(id!), id).toBe(true);
    for (const id of ['b1-1', 'k-cek', 'b1-3', 'b1-4', 'b1-5', 'b1-2', 'p-intro', 'p-caro', 'p-e5', 'p-italian', 'p-ruy', 'p-london', 'p-qgd', 'p-sicilian']) expect(ids.has(id), id).toBe(true);
  });
});
