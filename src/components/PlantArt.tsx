import { useId } from 'react';
import type { PlantId, PlantShape } from '../game/types';
import { PLANTS } from '../game/content/plants';

interface Props {
  species: PlantId;
  stage: 0 | 1 | 2 | 3;
  /** 0..1 growth progress, used for the bloom pop. */
  progress?: number;
  className?: string;
  sway?: boolean;
}

const LEAF_PATH = 'M0 0 C 16 -4, 27 8, 26 16 C 17 24, 3 20, 0 0 Z';

function Leaf({
  x,
  y,
  angle,
  scale = 1,
  leaf,
  vein,
  opacity = 1,
}: {
  x: number;
  y: number;
  angle: number;
  scale?: number;
  leaf: string;
  vein: string;
  opacity?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`} opacity={opacity}>
      <path d={LEAF_PATH} fill={leaf} />
      <path d="M2 2 C 10 7, 16 12, 23 15" stroke={vein} strokeWidth="1" fill="none" opacity="0.55" strokeLinecap="round" />
    </g>
  );
}

function Stem({ d, color, width = 4 }: { d: string; color: string; width?: number }) {
  return (
    <g>
      <path d={d} stroke={color} strokeWidth={width + 2.5} fill="none" strokeLinecap="round" opacity="0.22" />
      <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" />
    </g>
  );
}

function BellFlower({ x, y, rotate, petal, deep, core, open }: { x: number; y: number; rotate: number; petal: string; deep: string; core: string; open: number }) {
  const s = 0.78 + open * 0.78;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <path d="M0 0 C -9 5, -12 14, -10 22 C -6 31, 6 31, 10 22 C 12 14, 9 5, 0 0 Z" fill={deep} />
      <path d="M0 2 C -6 6, -8 14, -6.5 21 C -3 27, 3 27, 6.5 21 C 8 14, 6 6, 0 2 Z" fill={petal} />
      <path d="M-8 23 C -3 27, 3 27, 8 23" stroke={core} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.9" />
      <circle cx="0" cy="28" r="2.4" fill={core} />
      <circle cx="-2" cy="14" r="1.4" fill="#ffffff" opacity="0.7" />
    </g>
  );
}

function Lotus({ petal, deep, core, open }: { petal: string; deep: string; core: string; open: number }) {
  const petals = 8;
  return (
    <g transform={`translate(60 68) scale(${0.45 + open * 0.65})`}>
      {Array.from({ length: petals }, (_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-21"
          rx="8.4"
          ry="22"
          fill={i % 2 === 0 ? deep : petal}
          opacity={0.85}
          transform={`rotate(${(360 / petals) * i})`}
        />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse
          key={`inner-${i}`}
          cx="0"
          cy="-13"
          rx="6.4"
          ry="15"
          fill={petal}
          transform={`rotate(${72 * i + 18})`}
        />
      ))}
      <circle cx="0" cy="0" r="7.5" fill={core} />
      <circle cx="0" cy="0" r="4" fill="#ffffff" opacity="0.55" />
      <circle cx="-3" cy="-3" r="1.5" fill="#ffffff" opacity="0.9" />
    </g>
  );
}

function Rose({ petal, deep, core, open }: { petal: string; deep: string; core: string; open: number }) {
  return (
    <g transform={`translate(60 62) scale(${0.5 + open * 0.6})`}>
      {Array.from({ length: 7 }, (_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-15"
          rx="12"
          ry="15"
          fill={deep}
          opacity="0.9"
          transform={`rotate(${(360 / 7) * i + 12})`}
        />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse key={`b-${i}`} cx="0" cy="-9" rx="9.5" ry="11" fill={petal} transform={`rotate(${60 * i + 30})`} />
      ))}
      <path d="M0 8 C -9 6, -11 -2, -6 -7 C -2 -11, 5 -9, 7 -3 C 9 3, 5 8, 0 8 Z" fill={petal} />
      <path d="M0 3 C -4 2, -5 -2, -2 -4 C 1 -5, 4 -3, 3 0" stroke={core} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="7" cy="-12" r="1.4" fill="#ffffff" opacity="0.8" />
    </g>
  );
}

function Fern({ petal, deep, core, open }: { petal: string; deep: string; core: string; open: number }) {
  const fronds = [
    { angle: -72, len: 0.85 },
    { angle: -40, len: 0.95 },
    { angle: -8, len: 1 },
    { angle: 26, len: 0.95 },
    { angle: 58, len: 0.85 },
  ];
  return (
    <g transform={`translate(60 110) scale(${0.55 + open * 0.5})`}>
      {fronds.map((frond, i) => (
        <g key={i} transform={`rotate(${frond.angle}) scale(${frond.len})`}>
          <path d="M0 0 C 4 -20, 6 -38, 2 -54" stroke={deep} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          {Array.from({ length: 6 }, (_, j) => {
            const t = j / 6;
            const y = -8 - t * 44;
            const x = 2 + t * 3;
            return (
              <g key={`l-${j}`} transform={`translate(${x} ${y}) rotate(${-38 + j * 3}) scale(${1 - t * 0.4})`}>
                <ellipse cx="8" cy="0" rx="9" ry="3.1" fill={j % 2 === 0 ? petal : deep} opacity="0.92" />
              </g>
            );
          })}
        </g>
      ))}
      <circle cx="0" cy="-56" r="4" fill={core} opacity="0.9" />
      {Array.from({ length: 5 }, (_, i) => (
        <circle
          key={`s-${i}`}
          cx={Math.cos((i / 5) * Math.PI * 2) * 26}
          cy={-20 + Math.sin((i / 5) * Math.PI * 2) * 22}
          r={1 + (i % 3) * 0.5}
          fill={core}
          className="spore"
          style={{ animationDelay: `${i * 0.7}s` }}
        />
      ))}
    </g>
  );
}

function Spire({ petal, deep, core, open }: { petal: string; deep: string; core: string; open: number }) {
  return (
    <g transform={`translate(60 42) scale(${0.55 + open * 0.5})`}>
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (360 / 6) * i;
        return (
          <g key={i} transform={`rotate(${angle})`}>
            <ellipse cx="0" cy="-13" rx="6.3" ry="14" fill={i % 2 ? petal : deep} />
            <ellipse cx="0" cy="-11" rx="3.2" ry="9" fill={core} opacity="0.5" />
          </g>
        );
      })}
      <circle cx="0" cy="0" r="7" fill={core} />
      {[22, 40, 58, 74].map((offset, i) => (
        <g key={`b-${offset}`} transform={`translate(${i % 2 === 0 ? -6 : 6} ${offset}) rotate(${i % 2 === 0 ? -24 : 24})`}>
          <path d="M0 0 C -6 3, -7 9, -5 14 C -2 18, 3 18, 5 14 C 7 9, 6 3, 0 0 Z" fill={i % 2 ? deep : petal} />
          <circle cx="0" cy="14" r="1.6" fill={core} />
        </g>
      ))}
    </g>
  );
}

function Crystal({ petal, deep, core, open }: { petal: string; deep: string; core: string; open: number }) {
  const shards = [
    { x: -20, h: 46, w: 9, a: -18 },
    { x: -8, h: 66, w: 11, a: -7 },
    { x: 5, h: 78, w: 12, a: 4 },
    { x: 18, h: 56, w: 9, a: 15 },
    { x: 28, h: 36, w: 7, a: 26 },
  ];
  return (
    <g transform={`translate(60 96) scale(${0.55 + open * 0.5})`}>
      {shards.map((s, i) => (
        <g key={i} transform={`translate(${s.x} 0) rotate(${s.a})`}>
          <path d={`M0 0 L ${-s.w} 10 L ${-s.w * 0.7} ${-s.h * 0.6} L 0 ${-s.h} L ${s.w * 0.8} ${-s.h * 0.5} L ${s.w} 10 Z`} fill={i % 2 ? deep : petal} opacity="0.92" />
          <path d={`M0 0 L 0 ${-s.h} L ${s.w * 0.8} ${-s.h * 0.5} L ${s.w} 10 Z`} fill="#ffffff" opacity="0.18" />
          <path d={`M0 0 L 0 ${-s.h * 0.7}`} stroke={core} strokeWidth="1" opacity="0.5" />
        </g>
      ))}
      <circle cx="4" cy="-14" r="5.5" fill={core} />
      <circle cx="4" cy="-14" r="9" fill={core} opacity="0.18" />
    </g>
  );
}

function Orchid({ petal, deep, core, open }: { petal: string; deep: string; core: string; open: number }) {
  return (
    <g transform={`translate(60 66) scale(${0.5 + open * 0.6})`}>
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <ellipse key={i} cx="0" cy="-19" rx="11" ry="19" fill={i % 2 ? deep : petal} transform={`rotate(${angle})`} />
      ))}
      <path d="M0 16 C -10 10, -14 0, -10 -8 C -5 -13, 5 -13, 10 -8 C 14 0, 10 10, 0 16 Z" fill={core} opacity="0.92" />
      <circle cx="0" cy="2" r="4.4" fill={deep} />
      <circle cx="-2" cy="-1" r="1.4" fill="#ffffff" />
      <circle cx="17" cy="-18" r="1.6" fill="#ffffff" opacity="0.8" />
    </g>
  );
}

function Eternal({ petal, deep, core, open }: { petal: string; deep: string; core: string; open: number }) {
  return (
    <g transform={`translate(60 64) scale(${0.55 + open * 0.55})`}>
      <circle r="42" fill="none" stroke={core} strokeWidth="0.8" opacity="0.35" strokeDasharray="1 6" className="halo" />
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-24"
          rx="7"
          ry="23"
          fill={i % 3 === 0 ? core : i % 2 === 0 ? petal : deep}
          opacity={0.88}
          transform={`rotate(${30 * i})`}
        />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse key={`in-${i}`} cx="0" cy="-12" rx="5.5" ry="14" fill={petal} transform={`rotate(${60 * i + 30})`} />
      ))}
      <circle r="8" fill="#fff8e2" />
      <circle r="4" fill="#ffffff" opacity="0.8" />
      {[0, 1, 2].map((i) => (
        <circle
          key={`m-${i}`}
          r={1.6}
          fill={core}
          className="mote"
          style={{ animationDelay: `${i * 0.9}s` }}
          transform={`translate(${Math.cos(i * 2.1) * 34} ${Math.sin(i * 2.1) * 26})`}
        />
      ))}
    </g>
  );
}

function FlowerHead({ shape, petal, deep, core, open }: { shape: PlantShape; petal: string; deep: string; core: string; open: number }) {
  switch (shape) {
    case 'bell':
      return (
        <g>
          <circle cx="60" cy="66" r="30" fill={core} opacity="0.08" />
          <BellFlower x={60} y={52} rotate={0} petal={petal} deep={deep} core={core} open={open} />
          <BellFlower x={40} y={62} rotate={-22} petal={petal} deep={deep} core={core} open={open * 0.92} />
          <BellFlower x={80} y={64} rotate={22} petal={petal} deep={deep} core={core} open={open * 0.88} />
        </g>
      );
    case 'lotus':
      return <Lotus petal={petal} deep={deep} core={core} open={open} />;
    case 'rose':
      return <Rose petal={petal} deep={deep} core={core} open={open} />;
    case 'spire':
      return <Spire petal={petal} deep={deep} core={core} open={open} />;
    case 'crystal':
      return <Crystal petal={petal} deep={deep} core={core} open={open} />;
    case 'orchid':
      return <Orchid petal={petal} deep={deep} core={core} open={open} />;
    case 'eternal':
      return <Eternal petal={petal} deep={deep} core={core} open={open} />;
    case 'fern':
      return <Fern petal={petal} deep={deep} core={core} open={open} />;
    default:
      return null;
  }
}

export default function PlantArt({ species, stage, progress = 0, className = '', sway = true }: Props) {
  const uid = useId().replace(/[:]/g, '');
  const def = PLANTS[species];
  const { petal, petalDeep, core, stem, leaf, glow } = def.palette;
  const open = stage === 3 ? 0.9 + Math.min(0.1, (progress - 0.86) * 0.7) : stage === 2 ? 0.55 : 0.12;
  const scale = stage === 0 ? 1 : stage === 1 ? 0.78 : stage === 2 ? 0.9 : 1;
  const isSpire = def.shape === 'spire';
  const stemTop = isSpire ? 52 : 78;
  const stemWidth = def.shape === 'fern' ? 2.4 : def.shape === 'crystal' ? 2 : 4;

  return (
    <svg
      viewBox="0 0 120 150"
      className={`plant-art ${sway ? 'plant-sway' : ''} ${className}`}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.55" />
          <stop offset="60%" stopColor={glow} stopOpacity="0.15" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`stem-${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={stem} stopOpacity="0.65" />
          <stop offset="100%" stopColor={leaf} />
        </linearGradient>
      </defs>

      <ellipse cx="60" cy="112" rx="42" ry="16" fill={`url(#glow-${uid})`} className="plant-ground-glow" />

      <g transform={`translate(60 150) scale(${scale}) translate(-60 -150)`} style={{ transformOrigin: '60px 150px' }}>
        {stage === 0 ? (
          <g>
            <ellipse cx="60" cy="146" rx="19" ry="6.5" fill="#2c1f3c" opacity="0.75" />
            <ellipse cx="60" cy="145" rx="12" ry="4" fill="#463356" opacity="0.9" />
            <Stem d="M60 147 C 57 133, 58 117, 61 102" color={`url(#stem-${uid})`} width={4} />
            <Leaf x={59} y={136} angle={-158} scale={1.25} leaf={leaf} vein={stem} />
            <Leaf x={61} y={124} angle={-22} scale={1.1} leaf={leaf} vein={stem} />
            <Leaf x={60} y={112} angle={-120} scale={0.78} leaf={petal} vein={stem} />
            <circle cx="61" cy="100" r="4" fill={core} className="seed-glow" />
            <circle cx="61" cy="100" r="9" fill={glow} opacity="0.3" />
          </g>
        ) : (
          <g>
            {!isSpire && def.shape !== 'fern' && def.shape !== 'crystal' && (
              <Stem d={`M60 148 C ${def.shape === 'bell' ? 55 : 63} 124, 58 ${stemTop + 24}, 60 ${stemTop}`} color={`url(#stem-${uid})`} width={stemWidth} />
            )}
            <Leaf x={58} y={134} angle={-152} scale={1.05} leaf={leaf} vein={stem} />
            <Leaf x={62} y={124} angle={-26} scale={0.92} leaf={leaf} vein={stem} opacity={0.95} />
            {stage >= 2 && (
              <>
                <Leaf x={58} y={112} angle={-166} scale={0.8} leaf={leaf} vein={stem} opacity={0.85} />
                <Leaf x={63} y={104} angle={-12} scale={0.7} leaf={petal} vein={stem} opacity={0.7} />
              </>
            )}
            {((def.shape !== 'spire' && def.shape !== 'fern' && def.shape !== 'crystal') || stage >= 2) && (
              <FlowerHead shape={def.shape} petal={petal} deep={petalDeep} core={core} open={open} />
            )}
          </g>
        )}
      </g>

      {stage === 3 && (
        <g className="plant-sparkles">
          <circle cx="34" cy="62" r="1.6" fill={core} opacity="0.8" />
          <circle cx="89" cy="80" r="1.2" fill={core} opacity="0.6" />
          <circle cx="78" cy="42" r="1" fill="#ffffff" opacity="0.7" />
        </g>
      )}
    </svg>
  );
}
