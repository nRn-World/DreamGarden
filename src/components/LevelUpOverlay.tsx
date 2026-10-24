import { useEffect } from 'react';
import { useGame } from '../game/store';
import { makeT } from '../i18n';

export default function LevelUpOverlay() {
  const level = useGame((s) => s.levelUp);
  const dismiss = useGame((s) => s.dismissLevelUp);
  const locale = useGame((s) => s.save.locale ?? 'en');
  const t = makeT(locale);

  useEffect(() => {
    if (level === null) return;
    const timer = setTimeout(dismiss, 3400);
    return () => clearTimeout(timer);
  }, [level, dismiss]);

  if (level === null) return null;

  return (
    <button type="button" className="level-overlay" onClick={dismiss} aria-label={t('common.close')}>
      <span className="level-burst" aria-hidden="true" />
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          className="level-petal"
          aria-hidden="true"
          style={{
            insetInlineStart: `${8 + ((i * 37) % 84)}%`,
            top: `${12 + ((i * 29) % 70)}%`,
            animationDelay: `${(i % 7) * 0.12}s`,
            ['--petal-hue' as string]: `${(i * 47) % 360}`,
          }}
        />
      ))}
      <span className="level-card">
        <span className="eyebrow">{t('common.level', { level })}</span>
        <strong className="level-big">{level}</strong>
        <span className="level-caption">{t('toast.levelup', { level })}</span>
      </span>
    </button>
  );
}
