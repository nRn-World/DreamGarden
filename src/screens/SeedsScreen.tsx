import { useState } from 'react';
import Hud from '../components/Hud';
import BasketContent from '../components/BasketContent';
import DecoArt from '../components/DecoArt';
import PlantArt from '../components/PlantArt';
import Icon from '../components/Icon';
import { DECO_ORDER, DECORATIONS } from '../game/content/spirits';
import { PLANTS, PLANT_ORDER } from '../game/content/plants';
import { harmonyOf } from '../game/engine';
import { useGame } from '../game/store';
import { formatDuration, formatNumber, makeT } from '../i18n';

type Tab = 'seeds' | 'decor' | 'basket';

export default function SeedsScreen() {
  const save = useGame((s) => s.save);
  const plant = useGame((s) => s.plant);
  const buyDecoration = useGame((s) => s.buyDecoration);
  const togglePlace = useGame((s) => s.togglePlaceDecoration);
  const notify = useGame((s) => s.notify);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  const [tab, setTab] = useState<Tab>('seeds');
  const emptyBed = save.plots.find((p) => p.unlocked && !p.plant);
  const harmony = harmonyOf(save);

  const plantInGarden = (id: (typeof PLANT_ORDER)[number]) => {
    if (!emptyBed) {
      notify(t('seeds.noBed'), 'leaf', 'warn');
      return;
    }
    plant(emptyBed.id, id);
  };

  return (
    <section className="page" aria-label={t('seeds.title')}>
      <Hud full={false} />
      <div className="page-scroll">
        <header className="page-head">
          <span className="eyebrow">{t('nav.seeds')}</span>
          <h1>{t('seeds.title')}</h1>
          <p>{t('seeds.subtitle')}</p>
        </header>

        <div className="segmented" role="tablist" aria-label={t('seeds.title')}>
          {(['seeds', 'decor', 'basket'] as Tab[]).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={`segment ${tab === key ? 'is-active' : ''}`}
              onClick={() => setTab(key)}
            >
              {key === 'seeds' ? t('seeds.tabSeeds') : key === 'decor' ? t('seeds.tabDecor') : t('seeds.tabHarvest')}
            </button>
          ))}
        </div>

        {tab === 'seeds' && (
          <div className="shop-grid">
            {PLANT_ORDER.map((id) => {
              const def = PLANTS[id];
              const locked = save.level < def.unlockLevel || !save.unlockedPlants.includes(id);
              const poor = save.dew < def.seedCost;
              return (
                <article
                  key={id}
                  className={`shop-card ${locked ? 'is-locked' : ''}`}
                  style={{
                    ['--card-petal' as string]: def.palette.petal,
                    ['--card-glow' as string]: def.palette.glow,
                    ['--card-deep' as string]: def.palette.petalDeep,
                  }}
                >
                  <div className="shop-card-art">
                    <PlantArt species={id} stage={3} sway={false} />
                    {locked && (
                      <span className="shop-lock">
                        <Icon name="lock" size={14} />
                        {t('seeds.locked', { level: def.unlockLevel })}
                      </span>
                    )}
                  </div>
                  <div className="shop-card-body">
                    <div className="shop-name-row">
                      <h2>{t(`plant.${id}.name`)}</h2>
                      <span className="pill pill-tier">T{def.tier}</span>
                    </div>
                    <p className="shop-line">{t(`plant.${id}.line`)}</p>
                    <div className="shop-stats">
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
                    </div>
                    <div className="shop-foot">
                      <span className={`shop-price ${poor ? 'is-poor' : ''}`}>
                        <Icon name="dew" size={13} />
                        {formatNumber(locale, def.seedCost)}
                      </span>
                      <button
                        type="button"
                        className="mini-button shop-plant"
                        onClick={() => plantInGarden(id)}
                        aria-label={locked ? t('aria.lockedPlant', { plant: t(`plant.${id}.name`), level: def.unlockLevel }) : t('aria.plant', { plant: t(`plant.${id}.name`) })}
                      >
                        {locked ? t('common.locked') : t('seeds.plantHere')}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
            {!emptyBed && <p className="shop-note">{t('seeds.noBed')}</p>}
          </div>
        )}

        {tab === 'decor' && (
          <>
            <div className="decor-summary">
              <span className="decor-summary-icon">
                <Icon name="leaf" size={18} />
              </span>
              <span>
                <strong>{t('decor.total', { value: harmony })}</strong>
                <span>{t('hud.harmonyValue', { value: harmony, percent: Math.round(harmony * 0.4) })}</span>
              </span>
            </div>
            <div className="decor-grid">
              {DECO_ORDER.map((id) => {
                const def = DECORATIONS[id];
                const owned = save.decorations[id];
                const placed = save.placedDecorations.includes(id);
                const locked = save.level < def.unlockLevel;
                return (
                  <article key={id} className={`decor-card ${owned ? 'is-owned' : ''} ${placed ? 'is-placed' : ''}`}>
                    <div className="decor-card-art">
                      <DecoArt id={id} />
                    </div>
                    <div className="decor-card-body">
                      <div className="shop-name-row">
                        <h2>{t(`deco.${id}.name`)}</h2>
                        <span className="pill pill-tier">+{def.harmony}</span>
                      </div>
                      <p className="shop-line">{t(`deco.${id}.line`)}</p>
                      {placed && <span className="placed-tag">{t('decor.total', { value: def.harmony })}</span>}
                      <div className="shop-foot">
                        {locked ? (
                          <span className="shop-locked-label">
                            <Icon name="lock" size={12} />
                            {t('decor.locked', { level: def.unlockLevel })}
                          </span>
                        ) : owned ? (
                          <button type="button" className={`mini-button ${placed ? 'is-quiet' : ''}`} onClick={() => togglePlace(id)}>
                            {placed ? t('decor.remove') : t('decor.place')}
                          </button>
                        ) : (
                          <>
                            <span className="shop-price">
                              <Icon name="dew" size={13} />
                              {formatNumber(locale, def.cost)}
                            </span>
                            <button type="button" className="mini-button" onClick={() => buyDecoration(id)}>
                              {t('decor.buy')}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {tab === 'basket' && (
          <div className="basket-panel">
            <BasketContent />
          </div>
        )}
        <div className="page-bottom-space" />
      </div>
    </section>
  );
}
