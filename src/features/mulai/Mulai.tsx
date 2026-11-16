import { useState } from 'react';
import { Avatar } from '../../components/Avatar';
import { KI_SABDA } from '../../content/characters';
import { useT } from '../../i18n';
import type { Key } from '../../i18n/strings';
import { useStore } from '../../state/store';
import { withSync } from '../../sync/state';

const LEVELS: { level: number; title: Key; sub: Key }[] = [
  { level: 0, title: 'level.zero', sub: 'level.zero.sub' },
  { level: 500, title: 'level.rules', sub: 'level.rules.sub' },
  { level: 800, title: 'level.800', sub: 'level.800.sub' },
  { level: 1100, title: 'level.1100', sub: 'level.1100.sub' },
  { level: 1400, title: 'level.1400', sub: 'level.1400.sub' },
];

/** First run: language, then where to start. */
export function Mulai() {
  const t = useT();
  const lang = useStore((s) => s.settings.lang);
  const setSettings = useStore((s) => s.setSettings);
  const finish = useStore((s) => s.finishOnboarding);
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState(800);

  return (
    <div className="screen mulai">
      <div className="mulai-hero">
        <Avatar spec={KI_SABDA} size={132} mood="happy" label="Ki Sabda" />
        <p className="wordmark">Yuddha</p>
      </div>
      {step === 0 ? (
        <>
          <h1>{t('mulai.title')}</h1>
          <p className="lede">{t('mulai.lede')}</p>
          <div className="seg mulai-lang">
            <button className={lang === 'id' ? 'seg-on' : ''} onClick={() => setSettings({ lang: 'id' })}>
              Indonesia
            </button>
            <button className={lang === 'en' ? 'seg-on' : ''} onClick={() => setSettings({ lang: 'en' })}>
              English
            </button>
          </div>
          <button className="btn btn-primary btn-wide" onClick={() => setStep(1)}>
            {t('mulai.begin')}
          </button>
          <button className="btn btn-text" onClick={() => void withSync((m) => m.signInWithGoogle())}>
            {t('mulai.haveAccount')}
          </button>
        </>
      ) : (
        <>
          <h1>{t('mulai.levelTitle')}</h1>
          <p className="lede">{t('mulai.levelLede')}</p>
          <div className="level-list">
            {LEVELS.map((lv) => (
              <button key={lv.level} className={`level${level === lv.level ? ' level-on' : ''}`} onClick={() => setLevel(lv.level)}>
                <span className="level-title">{t(lv.title)}</span>
                <span className="level-sub">{t(lv.sub)}</span>
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-wide" onClick={() => finish(level)}>
            {t('mulai.enter')}
          </button>
        </>
      )}
    </div>
  );
}
