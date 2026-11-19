import { Chess } from 'chess.js';
import { useEffect, useRef, useState } from 'react';
import { play } from '../../audio/sound';
import { getEngine } from '../../chess/engine';
import { kingSquare, legalDests, parseUci } from '../../chess/vision';
import { NyalaIcon } from '../../components/Avatar';
import { Board } from '../../components/Board';
import { Bubble } from '../../components/ui';
import type { Scene } from '../../content/lessons';
import type { L } from '../../content/types';
import { useL, useT } from '../../i18n';
import type { PieceType } from '../../pieces/PieceArt';
import { useStore } from '../../state/store';
import { freshMove, judgeOwnMove, judgeReply, startOf } from './practice';

type PlaySceneData = Extract<Scene, { kind: 'play' }>;

type Status = 'you' | 'wait' | 'won' | 'failed';

/** The defender's reply: the engine's choice, or any legal move if the engine is unavailable. */
async function reply(fen: string): Promise<string | null> {
  try {
    const lines = await getEngine().analyse(fen, { depth: 8, multipv: 1 });
    if (lines[0]) return lines[0].move;
  } catch {
    // Fall through to a plain legal move so the exercise still works offline.
  }
  const moves = new Chess(fen).moves({ verbose: true });
  if (moves.length === 0) return null;
  const m = moves[Math.floor(Math.random() * moves.length)];
  return `${m.from}${m.to}${m.promotion ?? ''}`;
}

/** A lesson exercise that is played out, move by move, until checkmate or a safe promotion. */
export function PlayScene({ scene, onSolved, onMistake }: { scene: PlaySceneData; onSolved: () => void; onMistake: () => void }) {
  const t = useT();
  const l = useL();
  const pieceSet = useStore((s) => s.settings.pieceSet);
  const chess = useRef(new Chess(scene.fen));
  const gen = useRef(0);
  const [fen, setFen] = useState(scene.fen);
  const [lastMove, setLastMove] = useState<[string, string] | null>(null);
  const [status, setStatus] = useState<Status>('you');
  const [made, setMade] = useState(0);
  const [failText, setFailText] = useState<L | null>(null);
  const [hint, setHint] = useState<{ from: string; to: string } | null>(null);
  const side = useRef(chess.current.turn()).current;
  const start = useRef(startOf(scene.fen)).current;
  const goal = scene.goal ?? 'mate';

  useEffect(
    () => () => {
      gen.current += 1;
    },
    [],
  );

  const show = () => {
    const c = chess.current;
    setFen(c.fen());
    const h = c.history({ verbose: true });
    const last = h[h.length - 1];
    setLastMove(last ? [last.from, last.to] : null);
  };

  const win = () => {
    play('win');
    setStatus('won');
  };

  const fail = (text: L) => {
    play('bad');
    onMistake();
    setFailText(text);
    setStatus('failed');
  };

  const restart = () => {
    gen.current += 1;
    chess.current = new Chess(scene.fen);
    setMade(0);
    setFailText(null);
    setHint(null);
    setStatus('you');
    show();
  };

  const onMove = async (from: string, to: string, promotion?: PieceType) => {
    if (status !== 'you') return;
    const c = chess.current;
    const my = gen.current;
    let m;
    try {
      m = c.move({ from, to, promotion });
    } catch {
      return;
    }
    setHint(null);
    show();
    const count = made + 1;
    setMade(count);
    const own = judgeOwnMove(c, goal, side);
    if (own === 'won') return win();
    play(c.inCheck() ? 'check' : m.captured ? 'capture' : 'move');
    if (own === 'stalemate') return fail(scene.stalemate);
    if (own === 'lost') return fail(scene.lost);
    if (own === 'repeated') return fail(scene.tooLong);
    // A promotion on the last allowed move still gets its chance to survive the answer.
    if (count >= scene.maxMoves && !(goal === 'promote' && m.promotion)) return fail(scene.tooLong);

    setStatus('wait');
    const answer = await reply(c.fen());
    await new Promise((r) => setTimeout(r, 350));
    if (my !== gen.current || !answer) return;
    const r = c.move(parseUci(answer));
    show();
    play(r.captured ? 'capture' : 'move');
    const after = judgeReply(c, goal, side, start);
    if (after === 'won') return win();
    if (after === 'lost') return fail(scene.lost);
    if (after === 'repeated') return fail(scene.tooLong);
    if (count >= scene.maxMoves) return fail(scene.tooLong);
    setStatus('you');
  };

  const askHint = async () => {
    if (status !== 'you') return;
    const my = gen.current;
    try {
      const lines = await getEngine().analyse(chess.current.fen(), { depth: goal === 'promote' ? 16 : 12, multipv: 3 });
      const best = freshMove(chess.current, lines);
      if (my !== gen.current || !best) return;
      const { from, to } = parseUci(best);
      play('hint');
      setHint({ from, to });
    } catch {
      // No engine, no hint; the exercise itself still works.
    }
  };

  const c = chess.current;
  const check = c.inCheck() ? kingSquare(c, c.turn()) : null;
  const left = Math.max(0, scene.maxMoves - made);

  return (
    <>
      <div className="lesson-stage">
        <Board
          fen={fen}
          orientation={scene.orient ?? side}
          dests={status === 'you' ? legalDests(c) : undefined}
          onMove={onMove}
          lastMove={lastMove}
          check={check}
          hint={hint}
          pieceSet={pieceSet}
        />
      </div>
      <div className="lesson-talk">
        <Bubble name="Ki Sabda" mood={status === 'won' ? 'happy' : status === 'failed' ? 'surprised' : 'neutral'} tone={status === 'won' ? 'good' : status === 'failed' ? 'bad' : undefined}>
          {status === 'won' ? l(scene.right) : failText ? l(failText) : l(scene.text)}
        </Bubble>
        {(status === 'you' || status === 'wait') && <p className="note num">{t('lesson.movesLeft', { n: left })}</p>}
        <div className="lesson-actions">
          {(status === 'you' || status === 'wait') && (
            <button className="btn btn-ghost" onClick={askHint} disabled={status !== 'you'}>
              <NyalaIcon size={22} /> {t('game.hint')}
            </button>
          )}
          {status === 'failed' && (
            <button className="btn btn-primary" onClick={restart}>
              {t('lesson.restart')}
            </button>
          )}
          {status === 'won' && (
            <button className="btn btn-primary" onClick={onSolved}>
              {t('common.next')}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
