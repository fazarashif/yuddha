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
          if (scene.reply) {
            // The opponent's answer must be playable after every accepted move.
            expect(scene.accept, 'a reply needs fixed answers').toBeTruthy();
            for (const uci of scene.accept ?? []) {
              const after = new Chess(scene.fen);
              after.move(parseUci(uci));
              expect(() => after.move(parseUci(scene.reply!)), `reply after ${uci}`).not.toThrow();
            }
          }
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
          if (scene.goal === 'promote') {
            const pawns = start.board().flat().filter((p) => p && p.type === 'p' && p.color === start.turn());
            expect(pawns.length, 'needs a pawn to promote').toBeGreaterThan(0);
          }
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

  it('beginner rule claims agree with the rules', () => {
    const fens = (id: string) => ALL_LESSONS.find((l) => l.id === id)!.scenes.map((s) => s.fen);
    const b03 = fens('b0-3');
    // Castling through an attacked square, and out of check, is not allowed.
    expect(legal(b03[5]!, 'e1g1')).toBe(false);
    expect(new Chess(b03[5]!).inCheck()).toBe(false);
    expect(legal(b03[6]!, 'e1g1')).toBe(false);
    expect(new Chess(b03[6]!).inCheck()).toBe(true);
    // En passant: allowed right away, gone afterwards, and only against the pawn that just moved.
    expect(legal(b03[8]!, 'e5d6')).toBe(true);
    expect(legal(b03[9]!, 'e5d6')).toBe(false);
    expect(legal(b03[10]!, 'e5d6')).toBe(false);

    const b04 = fens('b0-4');
    expect(new Chess(b04[1]!).isStalemate()).toBe(true);
    expect(new Chess(b04[2]!).isCheckmate()).toBe(true);
    expect(new Chess(b04[3]!).isStalemate()).toBe(true);
    const onlyCheck = new Chess(b04[4]!);
    expect(onlyCheck.inCheck() && !onlyCheck.isCheckmate()).toBe(true);
    const trap = new Chess(b04[5]!);
    trap.move(parseUci('c1c7'));
    expect(trap.isStalemate()).toBe(true);
    expect(new Chess(b04[6]!).isInsufficientMaterial()).toBe(true);
  });

  it('tactics claims agree with the board', () => {
    const scene = (id: string, n: number) => ALL_LESSONS.find((l) => l.id === id)!.scenes[n];
    const after = (fen: string, ...moves: string[]) => {
      const c = new Chess(fen);
      for (const m of moves) c.move(parseUci(m));
      return c;
    };

    // Forks: the fork square is unguarded, a3 does not stop it, castling long does.
    const fork = scene('b2-1', 7).fen!;
    expect(new Chess(fork).attackers('c2', 'w')).toEqual([]);
    expect(legal(after(fork, 'a2a3').fen(), 'b4c2')).toBe(true);
    expect(after(fork, 'a2a3', 'b4c2').inCheck()).toBe(true);
    expect(after(fork, 'e1c1').attackers('c2', 'w')).toEqual(['c1']);

    // Pins: the absolutely pinned knight has no move, the relatively pinned one does.
    const pins = scene('b2-2', 5).fen!;
    expect(new Chess(pins).moves({ square: 'c6' })).toEqual([]);
    expect(new Chess(pins).moves({ square: 'f3' }).length).toBeGreaterThan(0);
    const relative = new Chess(scene('b2-2', 2).fen!);
    expect(relative.moves({ square: 'f6' }).length).toBeGreaterThan(0);

    // Discovered attacks: the knight jump is a check by the rook, and the warned-about jump wins the queen.
    const disc = scene('b2-3', 2).fen!;
    expect(after(disc, 'e3d5').inCheck()).toBe(true);
    expect(after(disc, 'e3d5').attackers('c7', 'w')).toContain('d5');
    const danger = scene('b2-3', 6).fen!;
    const jumped = after(danger, 'a2a3', 'e4c3');
    expect(jumped.inCheck()).toBe(true);
    expect(jumped.attackers('d1', 'b')).toContain('c3');

    // Removing the guard: one guard before, none after.
    const guard = scene('b2-4', 1).fen!;
    expect(new Chess(guard).attackers('d5', 'b')).toEqual(['f6']);
    expect(new Chess(scene('b2-4', 3).fen!).attackers('d5', 'b')).toEqual([]);
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
