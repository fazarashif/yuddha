import { Check, Lock } from '@phosphor-icons/react';
import { useLocation } from 'wouter';
import { TopBar } from '../../components/ui';
import { CHAPTERS } from '../../content/lessons';
import { useL, useT } from '../../i18n';
import { useStore } from '../../state/store';

/** The campaign map: every chapter is open, lessons inside a chapter unlock in order. */
export function Lakon() {
  const t = useT();
  const l = useL();
  const [, go] = useLocation();
  const done = useStore((s) => s.lessons);
  const startChapter = useStore((s) => s.startChapter);

  return (
    <div className="screen">
      <TopBar title={<h1>{t('nav.lakon')}</h1>} />
      <p className="lede">{t('lakon.lede')}</p>
      {CHAPTERS.map((ch) => (
        <section key={ch.n} className={`chapter${ch.n === startChapter ? ' chapter-here' : ''}`}>
          <header className="chapter-head">
            <span className="chapter-n num">{ch.n}</span>
            <div>
              <h2>{l(ch.title)}</h2>
              <p className="dim">{l(ch.range)}{ch.n === startChapter ? ` · ${t('lakon.yourStart')}` : ''}</p>
            </div>
          </header>
          <ol className="path">
            {ch.lessons.map((lesson, i) => {
              const isDone = Boolean(done[lesson.id]);
              const open = i === 0 || Boolean(done[ch.lessons[i - 1].id]) || isDone;
              return (
                <li key={lesson.id} className={`node${isDone ? ' node-done' : open ? ' node-open' : ' node-locked'}`}>
                  <button disabled={!open} onClick={() => go(`/lakon/${lesson.id}`)}>
                    <span className="node-dot">{isDone ? <Check size={18} weight="bold" /> : open ? <span className="num">{i + 1}</span> : <Lock size={16} />}</span>
                    <span className="node-text">
                      <span className="node-title">{l(lesson.title)}</span>
                      <span className="node-blurb">{l(lesson.blurb)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
            {ch.upcoming.map((title) => (
              <li key={title.id} className="node node-soon">
                <div>
                  <span className="node-dot" />
                  <span className="node-text">
                    <span className="node-title">{l(title)}</span>
                    <span className="node-blurb">{t('lakon.soon')}</span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
