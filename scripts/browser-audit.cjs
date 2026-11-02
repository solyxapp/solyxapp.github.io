const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { chromium } = require('playwright');
const sharp = require('sharp');

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4186';
const output = path.resolve(process.env.AUDIT_OUTPUT || path.join(__dirname, '../qa/2026-10-11-release'));
let browser;
(async () => {
  await fs.mkdir(output, { recursive: true });
  browser = await chromium.launch({ headless: true });
  const report = { checks: [], errors: [], screenshots: [] };
  async function check(name, fn) {
    try { await fn(); report.checks.push({ name, pass: true }); }
    catch (error) { report.checks.push({ name, pass: false, error: error.message }); }
  }
  for (const width of [320, 390, 768, 1440, 1920]) {
    console.log(`Checking ${width}px`);
    const page = await browser.newPage({ viewport: { width, height: width > 1000 ? 1000 : 844 }, deviceScaleFactor: 1 });
    page.setDefaultTimeout(30000);
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(base, { waitUntil: 'networkidle' });
    await check(`${width}: animated hero renders nonblank pixels`, async () => {
      await page.waitForSelector('.galaxy-ready');
      const canvas = page.locator('.galaxy-canvas');
      const a = await canvas.screenshot();
      const stats = await sharp(a).stats();
      assert.ok(stats.channels.slice(0, 3).some(channel => channel.stdev > 2));
      await page.waitForTimeout(300);
      assert.ok(!a.equals(await canvas.screenshot()), 'hero pixels should change over time');
    });
    if ([390, 1440].includes(width)) {
      const file = `hero-${width}.png`;
      await page.screenshot({ path: path.join(output, file) });
      report.screenshots.push(file);
    }
    // Scrub the pinned phone tour to each screen's midpoint and confirm it is the one shown.
    for (let index = 0; index < 4; index++) {
      await page.evaluate(i => {
        const cosmos = document.querySelector('.cosmos');
        const travel = cosmos.offsetHeight - innerHeight;
        scrollTo({ top: cosmos.offsetTop + travel * (0.16 + 0.84 * (i + 0.5) / 4), behavior: 'instant' });
      }, index);
      await page.waitForTimeout(400);
      await check(`${width}: phone screen ${index + 1} shown`, async () => {
        const step = page.locator('.sky-step').nth(index);
        assert.equal(await step.getAttribute('data-current'), '');
        assert.ok(await step.locator('img').evaluate(el => el.complete && el.naturalWidth > 0));
      });
      if ([390, 1440].includes(width) && index === 1) {
        const file = `galaxy-chapter-${width}.png`;
        await page.screenshot({ path: path.join(output, file) });
        report.screenshots.push(file);
      }
    }
    await page.locator('.collection').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    await check(`${width}: catalog populated`, async () => assert.ok(await page.locator('.collection-item').count() > 0));
    await page.getByText('How much does Solyx cost?', { exact: true }).click();
    await check(`${width}: FAQ opens with launch price`, async () => {
      assert.match(await page.locator('details[open]').innerText(), /\$79\.99 USD/);
    });
    if ([390, 1440].includes(width)) {
      const pricing = `pricing-${width}.png`;
      await page.locator('.questions').screenshot({ path: path.join(output, pricing) });
      report.screenshots.push(pricing);
      const file = `full-${width}.jpg`;
      await page.screenshot({ path: path.join(output, file), fullPage: true, type: 'jpeg', quality: 80 });
      report.screenshots.push(file);
    }
    for (const route of ['/', '/support/', '/privacy/', '/confirmed/']) {
      if (route !== '/') await page.goto(base + route, { waitUntil: 'networkidle' });
      await check(`${width}: ${route} no horizontal overflow`, async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)));
      await check(`${width}: ${route} one h1 and main`, async () => {
        assert.equal(await page.locator('h1').count(), 1);
        assert.equal(await page.locator('main').count(), 1);
      });
      if (route === '/support/' && [390, 1440].includes(width)) {
        const file = `support-${width}.png`;
        await page.locator('main').screenshot({ path: path.join(output, file) });
        report.screenshots.push(file);
      }
    }
    await page.close();
  }
  const reduced = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
  await reduced.goto(base, { waitUntil: 'networkidle' });
  await check('reduced-motion hero is stable', async () => {
    await reduced.waitForSelector('.galaxy-ready');
    const a = await reduced.locator('.galaxy-canvas').screenshot();
    await reduced.waitForTimeout(400);
    assert.ok(a.equals(await reduced.locator('.galaxy-canvas').screenshot()), 'reduced-motion pixels should stay stable');
  });
  await check('keyboard skip link targets main', async () => {
    await reduced.keyboard.press('Tab');
    assert.equal(await reduced.locator(':focus').innerText(), 'Skip to content');
    await reduced.keyboard.press('Enter');
    assert.ok(reduced.url().endsWith('#main'));
  });
  await reduced.locator('.collection').scrollIntoViewIfNeeded();
  await check('reduced-motion catalog has no automatic animation', async () => assert.equal(await reduced.locator('.collection-track').first().evaluate(el => getComputedStyle(el).animationName), 'none'));
  const fallback = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await fallback.goto(base);
  await check('no-JS image and FAQ work', async () => {
    await fallback.locator('.product-phone').first().scrollIntoViewIfNeeded();
    assert.ok(await fallback.locator('.product-phone img').first().isVisible());
    await fallback.getByText('How much does Solyx cost?', { exact: true }).click();
    assert.match(await fallback.locator('details[open]').innerText(), /Lifetime is a one-time purchase and does not renew/);
  });
  await check('no runtime or HTTP errors', async () => assert.deepEqual(report.errors, []));
  await browser.close();
  await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(report, null, 2));
  const failures = report.checks.filter(check => !check.pass);
  console.log(`${report.checks.length - failures.length}/${report.checks.length} checks passed`);
  console.log(JSON.stringify(failures, null, 2));
  process.exitCode = failures.length ? 1 : 0;
})().catch(async error => { console.error(error); await browser?.close(); process.exitCode = 1; });
