import { Chess } from 'chess.js';
import { describe, expect, it } from 'vitest';
import { OPENING_TABLE, familyOf, nameOpening } from '../chess/openingNames';
import { bookLines, checkBook, slotFor } from './book';
import { OPENING_INFO } from './openings';

const NONE = { w: null, e4: null, d4: null };
const moves = (s: string) => s.split(' ');

describe('opening names', () => {
  it('every entry is a legal sequence', () => {
    for (const e of OPENING_TABLE) {
      const c = new Chess();
      for (const san of e.moves) expect(() => c.move(san), `${e.name}: ${san}`).not.toThrow();
    }
  });

  it('picks the longest matching entry', () => {
    expect(nameOpening(moves('e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5 d5 exd5 Nxd5 Nxf7 Kxf7'))).toBe('Italian Game: Two Knights Defense, Fried Liver Attack');
    expect(nameOpening(moves('e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6 Be2'))).toBe('Sicilian Defense: Dragon Variation');
    expect(nameOpening(moves('d4 d5 c4 e6 Nc3'))).toBe("Queen's Gambit Declined");
    expect(nameOpening(moves('e4 e5 Nf3 Nc6 Bb5 a6 Ba4'))).toBe('Ruy Lopez: Morphy Defense');
    expect(nameOpening(moves('a3'))).toBeNull();
    expect(familyOf('Sicilian Defense: Dragon Variation')).toBe('Sicilian Defense');
  });
});

describe('book check', () => {
  it('knows which repertoire slot a game belongs to', () => {
    expect(slotFor('w', moves('d4 d5'))).toBe('w');
    expect(slotFor('b', moves('e4 c5'))).toBe('e4');
    expect(slotFor('b', moves('d4 Nf6'))).toBe('d4');
    expect(slotFor('b', moves('c4 e5'))).toBeNull();
  });

  it('every library opening has lines and a slot', () => {
    for (const [id, info] of Object.entries(OPENING_INFO)) {
      expect(bookLines(id).length, id).toBeGreaterThan(0);
      expect(['w', 'e4', 'd4']).toContain(info.slot);
    }
  });

  it('finds the first move where the player left the book', () => {
    const r = checkBook(moves('e4 e5 Nf3 Nc6 Bc4 Bc5 Nc3 Nf6'), 'w', NONE)!;
    expect(r.lessonId).toBe('p-italian');
    expect(r.left).toEqual({ by: 'me', ply: 7, played: 'Nc3', book: ['c3'] });
  });

  it('notices when the opponent leaves the book first', () => {
    const r = checkBook(moves('e4 e5 Nf3 Nc6 Bc4 h6 c3'), 'w', NONE)!;
    expect(r.left?.by).toBe('them');
    expect(r.left?.ply).toBe(6);
  });

  it('as Black, picks the defence that was actually played', () => {
    const r = checkBook(moves('e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6'), 'b', NONE)!;
    expect(r.lessonId).toBe('p-caro');
    expect(r.left).toEqual({ by: 'me', ply: 8, played: 'Nf6', book: ['Bf5'] });
  });

  it('a chosen repertoire is the only book', () => {
    const r = checkBook(moves('e4 e5 Nf3'), 'w', { ...NONE, w: 'p-london' })!;
    expect(r.lessonId).toBe('p-london');
    expect(r.left).toEqual({ by: 'me', ply: 1, played: 'e4', book: ['d4'] });
  });

  it('stays silent when the library does not cover the game', () => {
    expect(checkBook(moves('c4 e5'), 'w', NONE)).toBeNull();
    expect(checkBook(moves('c4 e5'), 'b', NONE)).toBeNull();
    expect(checkBook(moves('e4 e6 d4 d5'), 'w', NONE)).not.toBeNull();
  });

  it('reports a game that stayed in book to the end', () => {
    const r = checkBook(moves('d4 d5 Bf4 c5 e3 Nc6 c3 Qb6 Qb3 c4'), 'w', NONE)!;
    expect(r.lessonId).toBe('p-london');
    expect(r.left).toBeNull();
    expect(r.followed).toBe(9);
  });
});

describe('challenger books', () => {
  it('every signature line is legal and every challenger is known', async () => {
    const { SIGNATURE } = await import('./botBooks');
    const { BOTS } = await import('./characters');
    expect(Object.keys(SIGNATURE).sort()).toEqual(BOTS.map((b) => b.id).sort());
    for (const [id, book] of Object.entries(SIGNATURE)) {
      for (const line of [...(book.w ?? []), ...(book.b ?? [])]) {
        const c = new Chess();
        for (const san of line.split(' ')) expect(() => c.move(san), `${id}: ${san} in ${line}`).not.toThrow();
      }
    }
  });

  it('in repertoire mode the challenger takes the other side of the player\'s choice', async () => {
    const { botLines } = await import('./botBooks');
    // The player is White with the London: the challenger, Black, answers 1.d4.
    const asBlack = botLines('cantrik-lugu', 'b', 'repertoire', { ...NONE, w: 'p-london' });
    expect(new Set(asBlack.map((l) => l[0]))).toEqual(new Set(['d4']));
    // The player is Black with the Caro-Kann only: the challenger opens 1.e4 and goes into it.
    const asWhite = botLines('cantrik-lugu', 'w', 'repertoire', { ...NONE, e4: 'p-caro' });
    expect(asWhite.every((l) => l[0] === 'e4' && l[1] === 'c6')).toBe(true);
    // Without a repertoire, the whole library for that side.
    const all = botLines('cantrik-lugu', 'w', 'repertoire', NONE);
    expect(new Set(all.map((l) => l[0]))).toEqual(new Set(['e4', 'd4']));
    expect(all.length).toBeGreaterThan(10);
    expect(botLines('buta-cilik', 'w', 'own', NONE)).toEqual([]);
  });
});
