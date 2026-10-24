import type { LocaleCode } from '../languages';
import en from './en';
import sv from './sv';
import tr from './tr';
import es from './es';
import ar from './ar';
import fr from './fr';
import ja from './ja';
import type { Tale } from './types';

export type { Tale };

export const TALES: Record<LocaleCode, Tale[]> = { en, sv, tr, es, ar, fr, ja };

/** Tale `index` (1-based) in the player's language, falling back to English. */
export function taleFor(locale: string, index: number): Tale | undefined {
  return (TALES[locale as LocaleCode] ?? en)[index - 1] ?? en[index - 1];
}
