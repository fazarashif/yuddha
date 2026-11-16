import { Board } from '../components/Board';
import { PieceArt } from '../pieces/PieceArt';
import type { PieceSet, PieceType } from '../pieces/PieceArt';

const TYPES: PieceType[] = ['k', 'q', 'r', 'b', 'n', 'p'];
const SIZES = [32, 48, 64, 128];
const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const THEMES = ['kelir', 'kawung', 'candi', 'jati'];

function Sheet({ set }: { set: PieceSet }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{ marginBottom: 8 }}>Set: {set}</h3>
      {SIZES.map((s) => (
        <div key={s} style={{ display: 'flex', marginBottom: 6 }}>
          {(['w', 'b'] as const).flatMap((c) =>
            (['light', 'dark'] as const).map((bg) => (
              <div key={c + bg} style={{ display: 'flex', background: bg === 'light' ? 'var(--sq-light)' : 'var(--sq-dark)', marginRight: 8 }}>
                {TYPES.map((t) => (
                  <div key={t} style={{ width: s, height: s }}>
                    <PieceArt type={t} color={c} set={set} />
                  </div>
                ))}
              </div>
            )),
          )}
        </div>
      ))}
    </section>
  );
}

/** Internal review sheet for piece and board art. Not linked from the app. */
export function Lab() {
  const which = new URLSearchParams(location.search).get('v') ?? 'pieces';
  if (which === 'boards') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 360px)', gap: 24, padding: 24 }}>
        {THEMES.map((th) => (
          <div key={th} data-board={th}>
            <h3 style={{ marginBottom: 8 }}>{th}</h3>
            <Board fen={START} lastMove={['e2', 'e4']} check="e8" hint={{ from: 'g1', to: 'f3' }} dests={{ b1: ['a3', 'c3'] }} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{ padding: 24 }}>
      <Sheet set="yuddha" />
      <Sheet set="klasik" />
    </div>
  );
}
