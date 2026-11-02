const assert = require('node:assert/strict');

const previewOnly = process.argv.includes('--preview');
if (!previewOnly && process.env.SOLYX_RELEASE_CONFIRMED !== 'app-and-lifetime-live') {
  console.error('NOT DEPLOYED: release verification is blocked. After independently verifying the app and Lifetime are live, set SOLYX_RELEASE_CONFIRMED=app-and-lifetime-live. Use --preview for local checks without release approval.');
  process.exit(2);
}
console.log(previewOnly
  ? 'PREVIEW ONLY: NOT DEPLOYED; release availability is not confirmed.'
  : 'Release confirmation supplied by operator; this command checks the site and does not deploy.');
const { chromium } = require('playwright');

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4186';
(async () => {
  const browser = await chromium.launch({ headless: true });
  let failures = 0;
  async function check(name, fn) {
    try { await fn(); console.log(`PASS ${name}`); }
    catch (error) { failures++; console.error(`FAIL ${name}: ${error.message}`); }
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.setDefaultTimeout(3000);
  const screenshots = [];
  page.on('request', request => {
    if (/assets\/(habits|galaxy-overview|reveal|archive|mission-control)[^/]*\.(png|webp)/.test(request.url())) screenshots.push(request.url());
  });
  await page.goto(base);
  await page.waitForTimeout(1200);
  await check('exact product thesis', async () => assert.equal(await page.locator('.hero-statement').innerText(), 'Your habits build your galaxy.'));
  await check('100+ catalog copy', async () => {
    const text = await page.locator('body').innerText();
    assert.ok(text.includes('100+ planets. 100+ constellations.'));
    assert.ok(!text.includes('108 planets'));
  });
  await check('final Lifetime alternative, USD price, local currency and qualified yearly trial', async () => {
    const text = (await page.locator('.faq-list').textContent()).replace(/\s+/g, ' ');
    assert.match(text, /monthly or yearly subscription/);
    assert.match(text, /Choose a monthly or yearly subscription, or Lifetime access/);
    assert.match(text, /\$79\.99 USD/);
    assert.match(text, /local currency/);
    assert.doesNotMatch(text, /forthcoming|coming soon|not available yet/i);
    assert.match(text.replace(/\s+/g, ' '), /Eligible new subscribers can try the yearly plan free for 7 days/);
    assert.match(text, /Monthly and yearly subscriptions renew automatically until canceled/);
    assert.match(text, /You do not need a subscription with Lifetime/);
  });
  await check('download note is final launch copy', async () => {
    const text = await page.locator('.subscription-note').textContent();
    assert.match(text, /Monthly, yearly, or Lifetime/);
    assert.match(text, /\$79\.99 USD/);
    assert.match(text, /Subscriptions renew automatically until canceled/);
    assert.doesNotMatch(text, /forthcoming|coming|not available yet/i);
  });
  await check('account FAQ includes purchase analytics rather than subscription-only analytics', async () => {
    const text = (await page.locator('.faq-list').textContent()).replace(/\s+/g, ' ');
    assert.match(text, /RevenueCat manages purchase access and limited purchase analytics/);
  });
  await check('distant screenshot textures are deferred', async () => {
    assert.ok(!screenshots.some(url => /reveal|archive|mission-control/.test(url)));
    assert.equal(screenshots.length, new Set(screenshots).size);
  });
  await check('scroll story remains accessible as text', async () => {
    assert.match(await page.locator('[data-scroll-words]').ariaSnapshot(), /That morning walk/);
  });
  for (const route of ['support', 'privacy']) {
    await page.goto(`${base}/${route}/`);
    await check(`${route} has canonical and skip link`, async () => {
      assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), `https://solyxapp.com/${route}/`);
      await page.keyboard.press('Tab');
      assert.equal(await page.locator(':focus').innerText(), 'Skip to content');
    });
    if (route === 'support') await check('support covers Lifetime restoration and nonrenewal', async () => {
      const text = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
      assert.match(text, /Restore Purchases.*subscription or Lifetime purchase/);
      assert.match(text, /\$79\.99 USD/);
      assert.match(text, /does not renew/);
      assert.match(text, /Monthly and yearly subscriptions renew automatically until canceled/);
      assert.match(text, /non-consumable/);
      assert.match(text, /You do not need a subscription with Lifetime/);
      assert.doesNotMatch(text, /forthcoming|not available yet/i);
    });
    if (route === 'privacy') await check('privacy purchase terminology preserves effective date', async () => {
      const text = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
      assert.match(text, /Effective September 29, 2026/);
      assert.match(text, /including subscriptions and Lifetime access/);
      assert.match(text, /retrieve purchase options/);
      assert.doesNotMatch(text, /subscription access/);
      assert.match(text, /limited purchase analytics/);
      assert.match(text, /measure purchase performance/);
      assert.match(text, /paywall views lead to purchases/);
      assert.match(text, /onboarding or subscription renewal/);
    });
  }
  for (const route of ['/', '/support/', '/privacy/', '/confirmed/']) {
    await page.goto(base + route);
    await check(`${route} content and metadata have no subscription-only product claims`, async () => {
      const text = await page.evaluate(() => [
        document.title,
        document.body.textContent,
        ...[...document.querySelectorAll('meta[content]')].map(el => el.content),
        ...[...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.stringify(JSON.parse(el.textContent))),
      ].join(' ').replace(/\s+/g, ' '));
      assert.doesNotMatch(text, /subscription required|Solyx requires a.*subscription|subscription-only|subscription options|subscription access|limited subscription analytics|subscription offer(?:ing)?|paywall views lead to subscriptions/i);
    });
    if (route === '/support/') await check('subscription cancellation and standard Terms remain accurate', async () => {
      assert.match(await page.locator('main').innerText(), /manage or cancel a subscription from your Apple Account subscription settings/);
      assert.equal(await page.getByRole('link', { name: 'Terms of Use' }).getAttribute('href'), 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/');
    });
  }
  const noJS = await browser.newPage({ javaScriptEnabled: false });
  await noJS.goto(base);
  await check('no-JavaScript hero fallback visible', async () => assert.equal(await noJS.locator('.galaxy-art').evaluate(el => getComputedStyle(el).visibility), 'visible'));
  await browser.close();
  if (!failures && previewOnly) console.log('Preview checks passed. NOT DEPLOYED; release gate remains unconfirmed.');
  process.exitCode = failures ? 1 : 0;
})().catch(error => { console.error(error); process.exitCode = 1; });
