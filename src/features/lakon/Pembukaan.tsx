import { Check } from '@phosphor-icons/react';
import { useLocation } from 'wouter';
import { TopBar } from '../../components/ui';
import { OPENINGS } from '../../content/lessons';
import { OPENING_GROUPS, OPENING_INFO } from '../../content/openings';
import { useL, useT } from '../../i18n';
import { useStore } from '../../state/store';

/** The opening library: openings grouped by colour and by the opponent's first move. */
export function Pembukaan() {
  const t = useT();
  const l = useL();
  const [, go] = useLocation();
  const done = useStore((s) => s.lessons);

  return (
    <div className="screen">
      <TopBar back="/lakon" title={<h1>{t('pembukaan.title')}</h1>} />
      <p className="lede">{t('pembukaan.lede')}</p>
      {OPENING_GROUPS.map((group) => (
        <section key={group.title.id} className="opening-group">
          <h2>{l(group.title)}</h2>
          <div className="opening-list">
            {group.ids.map((id) => {
              const lesson = OPENINGS.find((o) => o.id === id)!;
              const info = OPENING_INFO[id];
              return (
                <button key={id} className={`opening-card${done[id] ? ' opening-done' : ''}`} onClick={() => go(`/lakon/${id}`)}>
                  <span className="opening-top">
                    <span className="opening-title">{l(lesson.title)}</span>
                    {done[id] && <Check size={16} weight="bold" />}
                  </span>
                  <span className="opening-blurb">{l(lesson.blurb)}</span>
                  {info && (
                    <span className="opening-tags">
                      <span className={`opening-side opening-side-${info.side}`}>{t(info.side === 'w' ? 'pembukaan.white' : 'pembukaan.black')}</span>
                      <span className="opening-style">{l(info.style)}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
