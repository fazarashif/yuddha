import { ArrowDown, ArrowUp } from '@phosphor-icons/react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { dayNumber, useStore } from '../../state/store';
import { useT } from '../../i18n';
import type { Key } from '../../i18n/strings';
import { WEEK, accuracySeries, blunderSeries, change, chesscomSeries, latest, logSeries, skillMap, weakest, weekOf } from './skill';
import type { Area, Series } from './skill';

const weekLabel = (week: number, lang: string) =>
  new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'short' }).format(new Date(week * WEEK * 86400000));

/** A twelve-week line with a touch readout; a single series, so the tile's label names it. */
function Sparkline({ series, lang, format }: { series: Series; lang: string; format: (v: number) => string }) {
  const [at, setAt] = useState<number | null>(null);
  const known = series.values.map((v, i) => [i, v] as const).filter((p): p is readonly [number, number] => p[1] !== null);
  if (known.length < 2) return <div className="spark spark-empty" aria-hidden />;
  const vs = known.map((p) => p[1]);
  const lo = Math.min(...vs);
  const hi = Math.max(...vs);
  const n = series.values.length;
  const x = (i: number) => (i / (n - 1)) * 100;
  const y = (v: number) => (hi === lo ? 14 : 26 - ((v - lo) / (hi - lo)) * 22);
  const points = known.map(([i, v]) => `${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(' ');
  const pick = (clientX: number, rect: DOMRect) => {
    const i = Math.round(((clientX - rect.left) / rect.width) * (n - 1));
    const nearest = known.reduce((best, p) => (Math.abs(p[0] - i) < Math.abs(best[0] - i) ? p : best));
    setAt(nearest[0]);
  };
  const shown = at !== null ? known.find((p) => p[0] === at) : null;
  const last = known[known.length - 1];
  return (
    <div className="spark">
      <svg
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
        onPointerMove={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
        onPointerDown={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
        onPointerLeave={() => setAt(null)}
        role="img"
        aria-label={known.map(([i, v]) => `${weekLabel(series.weeks[i], lang)}: ${format(v)}`).join(', ')}
      >
        <polyline points={points} className="spark-line" vectorEffect="non-scaling-stroke" />
        {shown && <line x1={x(shown[0])} x2={x(shown[0])} y1={0} y2={30} className="spark-cross" vectorEffect="non-scaling-stroke" />}
      </svg>
      <span className="spark-dot" style={{ left: `${x((shown ?? last)[0])}%`, top: `${(y((shown ?? last)[1]) / 30) * 100}%` }} />
      <span className="spark-read num">{shown ? `${weekLabel(series.weeks[shown[0]], lang)}: ${format(shown[1])}` : ' '}</span>
    </div>
  );
}

function Tile({ label, series, value, lowerIsBetter, lang, format, t }: { label: string; series: Series; value: number | null; lowerIsBetter?: boolean; lang: string; format: (v: number) => string; t: (k: Key, v?: Record<string, string | number>) => string }) {
  const d = change(series);
  const better = d !== null && d !== 0 && (lowerIsBetter ? d < 0 : d > 0);
  return (
    <div className="ptile">
      <span className="ptile-label">{label}</span>
      <span className="ptile-value num">{value === null ? '-' : format(value)}</span>
      {d !== null && d !== 0 ? (
        <span className={`ptile-delta num ${better ? 'ptile-up' : 'ptile-down'}`}>
          {d > 0 ? <ArrowUp size={12} weight="bold" /> : <ArrowDown size={12} weight="bold" />}
          {format(Math.abs(d))} {t('progress.in4w')}
        </span>
      ) : (
        <span className="ptile-delta dim">{t('progress.noChange')}</span>
      )}
      <Sparkline series={series} lang={lang} format={format} />
    </div>
  );
}

const AREA_NAME: Record<Area, Key> = { tactics: 'skill.tactics', o: 'skill.opening', m: 'skill.middle', e: 'skill.endgame' };
const AREA_PRACTICE: Record<Area, string> = { tactics: '/puzzle', o: '/pembukaan', m: '/lakon/b3-2', e: '/lakon/b2-5' };

/** Progress tiles and the skill map at the top of Cermin. */
export function Progress() {
  const t = useT();
  const [, go] = useLocation();
  const lang = useStore((s) => s.settings.lang);
  const games = useStore((s) => s.games);
  const log = useStore((s) => s.ratingLog);
  const playRating = useStore((s) => s.playRating);
  const puzzleRating = useStore((s) => s.puzzleRating);
  const puzzlesDone = useStore((s) => s.puzzlesDone);
  const themeStats = useStore((s) => s.themeStats);

  const week = weekOf(dayNumber());
  const cc = chesscomSeries(games, week);
  const strength = cc.timeClass ? cc : logSeries(log, 'play', week);
  const blunders = blunderSeries(games, week);
  const accuracy = accuracySeries(games, week);
  const puzzle = logSeries(log, 'puzzle', week);
  const whole = (v: number) => String(Math.round(v));
  const tenth = (v: number) => (Math.round(v * 10) / 10).toLocaleString(lang === 'id' ? 'id-ID' : 'en-GB');

  const areas = skillMap(games, themeStats);
  const low = weakest(areas);

  return (
    <>
      <div className="ptiles">
        <Tile
          t={t}
          lang={lang}
          label={cc.timeClass ? t('progress.chesscom', { tc: cc.timeClass }) : t('cermin.rating')}
          series={strength}
          value={cc.timeClass ? latest(cc) : playRating}
          format={whole}
        />
        <Tile t={t} lang={lang} label={t('cermin.puzzleRating')} series={puzzle} value={puzzlesDone ? puzzleRating : null} format={whole} />
        <Tile t={t} lang={lang} label={t('cermin.blunders')} series={blunders} value={latest(blunders)} lowerIsBetter format={tenth} />
        <Tile t={t} lang={lang} label={t('review.accuracy')} series={accuracy} value={latest(accuracy)} format={whole} />
      </div>

      <section className="panel">
        <h3>{t('skill.title')}</h3>
        <ul className="meters">
          {areas.map((a) => (
            <li key={a.area} className={`meter-row${a.area === low ? ' meter-low' : ''}`}>
              <span className="meter-name">
                {t(AREA_NAME[a.area])}
                {a.area === low && <span className="node-tag">{t('skill.weakest')}</span>}
              </span>
              <span className="meter-figure num">{a.score === null ? '-' : a.score}</span>
              <span className="meter-track">
                <span style={{ width: `${a.score ?? 0}%` }} />
              </span>
              <span className="meter-note dim small">
                {a.score === null
                  ? t('skill.needMore')
                  : a.area === 'tactics'
                    ? t('skill.tacticsNote', { n: a.n })
                    : t('skill.phaseNote', { slips: (a.slips ?? 0).toLocaleString(lang === 'id' ? 'id-ID' : 'en-GB') })}
              </span>
            </li>
          ))}
        </ul>
        {low && (
          <button className="btn btn-ghost btn-small" onClick={() => go(AREA_PRACTICE[low])}>
            {t('skill.practise', { area: t(AREA_NAME[low]) })}
          </button>
        )}
        <p className="dim small">{t('skill.help')}</p>
      </section>
    </>
  );
}
