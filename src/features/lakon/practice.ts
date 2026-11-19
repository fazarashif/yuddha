import { Chess } from 'chess.js';
import type { Color } from 'chess.js';
import { winPercent } from '../../chess/eval';
import { PIECE_VALUE } from '../../chess/vision';

/** How a practice game against the engine is judged. Kept apart from the screen so it can be tested. */

export type Goal = 'mate' | 'promote';
export type Verdict = 'won' | 'lost' | 'stalemate' | 'repeated' | null;

const pieces = (c: Chess, color: Color) => c.board().flat().filter((p) => p && p.color === color && p.type !== 'k');
const material = (c: Chess, color: Color) => pieces(c, color).reduce((n, p) => n + PIECE_VALUE[p!.type], 0);
/** Pieces other than pawns and the king: a promotion that survives adds one. */
const officers = (c: Chess, color: Color) => pieces(c, color).filter((p) => p!.type !== 'p').length;
const other = (color: Color): Color => (color === 'w' ? 'b' : 'w');
const balance = (c: Chess, side: Color) => material(c, side) - material(c, other(side));
/**
 * A queen or rook against a bare king is the basic mate, which the earlier lessons teach.
 * When the bare king is to move, it must not be able to take that piece.
 */
function basicMate(c: Chess, side: Color) {
  if (pieces(c, other(side)).length > 0) return false;
  const majors = pieces(c, side).filter((p) => p!.type === 'q' || p!.type === 'r').map((p) => p!.square as string);
  if (c.turn() === side) return majors.length > 0;
  const taken = new Set(c.moves({ verbose: true }).filter((m) => m.captured).map((m) => m.to as string));
  return majors.some((sq) => !taken.has(sq));
}

export interface Start {
  balance: number;
  officers: number;
}

export function startOf(fen: string): Start {
  const c = new Chess(fen);
  return { balance: balance(c, c.turn()), officers: officers(c, c.turn()) };
}

/** After the learner's own move. */
export function judgeOwnMove(c: Chess, goal: Goal, side: Color): Verdict {
  if (c.isCheckmate()) return 'won';
  if (c.isStalemate()) return 'stalemate';
  if (c.isThreefoldRepetition()) return 'repeated';
  if (c.isDraw()) return 'lost';
  if (goal === 'promote' && basicMate(c, side)) return 'won';
  return null;
}

/** After the defender's answer. Material that can be won straight back does not count as lost yet. */
export function judgeReply(c: Chess, goal: Goal, side: Color, start: Start): Verdict {
  if (c.isThreefoldRepetition()) return 'repeated';
  if (c.isCheckmate() || c.isDraw()) return 'lost';
  if (goal === 'promote' && (officers(c, side) > start.officers || basicMate(c, side))) return 'won';
  const now = balance(c, side);
  if (now >= start.balance) return null;
  const regain = c.moves({ verbose: true }).some((m) => m.captured && now + PIECE_VALUE[m.captured] >= start.balance);
  return regain ? null : 'lost';
}

const key = (fen: string) => fen.split(' ').slice(0, 4).join(' ');

/**
 * Picks the engine's best move, or an almost equally good one that does not walk back into a
 * position already seen. Candidates come best first, with scores from the mover's side.
 */
export function freshMove(c: Chess, lines: { move: string; cp: number }[]): string | undefined {
  if (lines.length === 0) return undefined;
  const best = winPercent(lines[0].cp);
  const candidates = lines.filter((l) => best - winPercent(l.cp) < 2).map((l) => l.move);
  const seen = new Set<string>([key(c.fen())]);
  for (const m of c.history({ verbose: true })) seen.add(key(m.before)).add(key(m.after));
  return (
    candidates.find((uci) => {
      const probe = new Chess(c.fen());
      try {
        probe.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
      } catch {
        return false;
      }
      return !seen.has(key(probe.fen()));
    }) ?? candidates[0]
  );
}
