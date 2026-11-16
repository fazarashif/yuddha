import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import { PIECE_VALUE, hangingPieces, parseUci } from '../chess/vision';
import type { Goal } from './lessons';

function meetsGoal(fen: string, uci: string, goal: Goal): boolean {
  const chess = new Chess(fen);
  const mover = chess.turn();
  let evenTrade: string | null = null;
  try {
    const m = chess.move(parseUci(uci));
    // A piece that just took something of equal or greater value may be retaken.
    if (m.captured && PIECE_VALUE[m.captured] >= PIECE_VALUE[m.piece]) evenTrade = m.to;
  } catch {
    return false;
  }
  const after = chess.fen();
  if (goal.kind === 'stopMate') {
    return !chess.moves({ verbose: true }).some((m) => {
      const probe = new Chess(after);
      probe.move(m);
      return probe.isCheckmate();
    });
  }
  if (hangingPieces(after, mover).some((p) => p.square !== evenTrade)) return false;
  if (goal.square) {
    const piece = chess.get(goal.square as Square);
    if (piece && piece.color === mover) {
      const attackers = chess.attackers(goal.square as Square, mover === 'w' ? 'b' : 'w').length;
      const guards = chess.attackers(goal.square as Square, mover).length;
      if (attackers > guards) return false;
    }
  }
  return true;
}

/** Decides whether a move solves a lesson task. */
export function judgeMove(scene: { fen: string; accept?: string[]; goal?: Goal }, uci: string): boolean {
  if (scene.accept?.includes(uci)) return true;
  return scene.goal ? meetsGoal(scene.fen, uci, scene.goal) : false;
}
