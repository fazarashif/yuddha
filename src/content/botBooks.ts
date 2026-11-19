import { bookLines } from './book';
import type { Repertoire } from './book';
import { OPENING_INFO } from './openings';

/**
 * Opening books for the challengers. A challenger follows a line while the game matches it and
 * switches to its usual thinking as soon as either side leaves the book.
 */

type Book = { w?: string[]; b?: string[] };

const lessons = (...ids: string[]) => ids.flatMap((id) => bookLines(id).map((l) => l.join(' ')));

/** What each challenger likes to play, by the colour it has. Lines are SAN from the start. */
export const SIGNATURE: Record<string, Book> = {
  'buta-cilik': {},
  'cantrik-lugu': { w: lessons('p-italian'), b: lessons('p-e5') },
  gandarwa: {
    // The queen comes out early, as the character promises.
    w: ['e4 e5 Qh5 Nc6 Bc4', 'e4 e5 Bc4 Nc6 Qf3', 'e4 e5 Bc4 Nf6 Qf3'],
    b: ['e4 d5 exd5 Qxd5 Nc3 Qa5', 'd4 e5'],
  },
  'nyi-rara': {
    // Every line carries a trap from the library.
    w: [
      'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7',
      'e4 e5 Nf3 d6 Bc4 Bg4 Nc3 g6 Nxe5',
      'e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Qe2',
      'd4 d5 Bf4 c5 e3 Qb6 Nc3',
    ],
    b: [
      'e4 c5 d4 cxd4 c3 dxc3 Nxc3 Nc6 Nf3 e6 Bc4 Qc7 O-O Nf6 Qe2 Ng4',
      'e4 e5 Nf3 Nc6 Bc4 Nf6',
      'd4 d5 c4 e6 Nc3 Nf6 Bg5 Nbd7',
    ],
  },
  'senapati-wesi': { w: lessons('p-london'), b: lessons('p-caro', 'p-qgd') },
  'resi-wening': { w: lessons('p-ruy'), b: lessons('p-e5', 'p-qgd') },
  'ratu-bayang': { w: [...lessons('p-italian'), 'e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5'], b: lessons('p-sicilian', 'p-qgd') },
  'prabu-kala': { w: lessons('p-ruy', 'p-italian'), b: lessons('p-sicilian', 'p-qgd') },
  'sang-hyang-kelir': { w: lessons('p-ruy'), b: lessons('p-sicilian', 'p-qgd') },
};

/**
 * The lines a challenger plays in one game. In repertoire mode it takes the other side of the
 * player's own repertoire (or of the whole library when none is chosen), so the player can rehearse
 * their openings in a real game.
 */
export function botLines(botId: string, botColor: 'w' | 'b', mode: 'own' | 'repertoire', repertoire: Repertoire): string[][] {
  if (mode === 'own') return (SIGNATURE[botId]?.[botColor] ?? []).map((l) => l.split(' '));
  const ids =
    botColor === 'b'
      ? [repertoire.w].filter((x): x is string => Boolean(x))
      : [repertoire.e4, repertoire.d4].filter((x): x is string => Boolean(x));
  const chosen = ids.length > 0 ? ids : Object.keys(OPENING_INFO).filter((id) => (OPENING_INFO[id].side === 'w') === (botColor === 'b'));
  return chosen.flatMap((id) => bookLines(id));
}
