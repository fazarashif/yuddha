import { Chess } from 'chess.js';
import type { PieceSymbol } from 'chess.js';
import type { EngineLike } from './engine';
import { classify, isMateScore, mateIn, moveAccuracy, winLoss } from './eval';
import type { MoveClass } from './eval';
import { PIECE_VALUE, parseUci, uciOf, undefendedAttacked } from './vision';

export type Motif =
  | { kind: 'missedMate'; n: number }
  | { kind: 'allowedMate'; n: number }
  | { kind: 'hung'; piece: PieceSymbol; square: string }
  | { kind: 'missedFree'; piece: PieceSymbol; square: string }
  | { kind: 'missedCapture'; piece: PieceSymbol; square: string }
  | { kind: 'generic' }
  /** Left the player's opening book with a move the engine also dislikes. */
  | { kind: 'book' };

export interface ReviewedMove {
  ply: number;
  color: 'w' | 'b';
  san: string;
  uci: string;
  fenBefore: string;
  fenAfter: string;
  /** Best score available before the move, from the mover's side. */
  bestCp: number;
  /** Score after the move actually played, from the mover's side. */
  playedCp: number;
  best: string;
  bestSan: string;
  loss: number;
  cls: MoveClass;
  motif: Motif;
}

export interface Review {
  moves: ReviewedMove[];
  accuracy: { w: number; b: number };
  counts: Record<'w' | 'b', Record<MoveClass, number>>;
}

export function sanOf(fen: string, uci: string): string {
  try {
    return new Chess(fen).move(parseUci(uci)).san;
  } catch {
    return uci;
  }
}

/** Names what went wrong, using only facts that can be read off the board. */
export function findMotif(m: Pick<ReviewedMove, 'fenBefore' | 'fenAfter' | 'best' | 'bestCp' | 'playedCp' | 'color'>, reply: string | null): Motif {
  if (isMateScore(m.bestCp) && m.bestCp > 0 && !(isMateScore(m.playedCp) && m.playedCp > 0)) {
    return { kind: 'missedMate', n: mateIn(m.bestCp) };
  }
  if (isMateScore(m.playedCp) && m.playedCp < 0) return { kind: 'allowedMate', n: mateIn(m.playedCp) };

  // Did the reply win something the mover left unguarded?
  if (reply) {
    const after = new Chess(m.fenAfter);
    const { to } = parseUci(reply);
    const victim = after.get(to as never);
    if (victim && victim.color === m.color) {
      const loose = undefendedAttacked(m.fenAfter, m.color).some((l) => l.square === to);
      const before = new Chess(m.fenAfter);
      const attacker = before.get(parseUci(reply).from as never);
      const cheaper = attacker ? PIECE_VALUE[attacker.type] < PIECE_VALUE[victim.type] : false;
      if (loose || cheaper) return { kind: 'hung', piece: victim.type, square: to };
    }
  }

  // Was the best move a capture the mover passed up?
  const before = new Chess(m.fenBefore);
  const { to } = parseUci(m.best);
  const target = before.get(to as never);
  if (target && target.color !== m.color) {
    const free = undefendedAttacked(m.fenBefore, target.color).some((l) => l.square === to);
    return { kind: free ? 'missedFree' : 'missedCapture', piece: target.type, square: to };
  }
  return { kind: 'generic' };
}

/**
 * Scores every move of a game. `positions` is the list of FENs from the start
 * position to the final one; `sans` holds the moves between them.
 */
export async function reviewGame(
  engine: EngineLike,
  pgn: string,
  depth: number,
  onProgress?: (done: number, total: number) => void,
  cancelled?: () => boolean,
): Promise<Review | null> {
  const game = new Chess();
  game.loadPgn(pgn);
  const history = game.history({ verbose: true });
  const fens = [history.length ? history[0].before : game.fen(), ...history.map((h) => h.after)];

  const evals: { cp: number; move: string | null }[] = [];
  for (let i = 0; i < fens.length; i++) {
    if (cancelled?.()) return null;
    const lines = await engine.analyse(fens[i], { depth, multipv: 1 });
    if (lines.length) {
      evals.push({ cp: lines[0].cp, move: lines[0].move });
    } else {
      // Game over: mate counts as lost for the side to move, anything else is level.
      const end = new Chess(fens[i]);
      evals.push({ cp: end.isCheckmate() ? -100000 : 0, move: null });
    }
    onProgress?.(i + 1, fens.length);
  }

  const moves: ReviewedMove[] = history.map((h, i) => {
    const bestCp = evals[i].cp;
    const playedCp = -evals[i + 1].cp;
    const uci = uciOf(h);
    const best = evals[i].move ?? uci;
    const loss = winLoss(bestCp, playedCp);
    const base = { fenBefore: h.before, fenAfter: h.after, best, bestCp, playedCp, color: h.color };
    const cls = classify(loss, uci === best);
    return {
      ply: i + 1,
      san: h.san,
      uci,
      bestSan: sanOf(h.before, best),
      loss,
      cls,
      motif: cls === 'best' || cls === 'good' ? { kind: 'generic' } : findMotif(base, evals[i + 1].move),
      ...base,
    };
  });

  const blank = (): Record<MoveClass, number> => ({ best: 0, good: 0, inaccuracy: 0, mistake: 0, blunder: 0 });
  const counts = { w: blank(), b: blank() };
  const acc = { w: [] as number[], b: [] as number[] };
  for (const m of moves) {
    counts[m.color][m.cls] += 1;
    acc[m.color].push(moveAccuracy(m.loss));
  }
  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  return { moves, accuracy: { w: mean(acc.w), b: mean(acc.b) }, counts };
}
