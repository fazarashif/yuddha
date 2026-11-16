import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { PieceArt } from '../pieces/PieceArt';
import type { PieceColor, PieceSet, PieceType } from '../pieces/PieceArt';
import './board.css';

export type Sq = string; // "a1" .. "h8"
export type Mark = 'good' | 'bad' | 'target' | 'danger';

interface Placed {
  id: number;
  type: PieceType;
  color: PieceColor;
  sq: Sq;
}

export interface BoardProps {
  fen: string;
  orientation?: PieceColor;
  /** Legal destinations per origin square. Empty or omitted = not movable. */
  dests?: Record<Sq, Sq[]>;
  onMove?: (from: Sq, to: Sq, promotion?: PieceType) => void;
  /** Called for any tapped square when the board is not moving pieces. */
  onSquareTap?: (sq: Sq) => void;
  lastMove?: [Sq, Sq] | null;
  check?: Sq | null;
  hint?: { from?: Sq; to?: Sq } | null;
  marks?: Record<Sq, Mark>;
  pieceSet?: PieceSet;
  coords?: boolean;
}

const FILES = 'abcdefgh';

function parseFen(fen: string): Map<Sq, { type: PieceType; color: PieceColor }> {
  const out = new Map<Sq, { type: PieceType; color: PieceColor }>();
  const rows = fen.split(' ')[0].split('/');
  rows.forEach((row, r) => {
    let f = 0;
    for (const ch of row) {
      if (ch >= '1' && ch <= '8') {
        f += Number(ch);
      } else {
        const lower = ch.toLowerCase() as PieceType;
        out.set(`${FILES[f]}${8 - r}`, { type: lower, color: ch === lower ? 'b' : 'w' });
        f += 1;
      }
    }
  });
  return out;
}

const fileOf = (sq: Sq) => FILES.indexOf(sq[0]);
const rankOf = (sq: Sq) => Number(sq[1]) - 1;
const dist = (a: Sq, b: Sq) => Math.abs(fileOf(a) - fileOf(b)) + Math.abs(rankOf(a) - rankOf(b));

let nextId = 1;

/** Carries piece identity across positions so moved pieces slide instead of jumping. */
function reconcile(prev: Placed[], fen: string): Placed[] {
  const target = parseFen(fen);
  const next: Placed[] = [];
  const pool = [...prev];
  const pending: { sq: Sq; type: PieceType; color: PieceColor }[] = [];

  for (const [sq, p] of target) {
    const i = pool.findIndex((o) => o.sq === sq && o.type === p.type && o.color === p.color);
    if (i >= 0) next.push(pool.splice(i, 1)[0]);
    else pending.push({ sq, ...p });
  }
  for (const p of pending) {
    let best = -1;
    for (let i = 0; i < pool.length; i++) {
      const o = pool[i];
      // A promoted pawn keeps the pawn's identity.
      const sameKind = o.color === p.color && (o.type === p.type || o.type === 'p');
      if (sameKind && (best < 0 || dist(o.sq, p.sq) < dist(pool[best].sq, p.sq))) best = i;
    }
    if (best >= 0) {
      const o = pool.splice(best, 1)[0];
      next.push({ id: o.id, type: p.type, color: p.color, sq: p.sq });
    } else {
      next.push({ id: nextId++, type: p.type, color: p.color, sq: p.sq });
    }
  }
  return next;
}

export function Board({
  fen,
  orientation = 'w',
  dests,
  onMove,
  onSquareTap,
  lastMove,
  check,
  hint,
  marks,
  pieceSet = 'yuddha',
  coords = true,
}: BoardProps) {
  const [pieces, setPieces] = useState<Placed[]>(() => reconcile([], fen));
  const [selected, setSelected] = useState<Sq | null>(null);
  const [promo, setPromo] = useState<{ from: Sq; to: Sq; color: PieceColor } | null>(null);
  const [dragId, setDragId] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; from: Sq; startX: number; startY: number; moved: boolean; el: HTMLElement | null } | null>(null);
  const skipAnim = useRef(false);

  useEffect(() => {
    setPieces((prev) => reconcile(prev, fen));
    setSelected(null);
    setPromo(null);
  }, [fen]);

  const flipped = orientation === 'b';
  const xy = (sq: Sq) => {
    const f = fileOf(sq);
    const r = rankOf(sq);
    return { x: flipped ? 7 - f : f, y: flipped ? r : 7 - r };
  };
  const sqAt = (clientX: number, clientY: number): Sq | null => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const cx = Math.floor(((clientX - rect.left) / rect.width) * 8);
    const cy = Math.floor(((clientY - rect.top) / rect.height) * 8);
    if (cx < 0 || cx > 7 || cy < 0 || cy > 7) return null;
    const f = flipped ? 7 - cx : cx;
    const r = flipped ? cy : 7 - cy;
    return `${FILES[f]}${r + 1}`;
  };

  const movable = (sq: Sq) => Boolean(dests && dests[sq] && dests[sq].length > 0);
  const targets = useMemo(() => new Set(selected && dests ? dests[selected] ?? [] : []), [selected, dests]);
  const occupied = useMemo(() => new Set(pieces.map((p) => p.sq)), [pieces]);

  const tryMove = (from: Sq, to: Sq, dropped: boolean) => {
    if (!dests?.[from]?.includes(to)) return false;
    const piece = pieces.find((p) => p.sq === from);
    if (!piece) return false;
    skipAnim.current = dropped;
    const lastRank = piece.color === 'w' ? '8' : '1';
    if (piece.type === 'p' && to[1] === lastRank) {
      setPromo({ from, to, color: piece.color });
      setSelected(null);
      return true;
    }
    setSelected(null);
    onMove?.(from, to);
    return true;
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (promo) return;
    const sq = sqAt(e.clientX, e.clientY);
    if (!sq) return;
    if (selected && selected !== sq && tryMove(selected, sq, false)) return;
    if (movable(sq)) {
      const piece = pieces.find((p) => p.sq === sq);
      if (!piece) return;
      const el = boardRef.current?.querySelector<HTMLElement>(`[data-pid="${piece.id}"]`) ?? null;
      drag.current = { id: piece.id, from: sq, startX: e.clientX, startY: e.clientY, moved: false, el };
      boardRef.current?.setPointerCapture(e.pointerId);
      setSelected((cur) => (cur === sq ? cur : sq));
      return;
    }
    setSelected(null);
    onSquareTap?.(sq);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || !d.el) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < 6) return;
    if (!d.moved) {
      d.moved = true;
      setDragId(d.id);
    }
    const rect = boardRef.current!.getBoundingClientRect();
    const cell = rect.width / 8;
    const { x, y } = xy(d.from);
    // Lift the piece above the finger so it stays visible on touch screens.
    const lift = e.pointerType === 'touch' ? cell * 0.7 : 0;
    d.el.style.transform = `translate(${x * cell + dx}px, ${y * cell + dy - lift}px) scale(1.18)`;
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.el) d.el.style.transform = '';
    setDragId(null);
    if (!d.moved) return;
    const sq = sqAt(e.clientX, e.clientY);
    if (sq && sq !== d.from) tryMove(d.from, sq, true);
  };

  const choosePromo = (type: PieceType) => {
    if (!promo) return;
    const { from, to } = promo;
    setPromo(null);
    onMove?.(from, to, type);
  };

  useEffect(() => {
    skipAnim.current = false;
  });

  const squares = [];
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const f = flipped ? 7 - x : x;
      const r = flipped ? y : 7 - y;
      const sq = `${FILES[f]}${r + 1}`;
      const dark = (f + r) % 2 === 0;
      const cls = ['sq', dark ? 'sq-dark' : 'sq-light'];
      if (lastMove && (lastMove[0] === sq || lastMove[1] === sq)) cls.push('sq-last');
      if (selected === sq) cls.push('sq-selected');
      if (check === sq) cls.push('sq-check');
      if (hint && (hint.from === sq || hint.to === sq)) cls.push('sq-hint');
      if (marks?.[sq]) cls.push(`sq-mark-${marks[sq]}`);
      squares.push(
        <div key={sq} className={cls.join(' ')} data-sq={sq}>
          {coords && x === 0 && <span className="coord coord-rank">{r + 1}</span>}
          {coords && y === 7 && <span className="coord coord-file">{FILES[f]}</span>}
          {targets.has(sq) && <span className={occupied.has(sq) ? 'dest dest-capture' : 'dest'} />}
        </div>,
      );
    }
  }

  return (
    <div className="board-frame">
      <div
        ref={boardRef}
        className="board"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="board-squares">{squares}</div>
        {pieces.map((p) => {
          const { x, y } = xy(p.sq);
          const dragging = dragId === p.id;
          return (
            <div
              key={p.id}
              data-pid={p.id}
              className={`piece${dragging ? ' piece-drag' : ''}${skipAnim.current ? ' piece-instant' : ''}`}
              style={{ transform: `translate(${x * 100}%, ${y * 100}%)` }}
            >
              <PieceArt type={p.type} color={p.color} set={pieceSet} />
            </div>
          );
        })}
        {promo && (
          <div className="promo" style={{ left: `${xy(promo.to).x * 12.5}%`, [xy(promo.to).y === 0 ? 'top' : 'bottom']: 0 }}>
            {(['q', 'n', 'r', 'b'] as PieceType[]).map((t) => (
              <button key={t} className="promo-btn" onPointerDown={(e) => e.stopPropagation()} onClick={() => choosePromo(t)}>
                <PieceArt type={t} color={promo.color} set={pieceSet} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
