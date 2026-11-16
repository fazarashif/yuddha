import { Chess } from 'chess.js';
import { describe, expect, it } from 'vitest';
import { ImportError, fetchChessComGames, toGameRecord } from './chesscom';
import type { RawGame } from './chesscom';

const PGN = `[Event "Live Chess"]
[Site "Chess.com"]
[White "Senapati"]
[Black "lawan_satu"]
[Result "1-0"]

1. e4 {[%clk 0:09:58.1]} 1... e5 {[%clk 0:09:57]} 2. Nf3 {[%clk 0:09:55]} 2... Nc6 {[%clk 0:09:50]} 3. Bc4 {[%clk 0:09:51]} 3... Nf6 {[%clk 0:09:44]} 4. Ng5 {[%clk 0:09:40]} 4... d5 {[%clk 0:09:30]} 5. exd5 {[%clk 0:09:35]} 5... Nxd5 {[%clk 0:09:20]} 1-0`;

const raw = (over: Partial<RawGame> = {}): RawGame => ({
  url: 'https://www.chess.com/game/live/123',
  uuid: 'abc-1',
  pgn: PGN,
  rules: 'chess',
  time_class: 'rapid',
  rated: true,
  end_time: 1_794_000_000,
  white: { username: 'Senapati', rating: 812, result: 'win' },
  black: { username: 'lawan_satu', rating: 799, result: 'resigned' },
  ...over,
});

describe('toGameRecord', () => {
  it('reads a game from the player side, without clock comments', () => {
    const g = toGameRecord(raw(), 'senapati')!;
    expect(g).toMatchObject({ id: 'cc-abc-1', color: 'w', result: 'win', source: 'chesscom', plies: 10, myRating: 812, timeClass: 'rapid', at: 1_794_000_000_000 });
    expect(g.opponent).toEqual({ name: 'lawan_satu', rating: 799 });
    expect(g.pgn).toBe('1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Nxd5');
    const replay = new Chess();
    replay.loadPgn(g.pgn);
    expect(replay.history()).toHaveLength(10);
  });

  it('works out the result for either colour', () => {
    expect(toGameRecord(raw(), 'LAWAN_SATU')).toMatchObject({ color: 'b', result: 'loss' });
    const drawn = raw({ white: { username: 'Senapati', rating: 1, result: 'stalemate' }, black: { username: 'lawan_satu', rating: 1, result: 'stalemate' } });
    expect(toGameRecord(drawn, 'senapati')!.result).toBe('draw');
    const lostOnTime = raw({ white: { username: 'Senapati', rating: 1, result: 'timeout' }, black: { username: 'lawan_satu', rating: 1, result: 'win' } });
    expect(toGameRecord(lostOnTime, 'senapati')!.result).toBe('loss');
  });

  it('skips variants, strangers, broken and very short games', () => {
    expect(toGameRecord(raw({ rules: 'chess960' }), 'senapati')).toBeNull();
    expect(toGameRecord(raw({ initial_setup: '8/8/8/8/8/8/8/K6k w - - 0 1' }), 'senapati')).toBeNull();
    expect(toGameRecord(raw(), 'orang_lain')).toBeNull();
    expect(toGameRecord(raw({ pgn: undefined }), 'senapati')).toBeNull();
    expect(toGameRecord(raw({ pgn: '1. e4 e5 2. Ke3 1-0' }), 'senapati')).toBeNull();
    expect(toGameRecord(raw({ pgn: '1. e4 e5 1-0' }), 'senapati')).toBeNull();
  });
});

describe('fetchChessComGames', () => {
  const API = 'https://api.chess.com/pub/player/senapati/games';
  const pages: Record<string, unknown> = {
    [`${API}/archives`]: { archives: [`${API}/2026/09`, `${API}/2026/10`, 'https://elsewhere.example/steal', `${API}/2026/11`] },
    [`${API}/2026/11`]: { games: [raw({ uuid: 'n1', end_time: 300 }), raw({ uuid: 'n2', end_time: 400, rules: 'bughouse' })] },
    [`${API}/2026/10`]: { games: [raw({ uuid: 'o1', end_time: 100 }), raw({ uuid: 'o2', end_time: 200 })] },
    [`${API}/2026/09`]: { games: [raw({ uuid: 's1', end_time: 50 })] },
  };
  const asked: string[] = [];
  const fetcher = (async (url: string) => {
    asked.push(url);
    const body = pages[url];
    return { ok: body !== undefined, status: body === undefined ? 404 : 200, json: async () => body } as Response;
  }) as typeof fetch;

  it('returns the newest games first and reads only the months it needs', async () => {
    asked.length = 0;
    const games = await fetchChessComGames(' Senapati ', { limit: 3, fetcher });
    expect(games.map((g) => g.id)).toEqual(['cc-n1', 'cc-o2', 'cc-o1']);
    expect(asked).toEqual([`${API}/archives`, `${API}/2026/11`, `${API}/2026/10`]);
  });

  it('never follows an archive link that points elsewhere', async () => {
    asked.length = 0;
    await fetchChessComGames('senapati', { limit: 50, fetcher });
    expect(asked.some((u) => u.includes('elsewhere'))).toBe(false);
  });

  it('explains what went wrong', async () => {
    const reason = (p: Promise<unknown>) => p.then(() => 'ok', (e: ImportError) => e.reason);
    expect(await reason(fetchChessComGames('a b', { fetcher }))).toBe('username');
    expect(await reason(fetchChessComGames('tidak_ada', { fetcher }))).toBe('notfound');
    const down = (async () => {
      throw new TypeError('failed to fetch');
    }) as typeof fetch;
    expect(await reason(fetchChessComGames('senapati', { fetcher: down }))).toBe('network');
    const none = (async (url: string) => ({ ok: true, status: 200, json: async () => (url.endsWith('archives') ? { archives: [] } : { games: [] }) })) as unknown as typeof fetch;
    expect(await reason(fetchChessComGames('senapati', { fetcher: none }))).toBe('empty');
  });
});
