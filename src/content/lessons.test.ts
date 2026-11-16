import { Chess } from 'chess.js';
import { describe, expect, it } from 'vitest';
import { hangingPieces, parseUci } from '../chess/vision';
import { judgeMove } from './judge';
import { ALL_LESSONS } from './lessons';

const legal = (fen: string, uci: string) => {
  try {
    new Chess(fen).move(parseUci(uci));
    return true;
  } catch {
    return false;
  }
};

describe('lesson content', () => {
  for (const lesson of ALL_LESSONS) {
    lesson.scenes.forEach((scene, i) => {
      const name = `${lesson.id} scene ${i + 1} (${scene.kind})`;
      it(`${name} is well formed`, () => {
        expect(scene.text.id.length).toBeGreaterThan(0);
        expect(scene.text.en.length).toBeGreaterThan(0);
        expect(scene.text.id + scene.text.en).not.toMatch(/[—–]/);
        if (scene.fen) expect(() => new Chess(scene.fen!, { skipValidation: false })).not.toThrow();
        if (scene.kind === 'move') {
          for (const uci of scene.accept ?? []) expect(legal(scene.fen, uci), `accept ${uci}`).toBe(true);
          for (const uci of Object.keys(scene.punish ?? {})) {
            expect(legal(scene.fen, uci), `punish ${uci}`).toBe(true);
            expect(judgeMove(scene, uci), `punish ${uci} must fail`).toBe(false);
          }
          expect(scene.accept || scene.goal, 'needs an answer').toBeTruthy();
          if (scene.hint) expect(judgeMove(scene, scene.hint), `hint ${scene.hint} must pass`).toBe(true);
          if (scene.mate) {
            // A scene that promises checkmate must deliver it with every accepted move.
            for (const uci of scene.accept ?? []) {
              const after = new Chess(scene.fen);
              after.move(parseUci(uci));
              expect(after.isCheckmate(), `${uci} must be checkmate`).toBe(true);
            }
          }
        }
        if (scene.kind === 'quiz') expect(scene.correct).toBeLessThan(scene.options.length);
        if (scene.kind === 'play') {
          const start = new Chess(scene.fen);
          expect(start.isGameOver()).toBe(false);
          expect(scene.maxMoves).toBeGreaterThan(4);
          for (const text of [scene.right, scene.stalemate, scene.tooLong, scene.lost]) {
            expect(text.id.length).toBeGreaterThan(0);
            expect(text.en.length).toBeGreaterThan(0);
          }
        }
        // No long dashes anywhere in the copy.
        expect(JSON.stringify(scene)).not.toMatch(/[—–]/);
      });
    });
  }

  it('loose-piece tasks agree with the board', () => {
    const tap = (id: string, n: number) => {
      const s = ALL_LESSONS.find((l) => l.id === id)!.scenes[n];
      if (s.kind !== 'tap') throw new Error('not a tap scene');
      return s;
    };
    const squares = (fen: string, c: 'w' | 'b') => hangingPieces(fen, c).map((p) => p.square).sort();
    expect(squares(tap('b1-1', 5).fen, 'b')).toEqual(tap('b1-1', 5).answers.slice().sort());
    expect(squares(tap('b1-1', 7).fen, 'b')).toEqual(tap('b1-1', 7).answers.slice().sort());
    expect(squares(tap('b1-1', 9).fen, 'w')).toEqual(tap('b1-1', 9).answers.slice().sort());
  });

  it('goal tasks reject careless moves', () => {
    const find = (id: string, n: number) => {
      const s = ALL_LESSONS.find((l) => l.id === id)!.scenes[n];
      if (s.kind !== 'move') throw new Error('not a move scene');
      return s;
    };
    expect(judgeMove(find('b1-1', 10), 'd2d3')).toBe(false); // bishop still hit by the a6 pawn
    expect(judgeMove(find('b1-1', 10), 'b5c6')).toBe(true); // trading it off is fine
    expect(judgeMove(find('b1-2', 4), 'b3b7')).toBe(false); // ignores the back-rank mate
    expect(judgeMove(find('b1-2', 4), 'g2g3')).toBe(true);
    expect(judgeMove(find('b1-3', 6), 'a2a3')).toBe(false); // e5 still outnumbered
    expect(judgeMove(find('b1-3', 6), 'e5c6')).toBe(true);
  });
});
