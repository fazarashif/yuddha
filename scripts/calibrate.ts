/**
 * Measures the challengers' playing strength by playing them against each other and against
 * Stockfish limited with UCI_Elo. Run through `npm run calibrate` (see package.json):
 *
 *   node .calibrate/calibrate.mjs <botId> <opponent> <games>
 *
 * where <opponent> is another bot id or "sf<elo>" (for example sf1320, the lowest Stockfish allows).
 * Prints one JSON line: { a, b, games, points } with points scored by <botId>.
 *
 * Stockfish's UCI_Elo scale is anchored to engine rating lists, not to Chess.com, so the
 * numbers it produces are an approximation of human ratings, not a measurement of them.
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { Chess } from 'chess.js';
import { chooseBotMove } from '../src/chess/bot';
import { InfoCollector } from '../src/chess/engine';
import type { AnalyseOptions, EngineLike, Line } from '../src/chess/engine';
import { BOTS } from '../src/content/characters';

const require = createRequire(import.meta.url);
const ENGINE = require.resolve('stockfish/bin/stockfish-19-lite-single.js');

/** A Stockfish process spoken to over UCI. */
class Uci {
  private proc = spawn('node', [ENGINE]);
  private buf = '';
  private waiter: ((line: string) => boolean) | null = null;
  private done: (() => void) | null = null;

  constructor() {
    this.proc.stdout.on('data', (d: Buffer) => {
      this.buf += d.toString();
      let i;
      while ((i = this.buf.indexOf('\n')) >= 0) {
        const line = this.buf.slice(0, i).trim();
        this.buf = this.buf.slice(i + 1);
        if (this.waiter?.(line)) {
          this.waiter = null;
          const d2 = this.done;
          this.done = null;
          d2?.();
        }
      }
    });
  }

  send(cmd: string) {
    this.proc.stdin.write(cmd + '\n');
  }

  /** Sends commands and resolves once a line satisfies `until`. */
  ask(cmds: string[], until: (line: string) => boolean): Promise<void> {
    return new Promise((resolve) => {
      this.waiter = until;
      this.done = resolve;
      for (const c of cmds) this.send(c);
    });
  }

  quit() {
    this.send('quit');
    this.proc.kill();
  }
}

class CliEngine implements EngineLike {
  constructor(private uci: Uci) {}
  async analyse(fen: string, opts: AnalyseOptions): Promise<Line[]> {
    const info = new InfoCollector();
    let best = '';
    await this.uci.ask([`setoption name MultiPV value ${opts.multipv ?? 1}`, `position fen ${fen}`, `go depth ${opts.depth}`], (line) => {
      if (line.startsWith('bestmove')) {
        best = line.split(' ')[1];
        return true;
      }
      info.push(line);
      return false;
    });
    return best && best !== '(none)' ? info.lines() : [];
  }
}

interface Player {
  name: string;
  move(fen: string): Promise<string | null>;
  quit(): void;
}

function botPlayer(id: string): Player {
  const bot = BOTS.find((b) => b.id === id);
  if (!bot) throw new Error(`unknown bot ${id}`);
  const uci = new Uci();
  uci.send('uci');
  const engine = new CliEngine(uci);
  return {
    name: id,
    move: async (fen) => (await chooseBotMove(engine, fen, bot.brain))?.move ?? null,
    quit: () => uci.quit(),
  };
}

function stockfishPlayer(elo: number): Player {
  const uci = new Uci();
  uci.send('uci');
  uci.send('setoption name UCI_LimitStrength value true');
  uci.send(`setoption name UCI_Elo value ${elo}`);
  return {
    name: `sf${elo}`,
    move: async (fen) => {
      let best: string | null = null;
      await uci.ask([`position fen ${fen}`, 'go movetime 150'], (line) => {
        if (!line.startsWith('bestmove')) return false;
        best = line.split(' ')[1];
        return true;
      });
      return best && best !== '(none)' ? best : null;
    },
    quit: () => uci.quit(),
  };
}

const playerFor = (id: string) => (/^sf\d+$/.test(id) ? stockfishPlayer(Number(id.slice(2))) : botPlayer(id));

/** Short, varied starts so that games do not repeat; each is played once with each colour. */
const OPENINGS = [
  'e4 e5', 'd4 d5', 'e4 c5', 'd4 Nf6', 'c4 e5', 'e4 e6', 'e4 c6', 'Nf3 d5',
  'e4 e5 Nf3 Nc6', 'd4 d5 c4 e6', 'e4 d5', 'd4 Nf6 c4 g6', 'e4 e5 Nf3 Nf6', 'd4 d5 Bf4 Nf6', 'e4 c5 Nf3 d6', 'e4 Nf6',
];

/** Plays one game; returns the points for White (1, 0.5 or 0). */
async function playGame(white: Player, black: Player, opening: string, judge: CliEngine): Promise<number> {
  const chess = new Chess();
  for (const san of opening.split(' ')) chess.move(san);
  while (!chess.isGameOver() && chess.history().length < 220) {
    const mover = chess.turn() === 'w' ? white : black;
    const uci = await mover.move(chess.fen());
    if (!uci) break;
    try {
      chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    } catch {
      break;
    }
  }
  if (chess.isCheckmate()) return chess.turn() === 'w' ? 0 : 1;
  if (chess.isGameOver()) return 0.5;
  // Long games are adjudicated by a full-strength look at the final position.
  const [line] = await judge.analyse(chess.fen(), { depth: 14 });
  const cp = line ? (chess.turn() === 'w' ? line.cp : -line.cp) : 0;
  return cp > 250 ? 1 : cp < -250 ? 0 : 0.5;
}

async function main() {
  const [a, b, gamesArg] = process.argv.slice(2);
  const games = Number(gamesArg ?? 16);
  const pa = playerFor(a);
  const pb = playerFor(b);
  const judgeUci = new Uci();
  judgeUci.send('uci');
  const judge = new CliEngine(judgeUci);
  let points = 0;
  for (let g = 0; g < games; g++) {
    const opening = OPENINGS[Math.floor(g / 2) % OPENINGS.length];
    const aWhite = g % 2 === 0;
    const white = await playGame(aWhite ? pa : pb, aWhite ? pb : pa, opening, judge);
    points += aWhite ? white : 1 - white;
  }
  console.log(JSON.stringify({ a, b, games, points }));
  pa.quit();
  pb.quit();
  judgeUci.quit();
}

void main();
