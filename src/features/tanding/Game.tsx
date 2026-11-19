import { ArrowCounterClockwise, Flag, Lightbulb } from '@phosphor-icons/react';
import { Chess } from 'chess.js';
import type { PieceSymbol } from 'chess.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { play } from '../../audio/sound';
import { chooseBotMove } from '../../chess/bot';
import type { BotChoice } from '../../chess/bot';
import { getEngine } from '../../chess/engine';
import type { Line } from '../../chess/engine';
import { eloUpdate, winLoss } from '../../chess/eval';
import { findMotif } from '../../chess/review';
import type { Motif } from '../../chess/review';
import { PIECE_VALUE, kingSquare, legalDests, parseUci, uciOf } from '../../chess/vision';
import { Avatar } from '../../components/Avatar';
import { Board } from '../../components/Board';
import { Bubble, Sheet, TopBar } from '../../components/ui';
import { botLines } from '../../content/botBooks';
import { botById } from '../../content/characters';
import { pickReply } from '../lakon/drill';
import type { L } from '../../content/types';
import { useL, useT } from '../../i18n';
import { PieceArt } from '../../pieces/PieceArt';
import type { PieceType } from '../../pieces/PieceArt';
import { useStore } from '../../state/store';
import { motifText } from './motif';

type Status = 'player' | 'bot' | 'over';
type Outcome = { result: 'win' | 'loss' | 'draw'; reason: 'mate' | 'resign' | 'stalemate' | 'draw'; ratingDelta: number | null; id: string };

const START_COUNT: Record<string, number> = { p: 8, n: 2, b: 2, r: 2, q: 1 };

/** Pieces each side has lost, read off the position. */
function captured(fen: string) {
  const counts: Record<string, number> = {};
  for (const ch of fen.split(' ')[0]) if (/[a-z]/i.test(ch)) counts[ch] = (counts[ch] ?? 0) + 1;
  const lost = (white: boolean) =>
    (['q', 'r', 'b', 'n', 'p'] as PieceType[]).flatMap((t) => {
      const have = counts[white ? t.toUpperCase() : t] ?? 0;
      return Array<PieceType>(Math.max(0, START_COUNT[t] - have)).fill(t);
    });
  const w = lost(true);
  const b = lost(false);
  const sum = (xs: PieceType[]) => xs.reduce((a, t) => a + PIECE_VALUE[t], 0);
  return { w, b, lead: sum(b) - sum(w) };
}

function Tray({ pieces, color, lead }: { pieces: PieceType[]; color: 'w' | 'b'; lead: number }) {
  return (
    <div className="tray">
      {pieces.map((t, i) => (
        <span key={i} className="tray-piece">
          <PieceArt type={t} color={color} />
        </span>
      ))}
      {lead > 0 && <span className="tray-lead num">+{lead}</span>}
    </div>
  );
}

export function Game({ botId }: { botId: string }) {
  const t = useT();
  const l = useL();
  const [, go] = useLocation();
  const query = new URLSearchParams(useSearch());
  const bot = botById(botId);
  const guided = query.get('g') !== '0';
  const playerColor = useMemo<'w' | 'b'>(() => {
    const c = query.get('c');
    return c === 'b' ? 'b' : c === 'r' ? (Math.random() < 0.5 ? 'w' : 'b') : 'w';
    // The colour is fixed for the lifetime of this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The challenger's opening book: its own favourites, or the other side of the player's repertoire.
  const rehearse = query.get('r') === '1';
  const book = useMemo(
    () => (bot ? botLines(bot.id, playerColor === 'w' ? 'b' : 'w', rehearse ? 'repertoire' : 'own', useStore.getState().repertoire) : []),
    // Fixed for the lifetime of this game.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  /** The book move for the challenger in the current position, if the game is still in book. */
  const fromBook = (choice: BotChoice | null): BotChoice | null => {
    const san = pickReply(book, chess.current.history(), Math.random);
    if (!san || !choice) return choice;
    try {
      return { ...choice, move: uciOf(new Chess(chess.current.fen()).move(san)) };
    } catch {
      return choice;
    }
  };

  const pieceSet = useStore((s) => s.settings.pieceSet);
  const playRating = useStore((s) => s.playRating);
  const recordGame = useStore((s) => s.recordGame);
  const markDaily = useStore((s) => s.markDaily);

  const chess = useRef(new Chess());
  const gen = useRef(0);
  const pre = useRef<Promise<Line[]> | null>(null);
  const [fen, setFen] = useState(chess.current.fen());
  const [status, setStatus] = useState<Status>('player');
  const [lastMove, setLastMove] = useState<[string, string] | null>(null);
  const [bark, setBark] = useState<L | null>(bot?.greet ?? null);
  const [hintLevel, setHintLevel] = useState(0);
  const [hint, setHint] = useState<{ from?: string; to?: string } | null>(null);
  const [warn, setWarn] = useState<{ choice: BotChoice; motif: Motif } | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [engineError, setEngineError] = useState(false);
  const [confirmResign, setConfirmResign] = useState(false);

  const sync = () => {
    const c = chess.current;
    setFen(c.fen());
    const h = c.history({ verbose: true });
    const last = h[h.length - 1];
    setLastMove(last ? [last.from, last.to] : null);
  };

  const finish = useCallback(
    (result: Outcome['result'], reason: Outcome['reason']) => {
      if (!bot) return;
      gen.current += 1;
      const c = chess.current;
      const score = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
      const newRating = guided ? null : eloUpdate(playRating, bot.elo, score);
      const id = `g${Date.now().toString(36)}`;
      recordGame(
        { id, at: Date.now(), botId: bot.id, color: playerColor, result, guided, pgn: c.pgn(), plies: c.history().length },
        newRating,
      );
      markDaily('tanding');
      setStatus('over');
      setHint(null);
      setBark(result === 'win' ? bot.onDefeat : result === 'loss' ? bot.onWin : null);
      setOutcome({ result, reason, ratingDelta: newRating === null ? null : newRating - playRating, id });
      play(result === 'win' ? 'win' : result === 'loss' ? 'lose' : 'check');
    },
    [bot, guided, markDaily, playRating, playerColor, recordGame],
  );

  /** Ends the game if the position is final. Returns true when it did. */
  const settle = useCallback(() => {
    const c = chess.current;
    if (!c.isGameOver()) return false;
    if (c.isCheckmate()) finish(c.turn() === playerColor ? 'loss' : 'win', 'mate');
    else finish('draw', c.isStalemate() ? 'stalemate' : 'draw');
    return true;
  }, [finish, playerColor]);

  const startPlayerTurn = useCallback(() => {
    setStatus('player');
    setHintLevel(0);
    setHint(null);
    pre.current = getEngine()
      .analyse(chess.current.fen(), { depth: 10, multipv: 1 })
      .catch(() => {
        setEngineError(true);
        return [];
      });
  }, []);

  const botTurn = useCallback(
    async (ready?: BotChoice) => {
      if (!bot) return;
      const my = gen.current;
      setStatus('bot');
      const began = Date.now();
      let choice = ready ?? null;
      try {
        choice ??= await chooseBotMove(getEngine(), chess.current.fen(), bot.brain);
        choice = fromBook(choice);
      } catch {
        setEngineError(true);
        return;
      }
      const wait = 650 - (Date.now() - began);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      if (my !== gen.current || !choice) return;
      const m = chess.current.move(parseUci(choice.move));
      sync();
      play(chess.current.inCheck() ? 'check' : m.captured ? 'capture' : 'move');
      if (m.captured && PIECE_VALUE[m.captured as PieceSymbol] >= 3) setBark(bot.onCapture);
      if (!settle()) startPlayerTurn();
    },
    [bot, settle, startPlayerTurn],
  );

  // First move of the game.
  useEffect(() => {
    if (playerColor === 'b') void botTurn();
    else startPlayerTurn();
    return () => {
      gen.current += 1;
    };
    // Runs once per mounted game.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPlayerMove = async (from: string, to: string, promotion?: PieceType) => {
    if (status !== 'player' || !bot) return;
    const c = chess.current;
    const before = c.fen();
    let m;
    try {
      m = c.move({ from, to, promotion });
    } catch {
      return;
    }
    const my = gen.current;
    sync();
    setHint(null);
    play(c.inCheck() ? 'check' : m.captured ? 'capture' : 'move');
    if (m.captured && PIECE_VALUE[m.captured as PieceSymbol] >= 3) setBark(bot.onLoss);
    if (settle()) return;
    setStatus('bot');

    // One search serves both the blunder check and the reply.
    let choice: BotChoice | null;
    try {
      // The search still runs in book: guided mode needs its evaluation for the blunder check.
      choice = fromBook(await chooseBotMove(getEngine(), c.fen(), bot.brain));
    } catch {
      setEngineError(true);
      return;
    }
    if (my !== gen.current || !choice) return;

    if (guided) {
      const lines = (await pre.current) ?? [];
      if (my !== gen.current) return;
      const best = lines[0];
      if (best && best.move !== uciOf(m)) {
        const playedCp = -choice.lines[0].cp;
        if (winLoss(best.cp, playedCp) >= 14) {
          const motif = findMotif(
            { fenBefore: before, fenAfter: c.fen(), best: best.move, bestCp: best.cp, playedCp, color: playerColor },
            choice.lines[0].move,
          );
          play('bad');
          setWarn({ choice, motif });
          return;
        }
      }
    }
    void botTurn(choice);
  };

  const rethink = () => {
    chess.current.undo();
    sync();
    setWarn(null);
    setStatus('player');
  };

  const carryOn = () => {
    const choice = warn?.choice;
    setWarn(null);
    void botTurn(choice);
  };

  const takeBack = () => {
    const c = chess.current;
    if (status !== 'player' || c.history().length < 2) return;
    c.undo();
    c.undo();
    sync();
    startPlayerTurn();
  };

  const showHint = async () => {
    if (status !== 'player') return;
    const lines = (await pre.current) ?? [];
    if (!lines[0]) return;
    const { from, to } = parseUci(lines[0].move);
    play('hint');
    setHint(hintLevel === 0 ? { from } : { from, to });
    setHintLevel((n) => Math.min(2, n + 1));
  };

  const again = () => {
    gen.current += 1;
    chess.current = new Chess();
    setOutcome(null);
    setWarn(null);
    setBark(bot?.greet ?? null);
    sync();
    if (playerColor === 'b') void botTurn();
    else startPlayerTurn();
  };

  if (!bot) return null;

  const c = chess.current;
  const taken = captured(fen);
  const check = c.inCheck() ? kingSquare(c, c.turn()) : null;
  const botColor = playerColor === 'w' ? 'b' : 'w';
  const canUndo = status === 'player' && c.history().length >= 2;

  return (
    <div className="play">
      <TopBar back="/tanding" title={`${guided ? t('game.guided') : t('game.pure')}${rehearse ? ` · ${t('select.book.rep')}` : ''}`} />
      <div className="play-body">
        <div className="play-side play-opponent">
          <Avatar spec={bot.face} size={46} mood={outcome?.result === 'win' ? 'surprised' : outcome?.result === 'loss' ? 'happy' : 'neutral'} label={bot.name} />
          <div className="play-who">
            <div className="play-name">
              {bot.name} <span className="play-elo num">{bot.elo}</span>
            </div>
            <Tray pieces={playerColor === 'w' ? taken.w : taken.b} color={playerColor} lead={playerColor === 'w' ? -taken.lead : taken.lead} />
          </div>
          {status === 'bot' && !warn && <span className="thinking" aria-label={t('game.thinking')} />}
        </div>
        {bark && <div className="play-bark">{l(bark)}</div>}

        <div className="play-board">
          <Board
            fen={fen}
            orientation={playerColor}
            dests={status === 'player' ? legalDests(c) : undefined}
            onMove={onPlayerMove}
            lastMove={lastMove}
            check={check}
            hint={hint}
            pieceSet={pieceSet}
          />
        </div>

        <div className="play-side">
          <div className="play-who">
            <div className="play-name">
              {t('game.you')} {!guided && <span className="play-elo num">{playRating}</span>}
            </div>
            <Tray pieces={botColor === 'w' ? taken.w : taken.b} color={botColor} lead={botColor === 'w' ? -taken.lead : taken.lead} />
          </div>
          <div className="play-turn">{status === 'player' ? t('game.yourTurn') : status === 'bot' ? t('game.thinking') : ''}</div>
        </div>

        <div className="play-actions">
          {guided && (
            <>
              <button className="btn btn-ghost" onClick={showHint} disabled={status !== 'player'}>
                <Lightbulb size={20} /> {t('game.hint')}
              </button>
              <button className="btn btn-ghost" onClick={takeBack} disabled={!canUndo}>
                <ArrowCounterClockwise size={20} /> {t('game.undo')}
              </button>
            </>
          )}
          <button className="btn btn-ghost" onClick={() => setConfirmResign(true)} disabled={status === 'over'}>
            <Flag size={20} /> {t('game.resign')}
          </button>
        </div>
        {engineError && <p className="note note-bad">{t('game.engineError')}</p>}
      </div>

      <Sheet open={Boolean(warn)}>
        {warn && (
          <>
            <Bubble mood="surprised" name="Ki Sabda" tone="bad">
              {t('game.warnLead')} {motifText(t, warn.motif, null)}
            </Bubble>
            <p className="three-q">{t('game.threeQ')}</p>
            <div className="sheet-actions">
              <button className="btn btn-primary" onClick={rethink}>
                {t('game.rethink')}
              </button>
              <button className="btn btn-ghost" onClick={carryOn}>
                {t('game.carryOn')}
              </button>
            </div>
          </>
        )}
      </Sheet>

      <Sheet open={confirmResign} onClose={() => setConfirmResign(false)}>
        <h3>{t('game.resignAsk')}</h3>
        <div className="sheet-actions">
          <button
            className="btn btn-danger"
            onClick={() => {
              setConfirmResign(false);
              finish('loss', 'resign');
            }}
          >
            {t('game.resign')}
          </button>
          <button className="btn btn-ghost" onClick={() => setConfirmResign(false)}>
            {t('common.cancel')}
          </button>
        </div>
      </Sheet>

      <Sheet open={Boolean(outcome)}>
        {outcome && (
          <div className="result">
            <h2 className={`result-title result-${outcome.result}`}>{t(`result.${outcome.result}`)}</h2>
            <p className="result-reason">{t(`result.by.${outcome.reason}`)}</p>
            <Bubble mood={outcome.result === 'win' ? 'happy' : 'neutral'} name="Ki Sabda">
              {t(`result.sabda.${outcome.result}`)}
            </Bubble>
            {outcome.ratingDelta !== null && (
              <p className="result-rating num">
                {t('result.rating')}: {playRating} ({outcome.ratingDelta >= 0 ? '+' : ''}
                {outcome.ratingDelta})
              </p>
            )}
            <div className="sheet-actions">
              <button className="btn btn-primary" onClick={() => go(`/ulasan/${outcome.id}`)}>
                {t('result.review')}
              </button>
              <button className="btn btn-ghost" onClick={again}>
                {t('result.again')}
              </button>
              <button className="btn btn-ghost" onClick={() => go('/tanding')}>
                {t('common.done')}
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
