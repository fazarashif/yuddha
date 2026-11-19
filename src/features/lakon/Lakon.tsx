import { BookOpen, CaretRight, Check, Lightning } from '@phosphor-icons/react';
import { useLocation } from 'wouter';
import { TopBar } from '../../components/ui';
import { CHAPTERS, KIAT, nextLesson } from '../../content/lessons';
import { useL, useT } from '../../i18n';
import { useStore } from '../../state/store';

/** The campaign map. Every lesson is open; the suggested one is simply the next unfinished in order. */
export function Lakon() {
  const t = useT();
  const l = useL();
  const [, go] = useLocation();
  const done = useStore((s) => s.lessons);
  const startChapter = useStore((s) => s.startChapter);
  const suggested = nextLesson(done, startChapter)?.id;

  return (
    <div className="screen">
      <TopBar title={<h1>{t('nav.lakon')}</h1>} />
      <p className="lede">{t('lakon.lede')}</p>

      <button className="library-card" onClick={() => go('/pembukaan')}>
        <BookOpen size={28} weight="duotone" />
        <span className="library-text">
          <span className="library-title">{t('lakon.openings')}</span>
          <span className="library-sub">{t('lakon.openingsSub')}</span>
        </span>
        <CaretRight size={18} />
      </button>

      <section className="kiat">
        <header className="kiat-head">
          <Lightning size={20} weight="fill" />
          <div>
            <h2>{t('lakon.kiat')}</h2>
            <p className="dim">{t('lakon.kiatLede')}</p>
          </div>
        </header>
        <div className="kiat-grid">
          {KIAT.map((tip) => (
            <button key={tip.id} className={`kiat-card${done[tip.id] ? ' kiat-done' : ''}`} onClick={() => go(`/lakon/${tip.id}`)}>
              <span className="kiat-title">
                {l(tip.title)}
                {done[tip.id] && <Check size={14} weight="bold" />}
              </span>
              <span className="kiat-blurb">{l(tip.blurb)}</span>
            </button>
          ))}
        </div>
      </section>

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
              const isNext = lesson.id === suggested;
              return (
                <li key={lesson.id} className={`node${isDone ? ' node-done' : isNext ? ' node-open' : ' node-free'}`}>
                  <button onClick={() => go(`/lakon/${lesson.id}`)}>
                    <span className="node-dot">{isDone ? <Check size={18} weight="bold" /> : <span className="num">{i + 1}</span>}</span>
                    <span className="node-text">
                      <span className="node-title">
                        {l(lesson.title)}
                        {isNext && <span className="node-tag">{t('lakon.next')}</span>}
                      </span>
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
