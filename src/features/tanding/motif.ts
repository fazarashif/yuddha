import type { Motif } from '../../chess/review';
import type { T } from '../../i18n';

/**
 * Ki Sabda's comment on a mistake. With `bestSan` the comment names the better
 * move; without it (during a live game) it only points at the problem.
 */
export function motifText(t: T, motif: Motif, bestSan: string | null): string {
  switch (motif.kind) {
    case 'book':
      return bestSan ? t('motif.book.best', { best: bestSan }) : t('motif.book');
    case 'missedMate':
      return bestSan ? t('motif.missedMate.best', { n: motif.n, best: bestSan }) : t('motif.missedMate', { n: motif.n });
    case 'allowedMate':
      return t('motif.allowedMate', { n: motif.n });
    case 'hung':
      return t('motif.hung', { piece: t(`piece.${motif.piece}`), square: motif.square });
    case 'missedFree':
      return bestSan
        ? t('motif.missedFree.best', { piece: t(`piece.${motif.piece}`), square: motif.square, best: bestSan })
        : t('motif.missedFree', { piece: t(`piece.${motif.piece}`), square: motif.square });
    case 'missedCapture':
      return bestSan ? t('motif.missedCapture.best', { best: bestSan }) : t('motif.missedCapture');
    case 'generic':
      return bestSan ? t('motif.generic.best', { best: bestSan }) : t('motif.generic');
  }
}
