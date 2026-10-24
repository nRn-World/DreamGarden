import { useEffect, useState } from 'react';
import { useGame } from '../game/store';
import { formatDuration, makeT } from '../i18n';

/** Near-black screen for falling asleep; any tap brings the garden back. */
export default function SleepOverlay() {
  const sleepUntil = useGame((s) => s.sleepUntil);
  const wake = useGame((s) => s.wake);
  const locale = useGame((s) => s.save.locale ?? 'en');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (sleepUntil === null) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [sleepUntil]);

  if (sleepUntil === null) return null;
  const t = makeT(locale);
  const left = sleepUntil - now;

  return (
    <button type="button" className="sleep-overlay" onClick={wake} aria-label={t('sleep.wake')}>
      <span className="sleep-moon" aria-hidden="true" />
      <span className="sleep-text">{left > 0 ? t('sleep.left', { time: formatDuration(left, locale, t) }) : t('sleep.goodnight')}</span>
      <span className="sleep-hint">{t('sleep.wake')}</span>
    </button>
  );
}
