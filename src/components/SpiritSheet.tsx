import { MAX_BOND, SPIRITS, bondCost } from '../game/content/spirits';
import { PLANTS, PLANT_ORDER } from '../game/content/plants';
import { bondRequirement, essencePerCrop } from '../game/engine';
import { useGame } from '../game/store';
import { formatNumber, makeT, type DictKey } from '../i18n';
import type { SpiritId } from '../game/types';
import SpiritArt from './SpiritArt';
import Icon from './Icon';
import PlanSheetFrame from './SheetFrame';

const PASSIVE_KEY: DictKey[] = [
  'spirits.passive.yield',
  'spirits.passive.dew',
  'spirits.passive.growth',
  'spirits.passive.stardust',
  'spirits.passive.orders',
  'spirits.passive.xp',
];

const PASSIVE_BY_ID: Record<string, DictKey> = {
  yield: 'spirits.passive.yield',
  dew: 'spirits.passive.dew',
  growth: 'spirits.passive.growth',
  stardust: 'spirits.passive.stardust',
  orders: 'spirits.passive.orders',
  xp: 'spirits.passive.xp',
};

export default function SpiritSheet({ id }: { id: SpiritId }) {
  const save = useGame((s) => s.save);
  const feed = useGame((s) => s.feedSpirit);
  const toggleEquip = useGame((s) => s.toggleEquip);
  const { locale } = { locale: save.locale ?? 'en' };
  const t = makeT(locale);
  const def = SPIRITS[id];
  const state = save.spirits[id];
  const locked = !state.unlocked;
  const invite = save.equipped.includes(id);
  const passiveKey = PASSIVE_BY_ID[def.passive] ?? PASSIVE_KEY[0];
  const percent = Math.round(def.power * state.bond * 100);
  const need = bondRequirement(state.bond);
  const bondRatio = state.bond >= MAX_BOND ? 1 : Math.min(1, state.essence / Math.max(1, need));
  const availableCrops = PLANT_ORDER.filter((plantId) => (save.inventory[plantId] ?? 0) > 0);

  return (
    <PlanSheetFrame
      title={t(`spirit.${id}.name`)}
      subtitle={t(`spirits.line.${id}`)}
      className="spirit-sheet"
    >
      <div className={`spirit-hero ${locked ? 'is-locked' : ''}`}>
        <div className="spirit-hero-art">
          <SpiritArt id={id} float />
          {locked && (
            <span className="spirit-lock">
              <Icon name="lock" size={16} />
            </span>
          )}
        </div>
        <div className="spirit-hero-info">
          <div className="spirit-bond-label">
            <span>{t('spirits.bond', { n: state.bond })}</span>
            <span className="spirit-bond-percent">
              {t('spirits.passive', {})} · {percent}%
            </span>
          </div>
          <div className="bond-track">
            <span style={{ width: `${Math.round(bondRatio * 100)}%` }} />
          </div>
          <span className="spirit-essence">
            {state.bond >= MAX_BOND ? t('spirits.bondMax') : t('spirits.essence', { current: formatNumber(locale, state.essence), needed: formatNumber(locale, need) })}
          </span>
          <div className="spirit-passive">
            <Icon name={def.passive === 'growth' ? 'motion' : def.passive === 'stardust' ? 'stardust' : def.passive === 'orders' ? 'wish' : 'leaf'} size={14} />
            {t(passiveKey, { percent })}
          </div>
        </div>
      </div>

      {locked ? (
        <div className="locked-panel">
          <Icon name="lock" size={17} />
          <span>{t('spirits.locked', { level: def.unlockLevel })}</span>
        </div>
      ) : (
        <>
          <button
            type="button"
            className={`btn ${invite ? 'btn-ghost' : 'btn-primary'} btn-full`}
            onClick={() => toggleEquip(id)}
          >
            <Icon name="spirit" size={17} />
            {invite ? t('spirits.invited') : t('spirits.invite')}
          </button>
          <p className="sheet-footnote">{t('spirits.inviteHint')}</p>

          <div className="section-divider" />

          <div className="sheet-section-head">
            <h3>{t('spirits.offerTitle')}</h3>
            <span className="muted">{t('spirits.offerHint')}</span>
          </div>

          {state.bond >= MAX_BOND ? (
            <div className="bond-complete">
              <Icon name="sparkle" size={18} />
              {t('spirits.bondMax')}
            </div>
          ) : availableCrops.length === 0 ? (
            <p className="sheet-paragraph muted">{t('spirits.noOffer')}</p>
          ) : (
            <div className="offer-list">
              {availableCrops.map((plantId) => {
                const plant = PLANTS[plantId];
                const have = save.inventory[plantId] ?? 0;
                const per = essencePerCrop(plantId);
                const needed = Math.ceil(Math.max(0, need - state.essence) / per);
                const offerCount = Math.max(1, Math.min(have, needed));
                return (
                  <button
                    type="button"
                    key={plantId}
                    className="offer-row"
                    onClick={() => feed(id, plantId)}
                  >
                    <span className="offer-dot" style={{ background: plant.palette.petal }} />
                    <span className="offer-name">
                      {t(`plant.${plantId}.name`)}
                      <span className="offer-have">×{formatNumber(locale, have)}</span>
                    </span>
                    <span className="offer-essence">
                      <Icon name="sparkle" size={12} />
                      {formatNumber(locale, per)}
                    </span>
                    <span className="mini-button">{t('spirits.offerAll', { count: offerCount, plant: '' }).trim()}</span>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {state.bond < MAX_BOND && (
        <p className="sheet-footnote">
          {t('spirits.bond', { n: state.bond })} · {formatNumber(locale, bondCost(state.bond))} essence
        </p>
      )}
    </PlanSheetFrame>
  );
}
