import type { Phase } from '../../chess/phase';
import type { GameRecord, RatingPoint } from '../../state/store';

/** The skill map and the progress figures, computed from the player's own records. */

export type Area = 'tactics' | Phase;

export interface AreaScore {
  area: Area;
  /** 0 to 100: accuracy for the game phases, first-try puzzle success for tactics. Null without enough data. */
  score: number | null;
  /** Inaccurate moves per ten moves (phases only). */
  slips: number | null;
  /** How much evidence the score rests on: moves for phases, puzzles for tactics. */
  n: number;
}

const PHASE_THEMES = ['endgame', 'middlegame', 'opening'];

/** Accuracy per phase over the latest reviewed games, and puzzle success for tactics. */
export function skillMap(games: GameRecord[], themeStats: Record<string, { seen: number; solved: number }>, recent = 20): AreaScore[] {
  const withPhases = games.filter((g) => g.phases).slice(0, recent);
  const phase = (p: Phase): AreaScore => {
    let n = 0;
    let acc = 0;
    let bad = 0;
    for (const g of withPhases) {
      const s = g.phases![p];
      n += s.n;
      acc += s.acc * s.n;
      bad += s.bad;
    }
    // A handful of moves says too little about a phase.
    return n < 10 ? { area: p, score: null, slips: null, n } : { area: p, score: Math.round(acc / n), slips: Math.round((bad / n) * 100) / 10, n };
  };
  let seen = 0;
  let solved = 0;
  for (const [name, st] of Object.entries(themeStats)) {
    if (PHASE_THEMES.includes(name)) continue;
    seen += st.seen;
    solved += st.solved;
  }
  const tactics: AreaScore = { area: 'tactics', score: seen >= 10 ? Math.round((solved / seen) * 100) : null, slips: null, n: seen };
  return [tactics, phase('o'), phase('m'), phase('e')];
}

/** The area with the lowest score, when at least two areas can be compared. */
export function weakest(areas: AreaScore[]): Area | null {
  const known = areas.filter((a) => a.score !== null);
  if (known.length < 2) return null;
  return known.reduce((lo, a) => (a.score! < lo.score! ? a : lo)).area;
}

export const WEEK = 7;
export const weekOf = (day: number) => Math.floor(day / WEEK);
const dayOf = (at: number) => Math.floor((at - new Date(at).getTimezoneOffset() * 60000) / 86400000);

/** One value per week for the last `weeks` weeks, oldest first; null where there is nothing to show. */
export interface Series {
  weeks: number[];
  values: (number | null)[];
}

const emptyWeeks = (thisWeek: number, weeks: number) => Array.from({ length: weeks }, (_, i) => thisWeek - weeks + 1 + i);

/** The Chess.com rating at the end of each week, in the time control played most. */
export function chesscomSeries(games: GameRecord[], thisWeek: number, weeks = 12): { timeClass: string | null } & Series {
  const imported = games.filter((g) => g.source === 'chesscom' && typeof g.myRating === 'number');
  const counts = new Map<string, number>();
  for (const g of imported) counts.set(g.timeClass ?? '', (counts.get(g.timeClass ?? '') ?? 0) + 1);
  const timeClass = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const ws = emptyWeeks(thisWeek, weeks);
  const mine = imported.filter((g) => (g.timeClass ?? '') === timeClass).sort((a, b) => a.at - b.at);
  const values = ws.map((w) => {
    const inWeek = mine.filter((g) => weekOf(dayOf(g.at)) === w);
    return inWeek.length ? inWeek[inWeek.length - 1].myRating! : null;
  });
  return { timeClass: timeClass || null, weeks: ws, values };
}

/** A rating from the daily log at the end of each week, carried forward over quiet weeks. */
export function logSeries(log: RatingPoint[], key: 'play' | 'puzzle', thisWeek: number, weeks = 12): Series {
  const ws = emptyWeeks(thisWeek, weeks);
  const values = ws.map((w) => {
    const upTo = log.filter((p) => weekOf(p.day) <= w);
    return upTo.length ? upTo[upTo.length - 1][key] : null;
  });
  return { weeks: ws, values };
}

/** The weekly average of one figure over reviewed games. */
function reviewedSeries(games: GameRecord[], pick: (g: GameRecord) => number, thisWeek: number, weeks: number): Series {
  const ws = emptyWeeks(thisWeek, weeks);
  const values = ws.map((w) => {
    const inWeek = games.filter((g) => g.accuracy !== undefined && weekOf(dayOf(g.at)) === w);
    return inWeek.length ? Math.round((inWeek.reduce((a, g) => a + pick(g), 0) / inWeek.length) * 10) / 10 : null;
  });
  return { weeks: ws, values };
}

/** Average blunders per reviewed game in each week. */
export const blunderSeries = (games: GameRecord[], thisWeek: number, weeks = 12) => reviewedSeries(games, (g) => g.blunders ?? 0, thisWeek, weeks);

/** Average accuracy per reviewed game in each week. */
export const accuracySeries = (games: GameRecord[], thisWeek: number, weeks = 12) => reviewedSeries(games, (g) => g.accuracy ?? 0, thisWeek, weeks);

/** The change between the latest value and the value four weeks earlier (or the earliest one after it). */
export function change(series: Series, span = 4): number | null {
  const v = series.values;
  let last = -1;
  for (let i = v.length - 1; i >= 0; i--) if (v[i] !== null) { last = i; break; }
  if (last < 0) return null;
  for (let i = Math.max(0, last - span); i < last; i++) if (v[i] !== null) return Math.round((v[last]! - v[i]!) * 10) / 10;
  return null;
}

export const latest = (s: Series): number | null => [...s.values].reverse().find((x) => x !== null) ?? null;
