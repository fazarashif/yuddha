import { Check } from '@phosphor-icons/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation } from 'wouter';
import { Bubble, TopBar } from '../../components/ui';
import { useT } from '../../i18n';
import type { Key } from '../../i18n/strings';
import { useStore } from '../../state/store';
import type { GameRecord } from '../../state/store';
import { ImportError, fetchChessComGames, normaliseUsername } from './chesscom';

type Phase = 'idle' | 'loading' | 'list' | 'error';

const ERROR_TEXT: Record<ImportError['reason'], Key> = {
  username: 'impor.err.username',
  notfound: 'impor.err.notfound',
  network: 'impor.err.network',
  empty: 'impor.err.empty',
};

const TIME_CLASS: Record<string, Key> = {
  bullet: 'impor.tc.bullet',
  blitz: 'impor.tc.blitz',
  rapid: 'impor.tc.rapid',
  daily: 'impor.tc.daily',
};

/** Brings the player's own Chess.com games in, so they can be reviewed like any other game. */
export function Impor() {
  const t = useT();
  const [, go] = useLocation();
  const lang = useStore((s) => s.settings.lang);
  const saved = useStore((s) => s.chesscomUser);
  const have = useStore((s) => s.games);
  const importGames = useStore((s) => s.importGames);
  const [name, setName] = useState(saved);
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<ImportError['reason']>('network');
  const [found, setFound] = useState<GameRecord[]>([]);
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const known = new Set(have.map((g) => g.id));
  const date = new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'short' });

  const search = async (e: FormEvent) => {
    e.preventDefault();
    setPhase('loading');
    try {
      const games = await fetchChessComGames(name);
      setFound(games);
      // Start with the five most recent games that are not here yet.
      setPicked(new Set(games.filter((g) => !known.has(g.id)).slice(0, 5).map((g) => g.id)));
      setPhase('list');
    } catch (err) {
      setError(err instanceof ImportError ? err.reason : 'network');
      setPhase('error');
    }
  };

  const toggle = (id: string) =>
    setPicked((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const confirm = () => {
    importGames(
      normaliseUsername(name),
      found.filter((g) => picked.has(g.id)),
    );
    go('/cermin');
  };

  const latest = found[0];

  return (
    <div className="screen">
      <TopBar back="/cermin" title={<h2>{t('impor.title')}</h2>} />
      <Bubble name="Ki Sabda">{t('impor.intro')}</Bubble>

      <form className="field" onSubmit={search}>
        <label className="field-label" htmlFor="cc-user">
          {t('impor.username')}
        </label>
        <div className="input-row">
          <input
            id="cc-user"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoComplete="username"
            inputMode="text"
            maxLength={25}
          />
          <button className="btn btn-primary" type="submit" disabled={phase === 'loading' || name.trim().length < 3}>
            {phase === 'loading' ? t('impor.searching') : t('impor.search')}
          </button>
        </div>
        <p className="field-help">{t('impor.usernameHelp')}</p>
        {phase === 'error' && (
          <p className="field-error" role="alert">
            {t(ERROR_TEXT[error])}
          </p>
        )}
      </form>

      {phase === 'loading' && (
        <ul className="pick-list" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="pick-row pick-skeleton" />
          ))}
        </ul>
      )}

      {phase === 'list' && (
        <>
          {latest?.myRating !== undefined && (
            <p className="note num">
              {t('impor.rating', { rating: latest.myRating, tc: t(TIME_CLASS[latest.timeClass ?? ''] ?? 'impor.tc.other') })}
            </p>
          )}
          <ul className="pick-list">
            {found.map((g) => {
              const here = known.has(g.id);
              const on = picked.has(g.id);
              return (
                <li key={g.id}>
                  <button className={`pick-row${on ? ' pick-on' : ''}`} onClick={() => toggle(g.id)} disabled={here} aria-pressed={on}>
                    <span className="pick-box">{(on || here) && <Check size={16} weight="bold" />}</span>
                    <span className={`pill pill-${g.result}`}>{t(`result.short.${g.result}`)}</span>
                    <span className="pick-who">
                      <span className="pick-name">
                        {g.opponent?.name} <span className="dim num">{g.opponent?.rating}</span>
                      </span>
                      <span className="pick-meta num">
                        {t(TIME_CLASS[g.timeClass ?? ''] ?? 'impor.tc.other')} · {date.format(g.at)} · {t('impor.moves', { n: Math.ceil(g.plies / 2) })}
                        {here ? ` · ${t('impor.already')}` : ''}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="sheet-actions sticky-actions">
            <button className="btn btn-primary" onClick={confirm} disabled={picked.size === 0}>
              {t('impor.confirm', { n: picked.size })}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
