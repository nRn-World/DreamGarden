import { useState } from 'react';
import { PLANTS, PLANT_ORDER } from '../game/content/plants';
import { STARTING_PLOTS, PLOT_UNLOCKS } from '../game/content/progression';
import { bonusesFor, dewMultiplier, growthOf, moonwellCharges } from '../game/engine';
import { useGame } from '../game/store';
import { formatDuration, formatNumber, makeT } from '../i18n';
import PlantArt from './PlantArt';
import Icon from './Icon';
import SheetFrame from './SheetFrame';
import BasketContent from './BasketContent';

function useLocaleT() {
  const locale = useGame((s) => s.save.locale ?? 'en');
  return { locale, t: makeT(locale) };
}

export function SeedSheet({ plotIndex }: { plotIndex: number }) {
  const save = useGame((s) => s.save);
  const plant = useGame((s) => s.plant);
  const closeSheet = useGame((s) => s.closeSheet);
  const { locale, t } = useLocaleT();
  const bedNumber = formatNumber(locale, plotIndex + 1);

  return (
    <SheetFrame title={t('plot.seedTitle')} subtitle={t('plot.seedSubtitle', { n: bedNumber })} className="seed-sheet">
      <div className="seed-balance">
        <span>
          <Icon name="dew" size={15} />
          {formatNumber(locale, save.dew)}
        </span>
        <span className="seed-balance-note">{t('hud.dewHint')}</span>
      </div>
      <div className="seed-list">
        {PLANT_ORDER.map((id) => {
          const def = PLANTS[id];
          const locked = save.level < def.unlockLevel || !save.unlockedPlants.includes(id);
          const poor = save.dew < def.seedCost;
          return (
            <button
              type="button"
              key={id}
              className={`seed-card ${locked ? 'is-locked' : ''} ${poor && !locked ? 'is-poor' : ''}`}
              onClick={() => {
                const ok = plant(plotIndex, id);
                if (ok) closeSheet();
              }}
            >
              <span className="seed-art">
                <PlantArt species={id} stage={3} sway={false} />
              </span>
              <span className="seed-copy">
                <span className="seed-name-row">
                  <span className="seed-name">{t(`plant.${id}.name`)}</span>
                  {locked ? (
                    <span className="pill pill-lock">
                      <Icon name="lock" size={10} />
                      {t('seeds.locked', { level: def.unlockLevel })}
                    </span>
                  ) : (
                    <span className="pill pill-tier">{`T${def.tier}`}</span>
                  )}
                </span>
                <span className="seed-line">{t(`plant.${id}.line`)}</span>
                <span className="seed-meta">
                  <span>
                    <Icon name="moon" size={12} />
                    {formatDuration(def.growMs, locale, t)}
                  </span>
                  <span>
                    <Icon name="leaf" size={12} />
                    {def.yieldMin}–{def.yieldMax}
                  </span>
                  <span>
                    <Icon name="water" size={12} />
                    {def.waterNeed}
                  </span>
                </span>
              </span>
              <span className="seed-price">
                <span className="seed-cost">
                  <Icon name="dew" size={13} />
                  {formatNumber(locale, def.seedCost)}
                </span>
                <span className="seed-plant-label">{t('plot.plant')}</span>
              </span>
            </button>
          );
        })}
      </div>
    </SheetFrame>
  );
}

export function PlantSheet({ plotIndex }: { plotIndex: number }) {
  const save = useGame((s) => s.save);
  const now = useGame((s) => s.now);
  const water = useGame((s) => s.water);
  const harvest = useGame((s) => s.harvest);
  const boost = useGame((s) => s.boost);
  const compost = useGame((s) => s.compost);
  const closeSheet = useGame((s) => s.closeSheet);
  const { locale, t } = useLocaleT();
  const [confirmCompost, setConfirmCompost] = useState(false);

  const plot = save.plots[plotIndex];
  const planted = plot?.plant;
  if (!planted) return null;
  const def = PLANTS[planted.species];
  const growth = growthOf(def, planted.plantedAt, planted.watered, now, bonusesFor(save));
  const freeCharges = moonwellCharges(save, now);
  const waterLeft = Math.max(0, def.waterNeed - planted.watered);

  return (
    <SheetFrame title={t('plantDetail.title', { plant: t(`plant.${def.id}.name`) })} subtitle={t(`plant.${def.id}.line`)}>
      <div className="plant-hero">
        <div className={`plant-hero-art ${growth.ripe ? 'is-ripe' : ''}`}>
          <PlantArt species={def.id} stage={growth.stage} progress={growth.progress} />
        </div>
        <div className="plant-hero-info">
          <span className="eyebrow">{t('garden.stage', { n: growth.stage + 1 })}</span>
          <div className="plant-status">
            {growth.ripe ? (
              <span className="status status-ready">
                <Icon name="sparkle" size={13} />
                {t('garden.ready')}
              </span>
            ) : (
              <span className="status">
                <Icon name="moon" size={13} />
                {t('time.left', { time: formatDuration(growth.remainingMs, locale, t) })}
              </span>
            )}
          </div>
          <div className="water-pips" aria-label={t('plantDetail.water', { watered: planted.watered, need: def.waterNeed })}>
            {Array.from({ length: def.waterNeed }, (_, i) => (
              <span key={i} className={`water-pip ${i < planted.watered ? 'is-filled' : ''}`}>
                <Icon name="water" size={12} />
              </span>
            ))}
          </div>
          <span className="plant-water-label">
            {t('plantDetail.water', { watered: planted.watered, need: def.waterNeed })}
          </span>
        </div>
      </div>

      <div className="growth-track" aria-hidden="true">
        <span style={{ width: `${Math.round(growth.progress * 100)}%` }} />
      </div>

      <div className="stat-grid">
        <div className="stat">
          <span className="stat-label">{t('plot.sellPrice', { dew: formatNumber(locale, Math.round(def.sellPrice * dewMultiplier(save))) })}</span>
          <strong>
            {def.yieldMin}–{def.yieldMax} <Icon name="leaf" size={13} />
          </strong>
        </div>
        <div className="stat">
          <span className="stat-label">{t('plantDetail.tip')}</span>
          <strong>{waterLeft > 0 ? `+${Math.round((waterLeft / def.waterNeed) * 40)}%` : '100%'}</strong>
        </div>
      </div>

      <div className="sheet-actions">
        {growth.ripe ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              harvest(plotIndex);
              closeSheet();
            }}
          >
            <Icon name="harvest" size={18} />
            {t('plantDetail.harvest')}
          </button>
        ) : (
          waterLeft > 0 && (
            <button type="button" className="btn btn-primary" onClick={() => water(plotIndex)}>
              <Icon name="water" size={18} />
              {t('garden.water')}
            </button>
          )
        )}
        {!growth.ripe && (
          <button type="button" className="btn btn-soft" onClick={() => boost(plotIndex)}>
            <Icon name="moon" size={17} />
            {freeCharges > 0
              ? t('plantDetail.boostFree')
              : t('plantDetail.boostCost', { cost: 2 })}
          </button>
        )}
      </div>

      <button
        type="button"
        className={`text-button compost ${confirmCompost ? 'is-confirming' : ''}`}
        onClick={() => {
          if (!confirmCompost) {
            setConfirmCompost(true);
            setTimeout(() => setConfirmCompost(false), 4000);
            return;
          }
          compost(plotIndex);
        }}
      >
        {confirmCompost ? t('plantDetail.compostConfirm') : t('plantDetail.compost')}
      </button>
    </SheetFrame>
  );
}

export function PlotSheet({ plotIndex }: { plotIndex: number }) {
  const save = useGame((s) => s.save);
  const unlockPlot = useGame((s) => s.unlockPlot);
  const closeSheet = useGame((s) => s.closeSheet);
  const { locale, t } = useLocaleT();
  const index = plotIndex - STARTING_PLOTS;
  const info = PLOT_UNLOCKS[index];
  if (!info) return null;
  const canLevel = save.level >= info.level;
  const canAfford = save.dew >= info.cost;

  return (
    <SheetFrame title={t('garden.sealed')} subtitle={t('garden.unlock')}>
      <div className="sealed-art" aria-hidden="true">
        <div className="sealed-moon" />
        <div className="sealed-bed">
          <Icon name="lock" size={26} />
        </div>
        <span className="sealed-spark sealed-spark-a" />
        <span className="sealed-spark sealed-spark-b" />
      </div>
      <p className="sheet-paragraph">
        {canLevel ? t('garden.unlockCost', { cost: formatNumber(locale, info.cost), level: info.level }) : t('toast.lockedLevel', { level: info.level })}
      </p>
      <button
        type="button"
        className="btn btn-primary btn-full"
        onClick={() => {
          unlockPlot(plotIndex);
          if (canLevel && canAfford) closeSheet();
        }}
      >
        <Icon name="lock" size={17} />
        {t('garden.unlock')}
      </button>
      {!canAfford && <p className="sheet-footnote">{t('toast.notEnoughDew')}</p>}
    </SheetFrame>
  );
}

export function BasketSheet() {
  const { t } = useLocaleT();
  return (
    <SheetFrame title={t('seeds.harvestTitle')} subtitle={t('seeds.basketHint')}>
      <BasketContent />
    </SheetFrame>
  );
}
