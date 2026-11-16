import { beforeEach, describe, expect, it, vi } from 'vitest';

/** A stand-in for the account service: one save per signed-in user. */
const server = {
  save: null as unknown,
  stores: 0,
  loads: 0,
  fail: false,
  authListener: null as null | ((event: string, session: unknown) => void),
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      onAuthStateChange: (cb: (event: string, session: unknown) => void) => {
        server.authListener = cb;
      },
      signOut: async () => server.authListener?.('SIGNED_OUT', null),
    },
    rpc: async (name: string, args?: { payload: unknown }) => {
      if (server.fail) return { data: null, error: new Error('offline') };
      if (name === 'yuddha_load_save') {
        server.loads += 1;
        return { data: server.save ? { data: server.save, updated_at: 'now' } : null, error: null };
      }
      server.stores += 1;
      server.save = JSON.parse(JSON.stringify(args!.payload));
      return { data: 'now', error: null };
    },
  }),
}));

vi.stubGlobal('document', { addEventListener: () => undefined, visibilityState: 'visible' });

const { useStore } = await import('../state/store');
const { useSync } = await import('./state');
const sync = await import('./sync');

const settle = async () => {
  await vi.advanceTimersByTimeAsync(10);
  await sync.syncNow();
};
const signIn = async () => {
  server.authListener!('SIGNED_IN', { user: { email: 'player@example.test' } });
  await settle();
};

describe('sync', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    sync.initSync();
    server.authListener!('SIGNED_OUT', null);
    server.save = null;
    server.fail = false;
    useStore.getState().resetAll();
    await vi.advanceTimersByTimeAsync(5000);
    server.stores = 0;
    server.loads = 0;
  });

  it('does nothing while signed out', async () => {
    useStore.getState().addXp(5);
    await vi.advanceTimersByTimeAsync(5000);
    expect(server.stores).toBe(0);
    expect(useSync.getState().email).toBeNull();
  });

  it('uploads the local save on first sign-in', async () => {
    useStore.getState().finishOnboarding(800);
    useStore.getState().addXp(30);
    await signIn();
    expect((server.save as { xp: number }).xp).toBe(30);
    expect(useSync.getState()).toMatchObject({ email: 'player@example.test', status: 'synced' });
  });

  it('a fresh device picks up the save from the server', async () => {
    server.save = { onboarded: true, level: 1100, xp: 240, lessons: { 'b1-1': { at: 1, mistakes: 0 } }, games: [], luka: [], beaten: {}, touched: 50 };
    expect(useStore.getState().onboarded).toBe(false);
    await signIn();
    const s = useStore.getState();
    expect(s.onboarded).toBe(true);
    expect(s.level).toBe(1100);
    expect(s.xp).toBe(240);
    expect(Object.keys(s.lessons)).toEqual(['b1-1']);
  });

  it('sends later changes after a short pause, once', async () => {
    useStore.getState().finishOnboarding(800);
    await signIn();
    const before = server.stores;
    useStore.getState().addXp(10);
    useStore.getState().addXp(10);
    await vi.advanceTimersByTimeAsync(1000);
    expect(server.stores).toBe(before);
    await vi.advanceTimersByTimeAsync(3000);
    expect(server.stores).toBe(before + 1);
    expect((server.save as { xp: number }).xp).toBe(20);
  });

  it('does not re-send a save the server already has', async () => {
    useStore.getState().finishOnboarding(800);
    await signIn();
    const before = server.stores;
    await sync.syncNow();
    await sync.syncNow();
    expect(server.stores).toBe(before);
  });

  it('combines progress made on two devices', async () => {
    useStore.getState().finishOnboarding(800);
    useStore.getState().completeLesson('b1-1', 2);
    await signIn();
    // Another device adds a lesson to the server copy.
    const other = server.save as { lessons: Record<string, unknown>; touched: number };
    other.lessons['b1-2'] = { at: 9, mistakes: 0 };
    useStore.getState().completeLesson('b1-3', 1);
    await sync.syncNow();
    expect(Object.keys(useStore.getState().lessons).sort()).toEqual(['b1-1', 'b1-2', 'b1-3']);
    expect(Object.keys((server.save as { lessons: object }).lessons).sort()).toEqual(['b1-1', 'b1-2', 'b1-3']);
  });

  it('a reset replaces the server copy instead of merging it back', async () => {
    useStore.getState().finishOnboarding(800);
    useStore.getState().addXp(90);
    await signIn();
    useStore.getState().resetAll();
    await sync.overwriteServer();
    expect((server.save as { xp: number }).xp).toBe(0);
    await sync.syncNow();
    expect(useStore.getState().xp).toBe(0);
  });

  it('reports a failed sync and recovers on the next try', async () => {
    useStore.getState().finishOnboarding(800);
    await signIn();
    server.fail = true;
    useStore.getState().addXp(7);
    await sync.syncNow();
    expect(useSync.getState().status).toBe('error');
    server.fail = false;
    await sync.syncNow();
    expect(useSync.getState().status).toBe('synced');
    expect((server.save as { xp: number }).xp).toBe(7);
  });
});
