import { Chess } from 'chess.js';
import { useMemo, useState } from 'react';
import { play } from '../../audio/sound';
import { getEngine } from '../../chess/engine';
import { winLoss } from '../../chess/eval';
import { sanOf } from '../../chess/review';
import { legalDests, parseUci } from '../../chess/vision';
import { Board } from '../../components/Board';
import { Bubble } from '../../components/ui';
import { useT } from '../../i18n';
import type { PieceType } from '../../pieces/PieceArt';
import { useStore } from '../../state/store';

type Phase = 'ask' | 'checking' | 'right' | 'wrong' | 'shown';

/** True when `uci` is the engine's choice or loses almost nothing against it. */
async function isGoodEnough(fen: string, uci: string, best: string): Promise<boolean> {
  if (uci === best) return true;
  const engine = getEngine();
  const before = await engine.analyse(fen, { depth: 10, multipv: 1 });
  const chess = new Chess(fen);
  chess.move(parseUci(uci));
  if (chess.isCheckmate()) return true;
  const after = await engine.analyse(chess.fen(), { depth: 10, multipv: 1 });
  if (!before[0] || !after[0]) return false;
  return winLoss(before[0].cp, -after[0].cp) < 6;
}

/**
 * Shows a position from one of the player's own games and asks for a better
 * move than the one played. Calls `onDone` once with the first-try result.
 */
export function FindBetter({
  fen,
  best,
  played,
  onDone,
  footer,
}: {
  fen: string;
  best: string;
  played: string;
  onDone?: (firstTry: boolean) => void;
  footer?: (phase: Phase) => React.ReactNode;
}) {
  const t = useT();
  const pieceSet = useStore((s) => s.settings.pieceSet);
  const [phase, setPhase] = useState<Phase>('ask');
  const [shownFen, setShownFen] = useState(fen);
  const [tries, setTries] = useState(0);
  const chess = useMemo(() => new Chess(fen), [fen]);
  const orientation = chess.turn();
  const bestSan = useMemo(() => sanOf(fen, best), [fen, best]);
  const playedSan = useMemo(() => sanOf(fen, played), [fen, played]);

  const onMove = async (from: string, to: string, promotion?: PieceType) => {
    if (phase !== 'ask' && phase !== 'wrong') return;
    const uci = `${from}${to}${promotion ?? ''}`;
    const probe = new Chess(fen);
    probe.move({ from, to, promotion });
    setShownFen(probe.fen());
    setPhase('checking');
    let ok = false;
    try {
      ok = await isGoodEnough(fen, uci, best);
    } catch {
      ok = uci === best;
    }
    if (ok) {
      play('good');
      setPhase('right');
      onDone?.(tries === 0);
    } else {
      play('bad');
      setTries((n) => n + 1);
      setPhase('wrong');
      setTimeout(() => setShownFen(fen), 500);
    }
  };

  const reveal = () => {
    const probe = new Chess(fen);
    probe.move(parseUci(best));
    setShownFen(probe.fen());
    setPhase('shown');
    onDone?.(false);
  };

  const canMove = (phase === 'ask' || phase === 'wrong') && shownFen === fen;
  const { from, to } = parseUci(best);

  return (
    <div className="find">
      <div className="find-board">
        <Board
          fen={shownFen}
          orientation={orientation}
          dests={canMove ? legalDests(chess) : undefined}
          onMove={onMove}
          hint={phase === 'shown' ? { from, to } : null}
          pieceSet={pieceSet}
        />
      </div>
      <Bubble
        name="Ki Sabda"
        mood={phase === 'right' ? 'happy' : phase === 'wrong' ? 'surprised' : 'neutral'}
        tone={phase === 'right' ? 'good' : phase === 'wrong' ? 'bad' : undefined}
      >
        {phase === 'ask' && t('find.ask', { played: playedSan })}
        {phase === 'checking' && t('find.checking')}
        {phase === 'right' && t('find.right')}
        {phase === 'wrong' && t('find.wrong')}
        {phase === 'shown' && t('find.shown', { best: bestSan })}
      </Bubble>
      <div className="find-actions">
        {phase === 'wrong' && (
          <button className="btn btn-ghost" onClick={reveal}>
            {t('find.reveal')}
          </button>
        )}
        {footer?.(phase)}
      </div>
    </div>
  );
}
