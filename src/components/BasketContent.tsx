import { PLANTS } from '../game/content/plants';
import type { PlantId } from '../game/types';
import { dewMultiplier, inventoryValue } from '../game/engine';
import { useGame } from '../game/store';
import { formatNumber, makeT } from '../i18n';
import PlantArt from './PlantArt';
import Icon from './Icon';
import { SheetEmpty } from './SheetFrame';

export default function BasketContent() {
  const save = useGame((s) => s.save);
  const sell = useGame((s) => s.sell);
  const sellAll = useGame((s) => s.sellAll);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  const entries = (Object.keys(save.inventory) as PlantId[])
    .map((id) => ({ id, count: save.inventory[id] ?? 0 }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => PLANTS[b.id].sellPrice - PLANTS[a.id].sellPrice);
  const total = inventoryValue(save);
  const boost = dewMultiplier(save);

  if (entries.length === 0) {
    return <SheetEmpty icon="basket" title={t('seeds.harvestEmpty')} body="" />;
  }

  return (
    <>
      <div className="basket-total">
        <span>{t('seeds.value', { dew: formatNumber(locale, total) })}</span>
        <span className="pill pill-tier">{Math.round(boost * 100)}%</span>
      </div>
      <div className="basket-list">
        {entries.map(({ id, count }) => {
          const def = PLANTS[id];
          const value = Math.round(def.sellPrice * count * boost);
          return (
            <div className="basket-row" key={id}>
              <span className="basket-art">
                <PlantArt species={def.id} stage={3} sway={false} />
              </span>
              <span className="basket-copy">
                <span className="basket-name">{t(`plant.${def.id}.name`)}</span>
                <span className="basket-meta">
                  {t('seeds.basketCount', { count })}
                  <span className="dot-sep">·</span>
                  {t('seeds.each', { dew: formatNumber(locale, Math.round(def.sellPrice * boost)) })}
                </span>
              </span>
              <span className="basket-side">
                <span className="basket-value">
                  <Icon name="dew" size={13} />
                  {formatNumber(locale, value)}
                </span>
                <button type="button" className="mini-button" onClick={() => sell(def.id, count)}>
                  {t('seeds.sell')}
                </button>
              </span>
            </div>
          );
        })}
      </div>
      <button type="button" className="btn btn-primary btn-full" onClick={sellAll}>
        <Icon name="dew" size={17} />
        {t('seeds.sellAll')}
      </button>
    </>
  );
}
