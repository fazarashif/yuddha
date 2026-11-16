import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Motif } from '../chess/review';
import type { Lang } from '../content/types';
import type { PieceSet } from '../pieces/PieceArt';

export type BoardTheme = 'kelir' | 'kawung' | 'candi' | 'jati';
export type DailyStep = 'warmup' | 'lakon' | 'luka' | 'tanding';

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
}

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

interface State {
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
  visionBest: number;
  beaten: Record<string, number>;
  games: GameRecord[];
  luka: LukaCard[];

  setSettings: (patch: Partial<Settings>) => void;
  finishOnboarding: (level: number) => void;
  completeLesson: (id: string, mistakes: number) => void;
  markDaily: (step: DailyStep) => void;
  addXp: (n: number) => void;
  recordGame: (game: GameRecord, newRating: number | null) => void;
  attachReview: (id: string, patch: Pick<GameRecord, 'accuracy' | 'blunders' | 'mistakes'>) => void;
  addLuka: (cards: Omit<LukaCard, 'due' | 'interval' | 'reps' | 'lapses'>[]) => void;
  gradeLuka: (id: string, correct: boolean) => void;
  setVisionBest: (n: number) => void;
  resetAll: () => void;
}

const emptyDaily = () => ({ day: dayNumber(), done: { warmup: false, lakon: false, luka: false, tanding: false } });

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
  visionBest: 0,
  beaten: {} as Record<string, number>,
  games: [] as GameRecord[],
  luka: [] as LukaCard[],
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
        set({ onboarded: true, level, startChapter: level < 600 ? 0 : 1, playRating: Math.max(400, level || 400) }),
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
          games: [game, ...s.games].slice(0, 40),
          playRating: newRating ?? s.playRating,
          beaten: game.result === 'win' ? { ...s.beaten, [game.botId]: (s.beaten[game.botId] ?? 0) + 1 } : s.beaten,
          xp: s.xp + (game.result === 'win' ? 30 : game.result === 'draw' ? 15 : 8),
        })),
      attachReview: (id, patch) => set((s) => ({ games: s.games.map((g) => (g.id === id ? { ...g, ...patch } : g)) })),
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
      setVisionBest: (n) => set((s) => ({ visionBest: Math.max(s.visionBest, n) })),
      resetAll: () => set({ ...initial, daily: emptyDaily() }),
    }),
    { name: 'yuddha-v1', version: 1 },
  ),
);

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
