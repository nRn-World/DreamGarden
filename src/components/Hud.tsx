import { useGame, goalText } from '../game/store';
import {
  levelXpNeeded,
  harmonyOf,
  moonwellCharges,
  inventoryTotal,
  availableChapter,
  nightProgress,
} from '../game/engine';
import { formatNumber, makeT } from '../i18n';
import Icon from './Icon';

export default function Hud({ full = true }: { full?: boolean }) {
  const save = useGame((s) => s.save);
  const now = useGame((s) => s.now);
  const go = useGame((s) => s.go);
  const openSheet = useGame((s) => s.openSheet);
  const t = makeT(save.locale ?? 'en');
  const needed = levelXpNeeded(save.level);
  const ratio = Math.min(1, save.xp / needed);
  const r = 19;
  const circumference = 2 * Math.PI * r;
  const basket = inventoryTotal(save);
  const harmony = harmonyOf(save);
  const charges = moonwellCharges(save, now);
  const goal = goalText(save, now);
  const chapter = availableChapter(save);
  const night = nightProgress(save);
  const nightDone = night.filter((task) => task.done).length;
  const nightReady = night.length > 0 && nightDone === night.length;

  const interact = () => {
    if (goal === 'goal.story' && chapter) {
      openSheet({ kind: 'story', index: chapter.index });
      return;
    }
    if (goal === 'goal.sell') {
      openSheet({ kind: 'basket' });
      return;
    }
    if (goal === 'goal.deliver') {
      go('wishes');
    }
  };

  const interactive = goal === 'goal.story' || goal === 'goal.sell' || goal === 'goal.deliver';

  return (
    <header className={`hud ${full ? 'hud-full' : 'hud-compact'}`}>
      <div className="hud-row">
        {full ? (
          <button
            type="button"
            className="level-ring"
            onClick={() => {
              go('journal');
              useGame.getState().setJournalTab('stats');
            }}
            aria-label={t('common.level', { level: save.level })}
          >
            <svg viewBox="0 0 46 46" aria-hidden="true">
              <circle cx="23" cy="23" r={r} className="level-ring-track" />
              <circle
                cx="23"
                cy="23"
                r={r}
                className="level-ring-value"
                strokeDasharray={`${circumference * ratio} ${circumference}`}
                transform="rotate(-90 23 23)"
              />
            </svg>
            <span className="level-ring-number">{formatNumber(save.locale ?? 'en', save.level)}</span>
          </button>
        ) : (
          <span className="hud-orb" aria-hidden="true">
            <Icon name="leaf" size={18} />
          </span>
        )}

        <div className="currency-group">
          <span className="currency currency-dew" title={t('hud.dewHint')}>
            <Icon name="dew" size={17} />
            <b>{formatNumber(save.locale ?? 'en', save.dew)}</b>
          </span>
          <span className="currency currency-stardust" title={t('hud.starDustHint')}>
            <Icon name="stardust" size={15} />
            <b>{formatNumber(save.locale ?? 'en', save.stardust)}</b>
          </span>
        </div>

        <div className="hud-actions">
          <button
            type="button"
            className="icon-button basket-button"
            onClick={() => openSheet({ kind: 'basket' })}
            aria-label={t('aria.basket')}
          >
            <Icon name="basket" size={20} />
            {basket > 0 && <span className="basket-badge">{formatNumber(save.locale ?? 'en', basket)}</span>}
          </button>
          <button
            type="button"
            className="icon-button book-button"
            onClick={() => openSheet({ kind: 'book' })}
            aria-label={t('aria.book')}
          >
            <Icon name="book" size={20} />
            {chapter && <span className="book-dot" aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={() => openSheet({ kind: 'settings' })}
            aria-label={t('aria.settings')}
          >
            <Icon name="settings" size={20} />
          </button>
        </div>
      </div>

      {full && (
        <div className="hud-meta">
          <button
            type="button"
            className={`goal-ribbon ${interactive ? 'is-interactive' : ''}`}
            onClick={interactive ? interact : undefined}
            aria-label={t(goal)}
          >
            <span className="goal-spark" aria-hidden="true">
              <Icon name="sparkle" size={15} />
            </span>
            <span className="goal-text">{t(goal)}</span>
            {interactive && <Icon name="chevron" size={15} className="goal-chevron" />}
          </button>
          <button
            type="button"
            className={`hud-chip night-chip ${save.night.slept ? 'is-slept' : nightReady ? 'is-ready' : ''}`}
            onClick={() => openSheet({ kind: 'night' })}
            aria-label={t('aria.night')}
          >
            <Icon name={save.night.slept || nightReady ? 'check' : 'moon'} size={13} />
            {t('night.chip', { done: nightDone, total: night.length })}
          </button>
          <span className="hud-chip" title={t('hud.harmonyValue', { value: harmony, percent: Math.round(harmony * 0.4) })}>
            <Icon name="leaf" size={13} />
            {formatNumber(save.locale ?? 'en', harmony)}
          </span>
          <span
            className={`hud-chip moonwell-chip ${charges === 0 ? 'is-empty' : ''}`}
            title={charges > 0 ? t('hud.moonwellFree', { count: charges }) : t('hud.moonwellEmpty', { cost: 2 })}
            aria-label={charges > 0 ? t('hud.moonwellFree', { count: charges }) : t('hud.moonwellEmpty', { cost: 2 })}
          >
            <Icon name="moon" size={13} />
            {formatNumber(save.locale ?? 'en', charges)}
          </span>
        </div>
      )}
    </header>
  );
}
