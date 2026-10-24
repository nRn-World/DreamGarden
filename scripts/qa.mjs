/**
 * Browser QA for Dream Garden.
 *
 * Start the production preview first:
 *   bun run build && bun run preview
 * Then:
 *   node scripts/qa.mjs
 *
 * Set CHROME_PATH to override the Chrome executable.
 */
import { chromium } from 'playwright-core';

const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const URL = (process.env.GARDEN_URL ?? 'http://127.0.0.1:4174').replace(/\/+$/, '');
const APP = `${URL}/`;
const results = [];
let failures = 0;

function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
}

async function trackConsole(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function main() {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });

  // ---------------------------------------------------------------- fresh run
  const phone = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    locale: 'en-GB',
    colorScheme: 'dark',
  });
  const page = await phone.newPage();
  const consoleErrors = await trackConsole(page);
  await page.goto(APP, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);

  check('first launch shows the language picker', await page.getByRole('radio', { name: /English/ }).count() === 1);
  check('seven language options are listed', (await page.getByRole('radio').count()) === 7);

  await page.getByRole('button', { name: /Continue/ }).click();
  await page.waitForTimeout(400);
  const introTitle = await page.locator('.intro-copy h1').textContent();
  check('intro copy appears after language choice', Boolean(introTitle && introTitle.length > 3));

  await page.getByRole('button', { name: /^Next/ }).click();
  await page.getByRole('button', { name: /^Next/ }).click();
  await page.getByRole('button', { name: /Enter the garden/i }).click();
  await page.waitForTimeout(700);
  check('title screen appears after onboarding', (await page.locator('.title-screen').count()) === 1);

  await page.getByRole('button', { name: /Enter the garden/i }).click();
  await page.waitForTimeout(900);
  check('garden renders twelve beds', (await page.locator('.plot').count()) === 12);

  // Plant the first seed through the real flow.
  await page.locator('.plot.is-empty').first().click();
  await page.waitForTimeout(500);
  check('seed sheet opens', (await page.locator('.sheet-panel').count()) === 1);
  await page.locator('.seed-card').first().click();
  await page.waitForTimeout(500);
  check('a plant appears in the bed', (await page.locator('.plot.is-planted').count()) >= 1);

  // Settings: toggles and Swedish.
  await page.getByRole('button', { name: /Open settings/i }).click();
  await page.waitForTimeout(500);
  check('settings sheet opens with language options', (await page.locator('.sheet-panel').count()) === 1);
  await page.getByRole('button', { name: /Svenska/ }).click();
  await page.waitForTimeout(500);
  check('Swedish applies immediately', (await page.locator('html').getAttribute('lang')) === 'sv');

  const motion = page.getByRole('switch', { name: /Rörelse|Minskad rörelse/i }).first();
  if (await motion.count()) {
    await motion.click();
    await page.waitForTimeout(200);
    check('reduced motion setting is applied', (await page.locator('html').getAttribute('data-motion')) === 'reduced');
  }

  const large = page.getByRole('switch', { name: /text|Större/i }).first();
  if (await large.count()) {
    await large.click();
    await page.waitForTimeout(200);
    const fontSize = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
    check('large text setting is applied', fontSize === '18px', fontSize);
  }

  let trapped = true;
  for (let i = 0; i < 12; i += 1) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(() => Boolean(document.activeElement?.closest('.sheet-panel')));
    if (!inside) trapped = false;
  }
  check('keyboard focus stays inside the open sheet', trapped);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  check('Escape closes the sheet', (await page.locator('.sheet-panel').count()) === 0);

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  check('language persists across reload', (await page.locator('html').getAttribute('lang')) === 'sv');
  check('no horizontal overflow at 390 px', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  check('no console errors in the fresh flow', consoleErrors.length === 0, consoleErrors.slice(0, 2).join(' | '));
  await phone.close();

  // ------------------------------------------------------------------- Arabic
  const rtlContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    locale: 'ar',
    colorScheme: 'dark',
  });
  const rtl = await rtlContext.newPage();
  const rtlErrors = await trackConsole(rtl);
  await rtl.goto(APP, { waitUntil: 'networkidle' });
  await rtl.waitForTimeout(600);
  await rtl.getByRole('radio', { name: /العربية/ }).click();
  await rtl.locator('.onboarding-foot .btn').click();
  await rtl.waitForTimeout(500);
  check('Arabic sets RTL direction', (await rtl.locator('html').getAttribute('dir')) === 'rtl');
  check('Arabic language tag is set', (await rtl.locator('html').getAttribute('lang')) === 'ar');
  check('Arabic layout has no horizontal overflow', await rtl.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await rtl.screenshot({ path: '.tmp/qa-arabic.png' });
  check('no console errors in Arabic', rtlErrors.length === 0, rtlErrors.slice(0, 2).join(' | '));
  await rtlContext.close();

  // ---------------------------------------------------------------- 320 px
  const narrowContext = await browser.newContext({ viewport: { width: 320, height: 700 }, deviceScaleFactor: 2 });
  const narrow = await narrowContext.newPage();
  await narrow.goto(APP, { waitUntil: 'networkidle' });
  await narrow.waitForTimeout(600);
  check('no horizontal overflow at 320 px', await narrow.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await narrow.screenshot({ path: '.tmp/qa-320.png' });
  await narrowContext.close();

  // ---------------------------------------------------------------- tablet
  const tabletContext = await browser.newContext({ viewport: { width: 1024, height: 1366 }, deviceScaleFactor: 1 });
  const tablet = await tabletContext.newPage();
  await tablet.goto(APP, { waitUntil: 'networkidle' });
  await tablet.waitForTimeout(600);
  check('tablet layout has no horizontal overflow', await tablet.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  const frameWidth = await tablet.evaluate(() => document.querySelector('.app-frame')?.getBoundingClientRect().width ?? 0);
  check('tablet keeps a readable centred frame', frameWidth > 480 && frameWidth <= 540, `${Math.round(frameWidth)}px`);
  await tablet.screenshot({ path: '.tmp/qa-tablet.png' });
  await tabletContext.close();

  // ---------------------------------------------------------------- offline PWA
  const offlineContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const offline = await offlineContext.newPage();
  await offline.goto(APP, { waitUntil: 'networkidle' });
  await offline.waitForTimeout(1500);
  const swReady = await offline.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    const registration = await navigator.serviceWorker.ready;
    return Boolean(registration.active);
  });
  check('service worker is active', swReady);
  await offline.waitForTimeout(1200);
  await offlineContext.setOffline(true);
  await offline.reload({ waitUntil: 'domcontentloaded' }).catch(() => undefined);
  await offline.waitForTimeout(1000);
  const offlineText = await offline.locator('body').innerText().catch(() => '');
  check('game boots offline', offlineText.length > 20 && /Dream Garden|Choose your language|Välj/i.test(offlineText));
  await offlineContext.close();

  await browser.close();
  console.log(`\n${results.length - failures}/${results.length} checks passed.`);
  if (failures > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
