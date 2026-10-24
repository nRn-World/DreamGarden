import { useId } from 'react';
import type { SpiritId } from '../game/types';
import { SPIRITS } from '../game/content/spirits';

interface Props {
  id: SpiritId;
  className?: string;
  float?: boolean;
  dim?: boolean;
}

function Eyes({ x = 60, y = 62, spread = 9, scale = 1, light = false }: { x?: number; y?: number; spread?: number; scale?: number; light?: boolean }) {
  const fill = light ? '#2b2440' : '#fffaf2';
  return (
    <g className="spirit-eyes" style={{ transformOrigin: `${x}px ${y}px` }}>
      <ellipse cx={x - spread} cy={y} rx={2.6 * scale} ry={3.2 * scale} fill={fill} />
      <ellipse cx={x + spread} cy={y} rx={2.6 * scale} ry={3.2 * scale} fill={fill} />
      <circle cx={x - spread} cy={y - 0.8} r={1.1 * scale} fill={light ? '#5c5478' : '#3b2c56'} />
      <circle cx={x + spread} cy={y - 0.8} r={1.1 * scale} fill={light ? '#5c5478' : '#3b2c56'} />
    </g>
  );
}

export default function SpiritArt({ id, className = '', float = true, dim = false }: Props) {
  const uid = useId().replace(/[:]/g, '');
  const def = SPIRITS[id];
  const { petal, petalDeep, core, glow } = def.palette;

  return (
    <svg
      viewBox="0 0 120 120"
      className={`spirit-art ${float ? 'spirit-float' : ''} ${className}`}
      aria-hidden="true"
      focusable="false"
      opacity={dim ? 0.55 : 1}
    >
      <defs>
        <radialGradient id={`aura-${uid}`} cx="50%" cy="52%" r="50%">
          <stop offset="0%" stopColor={glow} stopOpacity="0.5" />
          <stop offset="65%" stopColor={glow} stopOpacity="0.13" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={petal} />
          <stop offset="100%" stopColor={petalDeep} />
        </linearGradient>
      </defs>

      <circle cx="60" cy="62" r="52" fill={`url(#aura-${uid})`} />
      <g className="spirit-bob">
        {id === 'mossling' && (
          <g>
            <path
              d="M60 32 C 78 32, 92 46, 92 62 C 92 80, 78 92, 60 92 C 42 92, 28 80, 28 62 C 28 46, 42 32, 60 32 Z"
              fill={`url(#body-${uid})`}
            />
            <path d="M43 41 C 47 32, 55 28, 62 29" stroke={core} strokeWidth="1.6" fill="none" opacity="0.5" strokeLinecap="round" />
            <path d="M39 62 C 36 54, 38 47, 44 44" stroke={petalDeep} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M59 33 C 57 24, 60 17, 67 14 C 69 23, 66 30, 61 34 Z" fill={petalDeep} />
            <path d="M61 32 C 64 25, 70 22, 75 23 C 73 29, 68 33, 62 35 Z" fill={petal} />
            <circle cx="37" cy="72" r="4" fill={petalDeep} opacity="0.55" />
            <circle cx="82" cy="78" r="2.4" fill={core} opacity="0.7" />
            <Eyes y={60} />
            <path d="M56 72 C 58 74, 62 74, 64 72" stroke="#3b2c56" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.55" />
            <circle cx="42" cy="67" r="3.4" fill={core} opacity="0.28" />
            <circle cx="78" cy="67" r="3.4" fill={core} opacity="0.28" />
          </g>
        )}

        {id === 'tidewhisper' && (
          <g>
            <path d="M60 26 C 72 44, 88 56, 88 70 C 88 84, 75 94, 60 94 C 45 94, 32 84, 32 70 C 32 56, 48 44, 60 26 Z" fill={`url(#body-${uid})`} opacity="0.92" />
            <path d="M33 62 C 22 60, 16 68, 18 78 C 27 80, 34 74, 36 66 Z" fill={petal} opacity="0.6" />
            <path d="M87 62 C 98 60, 104 68, 102 78 C 93 80, 86 74, 84 66 Z" fill={petal} opacity="0.6" />
            <path d="M44 46 C 50 40, 55 36, 60 32" stroke="#ffffff" strokeWidth="2" opacity="0.4" fill="none" strokeLinecap="round" />
            <Eyes y={64} />
            <path d="M56 76 C 58 78, 62 78, 64 76" stroke="#2f5b70" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.5" />
            <circle cx="88" cy="46" r="2.2" fill="#ffffff" opacity="0.55" />
            <circle cx="96" cy="36" r="1.4" fill="#ffffff" opacity="0.4" />
          </g>
        )}

        {id === 'emberling' && (
          <g>
            <path
              d="M60 22 C 74 38, 86 48, 86 64 C 86 82, 74 94, 60 94 C 46 94, 34 82, 34 64 C 34 48, 46 38, 60 22 Z"
              fill={`url(#body-${uid})`}
            />
            <path d="M60 44 C 68 54, 74 60, 74 69 C 74 79, 68 86, 60 86 C 52 86, 46 79, 46 69 C 46 60, 52 54, 60 44 Z" fill={core} opacity="0.55" />
            <path d="M60 26 C 66 35, 71 41, 73 47" stroke="#fff3d0" strokeWidth="2" opacity="0.5" fill="none" strokeLinecap="round" />
            <Eyes y={64} light />
            <path d="M56 76 C 58 78, 62 78, 64 76" stroke="#6b4322" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.55" />
            <circle cx="30" cy="50" r="2" fill={glow} opacity="0.85" className="spark-drift" />
            <circle cx="93" cy="65" r="1.6" fill={glow} opacity="0.7" className="spark-drift" style={{ animationDelay: '1s' }} />
            <circle cx="85" cy="34" r="1.2" fill={core} opacity="0.8" className="spark-drift" style={{ animationDelay: '1.8s' }} />
          </g>
        )}

        {id === 'starling' && (
          <g>
            <path
              d="M60 22 C 64 34, 68 39, 80 41 C 71 49, 69 55, 72 68 C 62 62, 58 62, 48 68 C 51 55, 49 49, 40 41 C 52 39, 56 34, 60 22 Z"
              fill={`url(#body-${uid})`}
              stroke={core}
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            <path d="M60 38 C 62 44, 64 47, 69 48" stroke="#ffffff" strokeWidth="1.4" opacity="0.55" fill="none" strokeLinecap="round" />
            <g className="spirit-eyes">
              <ellipse cx="56" cy="52" rx="2.2" ry="2.8" fill="#413560" />
              <ellipse cx="64" cy="52" rx="2.2" ry="2.8" fill="#413560" />
              <circle cx="55.4" cy="51" r="0.9" fill="#ffffff" />
              <circle cx="63.4" cy="51" r="0.9" fill="#ffffff" />
            </g>
            <path d="M57 58 C 59 59, 61 59, 63 58" stroke="#413560" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
            <circle cx="28" cy="70" r="1.6" fill={core} className="spark-drift" />
            <circle cx="95" cy="52" r="2" fill={petal} opacity="0.8" className="spark-drift" style={{ animationDelay: '0.8s' }} />
            <circle cx="88" cy="84" r="1.2" fill={core} className="spark-drift" style={{ animationDelay: '1.6s' }} />
          </g>
        )}

        {id === 'petalwisp' && (
          <g>
            <path d="M60 34 C 71 34, 80 43, 80 54 C 80 58, 79 62, 77 65 C 86 68, 92 76, 92 84 C 80 88, 70 84, 65 77 C 62 80, 58 80, 55 77 C 50 84, 40 88, 28 84 C 28 76, 34 68, 43 65 C 41 62, 40 58, 40 54 C 40 43, 49 34, 60 34 Z" fill={`url(#body-${uid})`} />
            <path d="M43 68 C 49 74, 53 78, 56 80" stroke={petalDeep} strokeWidth="1.2" fill="none" opacity="0.4" />
            <path d="M77 68 C 71 74, 67 78, 64 80" stroke={petalDeep} strokeWidth="1.2" fill="none" opacity="0.4" />
            <path d="M60 34 C 60 27, 58 22, 54 18" stroke={petalDeep} strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="53" cy="17" r="3" fill={core} />
            <Eyes y={55} spread={8} />
            <path d="M56 64 C 58 66, 62 66, 64 64" stroke="#7c4a62" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
            <circle cx="92" cy="42" r="1.6" fill={core} opacity="0.7" className="spark-drift" />
          </g>
        )}

        {id === 'nocturne' && (
          <g>
            <circle cx="60" cy="60" r="34" fill={`url(#body-${uid})`} />
            <circle cx="73" cy="52" r="29" fill="#171528" opacity="0.92" />
            <circle cx="60" cy="60" r="34" fill="none" stroke={core} strokeWidth="0.8" opacity="0.4" />
            <g className="spirit-eyes">
              <ellipse cx="54" cy="64" rx="2.4" ry="3" fill="#f4f1ff" />
              <circle cx="53.4" cy="63" r="1" fill="#40406e" />
            </g>
            <path d="M58 73 C 60 74, 62 74, 64 72" stroke="#cfd4ff" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
            <circle cx="80" cy="71" r="1.6" fill="#ffffff" opacity="0.8" />
            <circle cx="86" cy="58" r="1" fill="#ffffff" opacity="0.6" />
            <circle cx="60" cy="60" r="46" fill="none" stroke={glow} strokeWidth="0.6" strokeDasharray="1 7" opacity="0.45" className="halo" />
            <circle cx="25" cy="48" r="1.4" fill={core} className="spark-drift" />
            <circle cx="91" cy="92" r="1.8" fill={glow} className="spark-drift" style={{ animationDelay: '1.2s' }} />
          </g>
        )}
      </g>
    </svg>
  );
}
