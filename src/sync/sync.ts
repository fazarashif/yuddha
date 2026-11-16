import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useStore } from '../state/store';
import type { SaveData } from '../state/store';
import { SUPABASE_KEY, SUPABASE_URL } from './config';
import { mergeSaves, pickSave, saveKey } from './merge';
import { useSync } from './state';

const PUSH_DELAY = 2500;
let client: SupabaseClient | null = null;
let signedIn = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
/** The save the server is known to hold, as text. */
let serverKey: string | null = null;
let busy: Promise<void> = Promise.resolve();

const current = () => pickSave(useStore.getState());

/** Runs sync steps one after another so a pull and a push never interleave. */
function queue(step: () => Promise<void>): Promise<void> {
  busy = busy.then(step).catch(() => {
    useSync.setState({ status: 'error' });
  });
  return busy;
}

async function push(): Promise<void> {
  if (!client || !signedIn) return;
  const save = current();
  const key = saveKey(save);
  if (key === serverKey) return;
  useSync.setState({ status: 'syncing' });
  const { error } = await client.rpc('yuddha_store_save', { payload: save });
  if (error) throw error;
  serverKey = key;
  useSync.setState({ status: 'synced', lastSync: Date.now() });
}

async function pull(): Promise<void> {
  if (!client || !signedIn) return;
  useSync.setState({ status: 'syncing' });
  const { data, error } = await client.rpc('yuddha_load_save');
  if (error) throw error;
  const remote = (data as { data?: unknown } | null)?.data ?? null;
  const local = current();
  const merged = mergeSaves(local, remote);
  // Remember what the server holds, so a save that already matches is not sent back.
  serverKey = remote && typeof remote === 'object' ? saveKey(remote as SaveData) : null;
  if (saveKey(merged) !== saveKey(local)) useStore.getState().applySave(merged);
  await push();
  useSync.setState({ status: 'synced', lastSync: Date.now() });
}

function schedulePush() {
  if (!signedIn) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => void queue(push), PUSH_DELAY);
}

/** Connects to the account service and keeps this device and the server in step. */
export function initSync() {
  if (client) return;
  client = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true, autoRefreshToken: true, storageKey: 'yuddha-auth' },
  });

  client.auth.onAuthStateChange((_event, session) => {
    const was = signedIn;
    signedIn = Boolean(session);
    useSync.setState({ ready: true, email: session?.user.email ?? null, status: signedIn ? useSync.getState().status : 'off' });
    // Calling the client from inside this callback can deadlock, so step out first.
    if (signedIn && !was) setTimeout(() => void queue(pull), 0);
    if (!signedIn) serverKey = null;
  });

  useStore.subscribe((state, prev) => {
    if (state.touched !== prev.touched) schedulePush();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void queue(pull);
    else if (pushTimer) {
      clearTimeout(pushTimer);
      void queue(push);
    }
  });
}

export async function signInWithGoogle() {
  initSync();
  await client!.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/profil` } });
}

export async function signOut() {
  if (!client) return;
  // Make sure the last changes reach the server before the session ends.
  await queue(push);
  await client.auth.signOut();
}

/** Sends this device's save as it is, without merging; used after a deliberate reset. */
export function overwriteServer() {
  serverKey = null;
  return queue(push);
}

export const syncNow = () => queue(pull);
