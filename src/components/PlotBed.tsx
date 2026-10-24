import { PLANTS } from '../game/content/plants';
import { PLOT_UNLOCKS, STARTING_PLOTS } from '../game/content/progression';
import { bonusesFor, growthOf } from '../game/engine';
import { useGame } from '../game/store';
import { formatDuration, formatNumber, makeT } from '../i18n';
import PlantArt from './PlantArt';
import Icon from './Icon';

interface Props {
  index: number;
  hint?: 'plant' | 'water' | 'harvest' | null;
}

function plotUnlockFor(index: number) {
  if (index < STARTING_PLOTS) return null;
  return PLOT_UNLOCKS[index - STARTING_PLOTS] ?? null;
}

export default function PlotBed({ index, hint }: Props) {
  const save = useGame((s) => s.save);
  const now = useGame((s) => s.now);
  const openSheet = useGame((s) => s.openSheet);
  const harvest = useGame((s) => s.harvest);
  const water = useGame((s) => s.water);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  const plot = save.plots[index];
  if (!plot) return null;
  const plant = plot.plant;
  const def = plant ? PLANTS[plant.species] : null;
  const growth = plant && def ? growthOf(def, plant.plantedAt, plant.watered, now, bonusesFor(save)) : null;
  const unlock = plotUnlockFor(index);
  const name = def ? t(`plant.${def.id}.name`) : '';
  const thirsty = !!plant && !!def && plant.watered < def.waterNeed;
  const ripe = !!growth?.ripe;
  const waterLeft = plant && def ? Math.max(0, def.waterNeed - plant.watered) : 0;

  const label = !plot.unlocked
    ? t('aria.sealedPlot')
    : !plant
      ? t('garden.empty')
      : ripe
        ? t('aria.harvest', { plant: name })
        : thirsty
          ? t('aria.water', { plant: name })
          : name;

  const onClick = () => {
    if (!plot.unlocked) {
      openSheet({ kind: 'plot', plot: index });
      return;
    }
    if (!plant) {
      openSheet({ kind: 'seed', plot: index });
      return;
    }
    if (ripe) {
      harvest(index);
      return;
    }
    if (thirsty) {
      water(index);
      return;
    }
    openSheet({ kind: 'plant', plot: index });
  };

  return (
    <button
      type="button"
      className={[
        'plot',
        !plot.unlocked ? 'is-locked' : '',
        plant ? 'is-planted' : 'is-empty',
        ripe ? 'is-ripe' : '',
        thirsty && !ripe ? 'is-thirsty' : '',
        hint ? `is-hint hint-${hint}` : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      aria-label={label}
      style={{ ['--bed-delay' as string]: `${index * 0.35}s` }}
    >
      <span className="plot-surface" aria-hidden="true">
        <span className="plot-stone stone-a" />
        <span className="plot-stone stone-b" />
        <span className="plot-sprig" />
      </span>

      {!plot.unlocked && (
        <span className="plot-locked" aria-hidden="true">
          <span className="plot-lock-seal">
            <Icon name="lock" size={17} />
          </span>
          {unlock && (
            <>
              <span className="plot-lock-level">{t('seeds.locked', { level: unlock.level })}</span>
              <span className="plot-lock-cost">
                <Icon name="dew" size={11} />
                {formatNumber(locale, unlock.cost)}
              </span>
            </>
          )}
        </span>
      )}

      {plot.unlocked && !plant && (
        <span className="plot-empty" aria-hidden="true">
          <span className="plot-plus">
            <Icon name="plus" size={20} />
          </span>
          <span className="plot-empty-label">{t('garden.empty')}</span>
        </span>
      )}

      {plant && def && growth && (
        <>
          <span className="plot-glow" aria-hidden="true" />
          <PlantArt
            species={def.id}
            stage={growth.stage}
            progress={growth.progress}
            className={growth.stage === 0 ? 'is-sprout' : ''}
          />
          {ripe ? (
            <span className="plot-ready">
              <Icon name="sparkle" size={11} />
              {t('garden.ready')}
            </span>
          ) : (
            <span className={`plot-timer ${thirsty ? 'is-thirsty' : ''}`}>
              {thirsty && <Icon name="water" size={12} />}
              {formatDuration(growth.remainingMs, locale, t)}
            </span>
          )}
          <span className="plot-progress" aria-hidden="true">
            <span style={{ width: `${Math.round(growth.progress * 100)}%` }} />
          </span>
          {waterLeft > 0 && !ripe && (
            <span className="plot-water-dots" aria-hidden="true">
              {Array.from({ length: def.waterNeed }, (_, i) => (
                <i key={i} className={i < plant.watered ? 'is-filled' : ''} />
              ))}
            </span>
          )}
        </>
      )}

      {hint && <span className="hint-ring" aria-hidden="true" />}
    </button>
  );
}
