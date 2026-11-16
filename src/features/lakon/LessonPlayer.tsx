import { Chess } from 'chess.js';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { play } from '../../audio/sound';
import { legalDests, parseUci } from '../../chess/vision';
import { Avatar, NyalaIcon } from '../../components/Avatar';
import { Board } from '../../components/Board';
import type { Mark } from '../../components/Board';
import { Bubble, Meter, TopBar } from '../../components/ui';
import { KI_SABDA } from '../../content/characters';
import { judgeMove } from '../../content/judge';
import { lessonById, nextLesson } from '../../content/lessons';
import type { Scene } from '../../content/lessons';
import type { L } from '../../content/types';
import { useL, useT } from '../../i18n';
import type { PieceType } from '../../pieces/PieceArt';
import { useStore } from '../../state/store';

type Verdict = { ok: boolean; text: L } | null;

function SceneView({ scene, onSolved, onMistake }: { scene: Scene; onSolved: () => void; onMistake: () => void }) {
  const t = useT();
  const l = useL();
  const pieceSet = useStore((s) => s.settings.pieceSet);
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [fen, setFen] = useState(scene.fen ?? null);
  const [found, setFound] = useState<string[]>([]);
  const [wrongSq, setWrongSq] = useState<string | null>(null);
  const [hinted, setHinted] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const solved = verdict?.ok === true;

  const chess = useMemo(() => (scene.fen ? new Chess(scene.fen) : null), [scene.fen]);
  const orient = scene.orient ?? (chess?.turn() ?? 'w');

  const fail = (text: L) => {
    play('bad');
    onMistake();
    setVerdict({ ok: false, text });
  };
  const pass = (text: L) => {
    play('good');
    setVerdict({ ok: true, text });
  };

  const onMove = (from: string, to: string, promotion?: PieceType) => {
    if (scene.kind !== 'move' || solved) return;
    const uci = `${from}${to}${promotion ?? ''}`;
    if (judgeMove(scene, uci)) {
      const c = new Chess(scene.fen);
      c.move({ from, to, promotion });
      setFen(c.fen());
      pass(scene.right);
    } else {
      fail(scene.punish?.[uci] ?? scene.wrong);
    }
  };

  const onTap = (sq: string) => {
    if (scene.kind !== 'tap' || solved) return;
    if (scene.answers.includes(sq)) {
      const next = found.includes(sq) ? found : [...found, sq];
      setFound(next);
      setWrongSq(null);
      if (next.length === scene.answers.length) pass(scene.right);
      else {
        play('tap');
        setVerdict(null);
      }
    } else {
      setWrongSq(sq);
      fail(scene.wrong);
    }
  };

  const marks: Record<string, Mark> = { ...(scene.marks ?? {}) };
  for (const sq of found) marks[sq] = 'good';
  if (wrongSq && !solved) marks[wrongSq] = 'bad';

  const hintMove = scene.kind === 'move' && scene.hint ? parseUci(scene.hint) : null;
  const hint = hintMove && hinted > 0 && !solved ? (hinted === 1 ? { from: hintMove.from } : hintMove) : null;
  const who = scene.kind === 'say' && scene.who === 'nyala' ? 'nyala' : undefined;
  const mood = solved ? 'happy' : verdict ? 'surprised' : scene.kind === 'say' ? (scene.mood ?? 'neutral') : 'neutral';
  const canContinue = scene.kind === 'say' || solved || (scene.kind === 'quiz' && picked !== null);

  return (
    <>
      <div className="lesson-stage">
        {fen ? (
          <Board
            fen={fen}
            orientation={orient}
            dests={scene.kind === 'move' && !solved && chess ? legalDests(chess) : undefined}
            onMove={onMove}
            onSquareTap={scene.kind === 'tap' ? onTap : undefined}
            marks={marks}
            hint={hint}
            pieceSet={pieceSet}
          />
        ) : (
          <div className="lesson-portrait">{who === 'nyala' ? <NyalaIcon size={180} mood={mood} /> : <Avatar spec={KI_SABDA} size={200} mood={mood} label="Ki Sabda" />}</div>
        )}
      </div>

      <div className="lesson-talk">
        <Bubble who={who} name={who === 'nyala' ? 'Nyala' : 'Ki Sabda'} mood={mood} tone={verdict ? (verdict.ok ? 'good' : 'bad') : undefined}>
          {verdict ? l(verdict.text) : l(scene.text)}
        </Bubble>

        {scene.kind === 'quiz' && (
          <div className="quiz">
            {!verdict && <p className="quiz-q">{l(scene.text)}</p>}
            {scene.options.map((opt, i) => {
              const state = picked === null ? '' : i === scene.correct ? ' quiz-right' : i === picked ? ' quiz-wrong' : ' quiz-dim';
              return (
                <button
                  key={i}
                  className={`quiz-opt${state}`}
                  disabled={picked !== null}
                  onClick={() => {
                    setPicked(i);
                    if (i === scene.correct) pass(scene.explain);
                    else fail(scene.explain);
                  }}
                >
                  {l(opt)}
                </button>
              );
            })}
          </div>
        )}

        {scene.kind === 'tap' && scene.answers.length > 1 && !solved && (
          <p className="note num">{t('lesson.found', { n: found.length, total: scene.answers.length })}</p>
        )}

        <div className="lesson-actions">
          {hintMove && !solved && (
            <button
              className="btn btn-ghost"
              onClick={() => {
                play('hint');
                setHinted((n) => Math.min(2, n + 1));
              }}
            >
              <NyalaIcon size={22} /> {t('game.hint')}
            </button>
          )}
          {canContinue && (
            <button className="btn btn-primary" onClick={onSolved}>
              {t('common.next')}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const t = useT();
  const l = useL();
  const [, go] = useLocation();
  const lesson = lessonById(lessonId);
  const completeLesson = useStore((s) => s.completeLesson);
  const markDaily = useStore((s) => s.markDaily);
  const lessons = useStore((s) => s.lessons);
  const startChapter = useStore((s) => s.startChapter);
  const [i, setI] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const finished = lesson ? i >= lesson.scenes.length : false;

  useEffect(() => {
    if (finished && lesson) {
      completeLesson(lesson.id, mistakes);
      markDaily('lakon');
      play('win');
    }
    // Recorded once, when the last scene is passed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  if (!lesson) return null;

  if (finished) {
    const upNext = nextLesson({ ...lessons, [lesson.id]: true }, startChapter);
    return (
      <div className="screen lesson-end">
        <Avatar spec={KI_SABDA} size={150} mood="happy" label="Ki Sabda" />
        <h1>{t('lesson.doneTitle')}</h1>
        <p className="lede">{l(lesson.title)}</p>
        <p className="dim">{mistakes === 0 ? t('lesson.flawless') : t('lesson.mistakes', { n: mistakes })}</p>
        <div className="sheet-actions">
          {upNext && (
            <button className="btn btn-primary" onClick={() => go(`/lakon/${upNext.id}`)}>
              {t('lesson.nextLesson')}
            </button>
          )}
          <button className={upNext ? 'btn btn-ghost' : 'btn btn-primary'} onClick={() => go('/lakon')}>
            {t('lesson.backToMap')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson">
      <TopBar close={() => go('/lakon')} title={<Meter value={i} max={lesson.scenes.length} />} />
      <SceneView key={`${lesson.id}-${i}`} scene={lesson.scenes[i]} onSolved={() => setI(i + 1)} onMistake={() => setMistakes((n) => n + 1)} />
    </div>
  );
}
