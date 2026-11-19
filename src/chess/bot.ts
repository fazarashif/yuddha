import { Chess } from 'chess.js';
import type { EngineLike, Line } from './engine';
import { winPercent } from './eval';
import { parseUci } from './vision';

/** Tunable error model for one opponent; tuned so its blunder rate matches human players (docs/KALIBRASI.md). */
export interface BotBrain {
  /** Search depth for the candidate list. */
  depth: number;
  /** How many candidate moves the bot considers. */
  multipv: number;
  /** Softmax temperature in centipawns: higher = sloppier choices. */
  temp: number;
  /** Chance per move of a real blunder, the kind that loses material, as weaker players make. */
  blunder: number;
  /**
   * How much a blunder gives away, in winning-chance points (0 to 100) as the Review measures it:
   * [least, most]. Defaults to [24, 60]; 22 or more counts as a blunder in the Review.
   */
  blunderLoss?: [number, number];
  /** Extra appeal (centipawns) of capturing something. */
  greed?: number;
  /** Extra appeal of giving check. */
  aggression?: number;
  /** Extra appeal of moving the queen in the first ten moves. */
  queenRush?: number;
}

export interface BotChoice {
  move: string;
  lines: Line[];
}

function appeal(chess: Chess, line: Line, brain: BotBrain): number {
  let bonus = 0;
  const { from, to, promotion } = parseUci(line.move);
  try {
    const m = chess.move({ from, to, promotion });
    if (m.captured) bonus += brain.greed ?? 0;
    if (chess.inCheck()) bonus += brain.aggression ?? 0;
    if (m.piece === 'q' && chess.moveNumber() <= 10) bonus += brain.queenRush ?? 0;
    chess.undo();
  } catch {
    // An unparsable engine move simply gets no bonus.
  }
  return bonus;
}

/** Picks a move the way a player of this strength and temperament might. */
export async function chooseBotMove(
  engine: EngineLike,
  fen: string,
  brain: BotBrain,
  rng: () => number = Math.random,
): Promise<BotChoice | null> {
  const lines = await engine.analyse(fen, { depth: brain.depth, multipv: brain.multipv });
  if (lines.length === 0) return null;
  const chess = new Chess(fen);
  const best = lines[0].cp;

  if (rng() < brain.blunder) {
    // A lapse: a move that really costs something, chosen from a wide, quick look at the position.
    const [least, most] = brain.blunderLoss ?? [24, 60];
    const wide = await engine.analyse(fen, { depth: Math.min(brain.depth, 6), multipv: 40 });
    const top = winPercent(wide[0]?.cp ?? best);
    const pool = wide.filter((l) => top - winPercent(l.cp) >= least && top - winPercent(l.cp) <= most);
    if (pool.length > 0) return { move: pool[Math.floor(rng() * pool.length)].move, lines };
  }

  const weights = lines.map((l) => Math.exp(-(best - l.cp - appeal(chess, l, brain)) / Math.max(1, brain.temp)));
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = rng() * total;
  for (let i = 0; i < lines.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return { move: lines[i].move, lines };
  }
  return { move: lines[0].move, lines };
}
