import { Chess } from 'chess.js';
import type { Color, PieceSymbol, Square } from 'chess.js';

export const PIECE_VALUE: Record<PieceSymbol, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };

export interface Loose {
  square: Square;
  type: PieceSymbol;
  color: Color;
}

const other = (c: Color): Color => (c === 'w' ? 'b' : 'w');

/**
 * Pieces of `color` that can be taken for free: attacked by the opponent and
 * either not defended at all, or attacked by something cheaper.
 * Kings are never listed. Pinned defenders are not accounted for.
 */
export function hangingPieces(fen: string, color: Color): Loose[] {
  const chess = new Chess(fen, { skipValidation: true });
  const out: Loose[] = [];
  for (const row of chess.board()) {
    for (const cell of row) {
      if (!cell || cell.color !== color || cell.type === 'k') continue;
      const attackers = chess.attackers(cell.square, other(color));
      if (attackers.length === 0) continue;
      const defenders = chess.attackers(cell.square, color);
      const cheapest = Math.min(...attackers.map((sq) => PIECE_VALUE[chess.get(sq)!.type]));
      if (defenders.length === 0 || cheapest < PIECE_VALUE[cell.type]) {
        out.push({ square: cell.square, type: cell.type, color: cell.color });
      }
    }
  }
  return out;
}

/** Pieces of `color` that nobody defends and somebody attacks. */
export function undefendedAttacked(fen: string, color: Color): Loose[] {
  const chess = new Chess(fen, { skipValidation: true });
  const out: Loose[] = [];
  for (const row of chess.board()) {
    for (const cell of row) {
      if (!cell || cell.color !== color || cell.type === 'k') continue;
      if (chess.attackers(cell.square, other(color)).length === 0) continue;
      if (chess.attackers(cell.square, color).length === 0) {
        out.push({ square: cell.square, type: cell.type, color: cell.color });
      }
    }
  }
  return out;
}

export function countAttackers(fen: string, square: Square, by: Color): number {
  return new Chess(fen, { skipValidation: true }).attackers(square, by).length;
}

/** Legal destinations per origin square for the side to move. */
export function legalDests(chess: Chess): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const m of chess.moves({ verbose: true })) (out[m.from] ??= []).push(m.to);
  return out;
}

export function kingSquare(chess: Chess, color: Color): Square | null {
  for (const row of chess.board()) for (const c of row) if (c && c.type === 'k' && c.color === color) return c.square;
  return null;
}

export const uciOf = (m: { from: string; to: string; promotion?: string }) => `${m.from}${m.to}${m.promotion ?? ''}`;
export const parseUci = (uci: string) => ({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci.slice(4, 5) || undefined });
