import { useId } from 'react';
import type { DecoId } from '../game/types';

export default function DecoArt({ id, className = '' }: { id: DecoId; className?: string }) {
  const uid = useId().replace(/[:]/g, '');
  return (
    <svg viewBox="0 0 120 140" className={`deco-art ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`wood-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7d5c63" />
          <stop offset="100%" stopColor="#4a3748" />
        </linearGradient>
        <radialGradient id={`light-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe7a8" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#ffc978" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffb35c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`water-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8ee6e0" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#3f7f9b" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`blossom-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd7e6" />
          <stop offset="100%" stopColor="#e796bb" />
        </linearGradient>
      </defs>

      {id === 'lantern' && (
        <g>
          <circle cx="60" cy="56" r="46" fill={`url(#light-${uid})`} className="deco-glow" />
          <path d="M60 132 L60 58" stroke={`url(#wood-${uid})`} strokeWidth="5" strokeLinecap="round" />
          <path d="M38 132 C 38 126, 82 126, 82 132" stroke="#3a2f3e" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M44 66 C 44 52, 76 52, 76 66" stroke="#5c4859" strokeWidth="4" fill="none" />
          <path d="M42 64 L 78 64 L 72 58 L 48 58 Z" fill="#66505f" />
          <rect x="46" y="66" width="28" height="28" rx="9" fill="#ffe3a3" opacity="0.92" />
          <rect x="46" y="66" width="28" height="28" rx="9" fill="none" stroke="#f7c879" strokeWidth="2" />
          <circle cx="60" cy="80" r="7" fill="#fff6d6" />
          <path d="M60 94 L 66 100 L 60 106 L 54 100 Z" fill="#66505f" />
          <path d="M49 70 L 49 90 M71 70 L 71 90" stroke="#e7b96a" strokeWidth="1" opacity="0.5" />
          <circle cx="84" cy="46" r="1.6" fill="#ffe9ae" className="spark-drift" />
        </g>
      )}

      {id === 'pond' && (
        <g>
          <ellipse cx="60" cy="104" rx="50" ry="24" fill="#1d2a3a" opacity="0.55" />
          <ellipse cx="60" cy="100" rx="48" ry="22" fill={`url(#water-${uid})`} />
          <ellipse cx="60" cy="96" rx="30" ry="10" fill="#bff6ef" opacity="0.13" />
          <path d="M24 98 C 34 92, 46 92, 56 96" stroke="#c7fff8" strokeWidth="1.2" opacity="0.4" fill="none" />
          <path d="M74 106 C 84 102, 94 102, 100 106" stroke="#c7fff8" strokeWidth="1" opacity="0.25" fill="none" />
          <g transform="translate(44 96)">
            <ellipse rx="12" ry="5" fill="#5fae8f" />
            <path d="M-12 0 C -4 -6, 4 -6, 12 0" stroke="#7fd0a9" strokeWidth="1.2" fill="none" />
            <path d="M0 -3 C 2 -10, 6 -12, 9 -12 C 7 -5, 4 -2, 0 -3 Z" fill="#ffd0e3" />
          </g>
          <g transform="translate(78 106) scale(0.7)">
            <ellipse rx="10" ry="4.2" fill="#4f9c84" />
            <path d="M0 -2 C 1 -8, 4 -10, 7 -10 C 5 -4, 3 -1, 0 -2 Z" fill="#ffe0b8" />
          </g>
          <circle cx="34" cy="106" r="1.6" fill="#d9fff7" opacity="0.7" />
          <circle cx="88" cy="92" r="1.2" fill="#d9fff7" opacity="0.5" />
          <g opacity="0.7">
            <circle cx="62" cy="88" r="3" fill="#ffffff" opacity="0.35" />
            <circle cx="58" cy="86" r="1.6" fill="#ffffff" opacity="0.3" />
          </g>
        </g>
      )}

      {id === 'arch' && (
        <g>
          <path d="M28 130 C 28 70, 92 70, 92 130" stroke={`url(#wood-${uid})`} strokeWidth="5" fill="none" />
          <path d="M38 130 C 38 84, 82 84, 82 130" stroke="#6a5364" strokeWidth="2" fill="none" opacity="0.7" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const t = i / 6;
            const x = 28 + 64 * t;
            const y = 130 - Math.sin(Math.PI * t) * 54;
            return (
              <g key={i} transform={`translate(${x} ${y})`}>
                <circle r="5" fill={`url(#blossom-${uid})`} />
                <circle r="2" fill="#fff0c9" />
                <path d="M-1 5 C 1 10, -2 14, -4 16" stroke="#7fb98d" strokeWidth="1.4" fill="none" />
              </g>
            );
          })}
          <path d="M28 130 C 20 136, 18 140, 22 138 M92 130 C 100 136, 102 140, 98 138" stroke="#7fb98d" strokeWidth="2" fill="none" />
          <circle cx="30" cy="64" r="1.5" fill="#ffe6f0" className="spark-drift" />
        </g>
      )}

      {id === 'bench' && (
        <g>
          <path d="M24 100 C 30 94, 90 94, 96 100 L 94 108 C 88 104, 32 104, 26 108 Z" fill={`url(#wood-${uid})`} />
          <path d="M28 84 C 34 78, 86 78, 92 84 L 92 94 C 84 90, 36 90, 28 94 Z" fill="#6a5364" />
          <path d="M32 80 C 40 76, 80 76, 88 80" stroke="#8f7484" strokeWidth="1.4" fill="none" opacity="0.7" />
          <path d="M32 108 L 30 128 M88 108 L 90 128" stroke="#4a3748" strokeWidth="4" strokeLinecap="round" />
          <path d="M40 108 L 38 124 M80 108 L 82 124" stroke="#4a3748" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
          <path d="M26 99 C 34 95, 44 95, 50 97" stroke="#b2919f" strokeWidth="1" opacity="0.5" fill="none" />
          <g transform="translate(76 94)">
            <ellipse rx="5" ry="4" fill="#ffd0e3" />
            <ellipse cx="4" cy="-3" rx="3.6" ry="3" fill="#ffe0ec" />
            <circle cx="2" cy="-1" r="1.4" fill="#fff5c9" />
          </g>
          <path d="M28 122 C 34 126, 40 126, 46 124" stroke="#7fb98d" strokeWidth="1.4" fill="none" opacity="0.7" />
        </g>
      )}

      {id === 'mushrooms' && (
        <g>
          <ellipse cx="60" cy="116" rx="44" ry="13" fill="#1f2a2c" opacity="0.4" />
          {[
            { x: 36, y: 112, s: 0.8 },
            { x: 52, y: 118, s: 1.15 },
            { x: 74, y: 114, s: 0.95 },
            { x: 90, y: 120, s: 0.65 },
            { x: 62, y: 108, s: 0.55 },
          ].map((m, i) => (
            <g key={i} transform={`translate(${m.x} ${m.y}) scale(${m.s})`}>
              <path d="M-3 0 C -3 -10, 3 -10, 3 0" stroke="#e7d9c2" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M-13 -2 C -14 -16, -6 -22, 0 -22 C 7 -22, 14 -16, 13 -2 C 8 -6, -8 -6, -13 -2 Z" fill={i % 2 ? '#8fb6ff' : '#b9a4ff'} />
              <path d="M-9 -10 C -6 -16, 4 -17, 8 -12" stroke="#e4dcff" strokeWidth="1.2" fill="none" opacity="0.6" />
              <circle cx="-4" cy="-12" r="1.6" fill="#f0f6ff" opacity="0.8" />
              <circle cx="5" cy="-8" r="1.1" fill="#f0f6ff" opacity="0.7" />
            </g>
          ))}
          <circle cx="52" cy="88" r="2" fill="#cfd8ff" className="spark-drift" opacity="0.7" />
          <circle cx="78" cy="94" r="1.4" fill="#cfd8ff" className="spark-drift" style={{ animationDelay: '1s' }} opacity="0.6" />
        </g>
      )}

      {id === 'chimes' && (
        <g>
          <path d="M22 44 C 40 36, 82 34, 100 44" stroke={`url(#wood-${uid})`} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M60 38 L 60 30" stroke="#6a5364" strokeWidth="2" />
          {[40, 52, 64, 76].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 44 L ${x} ${74 + i * 8}`} stroke="#d8cde8" strokeWidth="1" opacity="0.5" />
              <rect x={x - 3} y={74 + i * 8} width="6" height={22 + i * 4} rx="3" fill={i % 2 ? '#bfe6d9' : '#e5d4ff'} opacity="0.85" />
              <circle cx={x} cy={100 + i * 4} r="1.4" fill="#fff5d6" />
            </g>
          ))}
          <path d="M46 44 C 44 50, 48 54, 52 52 M70 42 C 72 48, 68 52, 64 50" stroke="#7fb98d" strokeWidth="1.2" fill="none" opacity="0.5" />
          <circle cx="92" cy="80" r="1.6" fill="#f5ecff" className="spark-drift" />
          <circle cx="30" cy="72" r="1.2" fill="#f5ecff" className="spark-drift" style={{ animationDelay: '1.2s' }} />
        </g>
      )}
    </svg>
  );
}
