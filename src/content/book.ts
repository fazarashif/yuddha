import { OPENING_INFO, OPENINGS } from './openings';
import type { RepertoireSlot } from './openings';

/** Checks a game against the opening library: where the player, or the opponent, left the book. */

export type Repertoire = Record<RepertoireSlot, string | null>;

export interface BookCheck {
  /** The library lesson whose lines the game followed longest. */
  lessonId: string;
  /** How many plies matched the book. */
  followed: number;
  /** Who left the book first; null when the game stayed in book until the book ran out. */
  left: null | { by: 'me' | 'them'; ply: number; played: string; book: string[] };
}

/** Every line a lesson knows: the lines of its memory drills. */
export function bookLines(lessonId: string): string[][] {
  const lesson = OPENINGS.find((o) => o.id === lessonId);
  if (!lesson) return [];
  return lesson.scenes.flatMap((s) => (s.kind === 'drill' ? s.lines.map((l) => l.split(' ')) : []));
}

/** Which repertoire slot a game falls into, from the player's colour and White's first move. */
export function slotFor(color: 'w' | 'b', sans: string[]): RepertoireSlot | null {
  if (color === 'w') return 'w';
  if (sans[0] === 'e4') return 'e4';
  if (sans[0] === 'd4') return 'd4';
  return null;
}

function follow(lessonId: string, sans: string[], color: 'w' | 'b'): BookCheck {
  const lines = bookLines(lessonId);
  for (let i = 0; i < sans.length; i++) {
    const book = [...new Set(lines.filter((l) => l.length > i && sans.slice(0, i).every((m, k) => l[k] === m)).map((l) => l[i]))];
    if (book.length === 0) return { lessonId, followed: i, left: null };
    if (!book.includes(sans[i])) {
      const mover = i % 2 === 0 ? 'w' : 'b';
      return { lessonId, followed: i, left: { by: mover === color ? 'me' : 'them', ply: i + 1, played: sans[i], book } };
    }
  }
  return { lessonId, followed: sans.length, left: null };
}

/**
 * Compares a game with the player's repertoire, or, when none is chosen for this situation, with every
 * library opening for the player's side. Returns null when the library has nothing to say.
 */
export function checkBook(sans: string[], color: 'w' | 'b', repertoire: Repertoire): BookCheck | null {
  const slot = slotFor(color, sans);
  if (!slot) return null;
  const chosen = repertoire[slot];
  const candidates = chosen ? [chosen] : Object.keys(OPENING_INFO).filter((id) => OPENING_INFO[id].slot === slot);
  const checks = candidates.map((id) => follow(id, sans, color));
  const best = checks.sort((a, b) => b.followed - a.followed)[0];
  if (!best) return null;
  // Without a chosen repertoire, a game that never touched the library says nothing.
  if (!chosen && best.followed === 0) return null;
  // As Black, an opponent who left the book on move one simply played something the library lacks.
  if (best.followed === 0 && best.left?.by === 'them') return null;
  return best;
}
