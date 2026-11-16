import { ArrowLeft, X } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { KI_SABDA } from '../content/characters';
import type { FaceSpec, Mood } from '../content/types';
import { Avatar, NyalaIcon } from './Avatar';

export function TopBar({ title, back, close, right }: { title?: ReactNode; back?: string; close?: () => void; right?: ReactNode }) {
  const [, go] = useLocation();
  return (
    <header className="topbar">
      {back && (
        <button className="icon-btn" onClick={() => go(back)} aria-label="Kembali">
          <ArrowLeft size={22} />
        </button>
      )}
      {close && (
        <button className="icon-btn" onClick={close} aria-label="Tutup">
          <X size={22} />
        </button>
      )}
      <div className="topbar-title">{title}</div>
      <div className="topbar-right">{right}</div>
    </header>
  );
}

/** A character speaking. Ki Sabda by default. */
export function Bubble({
  face = KI_SABDA,
  who,
  mood = 'neutral',
  name,
  tone,
  children,
}: {
  face?: FaceSpec;
  who?: 'nyala';
  mood?: Mood;
  name?: string;
  tone?: 'good' | 'bad';
  children: ReactNode;
}) {
  return (
    <div className={`bubble${tone ? ` bubble-${tone}` : ''}`}>
      {who === 'nyala' ? <NyalaIcon size={52} mood={mood} /> : <Avatar spec={face} mood={mood} size={52} label={name} />}
      <div className="bubble-body">
        {name && <div className="bubble-name">{name}</div>}
        <div className="bubble-text">{children}</div>
      </div>
    </div>
  );
}

export function Sheet({ open, onClose, children }: { open: boolean; onClose?: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="sheet-scrim" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function Meter({ value, max, tone }: { value: number; max: number; tone?: 'gold' | 'sukma' }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="meter" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className={`meter-fill meter-${tone ?? 'gold'}`} style={{ width: `${pct}%` }} />
    </div>
  );
}
