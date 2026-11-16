/** One principal variation reported by the engine. Scores are from the side to move. */
export interface Line {
  move: string;
  cp: number;
  mate: number | null;
  pv: string[];
  depth: number;
}

export interface AnalyseOptions {
  depth: number;
  multipv?: number;
}

export interface EngineLike {
  analyse(fen: string, opts: AnalyseOptions): Promise<Line[]>;
}

export const MATE_CP = 100000;

/** Parses a UCI "info" line into a Line, or null if it carries no scored pv. */
export function parseInfo(line: string): (Line & { multipv: number }) | null {
  if (!line.startsWith('info') || !line.includes(' pv ')) return null;
  const tok = line.split(' ');
  const num = (key: string) => {
    const i = tok.indexOf(key);
    return i >= 0 ? Number(tok[i + 1]) : NaN;
  };
  const si = tok.indexOf('score');
  if (si < 0) return null;
  const kind = tok[si + 1];
  const val = Number(tok[si + 2]);
  const mate = kind === 'mate' ? val : null;
  const cp = mate === null ? val : Math.sign(mate || 1) * (MATE_CP - Math.abs(mate) * 100);
  const pv = tok.slice(tok.indexOf('pv') + 1);
  const multipv = num('multipv');
  return { move: pv[0], cp, mate, pv, depth: num('depth'), multipv: Number.isNaN(multipv) ? 1 : multipv };
}

/** Collects the deepest line per multipv slot from a stream of UCI output. */
export class InfoCollector {
  private best = new Map<number, Line>();
  push(line: string) {
    const info = parseInfo(line);
    if (!info) return;
    const { multipv, ...rest } = info;
    this.best.set(multipv, rest);
  }
  lines(): Line[] {
    return [...this.best.entries()].sort((a, b) => a[0] - b[0]).map(([, l]) => l);
  }
}

const ENGINE_URL = '/engine/stockfish-19-lite-single.js';

/** Stockfish in a Web Worker. Requests run one at a time, in order. */
export class BrowserEngine implements EngineLike {
  private worker: Worker | null = null;
  private queue: Promise<unknown> = Promise.resolve();
  private listener: ((line: string) => void) | null = null;
  private ready: Promise<void> | null = null;

  private boot(): Promise<void> {
    if (this.ready) return this.ready;
    this.ready = new Promise<void>((resolve, reject) => {
      try {
        const worker = new Worker(ENGINE_URL);
        this.worker = worker;
        worker.onerror = (e) => reject(new Error(e.message || 'engine failed to load'));
        worker.onmessage = (e: MessageEvent) => {
          const line = typeof e.data === 'string' ? e.data : '';
          if (line === 'readyok' && !this.listener) resolve();
          this.listener?.(line);
        };
        worker.postMessage('uci');
        worker.postMessage('isready');
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
    this.ready.catch(() => {
      this.ready = null;
      this.worker = null;
    });
    return this.ready;
  }

  analyse(fen: string, opts: AnalyseOptions): Promise<Line[]> {
    const job = this.queue.then(async () => {
      await this.boot();
      const worker = this.worker!;
      const collector = new InfoCollector();
      return new Promise<Line[]>((resolve) => {
        this.listener = (line) => {
          if (line.startsWith('bestmove')) {
            this.listener = null;
            const lines = collector.lines();
            const move = line.split(' ')[1];
            // With no legal moves the engine answers "bestmove (none)".
            resolve(move && move !== '(none)' ? lines : []);
          } else {
            collector.push(line);
          }
        };
        worker.postMessage(`setoption name MultiPV value ${opts.multipv ?? 1}`);
        worker.postMessage(`position fen ${fen}`);
        worker.postMessage(`go depth ${opts.depth}`);
      });
    });
    this.queue = job.catch(() => undefined);
    return job;
  }

  dispose() {
    this.worker?.terminate();
    this.worker = null;
    this.ready = null;
  }
}

let shared: BrowserEngine | null = null;
export function getEngine(): BrowserEngine {
  shared ??= new BrowserEngine();
  return shared;
}
