import { useLocation } from 'wouter';
import type { Motif } from '../../chess/review';
import { Bubble, TopBar } from '../../components/ui';
import { botById } from '../../content/characters';
import { useL, useT } from '../../i18n';
import type { Key } from '../../i18n/strings';
import { useStore } from '../../state/store';
import { THEME_NAME } from '../puzzle/themes';
import type { PuzzleTheme } from '../puzzle/themes';

const MOTIF_LABEL: Record<Motif['kind'], Key> = {
  hung: 'cermin.motif.hung',
  missedFree: 'cermin.motif.missedFree',
  missedCapture: 'cermin.motif.missedCapture',
  missedMate: 'cermin.motif.missedMate',
  allowedMate: 'cermin.motif.allowedMate',
  generic: 'cermin.motif.generic',
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
  const wins = games.filter((g) => g.result === 'win').length;
  const losses = games.filter((g) => g.result === 'loss').length;
  const draws = games.length - wins - losses;

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
            {t('cermin.record', { w: wins, d: draws, l: losses })} · {t('cermin.visionBest', { n: visionBest })}
          </p>

          <section className="panel">
            <h3>{t('cermin.weak')}</h3>
            {weak.length === 0 ? (
              <p className="dim">{t('cermin.weakEmpty')}</p>
            ) : (
              <ul className="hbars">
                {weak.map((w) => (
                  <li key={w.name}>
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
            <ul className="game-list">
              {games.slice(0, 12).map((g) => (
                <li key={g.id}>
                  <button onClick={() => go(`/ulasan/${g.id}`)}>
                    <span className={`pill pill-${g.result}`}>{t(`result.short.${g.result}`)}</span>
                    <span className="game-who">{botById(g.botId)?.name ?? g.botId}</span>
                    <span className="dim num small">{g.accuracy !== undefined ? t('cermin.acc', { n: g.accuracy }) : t('cermin.unreviewed')}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
