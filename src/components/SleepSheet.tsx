import { useState } from 'react';
import { audio, type AmbienceKind } from '../game/audio';
import { useGame } from '../game/store';
import { makeT, type DictKey } from '../i18n';
import Icon from './Icon';
import SheetFrame from './SheetFrame';

const TIMERS = [5, 10, 20];
const SOUNDS: AmbienceKind[] = ['rain', 'wind', 'brown'];

export default function SleepSheet() {
  const locale = useGame((s) => s.save.locale ?? 'en');
  const startSleep = useGame((s) => s.startSleep);
  const t = makeT(locale);
  const [minutes, setMinutes] = useState(10);
  const [on, setOn] = useState<Record<AmbienceKind, boolean>>({
    rain: audio.hasAmbience('rain'),
    wind: audio.hasAmbience('wind'),
    brown: audio.hasAmbience('brown'),
  });

  const toggle = (kind: AmbienceKind) => {
    audio.setAmbience(kind, !on[kind]);
    setOn({ ...on, [kind]: !on[kind] });
  };

  return (
    <SheetFrame title={t('sleep.title')} subtitle={t('sleep.lead')} className="sleep-sheet">
      <h4 className="sleep-label">{t('sleep.timer')}</h4>
      <div className="sleep-chips" role="radiogroup" aria-label={t('sleep.timer')}>
        {TIMERS.map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={minutes === n}
            className={`sleep-chip ${minutes === n ? 'is-on' : ''}`}
            onClick={() => setMinutes(n)}
          >
            {t('sleep.minutes', { n })}
          </button>
        ))}
      </div>
      <h4 className="sleep-label">{t('sleep.ambience')}</h4>
      <div className="sleep-chips">
        {SOUNDS.map((kind) => (
          <button
            key={kind}
            type="button"
            aria-pressed={on[kind]}
            className={`sleep-chip ${on[kind] ? 'is-on' : ''}`}
            onClick={() => toggle(kind)}
          >
            {t(`sleep.${kind}` as DictKey)}
          </button>
        ))}
      </div>
      <div className="sheet-actions">
        <button type="button" className="btn btn-primary" onClick={() => startSleep(minutes)}>
          <Icon name="moon" size={16} />
          {t('sleep.start')}
        </button>
      </div>
    </SheetFrame>
  );
}
