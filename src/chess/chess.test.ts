import { describe, expect, it } from 'vitest';
import { chooseBotMove } from './bot';
import { InfoCollector, parseInfo } from './engine';
import type { EngineLike, Line } from './engine';
import { classify, eloUpdate, winLoss, winPercent } from './eval';
import { hangingPieces } from './vision';

describe('engine output', () => {
  it('parses centipawn and mate scores', () => {
    const cp = parseInfo('info depth 10 seldepth 14 multipv 2 score cp -34 nodes 1 pv e7e5 g1f3');
    expect(cp).toMatchObject({ move: 'e7e5', cp: -34, mate: null, multipv: 2, depth: 10 });
    const mate = parseInfo('info depth 5 multipv 1 score mate 2 pv d1h5 g7g6 h5f7');
    expect(mate!.mate).toBe(2);
    expect(mate!.cp).toBeGreaterThan(90000);
    expect(parseInfo('info depth 3 currmove e2e4')).toBeNull();
  });

  it('keeps the deepest line per slot', () => {
    const c = new InfoCollector();
    c.push('info depth 1 multipv 1 score cp 10 pv e2e4');
    c.push('info depth 2 multipv 2 score cp 5 pv d2d4');
    c.push('info depth 2 multipv 1 score cp 20 pv g1f3');
    expect(c.lines().map((l) => l.move)).toEqual(['g1f3', 'd2d4']);
  });
});

describe('evaluation', () => {
  it('maps scores to winning chances', () => {
    expect(winPercent(0)).toBe(50);
    expect(winPercent(300)).toBeGreaterThan(70);
    expect(winLoss(100, -400)).toBeGreaterThan(22);
    expect(classify(winLoss(100, -400), false)).toBe('blunder');
    expect(classify(30, true)).toBe('best');
  });
  it('updates ratings in the right direction', () => {
    expect(eloUpdate(800, 800, 1)).toBe(816);
    expect(eloUpdate(800, 1200, 0)).toBeGreaterThan(795);
  });
});

describe('vision', () => {
  it('finds loose pieces', () => {
    const fen = 'r1b1kbnr/pppp1ppp/2n5/4p3/2B1P2q/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1';
    expect(hangingPieces(fen, 'b').map((p) => p.square)).toEqual(['h4']);
  });
});

describe('bot', () => {
  const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const lines: Line[] = [
    { move: 'e2e4', cp: 40, mate: null, pv: ['e2e4'], depth: 8 },
    { move: 'a2a4', cp: -260, mate: null, pv: ['a2a4'], depth: 8 },
  ];
  const engine: EngineLike = { analyse: async () => lines };

  it('a strong bot plays the best line', async () => {
    const pick = await chooseBotMove(engine, fen, { depth: 8, multipv: 2, temp: 5, blunder: 0 }, () => 0.5);
    expect(pick!.move).toBe('e2e4');
  });
  it('a lapse can pick a weaker candidate', async () => {
    const rolls = [0, 0.99];
    const pick = await chooseBotMove(engine, fen, { depth: 8, multipv: 2, temp: 5, blunder: 1 }, () => rolls.shift()!);
    expect(pick!.move).toBe('a2a4');
  });
});
