import { chromium } from 'playwright';

const SHOTS = 'C:/Users/gehen/AppData/Local/Temp/claude/c--Users-gehen-Desktop-Jhavonei-portfolio/a78a8228-3e9a-434e-808d-e2c61426c56a/scratchpad';
const errors = [];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()} — ${r.failure()?.errorText}`));

// 1. Hero — full rite (fresh storage), then screenshot
await page.goto('https://jhavonei.me/', { waitUntil: 'networkidle' });
await page.waitForTimeout(6000); // rite completes ~4s
await page.screenshot({ path: `${SHOTS}/live-hero.png` });
const callouts = await page.locator('a.callout').count();
console.log(`callouts visible: ${callouts}`);
const canvasCount = await page.locator('canvas').count();
console.log(`webgl canvas present: ${canvasCount}`);

// 2. Click Fig.01 — Work (navigation transition)
await page.locator('a.callout', { hasText: 'Work' }).click();
await page.waitForURL('**/work', { timeout: 10000 });
await page.waitForTimeout(2200);
await page.screenshot({ path: `${SHOTS}/live-work.png` });
console.log(`work title: ${await page.locator('h1').innerText()}`);

// 3. Open a ledger row
await page.locator('button.lrow').nth(1).click();
await page.waitForTimeout(600);
console.log(`hash after row open: ${new URL(page.url()).hash}`);

// 4. Repository — live GitHub feeds
await page.goto('https://jhavonei.me/repository', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
await page.screenshot({ path: `${SHOTS}/live-repository.png` });
const severed = await page.locator('.severed').count();
console.log(`severed feeds: ${severed}`);

// 5. Author + WHITE mode via footer Fig.00
await page.goto('https://jhavonei.me/author', { waitUntil: 'networkidle' });
await page.locator('footer button', { hasText: 'Fig.00' }).click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${SHOTS}/live-author-white.png` });

console.log('---');
console.log(errors.length ? `ERRORS (${errors.length}):\n${errors.join('\n')}` : 'NO BROWSER ERRORS');
await browser.close();
