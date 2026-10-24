import Hud from '../components/Hud';
import SpiritArt from '../components/SpiritArt';
import PlantArt from '../components/PlantArt';
import Icon from '../components/Icon';
import { SPIRITS } from '../game/content/spirits';
import { canFulfillOrder } from '../game/engine';
import { useGame } from '../game/store';
import { formatNumber, makeT } from '../i18n';

export default function WishesScreen() {
  const save = useGame((s) => s.save);
  const fulfil = useGame((s) => s.fulfilOrder);
  const refresh = useGame((s) => s.refreshOrders);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);

  return (
    <section className="page" aria-label={t('wishes.title')}>
      <Hud full={false} />
      <div className="page-scroll">
        <header className="page-head page-head-row">
          <div>
            <span className="eyebrow">{t('nav.wishes')}</span>
            <h1>{t('wishes.title')}</h1>
            <p>{t('wishes.subtitle')}</p>
          </div>
          <button type="button" className="icon-button refresh-button" onClick={refresh} aria-label={t('wishes.refresh')}>
            <Icon name="reset" size={19} />
          </button>
        </header>

        <div className="wish-list">
          {save.orders.map((order) => {
            const spirit = SPIRITS[order.spirit];
            const ready = canFulfillOrder(save, order);
            return (
              <article key={order.id} className={`wish-card ${ready ? 'is-ready' : ''}`}>
                <div className="wish-head">
                  <span className="wish-spirit">
                    <SpiritArt id={order.spirit} />
                  </span>
                  <span className="wish-from">
                    <span className="eyebrow">{t('wishes.from', { spirit: t(`spirit.${order.spirit}.name`) })}</span>
                    <span className="wish-passive">{t(`spirits.line.${order.spirit}`)}</span>
                  </span>
                  {ready && (
                    <span className="wish-ready">
                      <Icon name="check" size={12} />
                      {t('wishes.ready')}
                    </span>
                  )}
                </div>

                <div className="wish-items">
                  {order.items.map((item) => {
                    const have = save.inventory[item.plant] ?? 0;
                    const enough = have >= item.count;
                    return (
                      <div className={`wish-item ${enough ? 'is-have' : 'is-missing'}`} key={item.plant}>
                        <span className="wish-item-art">
                          <PlantArt species={item.plant} stage={3} sway={false} />
                        </span>
                        <span className="wish-item-copy">
                          <span className="wish-item-name">{t(`plant.${item.plant}.name`)}</span>
                          <span className="wish-item-count">
                            {formatNumber(locale, Math.min(have, item.count))}/{formatNumber(locale, item.count)}
                          </span>
                        </span>
                        {!enough && <span className="wish-missing">{t('wishes.missing', { count: item.count - have })}</span>}
                      </div>
                    );
                  })}
                </div>

                <div className="wish-foot">
                  <span className="wish-reward">
                    <span>
                      <Icon name="dew" size={14} />
                      {formatNumber(locale, order.rewardDew)}
                    </span>
                    <span>
                      <Icon name="stardust" size={13} />
                      {formatNumber(locale, order.rewardStardust)}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="btn btn-primary wish-button"
                    disabled={!ready}
                    onClick={() => fulfil(order.id)}
                  >
                    {t('wishes.fulfil')}
                  </button>
                </div>
                <span className="wish-watermark" style={{ color: spirit.palette.glow }} aria-hidden="true">
                  <Icon name="sparkle" size={64} />
                </span>
              </article>
            );
          })}
          {save.orders.length === 0 && <p className="empty-page">{t('wishes.empty')}</p>}
        </div>

        <div className="wishes-footnote">
          <Icon name="sparkle" size={14} />
          <span>{t('wishes.tip')}</span>
        </div>
        <button type="button" className="text-button wishes-refresh" onClick={refresh}>
          <Icon name="reset" size={15} />
          {t('wishes.refresh')}
        </button>
        <div className="page-bottom-space" />
      </div>
    </section>
  );
}
