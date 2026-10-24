import { useEffect, useState } from 'react';
import { fireflyCap } from '../game/engine';
import { useGame } from '../game/store';
import { makeT } from '../i18n';

/** A calm extra: now and then a firefly drifts over the garden and pays a little dew when caught. */
export default function Fireflies() {
  const date = useGame((s) => s.save.night.date);
  const caught = useGame((s) => s.save.night.fireflies);
  const locale = useGame((s) => s.save.locale ?? 'en');
  const sheet = useGame((s) => s.sheet);
  const sleepUntil = useGame((s) => s.sleepUntil);
  const catchFirefly = useGame((s) => s.catchFirefly);
  const [fly, setFly] = useState<{ id: number; x: number; y: number } | null>(null);
  const blocked = !date || caught >= fireflyCap(date) || sheet !== null || sleepUntil !== null;

  useEffect(() => {
    if (blocked) {
      setFly(null);
      return;
    }
    const spawn = window.setTimeout(
      () => setFly({ id: Date.now(), x: 12 + Math.random() * 76, y: 28 + Math.random() * 44 }),
      9000 + Math.random() * 14000,
    );
    return () => window.clearTimeout(spawn);
  }, [blocked, fly]);

  useEffect(() => {
    if (!fly) return;
    const leave = window.setTimeout(() => setFly(null), 9000);
    return () => window.clearTimeout(leave);
  }, [fly]);

  if (!fly || blocked) return null;
  return (
    <button
      key={fly.id}
      type="button"
      className="firefly"
      style={{ left: `${fly.x}%`, top: `${fly.y}%` }}
      aria-label={makeT(locale)('firefly.label')}
      onClick={() => {
        catchFirefly();
        setFly(null);
      }}
    />
  );
}
