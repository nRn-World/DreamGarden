import Hud from '../components/Hud';
import SpiritArt from '../components/SpiritArt';
import Icon from '../components/Icon';
import { MAX_BOND, SPIRITS, SPIRIT_ORDER } from '../game/content/spirits';
import { useGame } from '../game/store';
import { makeT, type DictKey } from '../i18n';

const PASSIVE_KEY: Record<string, DictKey> = {
  yield: 'spirits.passive.yield',
  dew: 'spirits.passive.dew',
  growth: 'spirits.passive.growth',
  stardust: 'spirits.passive.stardust',
  orders: 'spirits.passive.orders',
  xp: 'spirits.passive.xp',
};

export default function SpiritsScreen() {
  const save = useGame((s) => s.save);
  const openSheet = useGame((s) => s.openSheet);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);

  return (
    <section className="page" aria-label={t('spirits.title')}>
      <Hud full={false} />
      <div className="page-scroll">
        <header className="page-head">
          <span className="eyebrow">{t('spirits.equippedCount', { count: save.equipped.length })}</span>
          <h1>{t('spirits.title')}</h1>
          <p>{t('spirits.subtitle')}</p>
        </header>

        <div className="spirit-grid">
          {SPIRIT_ORDER.map((id) => {
            const def = SPIRITS[id];
            const state = save.spirits[id];
            const locked = !state.unlocked;
            const invited = save.equipped.includes(id);
            const percent = Math.round(def.power * state.bond * 100);
            return (
              <button
                key={id}
                type="button"
                className={`spirit-card ${locked ? 'is-locked' : ''} ${invited ? 'is-invited' : ''}`}
                onClick={() => openSheet({ kind: 'spirit', id })}
                style={{ ['--spirit-glow' as string]: def.palette.glow, ['--spirit-deep' as string]: def.palette.petalDeep }}
              >
                <span className="spirit-card-art">
                  <SpiritArt id={id} dim={locked} />
                </span>
                <span className="spirit-card-name">
                  {t(`spirit.${id}.name`)}
                  {invited && (
                    <span className="invited-mark">
                      <Icon name="check" size={10} />
                    </span>
                  )}
                </span>
                {locked ? (
                  <span className="spirit-card-locked">
                    <Icon name="lock" size={11} />
                    {t('spirits.locked', { level: def.unlockLevel })}
                  </span>
                ) : (
                  <>
                    <span className="spirit-card-gift">{t(PASSIVE_KEY[def.passive], { percent })}</span>
                    <span className="bond-dots" aria-label={t('spirits.bond', { n: state.bond })}>
                      {Array.from({ length: MAX_BOND }, (_, i) => (
                        <i key={i} className={i < state.bond ? 'is-filled' : ''} />
                      ))}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <div className="wishes-footnote">
          <Icon name="spirit" size={14} />
          <span>{t('spirits.inviteHint')}</span>
        </div>
        <div className="page-bottom-space" />
      </div>
    </section>
  );
}
