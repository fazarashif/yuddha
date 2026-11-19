import { useMemo } from 'react';
import { useLocation } from 'wouter';
import type { Motif } from '../../chess/review';
import { Bubble, Meter, TopBar } from '../../components/ui';
import { botById } from '../../content/characters';
import { useL, useT } from '../../i18n';
import type { Key } from '../../i18n/strings';
import { useStore } from '../../state/store';
import { THEME_NAME } from '../puzzle/themes';
import { unreviewed, useBatch } from '../tanding/reviews';
import { SaranList, useAdvice } from '../saran/Saran';
import { openingStats } from './openingStats';
import type { PuzzleTheme } from '../puzzle/themes';

const MOTIF_LABEL: Record<Motif['kind'], Key> = {
  hung: 'cermin.motif.hung',
  missedFree: 'cermin.motif.missedFree',
  missedCapture: 'cermin.motif.missedCapture',
  missedMate: 'cermin.motif.missedMate',
  allowedMate: 'cermin.motif.allowedMate',
  generic: 'cermin.motif.generic',
  book: 'cermin.motif.book',
};

/** The mirror: what the player's own games say about their play. */
export function Cermin() {
  const t = useT();
  const l = useL();
  const [, go] = useLocation();
  const puzzleRating = useStore((s) => s.puzzleRating);
  const puzzlesDone = useStore((s) => s.puzzlesDone);
  const themeStats = useStore((s) => s.themeStats);
  const games = useStore((s) => s.games);
  const luka = useStore((s) => s.luka);
  const rating = useStore((s) => s.playRating);
  const visionBest = useStore((s) => s.visionBest);

  const reviewed = games.filter((g) => g.accuracy !== undefined);
  const recent = reviewed.slice(0, 10).reverse();
  const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  const blundersPerGame = avg(reviewed.slice(0, 10).map((g) => g.blunders ?? 0));
  const accuracy = avg(reviewed.slice(0, 10).map((g) => g.accuracy ?? 0));
  // Games against the built-in opponents and imported games are tallied apart.
  const tally = (list: typeof games) => {
    const w = list.filter((g) => g.result === 'win').length;
    const l = list.filter((g) => g.result === 'loss').length;
    return { w, l, d: list.length - w - l, n: list.length };
  };
  const here = tally(games.filter((g) => !g.source));
  const chesscom = tally(games.filter((g) => g.source === 'chesscom'));

  const openings = useMemo(() => openingStats(games).slice(0, 8), [games]);
  const pending = unreviewed(games);
  const batch = useBatch();
  const advice = useAdvice();

  const motifCounts = new Map<Motif['kind'], number>();
  for (const c of luka) motifCounts.set(c.motif.kind, (motifCounts.get(c.motif.kind) ?? 0) + 1);
  const motifs = [...motifCounts.entries()].sort((a, b) => b[1] - a[1]);
  const maxMotif = motifs[0]?.[1] ?? 1;
  const maxBlunders = Math.max(1, ...recent.map((g) => g.blunders ?? 0));
  // Themes the solver fails most, once there is enough evidence to say so.
  const weak = Object.entries(themeStats)
    .filter(([name, st]) => st.seen >= 4 && name in THEME_NAME)
    .map(([name, st]) => ({ name: name as PuzzleTheme, rate: st.solved / st.seen, seen: st.seen }))
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 5);

  return (
    <div className="screen">
      <TopBar title={<h1>{t('nav.cermin')}</h1>} />
      {games.length === 0 && puzzlesDone === 0 ? (
        <>
          <Bubble name="Ki Sabda">{t('cermin.empty')}</Bubble>
          <div className="sheet-actions">
            <button className="btn btn-primary" onClick={() => go('/tanding')}>
              {t('luka.play')}
            </button>
            <button className="btn btn-ghost" onClick={() => go('/impor')}>
              {t('cermin.import')}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="stats-row">
            <div className="stat">
              <span className="stat-n num">{rating}</span>
              <span className="stat-l">{t('cermin.rating')}</span>
            </div>
            <div className="stat">
              <span className="stat-n num">{reviewed.length ? blundersPerGame.toFixed(1) : '-'}</span>
              <span className="stat-l">{t('cermin.blunders')}</span>
            </div>
            <div className="stat">
              <span className="stat-n num">{reviewed.length ? Math.round(accuracy) : '-'}</span>
              <span className="stat-l">{t('review.accuracy')}</span>
            </div>
            <div className="stat">
              <span className="stat-n num">{puzzlesDone ? puzzleRating : '-'}</span>
              <span className="stat-l">{t('cermin.puzzleRating')}</span>
            </div>
          </div>
          <p className="note num">
            {here.n > 0 && `${t('cermin.record', here)} · `}
            {chesscom.n > 0 && `${t('cermin.recordCc', chesscom)} · `}
            {t('cermin.visionBest', { n: visionBest })}
          </p>

          {(pending.length > 0 || batch.running || batch.total > 0) && (
            <section className="panel batch-panel">
              <h3>{t('batch.title')}</h3>
              {batch.running ? (
                <>
                  <p className="num">{t('batch.running', { i: Math.min(batch.done + 1, batch.total), n: batch.total })}</p>
                  <Meter value={batch.done + batch.step.done / Math.max(1, batch.step.total)} max={batch.total} tone="sukma" />
                  <p className="dim small">{t('batch.note')}</p>
                  <button className="btn btn-ghost" onClick={batch.cancel}>
                    {t('batch.cancel')}
                  </button>
                </>
              ) : (
                <>
                  {batch.failed ? (
                    <p>{t('batch.failed')}</p>
                  ) : batch.total > 0 && batch.done >= batch.total ? (
                    <p>{t('batch.done', { n: batch.done, k: batch.added })}</p>
                  ) : batch.total > 0 ? (
                    <p>{t('batch.stopped', { n: batch.done })}</p>
                  ) : null}
                  {pending.length > 0 && (
                    <>
                      <p className="dim">{t('batch.pending', { n: pending.length })}</p>
                      <button className="btn btn-primary" onClick={() => batch.start(pending.map((g) => g.id))}>
                        {t('batch.start')}
                      </button>
                    </>
                  )}
                </>
              )}
            </section>
          )}

          <section className="panel saran-panel">
            <h3>{t('saran.title')}</h3>
            {advice.length === 0 ? <p className="dim">{t('saran.empty')}</p> : <SaranList advice={advice} limit={3} />}
          </section>

          <section className="panel">
            <h3>{t('cermin.weak')}</h3>
            {weak.length === 0 ? (
              <p className="dim">{t('cermin.weakEmpty')}</p>
            ) : (
              <ul className="hbars">
                {weak.map((w) => (
                  <li key={w.name} className="hbar-link" onClick={() => go(`/puzzle?tema=${w.name}`)}>
                    <span className="hbar-label">{l(THEME_NAME[w.name])}</span>
                    <span className="hbar hbar-good" style={{ width: `${Math.max(4, w.rate * 100)}%` }} />
                    <span className="num">{Math.round(w.rate * 100)}%</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="dim small">{t('cermin.weakHelp')}</p>
          </section>

          <section className="panel">
            <h3>{t('cermin.trend')}</h3>
            {recent.length === 0 ? (
              <p className="dim">{t('cermin.trendEmpty')}</p>
            ) : (
              <div className="bars" role="img" aria-label={t('cermin.trend')}>
                {recent.map((g) => (
                  <div key={g.id} className="bar-col">
                    <span className="bar-n num">{g.blunders ?? 0}</span>
                    <span className="bar" style={{ height: `${8 + ((g.blunders ?? 0) / maxBlunders) * 64}px` }} />
                  </div>
                ))}
              </div>
            )}
            <p className="dim small">{t('cermin.trendHelp')}</p>
          </section>

          {openings.length > 0 && (
            <section className="panel">
              <h3>{t('cermin.openings')}</h3>
              <ul className="opening-rows">
                {openings.map((o) => (
                  <li key={`${o.family}-${o.color}`} className="opening-row">
                    <span className="opening-row-name">
                      <span className={`opening-side opening-side-${o.color}`}>{t(o.color === 'w' ? 'cermin.asWhite' : 'cermin.asBlack')}</span> {o.family}
                    </span>
                    <span className="opening-row-meta num">
                      {o.n} · {o.w}/{o.d}/{o.l} · {Math.round(o.score * 100)}%
                    </span>
                    <span className="opening-row-bar">
                      <span style={{ width: `${Math.max(3, o.score * 100)}%` }} />
                    </span>
                  </li>
                ))}
              </ul>
              <p className="dim small">{t('cermin.openingsHelp')}</p>
            </section>
          )}

          <section className="panel">
            <h3>{t('cermin.motifs')}</h3>
            {motifs.length === 0 ? (
              <p className="dim">{t('cermin.motifsEmpty')}</p>
            ) : (
              <ul className="hbars">
                {motifs.map(([kind, n]) => (
                  <li key={kind}>
                    <span className="hbar-label">{t(MOTIF_LABEL[kind])}</span>
                    <span className="hbar" style={{ width: `${(n / maxMotif) * 100}%` }} />
                    <span className="num">{n}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel">
            <h3>{t('cermin.games')}</h3>
            {games.length === 0 ? (
              <p className="dim">{t('cermin.gamesEmpty')}</p>
            ) : (
              <ul className="game-list">
                {games.slice(0, 20).map((g) => (
                  <li key={g.id}>
                    <button onClick={() => go(`/ulasan/${g.id}`)}>
                      <span className={`pill pill-${g.result}`}>{t(`result.short.${g.result}`)}</span>
                      <span className="game-who">
                        {g.opponent?.name ?? botById(g.botId)?.name ?? g.botId}
                        {g.source === 'chesscom' && <span className="game-src">Chess.com</span>}
                      </span>
                      <span className="dim num small game-state">{g.accuracy !== undefined ? t('cermin.acc', { n: g.accuracy }) : t('cermin.unreviewed')}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button className="btn btn-ghost" onClick={() => go('/impor')}>
              {t('cermin.import')}
            </button>
          </section>
        </>
      )}
    </div>
  );
}
