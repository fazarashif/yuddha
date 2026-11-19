import { Chess } from 'chess.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { play } from '../../audio/sound';
import { kingSquare, legalDests } from '../../chess/vision';
import { NyalaIcon } from '../../components/Avatar';
import { Board } from '../../components/Board';
import { Bubble } from '../../components/ui';
import type { Scene } from '../../content/lessons';
import { useL, useT } from '../../i18n';
import type { PieceType } from '../../pieces/PieceArt';
import { useStore } from '../../state/store';
import { bookMoves, isFinished, pickReply } from './drill';

type DrillData = Extract<Scene, { kind: 'drill' }>;
type Status = 'you' | 'wait' | 'done';

/** Opening drill: play the book from memory while the other side picks one of the lines at random. */
export function DrillScene({ scene, onSolved, onMistake }: { scene: DrillData; onSolved: () => void; onMistake: () => void }) {
  const t = useT();
  const l = useL();
  const pieceSet = useStore((s) => s.settings.pieceSet);
  const lines = useMemo(() => scene.lines.map((x) => x.split(/\s+/)), [scene.lines]);
  const chess = useRef(new Chess());
  const gen = useRef(0);
  const [fen, setFen] = useState(chess.current.fen());
  const [lastMove, setLastMove] = useState<[string, string] | null>(null);
  const [status, setStatus] = useState<Status>('you');
  const [wrong, setWrong] = useState<string | null>(null);
  const [hint, setHint] = useState<{ from: string; to: string } | null>(null);
  const [slips, setSlips] = useState(0);
  const [runs, setRuns] = useState(0);

  const history = () => chess.current.history();
  const show = () => {
    const c = chess.current;
    setFen(c.fen());
    const h = c.history({ verbose: true });
    const last = h[h.length - 1];
    setLastMove(last ? [last.from, last.to] : null);
  };

  /** Lets the other side move whenever it is their turn, then hands the board back. */
  const advance = () => {
    const c = chess.current;
    if (isFinished(lines, history())) {
      play('win');
      setStatus('done');
      return;
    }
    if (c.turn() === scene.side) {
      setStatus('you');
      return;
    }
    setStatus('wait');
    const my = gen.current;
    window.setTimeout(() => {
      if (my !== gen.current) return;
      const reply = pickReply(lines, history(), Math.random);
      if (!reply) return;
      const m = c.move(reply);
      play(m.captured ? 'capture' : 'move');
      show();
      advance();
    }, 450);
  };

  useEffect(() => {
    advance();
    return () => {
      gen.current += 1;
    };
    // Runs once per attempt; restart() starts the next one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runs]);

  const restart = () => {
    gen.current += 1;
    chess.current = new Chess();
    setWrong(null);
    setHint(null);
    setSlips(0);
    show();
    setRuns((n) => n + 1);
  };

  const onMove = (from: string, to: string, promotion?: PieceType) => {
    if (status !== 'you') return;
    const probe = new Chess(chess.current.fen());
    let san: string;
    try {
      san = probe.move({ from, to, promotion }).san;
    } catch {
      return;
    }
    const book = bookMoves(lines, history());
    if (!book.includes(san)) {
      play('bad');
      onMistake();
      setSlips((n) => n + 1);
      setWrong(book[0]);
      const answer = new Chess(chess.current.fen()).move(book[0]);
      setHint({ from: answer.from, to: answer.to });
      return;
    }
    const m = chess.current.move(san);
    play(m.captured ? 'capture' : 'move');
    setWrong(null);
    setHint(null);
    show();
    advance();
  };

  const c = chess.current;
  const check = c.inCheck() ? kingSquare(c, c.turn()) : null;
  const moveNo = Math.floor(history().length / 2) + 1;

  return (
    <>
      <div className="lesson-stage">
        <Board
          fen={fen}
          orientation={scene.side}
          dests={status === 'you' ? legalDests(c) : undefined}
          onMove={onMove}
          lastMove={lastMove}
          check={check}
          hint={hint}
          pieceSet={pieceSet}
        />
      </div>
      <div className="lesson-talk">
        <Bubble name="Ki Sabda" mood={status === 'done' ? 'happy' : wrong ? 'surprised' : 'neutral'} tone={status === 'done' ? 'good' : wrong ? 'bad' : undefined}>
          {status === 'done' ? l(scene.right) : wrong ? t('drill.wrong', { san: wrong }) : l(scene.text)}
        </Bubble>
        <p className="note num">
          {status === 'done' ? t('drill.slips', { n: slips }) : t('drill.move', { n: moveNo })}
        </p>
        <div className="lesson-actions">
          {status === 'done' && (
            <>
              <button className="btn btn-ghost" onClick={restart}>
                <NyalaIcon size={22} /> {t('drill.again')}
              </button>
              <button className="btn btn-primary" onClick={onSolved}>
                {t('common.next')}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
