/**
 * Picks up a new version of the app while it is open.
 *
 * The service worker activates a new version on its own (skipWaiting + clientsClaim), but a page
 * that is already open keeps running the old code until it reloads. This reloads it, though never
 * in the middle of a game or a lesson: there the reload waits until the player is back on a menu.
 */

let pending = false;
let started = false;
let isBusy: (path: string) => boolean = () => false;

const reloadIfIdle = () => {
  if (pending && !isBusy(location.pathname)) location.reload();
};

export function watchForUpdates(busy: (path: string) => boolean) {
  isBusy = busy;
  if (started || !('serviceWorker' in navigator)) return;
  started = true;
  const sw = navigator.serviceWorker;
  // The very first install also takes control of the page; that is not an update.
  const hadController = Boolean(sw.controller);
  sw.addEventListener('controllerchange', () => {
    if (!hadController || pending) return;
    pending = true;
    reloadIfIdle();
  });
  void sw.ready.then((reg) => {
    const check = () => void reg.update().catch(() => {});
    // An installed app can stay open for days, so look for a new version now and then.
    window.setInterval(check, 30 * 60 * 1000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') check();
    });
  });
}

/** Called on every route change, so a waiting update lands as soon as the player leaves a game. */
export function onRouteChange() {
  reloadIfIdle();
}
