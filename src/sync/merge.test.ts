import { describe, expect, it } from 'vitest';
import type { SaveData } from '../state/store';
import { mergeSaves, pickSave, saveKey } from './merge';

const base = (over: Partial<SaveData> = {}): SaveData => ({
  settings: { lang: 'id', theme: 'dark', board: 'kelir', pieceSet: 'yuddha', sfx: 0.7, music: 0.3 },
  onboarded: true,
  level: 800,
  startChapter: 1,
  xp: 0,
  streak: { count: 0, lastDay: null, oil: 1 },
  daily: { day: 1, done: { warmup: false, lakon: false, puzzle: false, luka: false, tanding: false } },
  lessons: {},
  playRating: 800,
  puzzleRating: 800,
  puzzlesDone: 0,
  puzzleSeen: [],
  themeStats: {},
  visionBest: 0,
  beaten: {},
  games: [],
  luka: [],
  chesscomUser: '',
  repertoire: { w: null, e4: null, d4: null },
  touched: 0,
  ...over,
});

const game = (id: string, at: number) => ({ id, at, botId: 'x', color: 'w' as const, result: 'win' as const, guided: true, pgn: '', plies: 2 });
const card = (id: string, reps: number) => ({ id, fen: id, best: 'e2e4', played: 'a2a3', motif: { kind: 'generic' as const }, due: 1, interval: 1, reps, lapses: 0 });

describe('mergeSaves', () => {
  it('keeps the local save when the server has nothing usable', () => {
    const local = base({ xp: 5 });
    expect(mergeSaves(local, null)).toBe(local);
    expect(mergeSaves(local, 'junk')).toBe(local);
  });

  it('unites collections from both devices', () => {
    const local = base({ games: [game('a', 2)], luka: [card('k1', 0)], puzzleSeen: ['p2'], lessons: { 'b1-1': { at: 5, mistakes: 3 } }, beaten: { x: 1 }, touched: 10 });
    const remote = base({
      games: [game('b', 3)],
      luka: [card('k1', 2), card('k2', 0)],
      puzzleSeen: ['p1'],
      lessons: { 'b1-1': { at: 9, mistakes: 1 }, 'b1-2': { at: 1, mistakes: 0 } },
      beaten: { x: 2, y: 1 },
      touched: 20,
    });
    const out = mergeSaves(local, remote);
    expect(out.games.map((g) => g.id)).toEqual(['b', 'a']);
    expect(out.luka.find((c) => c.id === 'k1')!.reps).toBe(2);
    expect(out.luka).toHaveLength(2);
    expect(out.puzzleSeen).toEqual(['p1', 'p2']);
    expect(out.lessons['b1-1']).toEqual({ at: 9, mistakes: 1 });
    expect(Object.keys(out.lessons)).toHaveLength(2);
    expect(out.beaten).toEqual({ x: 2, y: 1 });
  });

  it('takes single values from the copy that changed last', () => {
    const remote = base({ puzzleRating: 1000, xp: 40, touched: 20 });
    const newerLocal = mergeSaves(base({ puzzleRating: 900, xp: 50, touched: 30 }), remote);
    expect(newerLocal.puzzleRating).toBe(900);
    expect(newerLocal.xp).toBe(50);
    expect(mergeSaves(base({ puzzleRating: 900, touched: 5 }), remote).puzzleRating).toBe(1000);
  });

  it('a fresh device does not override an established save', () => {
    const fresh = base({ onboarded: false, level: 800, touched: 99 });
    const remote = base({ onboarded: true, level: 1100, playRating: 1040, touched: 20 });
    const out = mergeSaves(fresh, remote);
    expect(out.onboarded).toBe(true);
    expect(out.level).toBe(1100);
    expect(out.playRating).toBe(1040);
  });

  it('tolerates a save written before newer fields existed', () => {
    const local = base({ puzzleSeen: ['p1'], touched: 5 });
    const old = { onboarded: true, xp: 12, games: [], luka: [], lessons: {}, beaten: {}, touched: 1 };
    const out = mergeSaves(local, old);
    expect(out.puzzleSeen).toEqual(['p1']);
    expect(out.xp).toBe(12);
  });

  it('is stable: merging a save with its own copy changes nothing', () => {
    const save = base({ games: [game('a', 2)], luka: [card('k', 1)], puzzleSeen: ['p'], xp: 7, touched: 3 });
    const copy = JSON.parse(JSON.stringify(pickSave(save)));
    expect(saveKey(mergeSaves(save, copy))).toBe(saveKey(save));
  });
});
