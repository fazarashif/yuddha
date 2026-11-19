/** Which part of the game a position belongs to. */
export type Phase = 'o' | 'm' | 'e';

/**
 * Endgame once six or fewer pieces other than kings and pawns remain on the board; opening for the
 * first ten moves otherwise; middlegame in between.
 */
export function phaseOf(fen: string, ply: number): Phase {
  const board = fen.split(' ')[0];
  const pieces = [...board].filter((ch) => /[nbrqNBRQ]/.test(ch)).length;
  if (pieces <= 6) return 'e';
  return ply <= 20 ? 'o' : 'm';
}
