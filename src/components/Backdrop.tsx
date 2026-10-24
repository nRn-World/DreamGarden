import { useMemo } from 'react';

function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export default function Backdrop() {
  const stars = useMemo(() => {
    const rand = seeded(7);
    return Array.from({ length: 64 }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 78,
      size: 0.9 + rand() * 2.1,
      opacity: 0.25 + rand() * 0.65,
      delay: rand() * 6,
      duration: 3.5 + rand() * 5,
    }));
  }, []);

  return (
    <div className="backdrop" aria-hidden="true">
      <div className="sky-gradient" />
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="aurora aurora-three" />

      <div className="stars">
        {stars.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              insetInlineStart: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="moon">
        <div className="moon-halo" />
        <div className="moon-disc">
          <span className="moon-crater crater-a" />
          <span className="moon-crater crater-b" />
          <span className="moon-crater crater-c" />
        </div>
      </div>

      <div className="cloud cloud-a" />
      <div className="cloud cloud-b" />

      <div className="distant-islands">
        <svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="far-island" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a2a58" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#14112a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M70 236 C 110 214, 176 214, 212 236 C 236 250, 210 270, 180 286 C 158 298, 120 298, 100 284 C 78 268, 56 250, 70 236 Z" fill="url(#far-island)" />
          <path d="M118 224 C 126 206, 144 198, 158 202" stroke="#5b477d" strokeWidth="1.4" fill="none" opacity="0.35" />
          <path d="M600 260 C 640 238, 700 238, 730 258 C 748 270, 726 288, 700 298 C 674 308, 634 302, 616 288 C 602 278, 592 268, 600 260 Z" fill="url(#far-island)" opacity="0.8" />
          <path d="M700 160 C 720 148, 750 148, 766 160 C 776 168, 762 178, 746 184 C 730 188, 712 184, 704 174 C 700 168, 696 164, 700 160 Z" fill="url(#far-island)" opacity="0.45" />
        </svg>
      </div>

      <div className="mist mist-a" />
      <div className="mist mist-b" />
      <div className="vignette" />
    </div>
  );
}
