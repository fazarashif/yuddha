import { BookOpenText, ChartLineUp, House, Sword, UserCircle } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { setVolumes, startMusic, unlockAudio } from './audio/sound';
import { Cermin } from './features/cermin/Cermin';
import { Impor } from './features/impor/Impor';
import { Lakon } from './features/lakon/Lakon';
import { LessonPlayer } from './features/lakon/LessonPlayer';
import { Laku } from './features/laku/Laku';
import { Latihan } from './features/latihan/Latihan';
import { Luka } from './features/luka/Luka';
import { Mulai } from './features/mulai/Mulai';
import { Profil } from './features/profil/Profil';
import { Puzzle } from './features/puzzle/Puzzle';
import { Game } from './features/tanding/Game';
import { Review } from './features/tanding/Review';
import { Select } from './features/tanding/Select';
import { useT } from './i18n';
import type { Key } from './i18n/strings';
import { Lab } from './lab/Lab';
import { useStore } from './state/store';
import { withSync } from './sync/state';

const TABS: { to: string; key: Key; icon: typeof House }[] = [
  { to: '/', key: 'nav.laku', icon: House },
  { to: '/lakon', key: 'nav.lakon', icon: BookOpenText },
  { to: '/tanding', key: 'nav.tanding', icon: Sword },
  { to: '/cermin', key: 'nav.cermin', icon: ChartLineUp },
  { to: '/profil', key: 'nav.profil', icon: UserCircle },
];

/** Screens that take the whole viewport and hide the navigation. */
const IMMERSIVE = /^\/(lakon\/.+|tanding\/.+|ulasan\/.+|latihan|luka|puzzle|impor)/;

function Nav() {
  const t = useT();
  const [path] = useLocation();
  return (
    <nav className="nav" aria-label="Utama">
      <span className="nav-mark">Yuddha</span>
      {TABS.map(({ to, key, icon: Icon }) => {
        const on = to === '/' ? path === '/' : path.startsWith(to);
        return (
          <Link key={to} href={to} className={`nav-tab${on ? ' nav-on' : ''}`} aria-current={on ? 'page' : undefined}>
            <Icon size={24} weight={on ? 'fill' : 'regular'} />
            <span>{t(key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function App() {
  const settings = useStore((s) => s.settings);
  const onboarded = useStore((s) => s.onboarded);
  const [path] = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = settings.theme;
    root.dataset.board = settings.board;
    root.lang = settings.lang;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', settings.theme === 'dark' ? '#0f1524' : '#efe6d2');
  }, [settings.theme, settings.board, settings.lang]);

  // Browsers hold sound back until the first gesture.
  useEffect(() => {
    const first = () => {
      const s = useStore.getState().settings;
      unlockAudio();
      setVolumes(s.sfx, s.music);
      if (s.music > 0) startMusic();
    };
    window.addEventListener('pointerdown', first, { once: true });
    return () => window.removeEventListener('pointerdown', first);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  // Restores a saved sign-in, or finishes one that just came back from Google.
  // If the first attempt fails for lack of a connection, it is tried again once back online.
  useEffect(() => {
    const start = () => void withSync((m) => m.initSync());
    start();
    window.addEventListener('online', start);
    return () => window.removeEventListener('online', start);
  }, []);

  if (path === '/lab') return <Lab />;
  if (!onboarded) return <Mulai />;

  const immersive = IMMERSIVE.test(path);
  return (
    <div className={`app${immersive ? ' app-immersive' : ''}`}>
      {!immersive && <Nav />}
      <main className="main">
        <Switch>
          <Route path="/" component={Laku} />
          <Route path="/lakon" component={Lakon} />
          <Route path="/lakon/:id">{(p) => <LessonPlayer key={p.id} lessonId={p.id} />}</Route>
          <Route path="/tanding" component={Select} />
          <Route path="/tanding/:id">{(p) => <Game key={p.id} botId={p.id} />}</Route>
          <Route path="/ulasan/:id">{(p) => <Review key={p.id} gameId={p.id} />}</Route>
          <Route path="/latihan" component={Latihan} />
          <Route path="/luka" component={Luka} />
          <Route path="/puzzle" component={Puzzle} />
          <Route path="/impor" component={Impor} />
          <Route path="/cermin" component={Cermin} />
          <Route path="/profil" component={Profil} />
          <Route component={Laku} />
        </Switch>
      </main>
    </div>
  );
}
