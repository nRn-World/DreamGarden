import { useEffect, useState } from 'react';
import { haptic } from '../game/audio';
import { useGame } from '../game/store';
import { makeT, type DictKey } from '../i18n';
import SheetFrame from './SheetFrame';

const PHASES: { key: DictKey; ms: number; grown: boolean }[] = [
  { key: 'breathe.in', ms: 4000, grown: true },
  { key: 'breathe.hold', ms: 4000, grown: true },
  { key: 'breathe.out', ms: 6000, grown: false },
];
const CYCLES = 3;

export default function BreatheSheet() {
  const locale = useGame((s) => s.save.locale ?? 'en');
  const haptics = useGame((s) => s.save.settings.haptics);
  const breathe = useGame((s) => s.breathe);
  const t = makeT(locale);
  /** -1 before starting, 0..8 while breathing (three phases per cycle), 9 when finished. */
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (step < 0) return;
    if (step >= CYCLES * PHASES.length) {
      breathe();
      return;
    }
    haptic(PHASES[step % PHASES.length].grown ? [30, 60, 30] : 20, haptics);
    const id = window.setTimeout(() => setStep(step + 1), PHASES[step % PHASES.length].ms);
    return () => window.clearTimeout(id);
  }, [step, haptics, breathe]);

  const done = step >= CYCLES * PHASES.length;
  const phase = step >= 0 && !done ? PHASES[step % PHASES.length] : null;
  const grown = phase ? phase.grown : false;

  return (
    <SheetFrame title={t('breathe.title')} subtitle={done ? t('breathe.done') : t('breathe.lead')} className="breathe-sheet">
      <div className="breathe-stage" aria-live="polite">
        <span
          className="breathe-orb"
          style={{ transform: `scale(${grown ? 1 : 0.45})`, transitionDuration: `${phase ? phase.ms : 800}ms` }}
        />
        <span className="breathe-word">{phase ? t(phase.key) : ''}</span>
        {!done && step >= 0 && (
          <span className="breathe-count">{t('breathe.cycles', { n: Math.floor(step / PHASES.length) + 1 })}</span>
        )}
      </div>
      {step < 0 && (
        <div className="sheet-actions">
          <button type="button" className="btn btn-primary" onClick={() => setStep(0)}>
            {t('breathe.start')}
          </button>
        </div>
      )}
    </SheetFrame>
  );
}
