import { useGame } from '../game/store';
import type { Screen } from '../game/store';
import { makeT } from '../i18n';
import { availableChapter } from '../game/engine';
import { audio, haptic } from '../game/audio';
import Icon, { type IconName } from './Icon';

const TABS: { screen: Screen; icon: IconName; label: 'nav.garden' | 'nav.seeds' | 'nav.wishes' | 'nav.spirits' | 'nav.journal' }[] = [
  { screen: 'garden', icon: 'leaf', label: 'nav.garden' },
  { screen: 'seeds', icon: 'seed', label: 'nav.seeds' },
  { screen: 'wishes', icon: 'wish', label: 'nav.wishes' },
  { screen: 'spirits', icon: 'spirit', label: 'nav.spirits' },
  { screen: 'journal', icon: 'book', label: 'nav.journal' },
];

export default function BottomNav() {
  const screen = useGame((s) => s.screen);
  const go = useGame((s) => s.go);
  const locale = useGame((s) => s.save.locale ?? 'en');
  const haptics = useGame((s) => s.save.settings.haptics);
  const save = useGame((s) => s.save);
  const t = makeT(locale);
  const wishReady = save.orders.some(
    (order) => order.items.every((item) => (save.inventory[item.plant] ?? 0) >= item.count),
  );
  const storyReady = availableChapter(save) !== null;

  return (
    <nav className="dock" aria-label={t('app.name')}>
      {TABS.map((tab) => {
        const active = screen === tab.screen;
        return (
          <button
            key={tab.screen}
            type="button"
            className={`dock-item ${active ? 'is-active' : ''}`}
            aria-current={active ? 'page' : undefined}
            onClick={() => {
              if (active) return;
              audio.sfx('tap');
              haptic(5, haptics);
              go(tab.screen);
            }}
          >
            <span className="dock-icon">
              <Icon name={tab.icon} size={21} />
              {tab.screen === 'wishes' && wishReady && <span className="dock-dot" aria-hidden="true" />}
              {tab.screen === 'journal' && storyReady && <span className="dock-dot" aria-hidden="true" />}
            </span>
            <span className="dock-label">{t(tab.label)}</span>
          </button>
        );
      })}
    </nav>
  );
}
