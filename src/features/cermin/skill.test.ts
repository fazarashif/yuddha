import { describe, expect, it } from 'vitest';
import { phaseOf } from '../../chess/phase';
import type { GameRecord } from '../../state/store';
import { logRatings } from '../../state/store';
import { blunderSeries, change, chesscomSeries, latest, logSeries, skillMap, weakest } from './skill';

const DAY = 86400000;
const game = (over: Partial<GameRecord>): GameRecord => ({ id: Math.random().toString(36), at: 0, botId: 'x', color: 'w', result: 'win', guided: false, pgn: '', plies: 40, ...over });
const ph = (o: [number, number, number], m: [number, number, number], e: [number, number, number]) => ({
  o: { n: o[0], acc: o[1], bad: o[2] },
  m: { n: m[0], acc: m[1], bad: m[2] },
  e: { n: e[0], acc: e[1], bad: e[2] },
});

describe('game phases', () => {
  it('splits opening, middlegame and endgame', () => {
    expect(phaseOf('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 1)).toBe('o');
    expect(phaseOf('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 30)).toBe('m');
    expect(phaseOf('4k3/8/8/8/8/8/8/R3K2R w - - 0 1', 8)).toBe('e');
  });
});

describe('skill map', () => {
  it('weights phase accuracy by the number of moves and finds the weakest area', () => {
    const games = [game({ phases: ph([10, 90, 0], [20, 70, 4], [0, 0, 0]) }), game({ phases: ph([10, 80, 1], [20, 60, 6], [12, 50, 3]) })];
    const map = skillMap(games, { fork: { seen: 8, solved: 6 }, pin: { seen: 4, solved: 2 }, endgame: { seen: 30, solved: 0 } });
    expect(map).toEqual([
      { area: 'tactics', score: 67, slips: null, n: 12 },
      { area: 'o', score: 85, slips: 0.5, n: 20 },
      { area: 'm', score: 65, slips: 2.5, n: 40 },
      { area: 'e', score: 50, slips: 2.5, n: 12 },
    ]);
    expect(weakest(map)).toBe('e');
  });

  it('leaves out areas without enough evidence', () => {
    const map = skillMap([game({ phases: ph([8, 90, 0], [0, 0, 0], [0, 0, 0]) })], {});
    expect(map.every((a) => a.score === null)).toBe(true);
    expect(weakest(map)).toBeNull();
  });
});

describe('progress', () => {
  const week = 3000;
  const at = (w: number) => (w * 7 + 3) * DAY + new Date().getTimezoneOffset() * 60000;

  it('tracks the Chess.com rating in the time control played most', () => {
    const games = [
      game({ source: 'chesscom', timeClass: 'rapid', myRating: 800, at: at(week - 5) }),
      game({ source: 'chesscom', timeClass: 'rapid', myRating: 850, at: at(week - 1) }),
      game({ source: 'chesscom', timeClass: 'blitz', myRating: 600, at: at(week) }),
    ];
    const s = chesscomSeries(games, week, 6);
    expect(s.timeClass).toBe('rapid');
    expect(s.values).toEqual([800, null, null, null, 850, null]);
    expect(latest(s)).toBe(850);
    expect(change(s)).toBe(50);
  });

  it('carries logged ratings forward and averages blunders per week', () => {
    let log = logRatings([], 800, 900, week * 7 - 20);
    log = logRatings(log, 820, 950, week * 7 + 1);
    log = logRatings(log, 830, 960, week * 7 + 2);
    expect(log).toHaveLength(3);
    const s = logSeries(log, 'puzzle', week, 4);
    expect(s.values).toEqual([900, 900, 900, 960]);
    expect(change(s)).toBe(60);
    const b = blunderSeries([game({ accuracy: 80, blunders: 2, at: at(week) }), game({ accuracy: 70, blunders: 1, at: at(week) })], week, 2);
    expect(b.values).toEqual([null, 1.5]);
    expect(change(b)).toBeNull();
  });
});
