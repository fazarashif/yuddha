import { Chess } from 'chess.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { play } from '../../audio/sound';
import { kingSquare, legalDests, parseUci } from '../../chess/vision';
import { NyalaIcon } from '../../components/Avatar';
import { Board } from '../../components/Board';
import { Bubble, Meter, TopBar } from '../../components/ui';
import { useL, useT } from '../../i18n';
import type { PieceType } from '../../pieces/PieceArt';
import { useStore } from '../../state/store';
import { pickPuzzle } from './data';
import type { PuzzleItem } from './data';
import { THEME_NAME, mainTheme } from './themes';

type Phase = 'loading' | 'error' | 'empty' | 'lead' | 'play' | 'wait' | 'wrong' | 'solved' | 'shown';
const DAILY_GOAL = 5;

/** Adaptive tactics puzzles: the rating follows the solver, the puzzles follow the rating. */
export function Puzzle() {
  const t = useT();
  const l = useL();
  const [, go] = useLocation();
  const pieceSet = useStore((s) => s.settings.pieceSet);
  const rating = useStore((s) => s.puzzleRating);
  const recordPuzzle = useStore((s) => s.recordPuzzle);
  const addLuka = useStore((s) => s.addLuka);
  const markDaily = useStore((s) => s.markDaily);

  const chess = useRef(new Chess());
  const gen = useRef(0);
  const [puzzle, setPuzzle] = useState<PuzzleItem | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [fen, setFen] = useState(chess.current.fen());
  const [lastMove, setLastMove] = useState<[string, string] | null>(null);
  const [idx, setIdx] = useState(1);
  const [graded, setGraded] = useState(false);
  const [delta, setDelta] = useState<number | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [solvedCount, setSolvedCount] = useState(0);
  const [side, setSide] = useState<'w' | 'b'>('w');

  const apply = (uci: string) => {
    const m = chess.current.move(parseUci(uci));
    setFen(chess.current.fen());
    setLastMove([m.from, m.to]);
    play(chess.current.inCheck() ? 'check' : m.captured ? 'capture' : 'move');
  };

  const load = useCallback(async () => {
    const my = ++gen.current;
    setPhase('loading');
    setHint(null);
    setDelta(null);
    setGraded(false);
    const state = useStore.getState();
    let next: PuzzleItem | null;
    try {
      next = await pickPuzzle(state.puzzleRating, new Set(state.puzzleSeen));
    } catch {
      if (my === gen.current) setPhase('error');
      return;
    }
    if (my !== gen.current) return;
    if (!next) {
      setPhase('empty');
      return;
    }
    chess.current = new Chess(next.fen);
    setPuzzle(next);
    setFen(next.fen);
    setLastMove(null);
    setIdx(1);
    setSide(chess.current.turn() === 'w' ? 'b' : 'w');
    setPhase('lead');
    // The opponent's move that creates the puzzle is played out first.
    setTimeout(() => {
      if (my !== gen.current) return;
      apply(next.moves[0]);
      setPhase('play');
    }, 650);
  }, []);

  useEffect(() => {
    void load();
    return () => {
      gen.current += 1;
    };
  }, [load]);

  const grade = (solved: boolean) => {
    if (!puzzle || graded) return;
    setGraded(true);
    const before = useStore.getState().puzzleRating;
    recordPuzzle(puzzle.id, puzzle.rating, solved, puzzle.themes);
    setDelta(useStore.getState().puzzleRating - before);
  };

  const finish = (how: 'solved' | 'shown') => {
    setPhase(how);
    setHint(null);
    if (how === 'solved') {
      play('good');
      grade(true);
      const n = solvedCount + 1;
      setSolvedCount(n);
      if (n >= DAILY_GOAL) markDaily('puzzle');
    }
  };

  const onMove = (from: string, to: string, promotion?: PieceType) => {
    if (!puzzle || (phase !== 'play' && phase !== 'wrong')) return;
    const my = gen.current;
    const uci = `${from}${to}${promotion ?? ''}`;
    const expected = puzzle.moves[idx];
    const before = chess.current.fen();
    const probe = new Chess(before);
    probe.move({ from, to, promotion });
    // Any checkmate solves the puzzle, as on Lichess.
    if (uci !== expected && !probe.isCheckmate()) {
      play('bad');
      if (!graded) {
        addLuka([{ id: `p-${puzzle.id}-${idx}`, fen: before, best: expected, played: uci, motif: { kind: 'generic' } }]);
        grade(false);
      }
      setFen(probe.fen());
      setLastMove([from, to]);
      setPhase('wait');
      setTimeout(() => {
        if (my !== gen.current) return;
        setFen(before);
        setLastMove(null);
        setPhase('wrong');
      }, 550);
      return;
    }
    apply(uci);
    setHint(null);
    const reply = idx + 1;
    if (probe.isCheckmate() || reply >= puzzle.moves.length) {
      finish('solved');
      return;
    }
    setPhase('wait');
    setTimeout(() => {
      if (my !== gen.current) return;
      apply(puzzle.moves[reply]);
      setIdx(reply + 1);
      setPhase('play');
    }, 450);
  };

  const reveal = () => {
    if (!puzzle) return;
    const my = gen.current;
    grade(false);
    setPhase('wait');
    setHint(null);
    const rest = puzzle.moves.slice(idx);
    rest.forEach((uci, i) =>
      setTimeout(() => {
        if (my !== gen.current) return;
        apply(uci);
        if (i === rest.length - 1) finish('shown');
      }, 500 * (i + 1)),
    );
  };

  const showHint = () => {
    if (!puzzle) return;
    grade(false);
    play('hint');
    setHint(parseUci(puzzle.moves[idx]).from);
  };

  const c = chess.current;
  const done = phase === 'solved' || phase === 'shown';
  const theme = puzzle ? mainTheme(puzzle.themes) : null;
  const canMove = phase === 'play' || phase === 'wrong';

  return (
    <div className="screen">
      <TopBar
        back="/"
        title={<h2>{t('puzzle.title')}</h2>}
        right={
          <span className="puzzle-rating num">
            {rating}
            {delta !== null && delta !== 0 && <span className={delta > 0 ? 'delta-up' : 'delta-down'}>{delta > 0 ? `+${delta}` : delta}</span>}
          </span>
        }
      />
      <Meter value={Math.min(solvedCount, DAILY_GOAL)} max={DAILY_GOAL} />

      {phase === 'error' && (
        <>
          <Bubble name="Ki Sabda">{t('puzzle.error')}</Bubble>
          <div className="sheet-actions">
            <button className="btn btn-primary" onClick={() => void load()}>
              {t('puzzle.retry')}
            </button>
          </div>
        </>
      )}
      {phase === 'empty' && <Bubble name="Ki Sabda">{t('puzzle.empty')}</Bubble>}

      {phase !== 'error' && phase !== 'empty' && (
        <>
          <div className={`find-board${phase === 'loading' ? ' board-loading' : ''}`} data-puzzle={puzzle?.id}>
            <Board
              fen={fen}
              orientation={side}
              dests={canMove ? legalDests(c) : undefined}
              onMove={onMove}
              lastMove={lastMove}
              check={c.inCheck() ? kingSquare(c, c.turn()) : null}
              hint={hint ? { from: hint } : null}
              pieceSet={pieceSet}
            />
          </div>

          <Bubble
            name="Ki Sabda"
            mood={phase === 'solved' ? 'happy' : phase === 'wrong' ? 'surprised' : 'neutral'}
            tone={phase === 'solved' ? 'good' : phase === 'wrong' ? 'bad' : undefined}
          >
            {phase === 'loading' && t('puzzle.loading')}
            {(phase === 'lead' || phase === 'play' || phase === 'wait') && t(side === 'w' ? 'puzzle.askWhite' : 'puzzle.askBlack')}
            {phase === 'wrong' && t('puzzle.wrong')}
            {phase === 'solved' && (theme ? t('puzzle.solvedTheme', { theme: l(THEME_NAME[theme]) }) : t('puzzle.solved'))}
            {phase === 'shown' && (theme ? t('puzzle.shownTheme', { theme: l(THEME_NAME[theme]) }) : t('puzzle.shown'))}
          </Bubble>

          {done && puzzle && (
            <p className="note num">
              {t('puzzle.meta', { rating: puzzle.rating })}
              {puzzle.themes.length > 0 && ` · ${puzzle.themes.map((th) => l(THEME_NAME[th])).join(', ')}`}
            </p>
          )}

          <div className="sheet-actions">
            {phase === 'wrong' && (
              <div className="row-actions">
                <button className="btn btn-ghost" onClick={showHint}>
                  <NyalaIcon size={22} /> {t('game.hint')}
                </button>
                <button className="btn btn-ghost" onClick={reveal}>
                  {t('find.reveal')}
                </button>
              </div>
            )}
            {done && (
              <>
                <button className="btn btn-primary" onClick={() => void load()}>
                  {t('puzzle.next')}
                </button>
                {solvedCount >= DAILY_GOAL && (
                  <button className="btn btn-ghost" onClick={() => go('/')}>
                    {t('common.done')}
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
