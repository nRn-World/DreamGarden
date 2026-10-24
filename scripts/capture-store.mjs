/**
 * Captures store screenshots from the local dev server.
 *
 * Usage:  bun run dev   (in another terminal)
 *         node scripts/capture-store.mjs
 *
 * Uses the installed Chrome (playwright-core, no browser download) at a
 * 430 × 932 CSS viewport with 3× density → 1290 × 2796 pixels, the App Store
 * 6.7" size. Also fine for Google Play (minimum 320 px, maximum 3840 px).
 */
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = process.env.GARDEN_URL ?? 'http://127.0.0.1:5173';
const OUT = 'store/screenshots';

const plant = (now, species, minutes, watered = 2) => ({
  species,
  plantedAt: now - minutes * 60_000,
  watered,
  totalWatered: watered,
});

function enrich(raw) {
  const now = Date.now();
  const save = JSON.parse(JSON.stringify(raw));
  save.level = 12;
  save.xp = 340;
  save.dew = 2480;
  save.stardust = 26;
  save.unlockedPlants = [
    'dewbell',
    'lumenlotus',
    'starfern',
    'moonrose',
    'sunspire',
    'crystalbloom',
    'whisperorchid',
  ];
  const plantings = [
    plant(now, 'moonrose', 40),
    plant(now, 'sunspire', 30),
    plant(now, 'dewbell', 2),
    plant(now, 'lumenlotus', 5),
    plant(now, 'crystalbloom', 20 * 60),
    plant(now, 'starfern', 120),
    plant(now, 'whisperorchid', 4),
    plant(now, 'eternitybloom', 3),
    null,
    null,
    null,
    null,
  ];
  save.plots = save.plots.map((plot, index) => ({
    ...plot,
    unlocked: index < 9,
    plant: plantings[index] ?? undefined,
  }));
  save.inventory = { dewbell: 4, lumenlotus: 2, starfern: 2, moonrose: 1 };
  save.chaptersRead = [1, 2, 3, 4];
  save.lastChapterSeen = 4;
  save.stats = {
    ...save.stats,
    harvests: 38,
    cropsSold: 27,
    dewEarned: 5240,
    planted: 54,
    ordersDone: 7,
    spiritsBonded: 5,
    chaptersRead: 4,
    boostsUsed: 12,
    dailyMaxStreak: 6,
    rareHarvests: 3,
    harvestsByPlant: { dewbell: 12, lumenlotus: 9, starfern: 7, moonrose: 6, sunspire: 4 },
  };
  save.spirits = {
    mossling: { bond: 5, essence: 3, offerings: 12, unlocked: true },
    tidewhisper: { bond: 4, essence: 2, offerings: 9, unlocked: true },
    emberling: { bond: 3, essence: 1, offerings: 7, unlocked: true },
    starling: { bond: 4, essence: 2, offerings: 10, unlocked: true },
    petalwisp: { bond: 2, essence: 0, offerings: 4, unlocked: true },
    nocturne: { bond: 1, essence: 0, offerings: 2, unlocked: true },
  };
  save.equipped = ['mossling', 'starling', 'nocturne'];
  save.decorations = { lantern: true, pond: true, arch: true, bench: true, mushrooms: true, chimes: true };
  save.placedDecorations = ['pond', 'lantern', 'arch', 'mushrooms', 'bench', 'chimes'];
  save.daily = { lastClaim: 0, streak: 6, totalClaims: 11 };
  save.achievementsClaimed = [
    'firstBloom',
    'greenThumb',
    'spiritFriend',
    'decorator',
    'patientGardener',
  ];
  save.flags = { harvestedFirst: true, metSpirit: 'mossling', sawHarmony: true };
  save.tutorial = 6;
  save.onboarded = true;
  save.locale = 'en';
  return save;
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({ executablePath: CHROME, headless: true });

  // Onboarding, from a clean context.
  const onboarding = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 3,
    locale: 'en-GB',
    colorScheme: 'dark',
  });
  const fresh = await onboarding.newPage();
  await fresh.goto(BASE, { waitUntil: 'networkidle' });
  await fresh.evaluate(() => document.fonts.ready);
  await fresh.waitForTimeout(900);
  await fresh.screenshot({ path: `${OUT}/00-onboarding.png` });
  await onboarding.close();

  // Main context with a rich, progressed garden.
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 3,
    locale: 'en-GB',
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200); // let the fresh save persist

  // Write the save from a page that doesn't run the game, so pagehide can't
  // overwrite it with the fresh state.
  await page.goto(`${BASE}/icons/icon.svg`);
  const level = await page.evaluate((enriched) => {
    const raw = localStorage.getItem('dreamgarden.save.v1');
    if (!raw) return 0;
    const save = JSON.parse(raw);
    Object.assign(save, enriched);
    localStorage.setItem('dreamgarden.save.v1', JSON.stringify(save));
    localStorage.setItem('dreamgarden.save.backup.v1', JSON.stringify(save));
    return save.level;
  }, enrich(await page.evaluate(() => JSON.parse(localStorage.getItem('dreamgarden.save.v1') ?? '{}'))));
  if (level === 0) throw new Error('Could not seed a save; is the dev server running?');

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/01-title.png` });

  await page.getByRole('button', { name: /continue growing|enter the garden/i }).click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/02-garden.png` });

  await page.getByRole('button', { name: 'Seeds', exact: true }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/03-seeds.png` });

  await page.getByRole('button', { name: 'Spirits', exact: true }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/04-spirits.png` });

  await page.getByRole('button', { name: 'Journal', exact: true }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/05-journal.png` });

  await page.locator('.chapter-card').first().click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/06-story.png` });
  await page.getByRole('button', { name: /close/i }).last().click();
  await page.waitForTimeout(400);

  await page.getByRole('button', { name: /open settings/i }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/07-settings.png` });

  await context.close();
  await browser.close();
  console.log(`Captured 8 screenshots in ${OUT}/ at 1290 × 2796.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
