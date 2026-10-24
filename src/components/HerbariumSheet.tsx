import { PLANT_ORDER } from '../game/content/plants';
import { useGame } from '../game/store';
import { formatNumber, makeT, type DictKey } from '../i18n';
import PlantArt from './PlantArt';
import SheetFrame from './SheetFrame';

export default function HerbariumSheet() {
  const save = useGame((s) => s.save);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);

  return (
    <SheetFrame title={t('herb.title')} subtitle={t('herb.lead')} className="herbarium-sheet">
      <ul className="herb-grid">
        {PLANT_ORDER.map((id) => {
          const count = save.stats.harvestsByPlant[id] ?? 0;
          const found = count > 0;
          return (
            <li key={id} className={`herb-card ${found ? '' : 'is-unknown'}`}>
              <div className="herb-art" aria-hidden="true">
                <PlantArt species={id} stage={3} sway={false} />
              </div>
              <span className="herb-name">{found ? t(`plant.${id}.name` as DictKey) : '???'}</span>
              <span className="herb-count">{found ? t('herb.harvested', { n: formatNumber(locale, count) }) : t('herb.unknown')}</span>
            </li>
          );
        })}
      </ul>
    </SheetFrame>
  );
}
