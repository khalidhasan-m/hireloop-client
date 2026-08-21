const { chromium, devices } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ ...devices['Pixel 5'] });
  for (const route of ['/dashboard/seeker/applications', '/dashboard/recruiter/applications']) {
    await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: 'networkidle' });
    const items = await page.evaluate(() => [...document.querySelectorAll('*')]
      .map((el) => ({ tag: el.tagName, cls: el.className, width: el.getBoundingClientRect().width, right: el.getBoundingClientRect().right, text: (el.textContent || '').trim().slice(0, 80) }))
      .filter((item) => Number.isFinite(item.width) && item.right > document.documentElement.clientWidth + 1)
      .sort((a, b) => b.right - a.right)
      .slice(0, 10));
    console.log(JSON.stringify({ route, viewport: await page.evaluate(() => document.documentElement.clientWidth), scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth), items }, null, 2));
  }
  await browser.close();
})();
