import { useCallback } from 'react';
import type { L } from '../content/types';
import { useStore } from '../state/store';
import { en, id } from './strings';
import type { Key } from './strings';

const TABLES = { id, en };

export type T = (key: Key, vars?: Record<string, string | number>) => string;

/** UI strings in the chosen language. `{name}` placeholders are filled from vars. */
export function useT(): T {
  const lang = useStore((s) => s.settings.lang);
  return useCallback(
    (key, vars) => {
      let out: string = TABLES[lang][key];
      if (vars) for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
      return out;
    },
    [lang],
  );
}

/** Picks the right language out of a bilingual content string. */
export function useL(): (text: L) => string {
  const lang = useStore((s) => s.settings.lang);
  return useCallback((text) => text[lang], [lang]);
}
