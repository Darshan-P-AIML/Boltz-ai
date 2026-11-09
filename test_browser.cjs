const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.error('BROWSER PAGE ERROR:', err.message));

    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    const title = await page.title();
    console.log('Page Title:', title);

    const rootHtml = await page.$eval('#root', el => el.innerHTML);
    console.log('Root Element HTML Length:', rootHtml.length);
    console.log('Root Element HTML Preview:', rootHtml.substring(0, 300));

    await browser.close();
  } catch (e) {
    console.error('Playwright Error:', e.message);
  }
})();
