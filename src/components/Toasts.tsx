import { useGame } from '../game/store';
import type { ToastIcon } from '../game/store';
import Icon, { type IconName } from './Icon';

const ICON_MAP: Record<ToastIcon, IconName> = {
  dew: 'dew',
  stardust: 'stardust',
  spirit: 'spirit',
  leaf: 'leaf',
  gift: 'gift',
  book: 'book',
  check: 'check',
  warn: 'info',
};

export default function Toasts() {
  const toasts = useGame((s) => s.toasts);
  return (
    <div className="toast-stack" role="status" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast tone-${toast.tone}`}>
          <span className="toast-icon">
            <Icon name={ICON_MAP[toast.icon]} size={15} />
          </span>
          <span>{toast.text}</span>
        </div>
      ))}
    </div>
  );
}
