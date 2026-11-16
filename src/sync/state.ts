import { create } from 'zustand';

export type SyncStatus = 'off' | 'syncing' | 'synced' | 'error';

interface SyncState {
  /** False until the saved session, if any, has been read. */
  ready: boolean;
  email: string | null;
  status: SyncStatus;
  lastSync: number | null;
}

/** What the interface needs to know about the account. Not persisted. */
export const useSync = create<SyncState>(() => ({ ready: false, email: null, status: 'off', lastSync: null }));

/** The sync code is loaded on demand so it does not slow the first paint. */
export const loadSync = () => import('./sync');

type SyncModule = Awaited<ReturnType<typeof loadSync>>;

/** Runs something from the sync code; a failed load (for instance offline) shows as a sync error instead of crashing. */
export function withSync(run: (m: SyncModule) => unknown): Promise<void> {
  return loadSync()
    .then((m) => {
      void run(m);
    })
    .catch(() => {
      useSync.setState({ status: 'error' });
    });
}
