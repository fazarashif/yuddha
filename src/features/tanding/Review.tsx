import { BookOpen, CaretLeft, CaretRight, WarningDiamond } from '@phosphor-icons/react';
import { Chess } from 'chess.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { getEngine } from '../../chess/engine';
import { nameOpening } from '../../chess/openingNames';
import { winPercent } from '../../chess/eval';
import type { MoveClass } from '../../chess/eval';
import { reviewGame } from '../../chess/review';
import type { Review as ReviewData, ReviewedMove } from '../../chess/review';
import { parseUci } from '../../chess/vision';
import { Board } from '../../components/Board';
import { Bubble, Meter, TopBar } from '../../components/ui';
import { checkBook } from '../../content/book';
import type { BookCheck } from '../../content/book';
import { botById } from '../../content/characters';
import { useT } from '../../i18n';
import type { T } from '../../i18n';
import { useStore } from '../../state/store';
import { FindBetter } from '../shared/FindBetter';
import { motifText } from './motif';

const cache = new Map<string, ReviewData>();
const BAD: MoveClass[] = ['inaccuracy', 'mistake', 'blunder'];
const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/** "5.Nc3" or "4...Nf6" for the move at this ply. */
const moveLabel = (ply: number, san: string) => `${Math.ceil(ply / 2)}${ply % 2 === 1 ? '.' : '...'}${san}`;

/** The opening card: the opening's name and where the game left the player's book. */
function OpeningPanel({ t, name, book, moves, onSee, onTrain }: { t: T; name: string | null; book: BookCheck | null; moves: ReviewedMove[]; onSee: (ply: number) => void; onTrain: (id: string) => void }) {
  const left = book?.left;
  const leftMove = left ? moves[left.ply - 1] : undefined;
  return (
    <section className="panel book-panel">
      <h3>
        <BookOpen size={18} weight="duotone" /> {t('review.opening')}: {name ?? '-'}
      </h3>
      {!book ? (
        <p className="dim">{t('review.book.unknown')}</p>
      ) : !left ? (
        <p>{t('review.book.end', { n: Math.ceil(book.followed / 2) })}</p>
      ) : left.by === 'me' ? (
        <p>
          {t('review.book.me', { n: Math.ceil(left.ply / 2), played: moveLabel(left.ply, left.played), book: left.book.join(' / ') })}{' '}
          {leftMove && BAD.includes(leftMove.cls) ? t('review.book.meBad') : t('review.book.meFine')}
        </p>
      ) : (
        <p>{t('review.book.them', { n: Math.ceil(left.ply / 2), played: moveLabel(left.ply, left.played) })}</p>
      )}
      {book && (
        <div className="book-actions">
          {left && (
            <button className="btn btn-ghost" onClick={() => onSee(left.ply)}>
              {t('review.book.see')}
            </button>
          )}
          <button className="btn btn-ghost" onClick={() => onTrain(book.lessonId)}>
            {t('review.book.train')}
          </button>
        </div>
      )}
    </section>
  );
}

function EvalGraph({ moves, at, onPick }: { moves: ReviewedMove[]; at: number; onPick: (i: number) => void }) {
  const n = moves.length;
  if (n < 2) return null;
  // Winning chances from White's side after each move.
  const ys = moves.map((m) => 100 - winPercent(m.color === 'w' ? m.playedCp : -m.playedCp));
  const x = (i: number) => (i / (n - 1)) * 100;
  const line = ys.map((y, i) => `${x(i).toFixed(2)},${(y * 0.4).toFixed(2)}`).join(' ');
  return (
    <svg
      className="evalgraph"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        onPick(Math.round(((e.clientX - r.left) / r.width) * (n - 1)) + 1);
      }}
    >
      <polygon points={`0,40 ${line} 100,40`} className="evalgraph-fill" />
      <line x1={0} x2={100} y1={20} y2={20} className="evalgraph-mid" />
      <polyline points={line} className="evalgraph-line" vectorEffect="non-scaling-stroke" />
      {at > 0 && <line x1={x(at - 1)} x2={x(at - 1)} y1={0} y2={40} className="evalgraph-cursor" vectorEffect="non-scaling-stroke" />}
    </svg>
  );
}

export function Review({ gameId }: { gameId: string }) {
  const t = useT();
  const [, go] = useLocation();
  const game = useStore((s) => s.games.find((g) => g.id === gameId));
  const pieceSet = useStore((s) => s.settings.pieceSet);
  const attachReview = useStore((s) => s.attachReview);
  const addLuka = useStore((s) => s.addLuka);
  const [review, setReview] = useState<ReviewData | null>(cache.get(gameId) ?? null);
  const [progress, setProgress] = useState({ done: 0, total: 1 });
  const [failed, setFailed] = useState(false);
  const [at, setAt] = useState(0);
  const [retry, setRetry] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!game || review) return;
    let cancelled = false;
    reviewGame(getEngine(), game.pgn, 10, (done, total) => !cancelled && setProgress({ done, total }), () => cancelled)
      .then((r) => {
        if (cancelled || !r) return;
        cache.set(gameId, r);
        setReview(r);
        const mine = r.moves.filter((m) => m.color === game.color);
        attachReview(gameId, {
          accuracy: Math.round(r.accuracy[game.color]),
          blunders: r.counts[game.color].blunder,
          mistakes: r.counts[game.color].mistake,
        });
        // Serious slips go into the Kitab Luka for spaced repetition.
        const cards = mine
          .filter((m) => m.cls === 'blunder' || m.cls === 'mistake')
          .slice(0, 6)
          .map((m) => ({ id: `${gameId}-${m.ply}`, fen: m.fenBefore, best: m.best, played: m.uci, motif: m.motif }));
        // Leaving the book with a move the engine also calls inaccurate is worth repeating too; the book move is the answer.
        const book = checkBook(r.moves.map((m) => m.san), game.color, useStore.getState().repertoire);
        const off = book?.left?.by === 'me' ? r.moves[book.left.ply - 1] : undefined;
        if (book?.left && off && off.cls === 'inaccuracy') {
          const answer = new Chess(off.fenBefore).move(book.left.book[0]);
          cards.push({ id: `${gameId}-${off.ply}`, fen: off.fenBefore, best: `${answer.from}${answer.to}${answer.promotion ?? ''}`, played: off.uci, motif: { kind: 'book' } });
        }
        addLuka(cards);
        const first = r.moves.find((m) => m.color === game.color && BAD.includes(m.cls));
        setAt(first ? first.ply : r.moves.length);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [game, gameId, review, attachReview, addLuka]);

  useEffect(() => {
    listRef.current?.querySelector('.mv-on')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [at]);

  const imported = game?.source === 'chesscom';
  const opponentName = game ? (game.opponent?.name ?? botById(game.botId)?.name) : undefined;
  const backTo = imported ? '/cermin' : '/tanding';
  const move = review && at > 0 ? review.moves[at - 1] : null;
  const myBad = useMemo(() => (review && game ? review.moves.filter((m) => m.color === game.color && BAD.includes(m.cls)) : []), [review, game]);
  const repertoire = useStore((s) => s.repertoire);
  const opening = useMemo(() => {
    if (!review || !game) return null;
    const sans = review.moves.map((m) => m.san);
    return { name: nameOpening(sans), book: checkBook(sans, game.color, repertoire) };
  }, [review, game, repertoire]);

  if (!game) {
    return (
      <div className="screen">
        <TopBar back="/cermin" title={<h2>{t('review.title')}</h2>} />
        <p className="note">{t('review.missing')}</p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="screen">
        <TopBar back={backTo} title={<h2>{t('review.title')}</h2>} right={<span className="dim">{opponentName}</span>} />
        <Bubble name="Ki Sabda">{failed ? t('game.engineError') : t('review.working')}</Bubble>
        {!failed && <Meter value={progress.done} max={progress.total} tone="sukma" />}
      </div>
    );
  }

  const mine = review.counts[game.color];
  const nextBad = myBad.find((m) => m.ply > at) ?? myBad[0];
  const isMine = move?.color === game.color;
  const showRetry = Boolean(move && isMine && BAD.includes(move.cls));

  return (
    <div className="screen review">
      <TopBar back={backTo} title={<h2>{t('review.title')}</h2>} right={<span className="dim">{opponentName}</span>} />

      <div className="stats-row">
        <div className="stat">
          <span className="stat-n num">{Math.round(review.accuracy[game.color])}</span>
          <span className="stat-l">{t('review.accuracy')}</span>
        </div>
        <div className="stat">
          <span className="stat-n num cls-blunder">{mine.blunder}</span>
          <span className="stat-l">{t('cls.blunder')}</span>
        </div>
        <div className="stat">
          <span className="stat-n num cls-mistake">{mine.mistake}</span>
          <span className="stat-l">{t('cls.mistake')}</span>
        </div>
        <div className="stat">
          <span className="stat-n num cls-inaccuracy">{mine.inaccuracy}</span>
          <span className="stat-l">{t('cls.inaccuracy')}</span>
        </div>
      </div>

      {retry && move ? (
        <FindBetter
          key={move.ply}
          fen={move.fenBefore}
          best={move.best}
          played={move.uci}
          footer={() => (
            <button className="btn btn-primary" onClick={() => setRetry(false)}>
              {t('review.backToGame')}
            </button>
          )}
        />
      ) : (
        <>
          <div className="review-board">
            <Board
              fen={move ? move.fenAfter : START}
              orientation={game.color}
              lastMove={move ? [parseUci(move.uci).from, parseUci(move.uci).to] : null}
              pieceSet={pieceSet}
            />
          </div>
          <EvalGraph moves={review.moves} at={at} onPick={setAt} />

          <div className="mv-list" ref={listRef}>
            {review.moves.map((m) => (
              <button key={m.ply} className={`mv cls-${m.cls}${m.ply === at ? ' mv-on' : ''}${m.color === game.color ? ' mv-mine' : ''}`} onClick={() => setAt(m.ply)}>
                {m.color === 'w' && <span className="mv-n num">{Math.ceil(m.ply / 2)}.</span>}
                {m.san}
              </button>
            ))}
          </div>

          <div className="review-nav">
            <button className="btn btn-ghost btn-icon" onClick={() => setAt((i) => Math.max(0, i - 1))} disabled={at === 0} aria-label={t('review.prev')}>
              <CaretLeft size={22} />
            </button>
            <button className="btn btn-ghost" onClick={() => nextBad && setAt(nextBad.ply)} disabled={!nextBad}>
              <WarningDiamond size={20} /> {t('review.nextBad')}
            </button>
            <button className="btn btn-ghost btn-icon" onClick={() => setAt((i) => Math.min(review.moves.length, i + 1))} disabled={at === review.moves.length} aria-label={t('review.next')}>
              <CaretRight size={22} />
            </button>
          </div>

          {move ? (
            <Bubble name="Ki Sabda" mood={move.cls === 'best' ? 'happy' : move.cls === 'blunder' ? 'surprised' : 'neutral'} tone={BAD.includes(move.cls) ? 'bad' : undefined}>
              <strong className={`cls-${move.cls}`}>
                {move.san}: {t(`cls.${move.cls}`)}.
              </strong>{' '}
              {BAD.includes(move.cls) ? motifText(t, move.motif, move.bestSan) : isMine ? t('review.fine') : t('review.theirs')}
            </Bubble>
          ) : (
            <Bubble name="Ki Sabda">{myBad.length ? t('review.intro', { n: myBad.length }) : t('review.clean')}</Bubble>
          )}

          <div className="sheet-actions">
            {showRetry && (
              <button className="btn btn-primary" onClick={() => setRetry(true)}>
                {t('review.retry')}
              </button>
            )}
            <button className="btn btn-ghost" onClick={() => go('/luka')}>
              {t('review.toLuka')}
            </button>
          </div>

          {opening && <OpeningPanel t={t} name={opening.name} book={opening.book} moves={review.moves} onSee={setAt} onTrain={(id) => go(`/lakon/${id}`)} />}
        </>
      )}
    </div>
  );
}
