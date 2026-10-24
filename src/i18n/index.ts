import en, { type DictKey, type Dictionary } from './en';
import sv from './sv';
import tr from './tr';
import es from './es';
import ar from './ar';
import fr from './fr';
import ja from './ja';
import type { LocaleCode } from './languages';

export const dictionaries: Record<LocaleCode, Partial<Dictionary>> = { en, sv, tr, es, ar, fr, ja };

export type { DictKey, Dictionary };
export { LANGUAGES, languageFor, detectLocale, isLocale, DEFAULT_LOCALE } from './languages';
export type { LocaleCode } from './languages';

export const numberFormatters = new Map<string, Intl.NumberFormat>();

export function formatNumber(locale: string, value: number): string {
  let fmt = numberFormatters.get(locale);
  if (!fmt) {
    try {
      fmt = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    } catch {
      fmt = new Intl.NumberFormat('en', { maximumFractionDigits: 0 });
    }
    numberFormatters.set(locale, fmt);
  }
  return fmt.format(Math.round(value));
}

export function translate(
  locale: string,
  key: DictKey,
  vars?: Record<string, string | number>,
): string {
  const dict = (dictionaries[locale as LocaleCode] ?? en) as Partial<Dictionary>;
  let message = dict[key] ?? en[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      const raw = typeof value === 'number' ? formatNumber(locale, value) : value;
      message = message.split(`{${name}}`).join(raw);
    }
  }
  return message;
}

export function makeT(locale: string) {
  return (key: DictKey, vars?: Record<string, string | number>) => translate(locale, key, vars);
}

export type TFunction = ReturnType<typeof makeT>;

/** "3m 20s", "2h 5m", "4d 3h" — compact, locale-aware. */
export function formatDuration(ms: number, _locale: string, t: TFunction): string {
  if (!Number.isFinite(ms) || ms <= 0) return t('time.now');
  const totalSeconds = Math.ceil(ms / 1000);
  if (totalSeconds < 60) return t('time.seconds', { n: totalSeconds });
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 60) {
    const seconds = totalSeconds % 60;
    return seconds > 0 ? `${t('time.minutes', { n: minutes })} ${t('time.seconds', { n: seconds })}` : t('time.minutes', { n: minutes });
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    const rest = minutes % 60;
    return rest > 0 ? `${t('time.hours', { n: hours })} ${t('time.minutes', { n: rest })}` : t('time.hours', { n: hours });
  }
  const days = Math.floor(hours / 24);
  const rest = hours % 24;
  return rest > 0 ? `${t('time.days', { n: days })} ${t('time.hours', { n: rest })}` : t('time.days', { n: days });
}

export const ALL_KEYS = Object.keys(en) as DictKey[];
