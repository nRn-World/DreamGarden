import { useGame } from '../game/store';
import { PLANTS } from '../game/content/plants';
import { bonusesFor, growthOf } from '../game/engine';
import { formatDuration, makeT, type DictKey } from '../i18n';
import Icon from './Icon';

export default function Tutorial() {
  const save = useGame((s) => s.save);
  const now = useGame((s) => s.now);
  const screen = useGame((s) => s.screen);
  const next = useGame((s) => s.nextTutorial);
  const finish = useGame((s) => s.finishTutorial);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  if (save.tutorial >= 6 || screen !== 'garden') return null;

  const step = Math.min(5, Math.max(1, save.tutorial));
  const planted = save.plots.find((p) => p.plant);
  let waitText = '';
  if (step === 3 && planted?.plant) {
    const def = PLANTS[planted.plant.species];
    const growth = growthOf(def, planted.plant.plantedAt, planted.plant.watered, now, bonusesFor(save));
    if (!growth.ripe) waitText = t('tutorial.waiting', { time: formatDuration(growth.remainingMs, locale, t) });
  }

  return (
    <aside className="tutorial-card" role="dialog" aria-label={t('tutorial.title')} aria-live="polite">
      <div className="tutorial-head">
        <span className="tutorial-orb">
          <Icon name="sparkle" size={16} />
        </span>
        <div>
          <span className="eyebrow">
            {step} / 5
          </span>
          <h3>{t('tutorial.title')}</h3>
        </div>
      </div>
      <p className="tutorial-copy">{t(`tutorial.step.${step}` as DictKey)}</p>
      {waitText && <span className="tutorial-wait">{waitText}</span>}
      <div className="tutorial-foot">
        <div className="tutorial-dots" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i + 1 < step ? 'is-done' : i + 1 === step ? 'is-active' : ''} />
          ))}
        </div>
        <div className="tutorial-actions">
          <button type="button" className="text-button" onClick={finish}>
            {t('tutorial.skip')}
          </button>
          <button type="button" className="mini-button tutorial-next" onClick={next}>
            {t('tutorial.next')}
            <Icon name="chevron" size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
