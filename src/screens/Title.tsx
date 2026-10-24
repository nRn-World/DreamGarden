import PlantArt from '../components/PlantArt';
import SpiritArt from '../components/SpiritArt';
import Icon from '../components/Icon';
import { asset } from '../lib/assets';
import { useGame } from '../game/store';
import { availableChapter, dailyAvailableAt } from '../game/engine';
import { makeT } from '../i18n';
import { audio, haptic } from '../game/audio';

export default function Title({ onEnter }: { onEnter: () => void }) {
  const save = useGame((s) => s.save);
  const now = useGame((s) => s.now);
  const openSheet = useGame((s) => s.openSheet);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  const chapter = availableChapter(save);
  const giftReady = now >= dailyAvailableAt(save);
  const started = save.stats.planted > 0 || save.stats.harvests > 0 || save.level > 1;

  return (
    <section className="title-screen">
      <div className="title-top">
        <span className="brand-mark">
          <img
            className="brand-mark-logo"
            src={asset('brand/nrnworld-mark-96.webp')}
            alt=""
            width={26}
            height={26}
            decoding="async"
          />
          <span>{t('app.by')}</span>
        </span>
        <button type="button" className="icon-button" onClick={() => openSheet({ kind: 'settings' })} aria-label={t('aria.settings')}>
          <Icon name="settings" size={19} />
        </button>
      </div>

      <div className="title-hero">
        <span className="title-kicker">{t('app.tagline')}</span>
        <h1 className="game-logo">
          <span className="logo-word">Dream</span>
          <span className="logo-word logo-word-alt">Garden</span>
        </h1>
        <p className="title-blurb">{t('onboarding.welcomeBody')}</p>
        <div className="title-badges">
          <span className="pill pill-tier">
            {t('title.level', { level: save.level })}
          </span>
          {chapter && (
            <span className="pill pill-moon">
              <Icon name="book" size={11} />
              {t('title.chapter', { n: chapter.index })}
            </span>
          )}
        </div>
      </div>

      <div className="title-garden" aria-hidden="true">
        <div className="title-island">
          <div className="title-plant title-plant-a">
            <PlantArt species="moonrose" stage={3} />
          </div>
          <div className="title-plant title-plant-b">
            <PlantArt species="lumenlotus" stage={3} />
          </div>
          <div className="title-plant title-plant-c">
            <PlantArt species="starfern" stage={3} />
          </div>
          <div className="title-plant title-plant-d">
            <PlantArt species="dewbell" stage={3} />
          </div>
          <div className="title-spirit title-spirit-a">
            <SpiritArt id="mossling" />
          </div>
          <div className="title-spirit title-spirit-b">
            <SpiritArt id="tidewhisper" />
          </div>
          <span className="title-firefly fly-a" />
          <span className="title-firefly fly-b" />
          <span className="title-firefly fly-c" />
        </div>
      </div>

      <div className="title-actions">
        <button
          type="button"
          className="btn btn-primary btn-hero"
          onClick={() => {
            audio.unlock();
            audio.sfx('reward');
            haptic(10, save.settings.haptics);
            onEnter();
          }}
        >
          <Icon name={started ? 'leaf' : 'sparkle'} size={19} />
          {started ? t('title.continue') : t('title.enter')}
        </button>

        <div className="title-secondary">
          <button type="button" className="pill-button" onClick={() => openSheet({ kind: 'daily' })}>
            <Icon name="gift" size={16} />
            <span>{t('title.daily')}</span>
            {giftReady && <span className="pill-dot" aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="pill-button"
            onClick={() => {
              if (chapter) openSheet({ kind: 'story', index: chapter.index });
              else openSheet({ kind: 'settings' });
            }}
          >
            <Icon name="book" size={16} />
            <span>{chapter ? t('journal.read') : t('nav.journal')}</span>
          </button>
        </div>
      </div>

      <footer className="title-footer">
        <span>{t('onboarding.promise')}</span>
      </footer>
    </section>
  );
}
