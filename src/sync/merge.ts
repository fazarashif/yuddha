import { DATA_KEYS, MAX_GAMES } from '../state/store';
import type { GameRecord, LukaCard, SaveData } from '../state/store';

export const pickSave = (state: SaveData): SaveData => {
  const out = { touched: state.touched } as Record<string, unknown>;
  for (const key of DATA_KEYS) out[key] = state[key];
  return out as SaveData;
};

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

function unionBy<T>(a: T[], b: T[], key: (x: T) => string, better: (x: T, y: T) => T): T[] {
  const map = new Map<string, T>();
  for (const item of [...a, ...b]) {
    const k = key(item);
    const seen = map.get(k);
    map.set(k, seen ? better(seen, item) : item);
  }
  return [...map.values()];
}

/**
 * Combines the save on this device with the one from the server.
 * Collections are united so nothing done on either device is lost; single
 * values (settings, ratings, streak) come from whichever copy changed last.
 */
export function mergeSaves(local: SaveData, incoming: unknown): SaveData {
  if (!isObject(incoming)) return local;
  // Fill gaps so an older or partial save cannot erase fields.
  const remote = { ...local, ...incoming } as SaveData;
  const remoteTouched = typeof incoming.touched === 'number' ? incoming.touched : 0;

  // A device that has not been set up yet never overrides one that has.
  const preferRemote = local.onboarded !== remote.onboarded ? remote.onboarded : remoteTouched > local.touched;
  const lead = preferRemote ? remote : local;

  const lessons = { ...remote.lessons };
  for (const [id, mine] of Object.entries(local.lessons)) {
    const theirs = lessons[id];
    lessons[id] = theirs ? { at: Math.max(mine.at, theirs.at), mistakes: Math.min(mine.mistakes, theirs.mistakes) } : mine;
  }

  const beaten = { ...remote.beaten };
  for (const [id, n] of Object.entries(local.beaten)) beaten[id] = Math.max(n, beaten[id] ?? 0);

  const themeStats = { ...remote.themeStats };
  for (const [name, mine] of Object.entries(local.themeStats)) {
    const theirs = themeStats[name];
    themeStats[name] = !theirs || mine.seen >= theirs.seen ? mine : theirs;
  }

  const games = unionBy<GameRecord>(local.games, remote.games, (g) => g.id, (x, y) => (y.accuracy !== undefined && x.accuracy === undefined ? y : x))
    .sort((x, y) => y.at - x.at)
    .slice(0, MAX_GAMES);

  // The copy that has been reviewed more is the more recent one.
  const progress = (c: LukaCard) => c.reps + c.lapses;
  const luka = unionBy<LukaCard>(local.luka, remote.luka, (c) => c.id, (x, y) => (progress(y) > progress(x) ? y : x)).slice(0, 200);

  const puzzleSeen = [...new Set([...remote.puzzleSeen, ...local.puzzleSeen])].slice(-4000);

  return {
    settings: lead.settings,
    onboarded: local.onboarded || remote.onboarded,
    level: lead.level,
    startChapter: lead.startChapter,
    streak: lead.streak,
    daily: lead.daily,
    playRating: lead.playRating,
    puzzleRating: lead.puzzleRating,
    chesscomUser: lead.chesscomUser || local.chesscomUser || remote.chesscomUser,
    xp: Math.max(local.xp, remote.xp),
    puzzlesDone: Math.max(local.puzzlesDone, remote.puzzlesDone),
    visionBest: Math.max(local.visionBest, remote.visionBest),
    lessons,
    beaten,
    themeStats,
    games,
    luka,
    puzzleSeen,
    touched: Math.max(local.touched, remoteTouched),
  };
}

/** Text form of the saved data, ignoring the change stamp, to tell whether two saves differ. */
export const saveKey = (save: SaveData) => JSON.stringify({ ...pickSave(save), touched: 0 });
