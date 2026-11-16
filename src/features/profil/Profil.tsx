import { useState } from 'react';
import { setVolumes, startMusic, stopMusic } from '../../audio/sound';
import { Board } from '../../components/Board';
import { Sheet, TopBar } from '../../components/ui';
import { rankFor } from '../../content/characters';
import { useL, useT } from '../../i18n';
import { PieceArt } from '../../pieces/PieceArt';
import { useStore } from '../../state/store';
import type { BoardTheme } from '../../state/store';

const BOARDS: BoardTheme[] = ['kelir', 'kawung', 'candi', 'jati'];
const LEVELS = [0, 500, 800, 1100, 1400];
const DEMO = 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 0 1';

export function Profil() {
  const t = useT();
  const l = useL();
  const s = useStore((st) => st.settings);
  const setSettings = useStore((st) => st.setSettings);
  const xp = useStore((st) => st.xp);
  const level = useStore((st) => st.level);
  const finishOnboarding = useStore((st) => st.finishOnboarding);
  const resetAll = useStore((st) => st.resetAll);
  const [confirm, setConfirm] = useState(false);
  const { rank } = rankFor(xp);

  const volume = (key: 'sfx' | 'music', value: number) => {
    const next = { ...s, [key]: value };
    setSettings({ [key]: value });
    setVolumes(next.sfx, next.music);
    if (key === 'music') {
      if (value > 0) startMusic();
      else stopMusic();
    }
  };

  return (
    <div className="screen">
      <TopBar title={<h1>{t('nav.profil')}</h1>} />
      <p className="lede">
        {l(rank.name)} · <span className="num">{xp} XP</span>
      </p>

      <section className="panel">
        <h3>{t('profil.look')}</h3>
        <div className="demo-board" data-board={s.board}>
          <Board fen={DEMO} pieceSet={s.pieceSet} coords={false} />
        </div>
        <div className="field">
          <span className="field-label">{t('profil.board')}</span>
          <div className="seg seg-wrap">
            {BOARDS.map((b) => (
              <button key={b} className={s.board === b ? 'seg-on' : ''} onClick={() => setSettings({ board: b })}>
                {t(`board.${b}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <span className="field-label">{t('profil.pieces')}</span>
          <div className="seg">
            {(['yuddha', 'klasik'] as const).map((p) => (
              <button key={p} className={s.pieceSet === p ? 'seg-on' : ''} onClick={() => setSettings({ pieceSet: p })}>
                <span className="seg-piece">
                  <PieceArt type="n" color="w" set={p} />
                </span>
                {t(`pieces.${p}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <span className="field-label">{t('profil.theme')}</span>
          <div className="seg">
            {(['dark', 'light'] as const).map((th) => (
              <button key={th} className={s.theme === th ? 'seg-on' : ''} onClick={() => setSettings({ theme: th })}>
                {t(`theme.${th}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <h3>{t('profil.sound')}</h3>
        <label className="field">
          <span className="field-label">{t('profil.sfx')}</span>
          <input type="range" min={0} max={1} step={0.05} value={s.sfx} onChange={(e) => volume('sfx', Number(e.target.value))} />
        </label>
        <label className="field">
          <span className="field-label">{t('profil.music')}</span>
          <input type="range" min={0} max={1} step={0.05} value={s.music} onChange={(e) => volume('music', Number(e.target.value))} />
        </label>
      </section>

      <section className="panel">
        <h3>{t('profil.general')}</h3>
        <div className="field">
          <span className="field-label">{t('profil.lang')}</span>
          <div className="seg">
            <button className={s.lang === 'id' ? 'seg-on' : ''} onClick={() => setSettings({ lang: 'id' })}>
              Indonesia
            </button>
            <button className={s.lang === 'en' ? 'seg-on' : ''} onClick={() => setSettings({ lang: 'en' })}>
              English
            </button>
          </div>
        </div>
        <div className="field">
          <span className="field-label">{t('profil.level')}</span>
          <div className="seg seg-wrap">
            {LEVELS.map((lv) => (
              <button key={lv} className={level === lv ? 'seg-on' : ''} onClick={() => finishOnboarding(lv)}>
                {lv === 0 ? t('level.zero.short') : lv === 1400 ? '1400+' : lv}
              </button>
            ))}
          </div>
          <p className="field-help">{t('profil.levelHelp')}</p>
        </div>
        <button className="btn btn-danger" onClick={() => setConfirm(true)}>
          {t('profil.reset')}
        </button>
      </section>

      <p className="note">{t('profil.localOnly')}</p>

      <Sheet open={confirm} onClose={() => setConfirm(false)}>
        <h3>{t('profil.resetAsk')}</h3>
        <p className="dim">{t('profil.resetHelp')}</p>
        <div className="sheet-actions">
          <button
            className="btn btn-danger"
            onClick={() => {
              resetAll();
              setConfirm(false);
            }}
          >
            {t('profil.reset')}
          </button>
          <button className="btn btn-ghost" onClick={() => setConfirm(false)}>
            {t('common.cancel')}
          </button>
        </div>
      </Sheet>
    </div>
  );
}
