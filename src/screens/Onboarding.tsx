import { useState } from 'react';
import PlantArt from '../components/PlantArt';
import SpiritArt from '../components/SpiritArt';
import Icon from '../components/Icon';
import { useGame } from '../game/store';
import { LANGUAGES, detectLocale, isLocale, makeT, type DictKey, type LocaleCode } from '../i18n';
import { audio } from '../game/audio';
import { asset } from '../lib/assets';

const SLIDES = [
  { plantA: 'dewbell' as const, plantB: 'moonrose' as const, spirit: 'mossling' as const, key: 1 },
  { plantA: 'lumenlotus' as const, plantB: 'starfern' as const, spirit: 'petalwisp' as const, key: 2 },
  { plantA: 'sunspire' as const, plantB: 'crystalbloom' as const, spirit: 'nocturne' as const, key: 3 },
];

export default function Onboarding() {
  const save = useGame((s) => s.save);
  const setLocale = useGame((s) => s.setLocale);
  const complete = useGame((s) => s.completeOnboarding);
  const [phase, setPhase] = useState<'language' | number>('language');
  const [selected, setSelected] = useState<LocaleCode>(() =>
    save.locale && isLocale(save.locale) ? save.locale : detectLocale(),
  );
  const t = makeT(selected);

  const choose = (code: LocaleCode) => {
    setSelected(code);
    setLocale(code);
    audio.sfx('tap');
  };

  const finish = () => {
    audio.unlock();
    audio.sfx('reward');
    complete(selected);
  };

  if (phase === 'language') {
    return (
      <section className="onboarding onboarding-language">
        <div className="onboarding-top">
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
        </div>

        <div className="onboarding-heading">
          <span className="onboarding-wordmark">{t('app.name')}</span>
          <h1>{t('onboarding.languageTitle')}</h1>
          <p>{t('onboarding.languageBody')}</p>
        </div>

        <div className="language-picker" role="radiogroup" aria-label={t('onboarding.languageTitle')}>
          {LANGUAGES.map((language) => {
            const active = selected === language.code;
            return (
              <button
                key={language.code}
                type="button"
                role="radio"
                aria-checked={active}
                className={`language-option ${active ? 'is-active' : ''}`}
                onClick={() => choose(language.code)}
              >
                <img src={asset(`flags/${language.flag}.svg`)} alt="" width={28} height={19} />
                <span className="language-option-name">{language.nativeName}</span>
                <span className="language-radio" aria-hidden="true">
                  {active && <span />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="language-art" aria-hidden="true">
          <div className="language-garden">
            <span className="language-ground" />
            <div className="language-plant language-plant-a">
              <PlantArt species="moonrose" stage={3} />
            </div>
            <div className="language-plant language-plant-b">
              <PlantArt species="dewbell" stage={3} />
            </div>
            <div className="language-spirit">
              <SpiritArt id="tidewhisper" />
            </div>
          </div>
        </div>

        <div className="onboarding-foot">
          <p className="promise">{t('onboarding.promise')}</p>
          <button type="button" className="btn btn-primary btn-full" onClick={() => setPhase(0)}>
            {t('onboarding.continue')}
            <Icon name="chevron" size={17} />
          </button>
        </div>
      </section>
    );
  }

  const slide = SLIDES[phase] ?? SLIDES[0];

  return (
    <section className="onboarding onboarding-intro">
      <div className="onboarding-top">
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
        <button type="button" className="text-button" onClick={finish}>
          {t('onboarding.skip')}
        </button>
      </div>

      <div className={`intro-art intro-art-${slide.key}`}>
        <span className="intro-halo" aria-hidden="true" />
        <div className="intro-island" aria-hidden="true">
          <div className="intro-plants">
            <PlantArt species={slide.plantA} stage={3} />
            <PlantArt species={slide.plantB} stage={3} className="intro-plant-b" />
          </div>
          <div className="intro-spirit">
            <SpiritArt id={slide.spirit} />
          </div>
        </div>
        <span className="intro-mote mote-a" aria-hidden="true" />
        <span className="intro-mote mote-b" aria-hidden="true" />
        <span className="intro-mote mote-c" aria-hidden="true" />
      </div>

      <div className="intro-copy" key={slide.key}>
        <span className="eyebrow">{t('app.name')}</span>
        <h1>{t(`intro.${slide.key}.title` as DictKey)}</h1>
        <p>{t(`intro.${slide.key}.body` as DictKey)}</p>
      </div>

      <div className="onboarding-foot">
        <div className="intro-dots" aria-hidden="true">
          {SLIDES.map((item, index) => (
            <span key={item.key} className={index === phase ? 'is-active' : index < phase ? 'is-done' : ''} />
          ))}
        </div>
        {phase < SLIDES.length - 1 ? (
          <button type="button" className="btn btn-primary btn-full" onClick={() => setPhase(phase + 1)}>
            {t('common.next')}
            <Icon name="chevron" size={17} />
          </button>
        ) : (
          <button type="button" className="btn btn-primary btn-full" onClick={finish}>
            {t('onboarding.begin')}
            <Icon name="sparkle" size={17} />
          </button>
        )}
      </div>
    </section>
  );
}
