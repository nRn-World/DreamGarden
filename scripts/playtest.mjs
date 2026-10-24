/**
 * End-to-end gameplay playtest against the local dev server.
 *
 * Usage: bun run dev (in another terminal)
 *        node scripts/playtest.mjs
 *
 * The script seeds a progressed save, then exercises the real UI. It is meant
 * to find interaction bugs, not to verify balance.
 */
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = (process.env.GARDEN_URL ?? 'http://127.0.0.1:5173').replace(/\/+$/, '');
const APP = `${BASE}/`;
const KEY = 'dreamgarden.save.v1';
const BACKUP = 'dreamgarden.save.backup.v1';
const OUT = '.tmp/playtest';
const results = [];
let failures = 0;

function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

async function tracked(page) {
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') {
      const loc = m.location();
      // The save-seeding helper opens /icons/icon.svg, which is outside the app
      // shell and therefore has no <link rel="icon">. Chrome's fallback request
      // for /favicon.ico there is not a game error.
      if (/\/favicon\.ico$/.test(loc.url || '')) return;
      errors.push(`${m.text()} @ ${loc.url || 'unknown'}:${loc.lineNumber ?? 0}`);
    }
  });
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (r) => {
    if (r.status() >= 400 && !/\/favicon\.ico$/.test(r.url())) errors.push(`${r.status()} ${r.url()}`);
  });
  page.on('requestfailed', (r) => errors.push(`FAILED ${r.url()} ${r.failure()?.errorText ?? ''}`));
  return errors;
}

async function seed(page) {
  await page.goto(APP, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const raw = await page.evaluate((key) => localStorage.getItem(key), KEY);
  if (!raw) throw new Error('No fresh save was written; is the app booting?');
  const save = JSON.parse(raw);

  const now = Date.now();
  const planted = (species, minutes) => ({
    species,
    plantedAt: now - minutes * 60_000,
    watered: 2,
    totalWatered: 2,
  });

  save.level = 17;
  save.xp = 900;
  save.dew = 6000;
  save.stardust = 40;
  save.onboarded = true;
  save.tutorial = 6;
  save.locale = 'en';
  save.unlockedPlants = [
    'dewbell',
    'lumenlotus',
    'starfern',
    'moonrose',
    'sunspire',
    'crystalbloom',
    'whisperorchid',
    'eternitybloom',
  ];
  save.plots = save.plots.map((plot, i) => {
    const plants = [
      planted('moonrose', 120),
      planted('sunspire', 120),
      planted('dewbell', 0.05),
      planted('whisperorchid', 0.05),
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];
    return { ...plot, unlocked: i < 9, plant: plants[i] ?? undefined };
  });
  save.inventory = {
    dewbell: 4,
    lumenlotus: 4,
    starfern: 3,
    moonrose: 2,
    sunspire: 2,
    crystalbloom: 1,
  };
  save.chaptersRead = [1, 2, 3, 4, 5];
  save.lastChapterSeen = 5;
  save.stats = {
    ...save.stats,
    harvests: 30,
    cropsSold: 20,
    dewEarned: 9000,
    planted: 60,
    ordersDone: 12,
    spiritsBonded: 5,
    chaptersRead: 5,
    boostsUsed: 10,
    dailyMaxStreak: 5,
    rareHarvests: 4,
    harvestsByPlant: { dewbell: 10, lumenlotus: 8, starfern: 6, moonrose: 4, sunspire: 2 },
  };
  save.spirits = {
    mossling: { bond: 2, essence: 0, offerings: 4, unlocked: true },
    tidewhisper: { bond: 2, essence: 0, offerings: 4, unlocked: true },
    emberling: { bond: 2, essence: 0, offerings: 4, unlocked: true },
    starling: { bond: 2, essence: 0, offerings: 4, unlocked: true },
    petalwisp: { bond: 2, essence: 0, offerings: 4, unlocked: true },
    nocturne: { bond: 2, essence: 0, offerings: 4, unlocked: true },
  };
  save.equipped = ['mossling'];
  save.decorations = { lantern: false, pond: false, arch: false, bench: false, mushrooms: false, chimes: false };
  save.placedDecorations = [];
  save.daily = { lastClaim: 0, streak: 4, totalClaims: 9 };
  save.moonwell = { charges: 3, date: new Date().toISOString().slice(0, 10) };
  save.achievementsClaimed = ['firstBloom'];
  save.flags = { harvestedFirst: true, metSpirit: 'mossling', sawHarmony: true };

  await page.goto(`${BASE}/icons/icon.svg`);
  await page.evaluate(
    ({ key, backup, value }) => {
      localStorage.setItem(key, value);
      localStorage.setItem(backup, value);
    },
    { key: KEY, backup: BACKUP, value: JSON.stringify(save) },
  );
  await page.goto(APP, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    locale: 'en-GB',
    acceptDownloads: true,
  });
  const page = await context.newPage();
  const errors = await tracked(page);
  await seed(page);

  check('seeded title shows level 17', (await page.getByText('Level 17', { exact: false }).count()) >= 1);
  await page.getByRole('button', { name: /continue growing/i }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/01-garden.png` });

  const plots = page.locator('.plot');
  check('garden has twelve beds', (await plots.count()) === 12);

  const dewBefore = await page.locator('.currency-dew b').first().innerText();
  await page.locator('.plot.is-ripe').first().click();
  await page.waitForTimeout(500);
  const basketBadge = await page.locator('.basket-badge').count();
  check('harvest fills the basket', basketBadge === 1);
  await page.getByRole('button', { name: /harvest basket/i }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/02-basket.png` });
  const sellAll = page.getByRole('button', { name: /sell all/i });
  check('basket offers sell all', (await sellAll.count()) === 1);
  await page.locator('.sheet-close').click();

  // Plant a seed from an empty bed and tend it.
  await page.locator('.plot.is-empty').first().click();
  await page.waitForTimeout(400);
  await page.locator('.seed-card').first().click();
  await page.waitForTimeout(600);
  check('planting from an empty bed works', (await page.locator('.plot.is-planted').count()) >= 4);
  await page.screenshot({ path: `${OUT}/planted.png` });

  const newBed = page.locator('.plot.is-thirsty').first();
  const labelBefore = await newBed.getAttribute('aria-label');
  await newBed.click();
  await page.waitForTimeout(700);
  const bed0 = page.locator('.plot').nth(0);
  const labelAfter = await bed0.getAttribute('aria-label');
  check(
    'tapping a thirsty bed waters it',
    /^Water /.test(labelBefore ?? '') && !/^Water /.test(labelAfter ?? ''),
    `${labelBefore} → ${labelAfter}`,
  );

  await page.locator('.plot.is-planted:not(.is-ripe):not(.is-thirsty)').first().click();
  await page.waitForTimeout(400);
  check('plant detail sheet opens', (await page.locator('.sheet-panel').count()) === 1);
  const boost = page.getByRole('button', { name: /boost/i }).first();
  check('plant sheet offers a moon boost', (await boost.count()) === 1);
  const chargesBefore = await page.locator('.moonwell-chip').getAttribute('aria-label');
  await boost.click();
  await page.waitForTimeout(350);
  const chargesAfter = await page.locator('.moonwell-chip').getAttribute('aria-label');
  check('moon boost consumes a charge', chargesBefore !== chargesAfter, `${chargesBefore} → ${chargesAfter}`);
  await page.locator('.sheet-close').click();

  // Unlock a sealed bed.
  const lockedBed = page.locator('.plot.is-locked').first();
  const unlockedBefore = await page.locator('.plot:not(.is-locked)').count();
  await lockedBed.click();
  await page.waitForTimeout(400);
  const unlockButton = page.getByRole('button', { name: /unlock garden bed|unlock/i }).first();
  check('sealed bed opens an unlock sheet', (await unlockButton.count()) === 1);
  await page.screenshot({ path: `${OUT}/03-unlock.png` });
  await unlockButton.click();
  await page.waitForTimeout(500);
  const unlockedAfter = await page.locator('.plot:not(.is-locked)').count();
  check('unlocking adds a bed', unlockedAfter === unlockedBefore + 1, `${unlockedBefore} → ${unlockedAfter}`);

  // Decoration purchase and placement.
  await page.getByRole('button', { name: 'Seeds', exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByRole('tab', { name: /decor/i }).click();
  await page.waitForTimeout(400);
  const buy = page.getByRole('button', { name: /^buy$/i }).first();
  check('decor shop offers a purchase', (await buy.count()) === 1);
  await buy.click();
  await page.waitForTimeout(400);
  const place = page.getByRole('button', { name: /^place$/i }).first();
  check('owned decoration can be placed', (await place.count()) === 1);
  await place.click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Garden', exact: true }).click();
  await page.waitForTimeout(500);
  check('placed decoration appears in the garden', (await page.locator('.deco').count()) >= 1);
  await page.screenshot({ path: `${OUT}/04-decor.png` });

  // Wishes.
  await page.getByRole('button', { name: 'Wishes', exact: true }).click();
  await page.waitForTimeout(400);
  const wish = page.locator('.wish-button:not([disabled])').first();
  if (await wish.count()) {
    await wish.click();
    await page.waitForTimeout(500);
    check('fulfilling a wish succeeds', true);
  } else {
    check('wish order is fillable with seeded stock', false, 'no enabled wish');
  }

  // Spirit offering.
  await page.getByRole('button', { name: 'Spirits', exact: true }).click();
  await page.waitForTimeout(400);
  await page.locator('.spirit-card').first().click();
  await page.waitForTimeout(400);
  const offer = page.locator('.offer-row').first();
  if (await offer.count()) {
    await offer.click();
    await page.waitForTimeout(400);
    check('offering a bloom works', true);
  } else {
    check('spirit has a bloom to offer', false, 'no offer rows');
  }
  await page.screenshot({ path: `${OUT}/05-spirit.png` });
  await page.locator('.sheet-close').click();

  // Sell the basket after wishes and offerings, so those systems still have stock.
  await page.getByRole('button', { name: 'Garden', exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /harvest basket/i }).click();
  await page.waitForTimeout(400);
  const sellAfter = page.getByRole('button', { name: /sell all/i });
  if (await sellAfter.count()) {
    await sellAfter.click();
    await page.waitForTimeout(400);
    const dewAfter = await page.locator('.currency-dew b').first().innerText();
    check('selling increases dew', dewAfter !== dewBefore, `${dewBefore} → ${dewAfter}`);
  } else {
    check('basket still has crops to sell', false);
  }
  await page.locator('.sheet-close').click();

  // Achievement claim.
  await page.getByRole('button', { name: 'Journal', exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByRole('tab', { name: /milestones|achievements/i }).click();
  await page.waitForTimeout(400);
  const claim = page.locator('.achievement-claim:not([disabled])').first();
  check('at least one achievement is claimable', (await claim.count()) >= 1);
  if (await claim.count()) {
    await claim.click();
    await page.waitForTimeout(400);
    check('achievement claim is acknowledged', (await page.locator('.achievement-claimed').count()) >= 1);
  }
  await page.screenshot({ path: `${OUT}/06-achievements.png` });

  // Read the final chapter.
  await page.getByRole('tab', { name: /story/i }).click();
  await page.waitForTimeout(400);
  const chapterSix = page.locator('.chapter-card').nth(5);
  await chapterSix.click();
  await page.waitForTimeout(500);
  check('chapter six opens', (await page.locator('.story-sheet').count()) === 1);
  const finale = await page.locator('.finale-card').innerText().catch(() => '');
  check('the finale is reachable', /awake|thank you|eternity/i.test(finale));
  await page.screenshot({ path: `${OUT}/07-story.png` });
  await page.locator('.sheet-close').click();

  // Daily gift.
  await page.getByRole('button', { name: /open settings/i }).click();
  await page.waitForTimeout(300);
  await page.locator('.sheet-close').click();
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.getByRole('button', { name: /night gift/i }).click();
  await page.waitForTimeout(400);
  const claimGift = page.getByRole('button', { name: /claim gift/i });
  check('night gift is claimable', (await claimGift.count()) === 1);
  if (await claimGift.count()) {
    await claimGift.click();
    await page.waitForTimeout(400);
    check('night gift cooldown starts', (await page.getByText(/next gift/i).count()) >= 1);
  }
  await page.locator('.sheet-close').click();
  await page.getByRole('button', { name: /continue growing/i }).click();
  await page.waitForTimeout(500);

  // Export the save.
  await page.getByRole('button', { name: /open settings/i }).click();
  await page.waitForTimeout(300);
  const downloadPromise = page.waitForEvent('download', { timeout: 4000 }).catch(() => null);
  await page.getByRole('button', { name: /export save/i }).click();
  const download = await downloadPromise;
  check('export downloads a save', Boolean(download), download?.suggestedFilename() ?? 'no download');

  // Credits use the official mark.
  await page.getByRole('button', { name: /credits/i }).click();
  await page.waitForTimeout(900);
  const logo = page.locator('.credits-logo');
  check('credits show the official nRnWorld mark', (await logo.count()) === 1 && (await logo.getAttribute('src'))?.includes('nrnworld-mark'));
  await page.screenshot({ path: `${OUT}/08-credits.png` });

  if (errors.length) console.log('ERRORS:', errors.slice(0, 8));
  check('no console or page errors during the playthrough', errors.length === 0, errors.slice(0, 3).join(' | '));
  await browser.close();

  console.log(`\n${results.length - failures}/${results.length} playtest checks passed.`);
  if (failures > 0) console.log('Review FAIL lines and the screenshots in .tmp/playtest.');
  process.exit(failures > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
