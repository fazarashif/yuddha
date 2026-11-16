import { Chess } from 'chess.js';
import type { GameRecord } from '../../state/store';

/** Thrown with a reason the interface can explain. */
export class ImportError extends Error {
  constructor(public reason: 'username' | 'notfound' | 'network' | 'empty') {
    super(reason);
  }
}

interface RawSide {
  username: string;
  rating: number;
  result: string;
}

/** One game as the Chess.com public API returns it (only the fields used here). */
export interface RawGame {
  url: string;
  uuid?: string;
  pgn?: string;
  rules: string;
  time_class: string;
  rated?: boolean;
  end_time: number;
  initial_setup?: string;
  white: RawSide;
  black: RawSide;
}

const API = 'https://api.chess.com/pub/player/';
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const USERNAME = /^[a-z0-9_-]{3,25}$/;

export const normaliseUsername = (name: string) => name.trim().toLowerCase();

/** Rewrites a move list as bare PGN: no headers, no clock comments. */
function plainPgn(sans: string[]): string {
  return sans.map((san, i) => (i % 2 === 0 ? `${i / 2 + 1}. ${san}` : san)).join(' ');
}

/**
 * Turns an API game into a stored record, seen from `username`'s side.
 * Returns null for variants, unreadable records and games too short to learn from.
 */
export function toGameRecord(raw: RawGame, username: string): GameRecord | null {
  if (raw.rules !== 'chess' || !raw.pgn) return null;
  if (raw.initial_setup && raw.initial_setup !== START_FEN) return null;
  const me = normaliseUsername(username);
  const color = normaliseUsername(raw.white.username) === me ? 'w' : normaliseUsername(raw.black.username) === me ? 'b' : null;
  if (!color) return null;

  let sans: string[];
  try {
    const chess = new Chess();
    chess.loadPgn(raw.pgn);
    sans = chess.history();
  } catch {
    return null;
  }
  if (sans.length < 8) return null;

  const mine = color === 'w' ? raw.white : raw.black;
  const theirs = color === 'w' ? raw.black : raw.white;
  const result = mine.result === 'win' ? 'win' : theirs.result === 'win' ? 'loss' : 'draw';
  const key = raw.uuid ?? raw.url.split('/').pop() ?? String(raw.end_time);

  return {
    id: `cc-${key}`,
    at: raw.end_time * 1000,
    botId: 'chesscom',
    source: 'chesscom',
    color,
    result,
    guided: false,
    pgn: plainPgn(sans),
    plies: sans.length,
    opponent: { name: theirs.username, rating: theirs.rating },
    myRating: mine.rating,
    timeClass: raw.time_class,
  };
}

async function getJson<T>(url: string, fetcher: typeof fetch): Promise<T> {
  let res: Response;
  try {
    res = await fetcher(url);
  } catch {
    throw new ImportError('network');
  }
  if (res.status === 404) throw new ImportError('notfound');
  if (!res.ok) throw new ImportError('network');
  try {
    return (await res.json()) as T;
  } catch {
    throw new ImportError('network');
  }
}

/**
 * Fetches a player's most recent standard games, newest first. Monthly
 * archives are read one at a time, newest month first, and only as many as
 * needed, to stay light on the public API.
 */
export async function fetchChessComGames(
  username: string,
  { limit = 20, maxMonths = 4, fetcher = fetch }: { limit?: number; maxMonths?: number; fetcher?: typeof fetch } = {},
): Promise<GameRecord[]> {
  const name = normaliseUsername(username);
  if (!USERNAME.test(name)) throw new ImportError('username');

  const { archives } = await getJson<{ archives: string[] }>(`${API}${encodeURIComponent(name)}/games/archives`, fetcher);
  // Only follow archive links that point back at the same API.
  const months = (archives ?? []).filter((u) => u.startsWith(API)).slice(-maxMonths).reverse();

  const out: GameRecord[] = [];
  for (const url of months) {
    const { games } = await getJson<{ games: RawGame[] }>(url, fetcher);
    const records = (games ?? [])
      .map((g) => toGameRecord(g, name))
      .filter((g): g is GameRecord => g !== null)
      .sort((a, b) => b.at - a.at);
    out.push(...records);
    if (out.length >= limit) break;
  }
  if (out.length === 0) throw new ImportError('empty');
  return out.slice(0, limit);
}
