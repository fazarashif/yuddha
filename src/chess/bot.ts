import { Chess } from 'chess.js';
import type { EngineLike, Line } from './engine';
import { parseUci } from './vision';

/** Tunable error model for one opponent. Values are design targets, not calibrated ratings. */
export interface BotBrain {
  /** Search depth for the candidate list. */
  depth: number;
  /** How many candidate moves the bot considers. */
  multipv: number;
  /** Softmax temperature in centipawns: higher = sloppier choices. */
  temp: number;
  /** Chance per move of ignoring the scores and playing any candidate. */
  blunder: number;
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

  if (rng() < brain.blunder && lines.length > 1) {
    // A lapse: any candidate that is not completely absurd.
    const pool = lines.filter((l) => best - l.cp < 700);
    return { move: pool[Math.floor(rng() * pool.length)].move, lines };
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
