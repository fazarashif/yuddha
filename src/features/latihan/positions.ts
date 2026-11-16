import { Chess } from 'chess.js';
import { PIECE_VALUE, hangingPieces } from '../../chess/vision';

/**
 * Makes a messy but legal middlegame by playing a loose, capture-happy game
 * from the start, then stops where the side not to move has loose pieces.
 * Positions are generated on the device, so the drill never runs out.
 */
export function makeVisionPosition(rng: () => number = Math.random): { fen: string; answers: string[]; side: 'w' | 'b' } | null {
  for (let attempt = 0; attempt < 40; attempt++) {
    const chess = new Chess();
    const plies = 14 + Math.floor(rng() * 22);
    for (let i = 0; i < plies && !chess.isGameOver(); i++) {
      const moves = chess.moves({ verbose: true });
      const weights = moves.map((m) => {
        let w = 1;
        if (m.captured) w += 2 + PIECE_VALUE[m.captured];
        if (i < 10 && (m.piece === 'n' || m.piece === 'b')) w += 2;
        if (i < 6 && m.piece === 'p' && 'de'.includes(m.from[0])) w += 3;
        if (m.piece === 'k') w *= 0.2;
        return w;
      });
      let roll = rng() * weights.reduce((a, b) => a + b, 0);
      let pick = 0;
      while (pick < moves.length - 1 && (roll -= weights[pick]) > 0) pick++;
      chess.move(moves[pick]);
    }
    if (chess.isGameOver() || chess.inCheck()) continue;
    const mover = chess.turn();
    const victim = mover === 'w' ? 'b' : 'w';
    const loose = hangingPieces(chess.fen(), victim);
    if (loose.length >= 1 && loose.length <= 3) {
      return { fen: chess.fen(), answers: loose.map((p) => p.square), side: mover };
    }
  }
  return null;
}
