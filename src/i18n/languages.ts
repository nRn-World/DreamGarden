export type LocaleCode = 'en' | 'sv' | 'tr' | 'es' | 'ar' | 'fr' | 'ja';

export interface LanguageDef {
  code: LocaleCode;
  nativeName: string;
  englishName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

/** Flags are public-domain SVG files from flagcdn.com (see THIRD_PARTY_NOTICES.md). */
export const LANGUAGES: LanguageDef[] = [
  { code: 'en', nativeName: 'English', englishName: 'English', flag: 'gb', dir: 'ltr' },
  { code: 'sv', nativeName: 'Svenska', englishName: 'Swedish', flag: 'se', dir: 'ltr' },
  { code: 'tr', nativeName: 'Türkçe', englishName: 'Turkish', flag: 'tr', dir: 'ltr' },
  { code: 'es', nativeName: 'Español', englishName: 'Spanish', flag: 'es', dir: 'ltr' },
  { code: 'ar', nativeName: 'العربية', englishName: 'Arabic', flag: 'sa', dir: 'rtl' },
  { code: 'fr', nativeName: 'Français', englishName: 'French', flag: 'fr', dir: 'ltr' },
  { code: 'ja', nativeName: '日本語', englishName: 'Japanese', flag: 'jp', dir: 'ltr' },
];

export const DEFAULT_LOCALE: LocaleCode = 'en';

export function isLocale(value: string | null | undefined): value is LocaleCode {
  return !!value && LANGUAGES.some((l) => l.code === value);
}

export function languageFor(code: string | null | undefined): LanguageDef {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}

export function detectLocale(): LocaleCode {
  try {
    const candidates = [navigator.language, ...(navigator.languages ?? [])];
    for (const raw of candidates) {
      const base = (raw ?? '').toLowerCase().split('-')[0];
      if (isLocale(base)) return base;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}
