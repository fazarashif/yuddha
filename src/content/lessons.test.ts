import { Chess } from 'chess.js';
import { describe, expect, it } from 'vitest';
import { hangingPieces, parseUci } from '../chess/vision';
import { judgeMove } from './judge';
import { ALL_CONTENT, ALL_LESSONS, OPENINGS } from './lessons';
import { OPENING_GROUPS, OPENING_INFO } from './openings';

const legal = (fen: string, uci: string) => {
  try {
    new Chess(fen).move(parseUci(uci));
    return true;
  } catch {
    return false;
  }
};

describe('lesson content', () => {
  for (const lesson of ALL_CONTENT) {
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

  it('strategy claims agree with the board', () => {
    const scene = (id: string, n: number) => ALL_LESSONS.find((l) => l.id === id)!.scenes[n];
    const pawnsOf = (fen: string, color: 'w' | 'b') =>
      new Chess(fen).board().flat().filter((p) => p && p.type === 'p' && p.color === color).map((p) => p!.square as string);
    const files = (sqs: string[]) => sqs.map((sq) => 'abcdefgh'.indexOf(sq[0]));
    const isolated = (fen: string) => {
      const own = pawnsOf(fen, 'w');
      return own.filter((sq) => !files(own).some((f) => Math.abs(f - files([sq])[0]) === 1)).sort();
    };
    const passed = (fen: string) => {
      const enemy = pawnsOf(fen, 'b');
      return pawnsOf(fen, 'w').filter((sq) => {
        const f = files([sq])[0];
        return !enemy.some((e) => Math.abs(files([e])[0] - f) <= 1 && Number(e[1]) > Number(sq[1]));
      });
    };
    const islands = (fen: string) => {
      const fs = [...new Set(files(pawnsOf(fen, 'w')))].sort((a, b) => a - b);
      return fs.filter((f, i) => i === 0 || f - fs[i - 1] > 1).length;
    };

    const tap = (id: string, n: number) => {
      const s = scene(id, n);
      if (s.kind !== 'tap') throw new Error('not a tap scene');
      return s;
    };
    // Pawn structure: the isolated, doubled and passed pawns, and the island count.
    expect(isolated(tap('b3-1', 1).fen)).toEqual(['d4']);
    const doubled = pawnsOf(tap('b3-1', 3).fen, 'w').filter((sq, _, all) => all.filter((o) => o[0] === sq[0]).length > 1);
    expect(doubled.sort()).toEqual(tap('b3-1', 3).answers.slice().sort());
    expect(islands(scene('b3-1', 4).fen!)).toBe(3);
    expect(passed(tap('b3-1', 6).fen)).toEqual(['d5']);
    expect(passed(scene('b3-1', 7).fen!)).toEqual([]);

    // Active pieces: the open files are open, the outpost cannot be hit by a pawn, the bishop is bad.
    const open = scene('b3-2', 1).fen!;
    for (const f of ['d', 'e']) expect([...pawnsOf(open, 'w'), ...pawnsOf(open, 'b')].some((sq) => sq[0] === f)).toBe(false);
    const outpost = scene('b3-2', 4).fen!;
    expect(new Chess(outpost).attackers('d5', 'w')).toContain('e4');
    expect(pawnsOf(outpost, 'b').some((sq) => ['c', 'e'].includes(sq[0]) && Number(sq[1]) > 5)).toBe(false);
    const light = (sq: string) => ('abcdefgh'.indexOf(sq[0]) + Number(sq[1]) - 1) % 2 === 1;
    const bad = scene('b3-2', 6).fen!;
    expect(light('e2')).toBe(true);
    expect(pawnsOf(bad, 'w').filter((sq) => ['c4', 'd5', 'e4', 'f3'].includes(sq)).every(light)).toBe(true);
    const knights = new Chess(scene('b3-2', 7).fen!);
    expect([knights.moves({ square: 'a1' }).length, knights.moves({ square: 'd4' }).length]).toEqual([2, 8]);

    // Attacking the king: f6 is the only guard of h7 besides the king, and g6 loses the queen.
    const battery = new Chess(scene('b3-3', 2).fen!);
    expect(battery.attackers('h7', 'b').filter((sq) => sq !== 'g8')).toEqual(['f6']);
    const g6 = new Chess(scene('b3-3', 5).fen!);
    expect(g6.move(parseUci('f6d8')).captured).toBe('q');

    // Rook endgames: in Philidor the white king is kept off row 6.
    const philidor = new Chess(scene('b3-4', 3).fen!);
    philidor.move(parseUci('b1b6'));
    expect(philidor.moves({ square: 'f5', verbose: true }).some((m) => m.to[1] === '6')).toBe(false);
  });

  it('quick tip claims agree with the board', () => {
    const scene = (id: string, n: number) => ALL_CONTENT.find((l) => l.id === id)!.scenes[n];
    const withTurn = (fen: string, turn: 'w' | 'b') => fen.replace(/ [wb] /, ` ${turn} `);
    // The queen on f6 really threatens mate on f2.
    const threat = new Chess(withTurn(scene('k-cek', 1).fen!, 'b'));
    threat.move(parseUci('f6f2'));
    expect(threat.isCheckmate()).toBe(true);
    // Légal's trap: if Black takes the knight instead, the g4 bishop falls.
    const legalTrap = new Chess(scene('k-legal', 1).fen!);
    legalTrap.move(parseUci('f3e5'));
    legalTrap.move(parseUci('d6e5'));
    expect(legalTrap.move(parseUci('d1g4')).captured).toBe('b');
    // Smothered mate: the knight jump is a double check.
    const smother = new Chess(scene('k-tercekik', 1).fen!);
    smother.move(parseUci('f7h6'));
    expect(smother.attackers('g8', 'w').sort()).toEqual(['c4', 'h6']);
    // Perpetual: each check leaves exactly one king move, and the cycle closes.
    const perp = new Chess(scene('k-abadi', 1).fen!);
    for (const [w, b] of [['d1h5', 'h7g8'], ['h5e8', 'g8h7'], ['e8h5', 'h7g8'], ['h5e8', 'g8h7']]) {
      perp.move(parseUci(w));
      expect(perp.inCheck()).toBe(true);
      expect(perp.moves()).toEqual([perp.moves({ verbose: true })[0].san]);
      perp.move(parseUci(b));
    }
    expect(perp.isThreefoldRepetition()).toBe(false);
    perp.move(parseUci('d1h5'.replace('d1', 'e8')));
    perp.move(parseUci('h7g8'));
    expect(perp.isThreefoldRepetition()).toBe(true);
  });

  it('chapter 4 claims agree with the board', () => {
    const scene = (id: string, n: number) => ALL_CONTENT.find((l) => l.id === id)!.scenes[n];
    // Ruy Lopez: the c8 bishop can reach g4, where it pins the f3 knight to the queen.
    const ruy = new Chess(scene('b4-1', 1).fen!.replace(' w ', ' b '));
    ruy.move(parseUci('c8g4'));
    expect(ruy.attackers('f3', 'b')).toContain('g4');
    expect(new Chess(ruy.fen()).get('d1')).toEqual({ type: 'q', color: 'w' });
    // h3 then covers g4; in the Italian, h6 covers g5.
    const h3 = new Chess(scene('b4-1', 2).fen!);
    h3.move(parseUci('h2h3'));
    expect(h3.attackers('g4', 'w')).toContain('h3');
    const h6 = new Chess(scene('b4-1', 3).fen!);
    h6.move(parseUci('h7h6'));
    expect(h6.attackers('g5', 'b')).toContain('h6');
    // Greek gift: nothing black guards h7 except the king, and a knight on f6 would guard h7 and h5.
    const greek = new Chess(scene('b4-2', 1).fen!);
    expect(greek.attackers('h7', 'b')).toEqual(['g8']);
    const knight = new Chess('4k3/8/5n2/8/8/8/8/4K3 w - - 0 1');
    expect(knight.attackers('h7', 'b')).toEqual(['f6']);
    expect(knight.attackers('h5', 'b')).toEqual(['f6']);
  });

  it('opening drills and the library agree with the lessons', () => {
    for (const lesson of OPENINGS) {
      for (const scene of lesson.scenes) {
        if (scene.kind !== 'drill') continue;
        for (const line of scene.lines) {
          const c = new Chess();
          for (const san of line.split(' ')) expect(() => c.move(san), `${lesson.id}: ${san} in ${line}`).not.toThrow();
          // A drill line ends on a move by the learner, so the learner always has the last word.
          expect(c.turn(), `${lesson.id}: ${line}`).not.toBe(scene.side);
        }
      }
    }
    const listed = OPENING_GROUPS.flatMap((g) => g.ids).sort();
    expect(listed).toEqual(OPENINGS.map((o) => o.id).sort());
    for (const id of listed) if (id !== 'p-intro') expect(OPENING_INFO[id], id).toBeTruthy();
    // The Caro-Kann trap: Nd6 really is mate.
    const caro = ALL_CONTENT.find((l) => l.id === 'p-caro')!.scenes.find((s) => s.kind === 'tap')!;
    const mate = new Chess(caro.fen!);
    mate.move('Nd6#');
    expect(mate.isCheckmate()).toBe(true);
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
