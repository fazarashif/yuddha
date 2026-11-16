import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Motif } from '../chess/review';
import type { Lang } from '../content/types';
import type { PieceSet } from '../pieces/PieceArt';

export type BoardTheme = 'kelir' | 'kawung' | 'candi' | 'jati';
export type DailyStep = 'warmup' | 'lakon' | 'puzzle' | 'luka' | 'tanding';

export interface Settings {
  lang: Lang;
  theme: 'dark' | 'light';
  board: BoardTheme;
  pieceSet: PieceSet;
  sfx: number;
  music: number;
}

export interface GameRecord {
  id: string;
  at: number;
  botId: string;
  color: 'w' | 'b';
  result: 'win' | 'loss' | 'draw';
  guided: boolean;
  pgn: string;
  plies: number;
  /** Filled in once the game has been reviewed. */
  accuracy?: number;
  blunders?: number;
  mistakes?: number;
  /** Set on games brought in from elsewhere; games against the built-in opponents have none. */
  source?: 'chesscom';
  opponent?: { name: string; rating: number };
  myRating?: number;
  timeClass?: string;
}

/** How many games are kept, newest first. */
export const MAX_GAMES = 60;

/** A mistake kept for spaced repetition. */
export interface LukaCard {
  id: string;
  fen: string;
  best: string;
  played: string;
  motif: Motif;
  /** Day number (days since epoch, local) when the card is next due. */
  due: number;
  interval: number;
  reps: number;
  lapses: number;
}

export const dayNumber = (d = new Date()) => Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);

export interface State {
  settings: Settings;
  onboarded: boolean;
  /** Self-declared starting strength; 0 means complete beginner. */
  level: number;
  startChapter: number;
  xp: number;
  streak: { count: number; lastDay: number | null; oil: number };
  daily: { day: number; done: Record<DailyStep, boolean> };
  lessons: Record<string, { at: number; mistakes: number }>;
  playRating: number;
  puzzleRating: number;
  puzzlesDone: number;
  /** Ids of puzzles already shown, newest last. */
  puzzleSeen: string[];
  themeStats: Record<string, { seen: number; solved: number }>;
  visionBest: number;
  beaten: Record<string, number>;
  games: GameRecord[];
  luka: LukaCard[];
  /** Chess.com username last used for importing games. */
  chesscomUser: string;
  /** When the saved data last changed on this device; used to settle sync conflicts. */
  touched: number;

  setSettings: (patch: Partial<Settings>) => void;
  finishOnboarding: (level: number) => void;
  completeLesson: (id: string, mistakes: number) => void;
  markDaily: (step: DailyStep) => void;
  addXp: (n: number) => void;
  recordGame: (game: GameRecord, newRating: number | null) => void;
  attachReview: (id: string, patch: Pick<GameRecord, 'accuracy' | 'blunders' | 'mistakes'>) => void;
  importGames: (username: string, games: GameRecord[]) => void;
  addLuka: (cards: Omit<LukaCard, 'due' | 'interval' | 'reps' | 'lapses'>[]) => void;
  gradeLuka: (id: string, correct: boolean) => void;
  recordPuzzle: (id: string, rating: number, solved: boolean, themes: string[]) => void;
  setVisionBest: (n: number) => void;
  applySave: (data: Partial<SaveData>) => void;
  resetAll: () => void;
}

/** Everything that is saved and synced; the rest of the state is actions. */
export const DATA_KEYS = [
  'settings',
  'onboarded',
  'level',
  'startChapter',
  'xp',
  'streak',
  'daily',
  'lessons',
  'playRating',
  'puzzleRating',
  'puzzlesDone',
  'puzzleSeen',
  'themeStats',
  'visionBest',
  'beaten',
  'games',
  'luka',
  'chesscomUser',
] as const satisfies readonly (keyof State)[];
export type DataKey = (typeof DATA_KEYS)[number];
export type SaveData = Pick<State, DataKey | 'touched'>;

const emptyDaily = () => ({ day: dayNumber(), done: { warmup: false, lakon: false, puzzle: false, luka: false, tanding: false } });

const initial = {
  settings: { lang: 'id', theme: 'dark', board: 'kelir', pieceSet: 'yuddha', sfx: 0.7, music: 0.3 } as Settings,
  onboarded: false,
  level: 800,
  startChapter: 1,
  xp: 0,
  streak: { count: 0, lastDay: null as number | null, oil: 1 },
  daily: emptyDaily(),
  lessons: {} as State['lessons'],
  playRating: 800,
  puzzleRating: 800,
  puzzlesDone: 0,
  puzzleSeen: [] as string[],
  themeStats: {} as State['themeStats'],
  visionBest: 0,
  beaten: {} as Record<string, number>,
  games: [] as GameRecord[],
  luka: [] as LukaCard[],
  chesscomUser: '',
  touched: 0,
};

/** Advances the streak for today. A stored "oil" covers one missed day. */
function touchStreak(s: State['streak']): State['streak'] {
  const today = dayNumber();
  if (s.lastDay === today) return s;
  const gap = s.lastDay === null ? Infinity : today - s.lastDay;
  if (gap === 1) {
    const count = s.count + 1;
    return { count, lastDay: today, oil: Math.min(2, s.oil + (count % 7 === 0 ? 1 : 0)) };
  }
  if (gap === 2 && s.oil > 0) return { count: s.count + 1, lastDay: today, oil: s.oil - 1 };
  return { count: 1, lastDay: today, oil: s.oil };
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      ...initial,
      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      finishOnboarding: (level) =>
        set((s) => ({
          onboarded: true,
          level,
          startChapter: level < 600 ? 0 : 1,
          playRating: s.games.length ? s.playRating : Math.max(400, level || 400),
          puzzleRating: s.puzzlesDone ? s.puzzleRating : Math.max(400, level || 400),
        })),
      completeLesson: (id, mistakes) =>
        set((s) => ({
          lessons: { ...s.lessons, [id]: { at: Date.now(), mistakes: Math.min(mistakes, s.lessons[id]?.mistakes ?? Infinity) } },
          xp: s.xp + (s.lessons[id] ? 10 : 40),
        })),
      markDaily: (step) =>
        set((s) => {
          const daily = s.daily.day === dayNumber() ? s.daily : emptyDaily();
          const first = !daily.done[step];
          return {
            daily: { ...daily, done: { ...daily.done, [step]: true } },
            streak: touchStreak(s.streak),
            xp: s.xp + (first ? 10 : 0),
          };
        }),
      addXp: (n) => set((s) => ({ xp: s.xp + n })),
      recordGame: (game, newRating) =>
        set((s) => ({
          games: [game, ...s.games].slice(0, MAX_GAMES),
          playRating: newRating ?? s.playRating,
          beaten: game.result === 'win' ? { ...s.beaten, [game.botId]: (s.beaten[game.botId] ?? 0) + 1 } : s.beaten,
          xp: s.xp + (game.result === 'win' ? 30 : game.result === 'draw' ? 15 : 8),
        })),
      attachReview: (id, patch) => set((s) => ({ games: s.games.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
      importGames: (username, games) =>
        set((s) => {
          const known = new Set(s.games.map((g) => g.id));
          const fresh = games.filter((g) => !known.has(g.id));
          return {
            chesscomUser: username,
            games: [...s.games, ...fresh].sort((a, b) => b.at - a.at).slice(0, MAX_GAMES),
          };
        }),
      addLuka: (cards) =>
        set((s) => {
          const known = new Set(s.luka.map((c) => c.fen));
          const fresh = cards.filter((c) => !known.has(c.fen)).map((c) => ({ ...c, due: dayNumber(), interval: 0, reps: 0, lapses: 0 }));
          return { luka: [...fresh, ...s.luka].slice(0, 200) };
        }),
      gradeLuka: (id, correct) =>
        set((s) => ({
          luka: s.luka.map((c) => {
            if (c.id !== id) return c;
            if (!correct) return { ...c, interval: 1, reps: 0, lapses: c.lapses + 1, due: dayNumber() + 1 };
            const interval = c.reps === 0 ? 1 : c.reps === 1 ? 3 : Math.round(c.interval * 2.2);
            return { ...c, interval, reps: c.reps + 1, due: dayNumber() + interval };
          }),
          xp: s.xp + (correct ? 6 : 2),
        })),
      recordPuzzle: (id, rating, solved, themes) =>
        set((s) => {
          // Early results move the rating faster so it settles quickly.
          const k = s.puzzlesDone < 10 ? 48 : 24;
          const expected = 1 / (1 + 10 ** ((rating - s.puzzleRating) / 400));
          const themeStats = { ...s.themeStats };
          for (const t of themes) {
            const cur = themeStats[t] ?? { seen: 0, solved: 0 };
            themeStats[t] = { seen: cur.seen + 1, solved: cur.solved + (solved ? 1 : 0) };
          }
          return {
            puzzleRating: Math.max(400, Math.round(s.puzzleRating + k * ((solved ? 1 : 0) - expected))),
            puzzlesDone: s.puzzlesDone + 1,
            puzzleSeen: [...s.puzzleSeen, id].slice(-4000),
            themeStats,
            xp: s.xp + (solved ? 5 : 1),
          };
        }),
      setVisionBest: (n) => set((s) => ({ visionBest: Math.max(s.visionBest, n) })),
      applySave: (data) => set(data),
      resetAll: () => set({ ...initial, daily: emptyDaily() }),
    }),
    { name: 'yuddha-v1', version: 1 },
  ),
);

// Stamp every change to saved data, so two devices can tell whose copy is newer.
useStore.subscribe((state, prev) => {
  if (state.touched !== prev.touched) return;
  if (DATA_KEYS.some((key) => state[key] !== prev[key])) useStore.setState({ touched: Date.now() });
});

/** Today's checklist, reset when the day changes. */
export function useDaily() {
  const daily = useStore((s) => s.daily);
  return daily.day === dayNumber() ? daily.done : emptyDaily().done;
}

/** The streak as it stands today: it shows as broken once too many days pass. */
export function useStreak() {
  const s = useStore((st) => st.streak);
  const today = dayNumber();
  const gap = s.lastDay === null ? Infinity : today - s.lastDay;
  const alive = gap <= 1 || (gap === 2 && s.oil > 0);
  return { count: alive ? s.count : 0, doneToday: gap === 0, oil: s.oil };
}

export const dueLuka = (cards: LukaCard[]) => cards.filter((c) => c.due <= dayNumber());
