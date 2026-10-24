import { useMemo } from 'react';
import { useGame } from '../game/store';
import { DECORATIONS } from '../game/content/spirits';
import { bonusesFor, growthOf } from '../game/engine';
import { PLANTS } from '../game/content/plants';
import { makeT } from '../i18n';
import PlotBed from './PlotBed';
import DecoArt from './DecoArt';
import SpiritArt from './SpiritArt';
import Hud from './Hud';
import Icon from './Icon';

const DECO_SLOT_CLASS: Record<string, string> = {
  'left-back': 'deco-left-back',
  'right-back': 'deco-right-back',
  'left-mid': 'deco-left-mid',
  'right-mid': 'deco-right-mid',
  'left-front': 'deco-left-front',
  'right-front': 'deco-right-front',
};

export default function GardenScene() {
  const save = useGame((s) => s.save);
  const now = useGame((s) => s.now);
  const openSheet = useGame((s) => s.openSheet);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  const bonuses = bonusesFor(save);

  const hints = useMemo(() => {
    const map: Record<number, 'plant' | 'water' | 'harvest' | null> = {};
    if (save.tutorial === 0 || save.tutorial === 1) {
      const first = save.plots.find((p) => p.unlocked && !p.plant);
      if (first) map[first.id] = 'plant';
    } else if (save.tutorial === 2) {
      const first = save.plots.find((p) => p.plant && p.plant.watered < PLANTS[p.plant.species].waterNeed);
      if (first) map[first.id] = 'water';
    } else if (save.tutorial === 3) {
      const first = save.plots.find(
        (p) =>
          p.plant &&
          growthOf(PLANTS[p.plant.species], p.plant.plantedAt, p.plant.watered, now, bonuses).ripe,
      );
      if (first) map[first.id] = 'harvest';
    }
    return map;
  }, [save.plots, save.tutorial, now, bonuses]);

  const fireflies = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: 6 + ((i * 37) % 88),
        top: 8 + ((i * 53) % 78),
        delay: (i * 0.7) % 8,
        duration: 5 + (i % 5),
      })),
    [],
  );

  return (
    <section className="garden-screen" aria-label={t('nav.garden')}>
      <Hud />

      <div className="garden-stage">
        <div className="garden-island">
          <div className="island-aura" aria-hidden="true" />

          <div className="deco-layer" aria-hidden="true">
            {save.placedDecorations.map((id) => {
              const def = DECORATIONS[id];
              if (!def) return null;
              return (
                <div key={id} className={`deco ${DECO_SLOT_CLASS[def.slot] ?? ''}`}>
                  <DecoArt id={id} />
                </div>
              );
            })}
          </div>

          <div className="companions" aria-label={t('spirits.invited')}>
            {save.equipped.slice(0, 3).map((id, index) => (
              <button
                key={id}
                type="button"
                className={`companion companion-${index + 1}`}
                onClick={() => openSheet({ kind: 'spirit', id })}
                aria-label={t(`spirit.${id}.name`)}
                title={t(`spirit.${id}.name`)}
              >
                <SpiritArt id={id} />
              </button>
            ))}
          </div>

          <div className="island-board">
            <div className="island-rim" aria-hidden="true" />
            <div className="island-beds">
              {save.plots.map((plot) => (
                <PlotBed key={plot.id} index={plot.id} hint={hints[plot.id] ?? null} />
              ))}
            </div>
            <div className="island-inscription" aria-hidden="true">
              <span />
              <Icon name="sparkle" size={12} />
              <span />
            </div>
          </div>

          <svg className="island-cliff" viewBox="0 0 400 200" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="cliff-face" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5a456f" />
                <stop offset="30%" stopColor="#3b2d51" />
                <stop offset="100%" stopColor="rgba(20, 15, 34, 0.15)" />
              </linearGradient>
              <linearGradient id="cliff-rim" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8fd8b6" stopOpacity="0" />
                <stop offset="50%" stopColor="#b9f3d3" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#8fd8b6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="waterfall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c9f7ff" stopOpacity="0.75" />
                <stop offset="70%" stopColor="#8fd8e8" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#8fd8e8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M4 2 H396 C 388 38, 360 70, 322 96 C 292 116, 268 142, 244 166 C 228 182, 214 194, 198 200 C 180 192, 160 178, 142 162 C 112 136, 78 112, 52 84 C 30 60, 12 32, 4 2 Z"
              fill="url(#cliff-face)"
            />
            <path d="M6 4 H394" stroke="url(#cliff-rim)" strokeWidth="3" />
            <path d="M64 40 C 96 64, 118 92, 138 124 M330 42 C 306 68, 282 94, 258 120" stroke="#6e5788" strokeWidth="1.4" fill="none" opacity="0.5" />
            <path d="M110 58 C 132 82, 146 100, 156 122 M290 62 C 274 84, 264 100, 252 118" stroke="#80699c" strokeWidth="1" fill="none" opacity="0.3" />
            <path d="M198 14 C 200 66, 194 112, 198 176" stroke="#4d3b66" strokeWidth="1.2" fill="none" opacity="0.55" />
            <path d="M300 10 C 298 44, 286 76, 264 104" stroke="url(#waterfall)" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M301 12 C 299 48, 288 80, 266 106" stroke="#e6fdff" strokeWidth="1.2" opacity="0.5" fill="none" />
            <g fill="#7fb98d" opacity="0.55">
              <path d="M74 32 C 80 48, 92 58, 106 62" stroke="#7fb98d" strokeWidth="1.4" fill="none" />
              <circle cx="106" cy="64" r="2.4" />
              <path d="M312 84 C 320 96, 332 102, 342 104" stroke="#7fb98d" strokeWidth="1.2" fill="none" />
              <circle cx="342" cy="106" r="1.8" />
              <circle cx="164" cy="128" r="2" />
              <circle cx="238" cy="150" r="1.6" />
            </g>
            <g opacity="0.5">
              <path d="M150 20 C 152 60, 146 96, 148 132" stroke="#6a9a84" strokeWidth="1.6" fill="none" />
              <path d="M148 54 C 156 58, 162 64, 166 72 M149 86 C 141 90, 136 96, 133 104" stroke="#6a9a84" strokeWidth="1.2" fill="none" />
            </g>
          </svg>

          <div className="island-mist" aria-hidden="true" />
          <div className="fireflies" aria-hidden="true">
            {fireflies.map((fly) => (
              <span
                key={fly.id}
                className="firefly"
                style={{
                  insetInlineStart: `${fly.left}%`,
                  top: `${fly.top}%`,
                  animationDelay: `${fly.delay}s`,
                  animationDuration: `${fly.duration}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="garden-quiet">
        <Icon name="sparkle" size={12} />
        {save.equipped.length > 0
          ? t('spirits.equippedCount', { count: save.equipped.length })
          : t('spirits.inviteHint')}
      </p>
    </section>
  );
}
