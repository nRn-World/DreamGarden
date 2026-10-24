import { useEffect, useRef, type ReactNode } from 'react';
import { useGame } from '../game/store';
import { makeT } from '../i18n';
import Icon from './Icon';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  closable?: boolean;
}

export default function SheetFrame({ title, subtitle, children, footer, className = '', closable = true }: Props) {
  const closeSheet = useGame((s) => s.closeSheet);
  const locale = useGame((s) => s.save.locale ?? 'en');
  const t = makeT(locale);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((node) => node.offsetParent !== null);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closable) {
        closeSheet();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [closeSheet, closable]);

  return (
    <div className="sheet-root">
      <div className="sheet-backdrop" onClick={() => closable && closeSheet()} aria-hidden="true" />
      <div
        className={`sheet-panel ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={panelRef}
        tabIndex={-1}
      >
        <div className="sheet-grabber" aria-hidden="true" />
        <header className="sheet-head">
          <div>
            <h2 className="sheet-title">{title}</h2>
            {subtitle && <p className="sheet-subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="icon-button sheet-close"
            onClick={closeSheet}
            aria-label={t('common.close')}
            ref={closeRef}
          >
            <Icon name="close" size={18} />
          </button>
        </header>
        <div className="sheet-body">{children}</div>
        {footer && <footer className="sheet-footer">{footer}</footer>}
      </div>
    </div>
  );
}

export function SheetEmpty({ icon = 'leaf', title, body }: { icon?: 'leaf' | 'basket' | 'wish'; title: string; body: string }) {
  return (
    <div className="sheet-empty">
      <span className="sheet-empty-orb">
        <Icon name={icon} size={26} />
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
