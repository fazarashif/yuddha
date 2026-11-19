import { Chess } from 'chess.js';
import { create } from 'zustand';
import { getEngine } from '../../chess/engine';
import { moveAccuracy } from '../../chess/eval';
import { phaseOf } from '../../chess/phase';
import { reviewGame } from '../../chess/review';
import type { Review } from '../../chess/review';
import { checkBook } from '../../content/book';
import { useStore } from '../../state/store';
import type { GameRecord, LukaCard } from '../../state/store';

/**
 * Game reviews, shared by the Review screen and the background queue: a finished review is cached for
 * this session and its results (accuracy, Kitab Luka cards) are stored once.
 */

const DEPTH = 10;
const cache = new Map<string, Review>();
const inflight = new Map<string, Promise<Review | null>>();

export const cachedReview = (id: string) => cache.get(id) ?? null;

type NewCard = Omit<LukaCard, 'due' | 'interval' | 'reps' | 'lapses'>;

/** The Kitab Luka cards a review yields: serious slips, plus leaving the book with an inaccuracy. */
export function cardsFrom(game: GameRecord, r: Review, repertoire = useStore.getState().repertoire): NewCard[] {
  const mine = r.moves.filter((m) => m.color === game.color);
  const cards: NewCard[] = mine
    .filter((m) => m.cls === 'blunder' || m.cls === 'mistake')
    .slice(0, 6)
    .map((m) => ({ id: `${game.id}-${m.ply}`, fen: m.fenBefore, best: m.best, played: m.uci, motif: m.motif }));
  const book = checkBook(r.moves.map((m) => m.san), game.color, repertoire);
  const off = book?.left?.by === 'me' ? r.moves[book.left.ply - 1] : undefined;
  if (book?.left && off && off.cls === 'inaccuracy') {
    const answer = new Chess(off.fenBefore).move(book.left.book[0]);
    cards.push({ id: `${game.id}-${off.ply}`, fen: off.fenBefore, best: `${answer.from}${answer.to}${answer.promotion ?? ''}`, played: off.uci, motif: { kind: 'book' } });
  }
  return cards;
}

/** The player's accuracy and inaccurate moves in each phase of the game. */
export function phasesOf(game: GameRecord, r: Review): NonNullable<GameRecord['phases']> {
  const sums = { o: { n: 0, acc: 0, bad: 0 }, m: { n: 0, acc: 0, bad: 0 }, e: { n: 0, acc: 0, bad: 0 } };
  for (const m of r.moves) {
    if (m.color !== game.color) continue;
    const p = sums[phaseOf(m.fenBefore, m.ply)];
    p.n += 1;
    p.acc += moveAccuracy(m.loss);
    if (m.cls === 'inaccuracy' || m.cls === 'mistake' || m.cls === 'blunder') p.bad += 1;
  }
  for (const p of Object.values(sums)) p.acc = p.n ? Math.round(p.acc / p.n) : 0;
  return sums;
}

function store(game: GameRecord, r: Review) {
  const s = useStore.getState();
  s.attachReview(game.id, {
    accuracy: Math.round(r.accuracy[game.color]),
    blunders: r.counts[game.color].blunder,
    mistakes: r.counts[game.color].mistake,
    phases: phasesOf(game, r),
  });
  s.addLuka(cardsFrom(game, r));
}

/**
 * Reviews a game, or joins a review of it that is already running. Returns null if the review was
 * cancelled before it finished.
 */
export function runReview(game: GameRecord, onProgress?: (done: number, total: number) => void, cancelled?: () => boolean): Promise<Review | null> {
  const hit = cache.get(game.id);
  if (hit) return Promise.resolve(hit);
  const running = inflight.get(game.id);
  if (running) return running;
  const job = reviewGame(getEngine(), game.pgn, DEPTH, onProgress, cancelled)
    .then((r) => {
      if (r) {
        cache.set(game.id, r);
        store(game, r);
      }
      return r;
    })
    .finally(() => inflight.delete(game.id));
  inflight.set(game.id, job);
  return job;
}

/* Background queue ------------------------------------------------------------------------------ */

interface Batch {
  running: boolean;
  total: number;
  done: number;
  /** The game being reviewed now, and how far along it is. */
  current: string | null;
  step: { done: number; total: number };
  /** Kitab Luka cards added by this run. */
  added: number;
  failed: boolean;
  start: (ids: string[]) => void;
  cancel: () => void;
}

let stopRequested = false;

export const useBatch = create<Batch>((set, get) => ({
  running: false,
  total: 0,
  done: 0,
  current: null,
  step: { done: 0, total: 1 },
  added: 0,
  failed: false,
  start: (ids) => {
    if (get().running) return;
    const queue = ids.filter((id) => !cache.has(id));
    if (queue.length === 0) return;
    stopRequested = false;
    set({ running: true, total: queue.length, done: 0, current: null, added: 0, failed: false });
    const lukaBefore = useStore.getState().luka.length;
    void (async () => {
      for (const id of queue) {
        if (stopRequested) break;
        const game = useStore.getState().games.find((g) => g.id === id);
        if (!game || game.phases !== undefined) {
          set((b) => ({ done: b.done + 1 }));
          continue;
        }
        set({ current: id, step: { done: 0, total: 1 } });
        const onProgress = (done: number, total: number) => set({ step: { done, total } });
        try {
          // A review started by the Review screen stops when that screen closes; pick it up again.
          let r = null;
          for (let tries = 0; !r && !stopRequested && tries < 3; tries++) r = await runReview(game, onProgress, () => stopRequested);
          // A game cut off by Stop is not counted; it stays in the list for next time.
          if (!r) break;
        } catch {
          set({ failed: true });
          break;
        }
        set((b) => ({ done: b.done + 1, added: Math.max(0, useStore.getState().luka.length - lukaBefore) }));
      }
      set({ running: false, current: null });
    })();
  },
  cancel: () => {
    stopRequested = true;
  },
}));

/** Games that have not been reviewed yet, newest first. */
/** Games without a complete review (reviews from before phases were stored count as incomplete). */
export const unreviewed = (games: GameRecord[]) => games.filter((g) => g.phases === undefined && g.plies > 1);
