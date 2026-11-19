import { Chess } from 'chess.js';
import { describe, expect, it } from 'vitest';
import { parseUci } from '../../chess/vision';
import { freshMove, judgeOwnMove, judgeReply, startOf } from './practice';

const LUCENA = '1K6/1P1k4/8/8/8/8/r7/5R2 w - - 0 1';
const PAWN = '4k3/8/8/8/3K4/3P4/8/8 w - - 0 1';
const QUEEN = '8/8/8/3k4/8/8/8/Q3K3 w - - 0 1';

const play = (fen: string, ...moves: string[]) => {
  const c = new Chess(fen);
  for (const m of moves) c.move(parseUci(m));
  return c;
};

describe('practice rules', () => {
  it('a promotion counts once the new queen survives the answer', () => {
    // The king on c7 guards b8: attacking the queen there does not win her.
    const guarded = '8/1PK1k3/8/8/8/8/r7/3R4 w - - 0 1';
    const c = play(guarded, 'b7b8q');
    expect(judgeOwnMove(c, 'promote', 'w')).toBe(null);
    c.move(parseUci('a2a8'));
    expect(judgeReply(c, 'promote', 'w', startOf(guarded))).toBe('won');
    // Nothing guards b8 here, and the black rook simply takes the new queen.
    const loose = '8/1P3k2/3K4/8/8/8/1r6/7R w - - 0 1';
    expect(judgeReply(play(loose, 'b7b8q', 'b2b8'), 'promote', 'w', startOf(loose))).toBe('lost');
  });

  it('a queen taken by a rook that can be taken back is not lost yet', () => {
    // b8 is guarded by the rook on h8; Rxb8 Rxb8 leaves rook against bare king.
    const fen = '7R/1P2k3/2K5/8/8/8/8/1r6 w - - 0 1';
    const start = startOf(fen);
    const c = play(fen, 'b7b8q', 'b1b8');
    expect(judgeReply(c, 'promote', 'w', start)).toBe(null);
    c.move(parseUci('h8b8'));
    expect(judgeOwnMove(c, 'promote', 'w')).toBe('won');
  });

  it('giving up the rook for the pawn leaves a won game', () => {
    const fen = '8/1PK1k3/8/8/8/8/1r6/3R4 b - - 0 1';
    const c = play(fen, 'b2b7', 'c7b7');
    expect(judgeOwnMove(c, 'promote', 'w')).toBe('won');
  });

  it('losing the rook for nothing ends the attempt', () => {
    const c = play(LUCENA, 'f1f2', 'a2f2');
    expect(judgeReply(c, 'promote', 'w', startOf(LUCENA))).toBe('lost');
  });

  it('a surviving promotion wins the pawn endgame, a lost pawn does not', () => {
    const start = startOf(PAWN);
    // Guarded by the king on c7, the new queen is already safe.
    expect(judgeOwnMove(play('4k3/2KP4/8/8/8/8/8/8 w - - 0 1', 'd7d8q'), 'promote', 'w')).toBe('won');
    // Unguarded next to the black king, she is not, and the king takes her.
    const loose = play('4k3/3P4/3K4/8/8/8/8/8 w - - 0 1', 'd7d8q');
    expect(judgeOwnMove(loose, 'promote', 'w')).toBe(null);
    loose.move(parseUci('e8d8'));
    expect(judgeReply(loose, 'promote', 'w', start)).toBe('lost');
    const gone = new Chess('8/8/8/3k4/8/2K5/8/8 w - - 0 1');
    expect(judgeReply(gone, 'promote', 'w', start)).toBe('lost');
  });

  it('mate practice: checkmate wins, stalemate and a lost queen do not', () => {
    expect(judgeOwnMove(play('k7/8/1K6/8/8/8/8/3Q4 w - - 0 1', 'd1d8'), 'mate', 'w')).toBe('won');
    expect(judgeOwnMove(play('k7/8/1K6/8/8/8/8/2Q5 w - - 0 1', 'c1c7'), 'mate', 'w')).toBe('stalemate');
    const lost = play(QUEEN, 'a1d4', 'd5d4');
    expect(judgeReply(lost, 'mate', 'w', startOf(QUEEN))).toBe('lost');
    const fine = play(QUEEN, 'a1b1', 'd5e5');
    expect(judgeReply(fine, 'mate', 'w', startOf(QUEEN))).toBe(null);
  });

  it('repetition is reported, and hints avoid it', () => {
    const shuffle = ['f1g1', 'a2b2', 'g1f1', 'b2a2'];
    const c = play(LUCENA, ...shuffle, ...shuffle.slice(0, 3));
    expect(judgeOwnMove(c, 'promote', 'w')).toBe(null);
    c.move(parseUci('b2a2'));
    expect(judgeReply(c, 'promote', 'w', startOf(LUCENA))).toBe('repeated');
    const back = play(LUCENA, ...shuffle);
    const line = (move: string, cp: number) => ({ move, cp });
    expect(freshMove(back, [line('f1g1', 480), line('f1d1', 470)])).toBe('f1d1');
    expect(freshMove(back, [line('f1d1', 480), line('f1g1', 480)])).toBe('f1d1');
    // A repeat is still better than a move that throws the win away.
    expect(freshMove(back, [line('f1g1', 480), line('f1f2', -500)])).toBe('f1g1');
  });
});
