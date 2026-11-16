import { Lock, Trophy } from '@phosphor-icons/react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Avatar } from '../../components/Avatar';
import { Sheet, TopBar } from '../../components/ui';
import { BOTS } from '../../content/characters';
import type { Bot } from '../../content/characters';
import { useL, useT } from '../../i18n';
import { useStore } from '../../state/store';

/** A challenger opens once the one before is beaten, or when it is near the player's level. */
function isOpen(index: number, level: number, beaten: Record<string, number>) {
  const bot = BOTS[index];
  return index === 0 || bot.elo <= Math.max(level, 400) + 250 || Boolean(beaten[BOTS[index - 1].id]);
}

export function Select() {
  const t = useT();
  const l = useL();
  const [, go] = useLocation();
  const level = useStore((s) => Math.max(s.level, s.playRating));
  const beaten = useStore((s) => s.beaten);
  const [pick, setPick] = useState<Bot | null>(null);
  const [color, setColor] = useState<'w' | 'r' | 'b'>('w');
  const [guided, setGuided] = useState(true);

  return (
    <div className="screen">
      <TopBar title={<h1>{t('nav.tanding')}</h1>} />
      <p className="lede">{t('select.lede')}</p>
      <ul className="bot-list">
        {BOTS.map((bot, i) => {
          const open = isOpen(i, level, beaten);
          return (
            <li key={bot.id}>
              <button className={`bot-card${open ? '' : ' bot-locked'}`} onClick={() => open && setPick(bot)} disabled={!open}>
                <Avatar spec={bot.face} size={60} label={bot.name} />
                <span className="bot-info">
                  <span className="bot-name">{bot.name}</span>
                  <span className="bot-epithet">{l(bot.epithet)}</span>
                  <span className="bot-tests">{open ? l(bot.tests) : t('select.locked', { name: BOTS[i - 1].name })}</span>
                </span>
                <span className="bot-meta">
                  <span className="bot-elo num">{bot.elo}</span>
                  {!open ? <Lock size={18} /> : beaten[bot.id] ? <Trophy size={18} weight="fill" className="gold" /> : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="note">{t('select.eloNote')}</p>

      <Sheet open={Boolean(pick)} onClose={() => setPick(null)}>
        {pick && (
          <>
            <div className="pick-head">
              <Avatar spec={pick.face} size={72} label={pick.name} />
              <div>
                <h2>{pick.name}</h2>
                <p className="dim">{l(pick.style)}</p>
              </div>
            </div>
            <div className="field">
              <span className="field-label">{t('select.color')}</span>
              <div className="seg">
                {(['w', 'r', 'b'] as const).map((c) => (
                  <button key={c} className={color === c ? 'seg-on' : ''} onClick={() => setColor(c)}>
                    {t(`select.color.${c}`)}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <span className="field-label">{t('select.mode')}</span>
              <div className="seg">
                <button className={guided ? 'seg-on' : ''} onClick={() => setGuided(true)}>
                  {t('game.guided')}
                </button>
                <button className={!guided ? 'seg-on' : ''} onClick={() => setGuided(false)}>
                  {t('game.pure')}
                </button>
              </div>
              <p className="field-help">{guided ? t('select.guidedHelp') : t('select.pureHelp')}</p>
            </div>
            <div className="sheet-actions">
              <button className="btn btn-primary" onClick={() => go(`/tanding/${pick.id}?c=${color}&g=${guided ? 1 : 0}`)}>
                {t('select.start')}
              </button>
            </div>
          </>
        )}
      </Sheet>
    </div>
  );
}
