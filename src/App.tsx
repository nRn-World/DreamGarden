import { useEffect, useRef, useState } from 'react';
import Backdrop from './components/Backdrop';
import BottomNav from './components/BottomNav';
import GardenScene from './components/GardenScene';
import Icon from './components/Icon';
import LevelUpOverlay from './components/LevelUpOverlay';
import SheetHost from './components/SheetHost';
import Toasts from './components/Toasts';
import Tutorial from './components/Tutorial';
import SleepOverlay from './components/SleepOverlay';
import Fireflies from './components/Fireflies';
import Onboarding from './screens/Onboarding';
import Title from './screens/Title';
import SeedsScreen from './screens/SeedsScreen';
import WishesScreen from './screens/WishesScreen';
import SpiritsScreen from './screens/SpiritsScreen';
import JournalScreen from './screens/JournalScreen';
import { useGame } from './game/store';
import { audio } from './game/audio';
import { weatherOf } from './game/engine';
import { asset } from './lib/assets';

function Splash() {
  return (
    <div className="splash">
      <div className="splash-mark">
        <img
          className="splash-brand"
          src={asset('brand/nrnworld-mark.png')}
          alt="nRnWorld"
          width={96}
          height={96}
          decoding="async"
        />
        <Icon name="sparkle" size={22} className="splash-spark" />
      </div>
      <h1>Dream Garden</h1>
      <span className="splash-loading">
        <span className="splash-dot" />
        <span className="splash-dot" />
        <span className="splash-dot" />
      </span>
      <p>By nRnWorld</p>
    </div>
  );
}

export default function App() {
  const loaded = useGame((s) => s.loaded);
  const save = useGame((s) => s.save);
  const screen = useGame((s) => s.screen);
  const sheet = useGame((s) => s.sheet);
  const welcomeBack = useGame((s) => s.welcomeBack);
  const init = useGame((s) => s.init);
  const tick = useGame((s) => s.tick);
  const openSheet = useGame((s) => s.openSheet);
  const [entered, setEntered] = useState(false);
  const [splash, setSplash] = useState(true);
  const welcomed = useRef(false);

  useEffect(() => {
    init();
    const timer = setTimeout(() => setSplash(false), 1050);
    return () => clearTimeout(timer);
  }, [init]);

  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') tick();
    }, 1000);
    const onVisible = () => tick();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [loaded, tick]);

  // After 21:00 the whole game warms slightly, which is easier on tired eyes.
  useEffect(() => {
    const apply = () => {
      const hour = new Date().getHours();
      document.documentElement.dataset.late = hour >= 21 || hour < 5 ? '1' : '0';
    };
    apply();
    const id = window.setInterval(apply, 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const unlock = () => audio.unlock();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(() => {
    if (!entered || !welcomeBack || welcomed.current) return;
    welcomed.current = true;
    if (!sheet) openSheet({ kind: 'offline' });
  }, [entered, welcomeBack, sheet, openSheet]);

  if (!loaded || splash) {
    return (
      <div className="app-shell" dir="ltr">
        <Backdrop />
        <div className="app-frame">
          <Splash />
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case 'garden':
        return (
          <>
            <GardenScene />
            <Fireflies />
          </>
        );
      case 'seeds':
        return <SeedsScreen />;
      case 'wishes':
        return <WishesScreen />;
      case 'spirits':
        return <SpiritsScreen />;
      case 'journal':
        return <JournalScreen />;
      default:
        return <GardenScene />;
    }
  };

  return (
    <div
      className="app-shell"
      data-screen={!save.onboarded ? 'onboarding' : !entered ? 'title' : screen}
      data-weather={save.night.date ? weatherOf(save.night.date) : 'clear'}
    >
      <Backdrop />
      <div className="app-frame">
        {!save.onboarded ? (
          <Onboarding />
        ) : !entered ? (
          <Title onEnter={() => setEntered(true)} />
        ) : (
          <>
            <div className="screen-slot" key={screen}>
              {renderScreen()}
            </div>
            <BottomNav />
            <Tutorial />
          </>
        )}

        <SheetHost />
        <LevelUpOverlay />
        <Toasts />
        <SleepOverlay />

      </div>
    </div>
  );
}
