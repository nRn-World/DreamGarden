import { describe, expect, it } from 'vitest';
import en, { type DictKey } from '../i18n/en';
import sv from '../i18n/sv';
import tr from '../i18n/tr';
import es from '../i18n/es';
import ar from '../i18n/ar';
import fr from '../i18n/fr';
import ja from '../i18n/ja';
import { dictionaries, formatDuration, makeT, translate } from '../i18n';

const locales = { sv, tr, es, ar, fr, ja };
const englishKeys = Object.keys(en) as DictKey[];

function placeholders(text: string): string[] {
  return Array.from(text.matchAll(/\{([a-zA-Z]+)\}/g))
    .map((match) => match[1])
    .sort();
}

describe('dictionary completeness', () => {
  it.each(Object.entries(locales))('%s contains every English key', (_code, dict) => {
    expect(Object.keys(dict).sort()).toEqual([...englishKeys].sort());
  });

  it.each(Object.entries(locales))('%s has no empty values', (_code, dict) => {
    for (const key of englishKeys) {
      expect(dict[key].trim().length, `${key} must not be empty`).toBeGreaterThan(0);
    }
  });

  it.each(Object.entries(locales))('%s preserves every placeholder', (_code, dict) => {
    for (const key of englishKeys) {
      expect(placeholders(dict[key]), `placeholders in ${key}`).toEqual(placeholders(en[key]));
    }
  });

  it('keeps long story chapters translated in every locale', () => {
    for (const [code, dict] of Object.entries(locales)) {
      for (let index = 1; index <= 6; index += 1) {
        const key = `story.chapterBody.${index}` as DictKey;
        expect(dict[key].length, `${code} ${key}`).toBeGreaterThan(120);
        expect(dict[key]).not.toBe(en[key]);
      }
    }
  });

  it('ships the six required story chapters in English', () => {
    for (let index = 1; index <= 6; index += 1) {
      expect(en[`story.chapterTitle.${index}` as DictKey].length).toBeGreaterThan(0);
      expect(en[`story.chapterBody.${index}` as DictKey].length).toBeGreaterThan(120);
    }
  });

  it('uses the expected script for each language', () => {
    expect(ar['app.tagline']).toMatch(/[\u0600-\u06FF]/);
    expect(ja['app.tagline']).toMatch(/[\u3040-\u30FF\u4E00-\u9FFF]/);
    expect(sv['title.enter']).toMatch(/[åäö]/i);
    expect(fr['onboarding.continue']).toMatch(/[a-zéèêàç]/i);
  });

  it('registers all seven locales in the runtime dictionary map', () => {
    expect(Object.keys(dictionaries)).toEqual(['en', 'sv', 'tr', 'es', 'ar', 'fr', 'ja']);
  });
});

describe('translation runtime', () => {
  it('interpolates numbers and leaves unknown placeholders alone', () => {
    expect(translate('en', 'common.level', { level: 1200 })).toBe('Level 1,200');
    expect(translate('en', 'toast.harvested', { count: 2, plant: 'Dewbell' })).toBe('Harvested 2 Dewbell');
    expect(translate('en', 'common.level', { other: 'x' })).toBe('Level {level}');
  });

  it('falls back to English for a missing locale key', () => {
    expect(translate('xx', 'common.close')).toBe('Close');
    expect(translate('sv', 'common.close')).toBe('Stäng');
  });

  it('formats durations in the requested language', () => {
    const svT = makeT('sv');
    expect(formatDuration(0, 'sv', svT)).toBe('nu');
    expect(formatDuration(20_000, 'sv', svT)).toBe('20 s');
    expect(formatDuration(90_000, 'sv', svT)).toBe('1 min 30 s');
    expect(formatDuration(3_600_000, 'sv', svT)).toBe('1 t');
    expect(formatDuration(90_000_000, 'sv', svT)).toBe('1 d 1 t');
  });
});
