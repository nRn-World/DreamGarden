import type { ReactNode } from 'react';

export type IconName =
  | 'dew'
  | 'stardust'
  | 'leaf'
  | 'seed'
  | 'wish'
  | 'spirit'
  | 'book'
  | 'settings'
  | 'basket'
  | 'water'
  | 'harvest'
  | 'moon'
  | 'close'
  | 'chevron'
  | 'check'
  | 'lock'
  | 'plus'
  | 'gift'
  | 'trophy'
  | 'sound'
  | 'music'
  | 'haptics'
  | 'motion'
  | 'text'
  | 'data'
  | 'reset'
  | 'shield'
  | 'info'
  | 'download'
  | 'upload'
  | 'back'
  | 'sun'
  | 'sparkle';

const paths: Record<IconName, ReactNode> = {
  dew: (
    <>
      <path d="M12 2.8c0 0 6.3 6.7 6.3 10.9a6.3 6.3 0 0 1-12.6 0C5.7 9.5 12 2.8 12 2.8Z" />
      <path d="M9.2 14.2a2.9 2.9 0 0 0 2.6 3" opacity=".6" />
    </>
  ),
  stardust: <path d="M12 2.2l2.4 7.4 7.4 2.4-7.4 2.4L12 21.8l-2.4-7.4L2.2 12l7.4-2.4z" fill="currentColor" stroke="none" />,
  leaf: (
    <>
      <path d="M20 4C10.6 4 4.5 8.1 4.5 15A4.5 4.5 0 0 0 9 19.5C16 19.5 20 13.4 20 4Z" />
      <path d="M4.7 19.4C7.5 14.7 11.5 10.9 16 8.4" opacity=".65" />
    </>
  ),
  seed: (
    <>
      <path d="M12 21c-4.4 0-7-2.7-7-6.2C5 10.4 8.6 7.2 12 3c3.4 4.2 7 7.4 7 11.8C19 18.3 16.4 21 12 21Z" />
      <path d="M12 20.6V12" opacity=".55" />
      <path d="M12 13.2c1.7-2.4 3.6-3.5 5.4-3.8" opacity=".55" />
    </>
  ),
  wish: (
    <>
      <path d="M12 3.4l1.9 5.1 5.1 1.9-5.1 1.9L12 17.4l-1.9-5.1L5 10.4l5.1-1.9z" />
      <path d="M18.4 16.2l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1-2.1-.8 2.1-.8z" />
    </>
  ),
  spirit: (
    <>
      <circle cx="12" cy="11" r="5.1" />
      <path d="M5.1 8.4C3 9 1.8 10.2 1.5 11.8c1.5 1 3.3 1.2 5.2.8M18.9 8.4c2.1.6 3.3 1.8 3.6 3.4-1.5 1-3.3 1.2-5.2.8" />
      <path d="M9.6 11.2h.01M14.4 11.2h.01" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M10 13.8c1.2.8 2.8.8 4 0" opacity=".7" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.4C6.6 4.3 9.4 4.3 12 5.5c2.6-1.2 5.4-1.2 8 0v12.9c-2.6-1.2-5.4-1.2-8 0-2.6-1.2-5.4-1.2-8 0Z" />
      <path d="M12 5.5v12.9" opacity=".55" />
      <path d="M7 8.6c1.1-.3 2.2-.3 3.3 0M7 11.3c1.1-.3 2.2-.3 3.3 0M13.7 8.6c1.1-.3 2.2-.3 3.3 0" opacity=".5" />
    </>
  ),
  settings: (
    <>
      <path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h9M17 17h3" />
      <circle cx="15" cy="7" r="2.1" />
      <circle cx="9" cy="12" r="2.1" />
      <circle cx="15" cy="17" r="2.1" />
    </>
  ),
  basket: (
    <>
      <path d="M4.2 9.5h15.6l-1.7 9.2a2 2 0 0 1-2 1.6H7.9a2 2 0 0 1-2-1.6Z" />
      <path d="M8.4 9.5C8.4 5.7 10 3.4 12 3.4s3.6 2.3 3.6 6.1" />
      <path d="M9.4 13.4v3.2M14.6 13.4v3.2" opacity=".5" />
    </>
  ),
  water: (
    <>
      <path d="M12 3.2c0 0 5.4 5.9 5.4 9.5a5.4 5.4 0 0 1-10.8 0C6.6 9.1 12 3.2 12 3.2Z" />
      <path d="M9.8 14.6c.2 1.2 1 2 2.2 2.2" opacity=".6" />
    </>
  ),
  harvest: (
    <>
      <path d="M12 21c-4.4 0-7-2.7-7-6.2C5 10.4 8.6 7.2 12 3c3.4 4.2 7 7.4 7 11.8C19 18.3 16.4 21 12 21Z" />
      <path d="M12 20.6V12M12 14.4l3.3-3M12 17l-3-2.8" opacity=".6" />
    </>
  ),
  moon: <path d="M20 14.4A8.6 8.6 0 0 1 9.6 4a8.7 8.7 0 1 0 10.4 10.4Z" />,
  close: <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />,
  chevron: <path d="M9.5 6.5 15 12l-5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />,
  check: <path d="m5 12.5 4.2 4.2L19 6.8" strokeLinecap="round" strokeLinejoin="round" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9.5" rx="3" />
      <path d="M8.4 10.5V8a3.6 3.6 0 0 1 7.2 0v2.5" />
      <circle cx="12" cy="15.2" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" strokeLinecap="round" />,
  gift: (
    <>
      <path d="M4 10h16v9.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5Z" />
      <path d="M3 6.8h18V10H3z" />
      <path d="M12 6.8v14.2" opacity=".7" />
      <path d="M12 6.8C10.4 3.4 8.9 2.5 7.6 3.2 6 4 6.5 6.4 8.4 6.8M12 6.8c1.6-3.4 3.1-4.3 4.4-3.6 1.6.8 1.1 3.2-.8 3.6" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 4h8v4.2a4 4 0 0 1-8 0Z" />
      <path d="M8 5.4H5.2v1.4a3.2 3.2 0 0 0 3.2 3.2M16 5.4h2.8v1.4a3.2 3.2 0 0 1-3.2 3.2" />
      <path d="M12 12.4V16M8.6 20h6.8M9.6 16h4.8v4H9.6z" />
    </>
  ),
  sound: (
    <>
      <path d="M4 9.5h3.2L12 5.3v13.4L7.2 14.5H4Z" />
      <path d="M15.6 9a4.4 4.4 0 0 1 0 6M18 6.4a8 8 0 0 1 0 11.2" opacity=".6" />
    </>
  ),
  music: (
    <>
      <path d="M9 17.4V5.6l9-1.8v11.6" />
      <circle cx="6.4" cy="17.8" r="2.6" />
      <circle cx="15.4" cy="15.8" r="2.6" />
    </>
  ),
  haptics: (
    <>
      <rect x="8" y="3" width="8" height="18" rx="2.4" />
      <path d="M5 8.5c-1.4 2.2-1.4 4.8 0 7M19 8.5c1.4 2.2 1.4 4.8 0 7" opacity=".6" />
      <path d="M11.4 17.8h1.2" opacity=".6" />
    </>
  ),
  motion: <path d="M3 8.5h11a3 3 0 1 0-3-3M3 12.5h16a3 3 0 1 1-3 3M3 16.5h7" strokeLinecap="round" />,
  text: <path d="M4 19 9.4 5h1.6L16.4 19M6 14.4h8M17.4 19l2.3-6.4M19.9 19l-2.3-6.4M17.7 12.6h4.4" strokeLinecap="round" />,
  data: (
    <>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
      <path d="M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
    </>
  ),
  reset: (
    <>
      <path d="M4 10.5a8 8 0 1 1 1.4 6.2" />
      <path d="M4 4.5v6h6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 5.8v5.6c0 4.4 2.9 7.6 7 9.1 4.1-1.5 7-4.7 7-9.1V5.8Z" />
      <path d="m9 11.8 2.1 2.1 4-4" opacity=".7" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 10.8v5.4M12 7.9h.01" strokeLinecap="round" strokeWidth="2" />
    </>
  ),
  download: <path d="M12 3.4v11.2M7.4 11l4.6 4.6L16.6 11M4.5 19.6h15" strokeLinecap="round" strokeLinejoin="round" />,
  upload: <path d="M12 20.6V9.4M7.4 13l4.6-4.6L16.6 13M4.5 4.4h15" strokeLinecap="round" strokeLinejoin="round" />,
  back: <path d="M14.5 6 9 12l5.5 6" strokeLinecap="round" strokeLinejoin="round" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" strokeLinecap="round" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" />
      <path d="M18 15.2l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" />
    </>
  ),
};

export default function Icon({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`icon ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
