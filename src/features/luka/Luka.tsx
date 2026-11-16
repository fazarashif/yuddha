import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Bubble, Meter, TopBar } from '../../components/ui';
import { useT } from '../../i18n';
import { dueLuka, useStore } from '../../state/store';
import { FindBetter } from '../shared/FindBetter';

/** Spaced repetition over the player's own mistakes. */
export function Luka() {
  const t = useT();
  const [, go] = useLocation();
  const all = useStore((s) => s.luka);
  const gradeLuka = useStore((s) => s.gradeLuka);
  const markDaily = useStore((s) => s.markDaily);
  // The session is fixed at entry so graded cards do not vanish mid-way.
  const session = useMemo(() => dueLuka(all).slice(0, 8), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);

  if (session.length === 0) {
    return (
      <div className="screen">
        <TopBar back="/" title={<h2>{t('luka.title')}</h2>} />
        <Bubble name="Ki Sabda" mood="happy">
          {all.length === 0 ? t('luka.empty') : t('luka.none', { n: all.length })}
        </Bubble>
        <div className="sheet-actions">
          <button className="btn btn-primary" onClick={() => go('/tanding')}>
            {t('luka.play')}
          </button>
        </div>
      </div>
    );
  }

  if (i >= session.length) {
    return (
      <div className="screen">
        <TopBar back="/" title={<h2>{t('luka.title')}</h2>} />
        <Bubble name="Ki Sabda" mood="happy">
          {t('luka.done', { score, n: session.length })}
        </Bubble>
        <div className="sheet-actions">
          <button className="btn btn-primary" onClick={() => go('/')}>
            {t('common.done')}
          </button>
        </div>
      </div>
    );
  }

  const card = session[i];
  return (
    <div className="screen">
      <TopBar back="/" title={<h2>{t('luka.title')}</h2>} right={<span className="dim num">{i + 1}/{session.length}</span>} />
      <Meter value={i} max={session.length} />
      <FindBetter
        key={card.id}
        fen={card.fen}
        best={card.best}
        played={card.played}
        onDone={(firstTry) => {
          gradeLuka(card.id, firstTry);
          if (firstTry) setScore((n) => n + 1);
        }}
        footer={(phase) =>
          (phase === 'right' || phase === 'shown') && (
            <button
              className="btn btn-primary"
              onClick={() => {
                if (i + 1 >= session.length) markDaily('luka');
                setI(i + 1);
              }}
            >
              {t('common.next')}
            </button>
          )
        }
      />
    </div>
  );
}
