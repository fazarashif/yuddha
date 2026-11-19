import { BookOpenText, PuzzlePiece, Scroll } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { lessonById } from '../../content/lessons';
import { useL, useT } from '../../i18n';
import type { Key } from '../../i18n/strings';
import { dueLuka, useStore } from '../../state/store';
import { THEME_NAME } from '../puzzle/themes';
import { advise } from './saran';
import type { Action, Advice } from './saran';

/** The player's practice advice, recomputed whenever their games, puzzles or cards change. */
export function useAdvice(): Advice[] {
  const games = useStore((s) => s.games);
  const luka = useStore((s) => s.luka);
  const themeStats = useStore((s) => s.themeStats);
  const repertoire = useStore((s) => s.repertoire);
  const done = useStore((s) => s.lessons);
  return useMemo(() => advise({ games, luka, dueLuka: dueLuka(luka).length, themeStats, repertoire, done }), [games, luka, themeStats, repertoire, done]);
}

export const actionPath = (a: Action) => (a.kind === 'lesson' ? `/lakon/${a.id}` : a.kind === 'puzzles' ? `/puzzle?tema=${a.theme}` : '/luka');

const MOTIF_TEXT: Record<string, Key> = {
  hung: 'saran.motif.hung',
  missedFree: 'saran.motif.missedFree',
  missedCapture: 'saran.motif.missedCapture',
  missedMate: 'saran.motif.missedMate',
  allowedMate: 'saran.motif.allowedMate',
  book: 'saran.motif.book',
};

/** A list of advice cards, each with buttons that go straight to the practice. */
export function SaranList({ advice, limit }: { advice: Advice[]; limit: number }) {
  const t = useT();
  const l = useL();
  const [, go] = useLocation();

  const reason = (a: Advice) => {
    switch (a.kind) {
      case 'motif':
        return t(MOTIF_TEXT[a.motif], { n: a.n });
      case 'theme':
        return t('saran.theme', { theme: l(THEME_NAME[a.theme]), pct: Math.round(a.rate * 100), n: a.seen });
      case 'opening':
        return t('saran.opening', { family: a.family, color: t(a.color === 'w' ? 'cermin.asWhite' : 'cermin.asBlack'), pct: Math.round(a.score * 100), n: a.n });
      case 'luka':
        return t('saran.luka', { n: a.n });
    }
  };

  const label = (a: Action) =>
    a.kind === 'lesson' ? (lessonById(a.id) ? l(lessonById(a.id)!.title) : a.id) : a.kind === 'puzzles' ? t('saran.doPuzzles', { theme: l(THEME_NAME[a.theme]) }) : t('saran.doLuka');
  const icon = (a: Action) => (a.kind === 'lesson' ? <BookOpenText size={18} /> : a.kind === 'puzzles' ? <PuzzlePiece size={18} /> : <Scroll size={18} />);

  return (
    <ul className="saran-list">
      {advice.slice(0, limit).map((a, i) => (
        <li key={i} className="saran">
          <p className="saran-why">{reason(a)}</p>
          <div className="saran-actions">
            {a.actions.slice(0, 3).map((act, j) => (
              <button key={j} className={`btn ${j === 0 ? 'btn-primary' : 'btn-ghost'} btn-small`} onClick={() => go(actionPath(act))}>
                {icon(act)} {label(act)}
              </button>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}
