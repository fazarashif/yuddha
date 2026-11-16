import { BookOpenText, Check, Eye, Fire, PuzzlePiece, Scroll, Sword } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { Bubble, Meter } from '../../components/ui';
import { rankFor } from '../../content/characters';
import { nextLesson } from '../../content/lessons';
import { useL, useT } from '../../i18n';
import type { Key } from '../../i18n/strings';
import { dayNumber, dueLuka, useDaily, useStore, useStreak } from '../../state/store';
import type { DailyStep } from '../../state/store';

const SABDA_LINES: Key[] = ['laku.line1', 'laku.line2', 'laku.line3', 'laku.line4', 'laku.line5'];

/** Home: the daily practice in four short steps. */
export function Laku() {
  const t = useT();
  const l = useL();
  const [, go] = useLocation();
  const xp = useStore((s) => s.xp);
  const lessons = useStore((s) => s.lessons);
  const startChapter = useStore((s) => s.startChapter);
  const luka = useStore((s) => s.luka);
  const done = useDaily();
  const streak = useStreak();
  const { rank, next } = rankFor(xp);
  const lesson = nextLesson(lessons, startChapter);
  const due = dueLuka(luka).length;

  const steps: { key: DailyStep; icon: ReactNode; title: string; sub: string; to: string; skip?: boolean }[] = [
    { key: 'warmup', icon: <Eye size={24} />, title: t('laku.warmup'), sub: t('laku.warmupSub'), to: '/latihan' },
    {
      key: 'lakon',
      icon: <BookOpenText size={24} />,
      title: t('laku.lakon'),
      sub: lesson ? l(lesson.title) : t('laku.lakonNone'),
      to: lesson ? `/lakon/${lesson.id}` : '/lakon',
    },
    { key: 'puzzle', icon: <PuzzlePiece size={24} />, title: t('laku.puzzle'), sub: t('laku.puzzleSub'), to: '/puzzle' },
    {
      key: 'luka',
      icon: <Scroll size={24} />,
      title: t('laku.luka'),
      sub: due > 0 ? t('laku.lukaDue', { n: due }) : t('laku.lukaNone'),
      to: '/luka',
      skip: due === 0,
    },
    { key: 'tanding', icon: <Sword size={24} />, title: t('laku.tanding'), sub: t('laku.tandingSub'), to: '/tanding' },
  ];
  const total = steps.filter((s) => !s.skip).length;
  const finished = steps.filter((s) => !s.skip && done[s.key]).length;
  const firstOpen = steps.find((s) => !s.skip && !done[s.key]);

  return (
    <div className="screen laku">
      <header className="laku-head">
        <div>
          <p className="laku-rank">{l(rank.name)}</p>
          <h1>{t('laku.title')}</h1>
        </div>
        <div className={`streak${streak.doneToday ? ' streak-lit' : ''}`} aria-label={t('laku.streakLabel', { n: streak.count })}>
          <Fire size={26} weight={streak.doneToday ? 'fill' : 'regular'} />
          <span className="num">{streak.count}</span>
        </div>
      </header>

      <Bubble name="Ki Sabda" mood={finished === total ? 'happy' : 'neutral'}>
        {finished === total ? t('laku.allDone') : t(SABDA_LINES[dayNumber() % SABDA_LINES.length])}
      </Bubble>

      <section className="daily">
        <div className="daily-head">
          <h2>{t('laku.today')}</h2>
          <span className="dim num">
            {finished}/{total}
          </span>
        </div>
        <ol className="steps">
          {steps.map((s) => {
            const isDone = done[s.key];
            const isNext = firstOpen?.key === s.key;
            return (
              <li key={s.key}>
                <button className={`step${isDone ? ' step-done' : ''}${isNext ? ' step-next' : ''}${s.skip ? ' step-skip' : ''}`} onClick={() => go(s.to)}>
                  <span className="step-icon">{isDone ? <Check size={22} weight="bold" /> : s.icon}</span>
                  <span className="step-text">
                    <span className="step-title">{s.title}</span>
                    <span className="step-sub">{s.sub}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="rank-card">
        <div className="rank-row">
          <span>{l(rank.name)}</span>
          <span className="dim num">{next ? `${xp} / ${next.xp}` : xp}</span>
        </div>
        <Meter value={next ? xp - rank.xp : 1} max={next ? next.xp - rank.xp : 1} />
        {next && <p className="dim small">{t('laku.nextRank', { name: l(next.name) })}</p>}
      </section>
    </div>
  );
}
