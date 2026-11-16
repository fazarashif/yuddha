import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { play } from '../../audio/sound';
import { Board } from '../../components/Board';
import type { Mark } from '../../components/Board';
import { Bubble, Meter, TopBar } from '../../components/ui';
import { useT } from '../../i18n';
import { useStore } from '../../state/store';
import { makeVisionPosition } from './positions';

const ROUND_SECONDS = 60;
type Phase = 'intro' | 'run' | 'end';

/** Board-vision warm-up: tap every enemy piece that can be taken for free. */
export function Latihan() {
  const t = useT();
  const [, go] = useLocation();
  const pieceSet = useStore((s) => s.settings.pieceSet);
  const best = useStore((s) => s.visionBest);
  const setVisionBest = useStore((s) => s.setVisionBest);
  const markDaily = useStore((s) => s.markDaily);
  const [phase, setPhase] = useState<Phase>('intro');
  const [pos, setPos] = useState(() => makeVisionPosition());
  const [found, setFound] = useState<string[]>([]);
  const [miss, setMiss] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [slips, setSlips] = useState(0);
  const [left, setLeft] = useState(ROUND_SECONDS);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (phase !== 'run') return;
    const end = Date.now() + ROUND_SECONDS * 1000;
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) {
        clearInterval(timer);
        setVisionBest(scoreRef.current);
        markDaily('warmup');
        play('win');
        setPhase('end');
      }
    }, 250);
    return () => clearInterval(timer);
  }, [phase, markDaily, setVisionBest]);

  const start = () => {
    scoreRef.current = 0;
    setScore(0);
    setSlips(0);
    setFound([]);
    setMiss(null);
    setLeft(ROUND_SECONDS);
    setPos(makeVisionPosition());
    setPhase('run');
  };

  const onTap = (sq: string) => {
    if (phase !== 'run' || !pos) return;
    if (!pos.answers.includes(sq)) {
      play('bad');
      setMiss(sq);
      setSlips((n) => n + 1);
      return;
    }
    if (found.includes(sq)) return;
    const next = [...found, sq];
    setMiss(null);
    if (next.length < pos.answers.length) {
      play('tap');
      setFound(next);
      return;
    }
    play('good');
    scoreRef.current += 1;
    setScore(scoreRef.current);
    setFound(next);
    setTimeout(() => {
      setFound([]);
      setPos(makeVisionPosition());
    }, 350);
  };

  const marks: Record<string, Mark> = {};
  for (const sq of found) marks[sq] = 'good';
  if (miss) marks[miss] = 'bad';

  return (
    <div className="screen">
      <TopBar back="/" title={<h2>{t('vision.title')}</h2>} right={phase === 'run' ? <span className="num timer">{left}s</span> : null} />
      {phase === 'run' && <Meter value={left} max={ROUND_SECONDS} tone="sukma" />}

      {phase === 'intro' && (
        <>
          <Bubble name="Ki Sabda">{t('vision.intro')}</Bubble>
          <p className="note num">{t('vision.best', { n: best })}</p>
          <div className="sheet-actions">
            <button className="btn btn-primary" onClick={start}>
              {t('vision.start')}
            </button>
          </div>
        </>
      )}

      {phase === 'run' && pos && (
        <>
          <p className="vision-ask">
            {t(pos.side === 'w' ? 'vision.askBlack' : 'vision.askWhite')}
            {pos.answers.length > 1 ? ` ${t('vision.count', { n: pos.answers.length })}` : ''}
          </p>
          <div className="find-board">
            <Board fen={pos.fen} orientation={pos.side} onSquareTap={onTap} marks={marks} pieceSet={pieceSet} />
          </div>
          <p className="vision-score num">{t('vision.score', { n: score })}</p>
        </>
      )}

      {phase === 'end' && (
        <>
          <Bubble name="Ki Sabda" mood="happy">
            {t('vision.end', { n: score, slips })}
          </Bubble>
          <p className="note num">{t('vision.best', { n: Math.max(best, score) })}</p>
          <div className="sheet-actions">
            <button className="btn btn-primary" onClick={start}>
              {t('result.again')}
            </button>
            <button className="btn btn-ghost" onClick={() => go('/')}>
              {t('common.done')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
