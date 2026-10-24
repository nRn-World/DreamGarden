import { useRef, useState } from 'react';
import { useGame } from '../game/store';
import { LANGUAGES, makeT } from '../i18n';
import type { Settings } from '../game/types';
import Icon, { type IconName } from './Icon';
import SheetFrame from './SheetFrame';
import { asset } from '../lib/assets';

function ToggleRow({
  icon,
  label,
  hint,
  value,
  onChange,
}: {
  icon: IconName;
  label: string;
  hint?: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      className={`toggle-row ${value ? 'is-on' : ''}`}
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
    >
      <span className="toggle-icon">
        <Icon name={icon} size={18} />
      </span>
      <span className="toggle-copy">
        <span className="toggle-label">{label}</span>
        {hint && <span className="toggle-hint">{hint}</span>}
      </span>
      <span className="switch" aria-hidden="true">
        <span className="switch-knob" />
      </span>
    </button>
  );
}

export default function SettingsSheet() {
  const save = useGame((s) => s.save);
  const setSettings = useGame((s) => s.setSettings);
  const setLocale = useGame((s) => s.setLocale);
  const exportGarden = useGame((s) => s.exportGarden);
  const importGarden = useGame((s) => s.importGarden);
  const resetGarden = useGame((s) => s.resetGarden);
  const openSheet = useGame((s) => s.openSheet);
  const closeSheet = useGame((s) => s.closeSheet);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const toggle = (key: keyof Settings) => (value: boolean) => setSettings({ [key]: value } as Partial<Settings>);

  return (
    <SheetFrame title={t('settings.title')} subtitle={t('app.tagline')}>
      <section className="settings-section">
        <h3 className="settings-heading">{t('settings.language')}</h3>
        <div className="language-grid">
          {LANGUAGES.map((language) => {
            const active = language.code === locale;
            return (
              <button
                key={language.code}
                type="button"
                className={`language-card ${active ? 'is-active' : ''}`}
                onClick={() => setLocale(language.code)}
                aria-pressed={active}
              >
                <img src={asset(`flags/${language.flag}.svg`)} alt="" width={24} height={16} loading="lazy" />
                <span className="language-name">{language.nativeName}</span>
                {active && <Icon name="check" size={14} className="language-check" />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="settings-section">
        <h3 className="settings-heading">{t('settings.audio')}</h3>
        <div className="toggle-list">
          <ToggleRow icon="sound" label={t('settings.audio')} value={save.settings.sound} onChange={toggle('sound')} />
          <ToggleRow icon="music" label={t('settings.music')} value={save.settings.music} onChange={toggle('music')} />
          <ToggleRow icon="haptics" label={t('settings.haptics')} value={save.settings.haptics} onChange={toggle('haptics')} />
          <ToggleRow
            icon="motion"
            label={t('settings.reducedMotion')}
            hint={t('settings.reducedMotionHint')}
            value={save.settings.reducedMotion}
            onChange={toggle('reducedMotion')}
          />
          <ToggleRow icon="text" label={t('settings.largeText')} value={save.settings.largeText} onChange={toggle('largeText')} />
        </div>
      </section>

      <section className="settings-section">
        <h3 className="settings-heading">{t('settings.data')}</h3>
        <p className="settings-note">{t('settings.dataBody')}</p>
        <div className="settings-buttons">
          <button type="button" className="btn btn-soft" onClick={exportGarden}>
            <Icon name="download" size={16} />
            {t('settings.export')}
          </button>
          <button type="button" className="btn btn-soft" onClick={() => fileRef.current?.click()}>
            <Icon name="upload" size={16} />
            {t('settings.import')}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="visually-hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (file) importGarden(await file.text());
              event.target.value = '';
            }}
          />
        </div>
        <button
          type="button"
          className={`text-button danger ${confirmReset ? 'is-confirming' : ''}`}
          onClick={() => {
            if (!confirmReset) {
              setConfirmReset(true);
              setTimeout(() => setConfirmReset(false), 4500);
              return;
            }
            resetGarden();
            setConfirmReset(false);
            closeSheet();
          }}
        >
          <Icon name="reset" size={15} />
          {confirmReset ? t('settings.resetConfirm') : t('settings.reset')}
        </button>
      </section>

      <section className="settings-section">
        <h3 className="settings-heading">{t('settings.about')}</h3>
        <div className="settings-links">
          <button type="button" className="link-row" onClick={() => openSheet({ kind: 'privacy' })}>
            <Icon name="shield" size={16} />
            {t('settings.privacy')}
            <Icon name="chevron" size={15} className="link-chevron" />
          </button>
          <button type="button" className="link-row" onClick={() => openSheet({ kind: 'credits' })}>
            <Icon name="info" size={16} />
            {t('settings.credits')}
            <Icon name="chevron" size={15} className="link-chevron" />
          </button>
        </div>
        <p className="settings-version">
          {t('settings.version', { version: '1.0.0' })} · {t('settings.offlineNote')}
        </p>
      </section>
    </SheetFrame>
  );
}
