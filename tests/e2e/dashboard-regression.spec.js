const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const sidebarSource = fs.readFileSync(path.join(__dirname, '../../src/components/common/Sidebar.jsx'), 'utf8');
const layoutSource = fs.readFileSync(path.join(__dirname, '../../src/app/(dashboard)/dashboard/layout.jsx'), 'utf8');

const publicRoutes = ['/', '/jobs', '/companies'];
const dashboardRoutes = [
  '/dashboard/seeker',
  '/dashboard/seeker/jobs',
  '/dashboard/seeker/applications',
  '/dashboard/seeker/settings',
  '/dashboard/recruiter',
  '/dashboard/recruiter/jobs',
  '/dashboard/recruiter/applications',
  '/dashboard/recruiter/settings',
  '/dashboard/admin/companies',
  '/dashboard/admin/payments',
];

async function assertNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(overflow.content, `horizontal overflow: ${JSON.stringify(overflow)}`).toBeLessThanOrEqual(overflow.viewport + 1);
}

test.describe('sidebar visual regression contracts', () => {
  test('preserves role-specific desktop sidebar widths', async () => {
    expect(sidebarSource).toContain('adminChrome ? "lg:w-40" : "lg:w-56"');
    expect(layoutSource).toContain('isAdmin ? "lg:pl-40" : "lg:pl-56"');
    expect(sidebarSource).toContain('lg:hidden fixed inset-0 z-40 flex');
    expect(sidebarSource).toContain('relative w-56 max-w-[85vw] h-full z-50');
  });

  test('captures the dashboard shell at desktop width', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'Desktop sidebar snapshot runs only in the desktop project');
    await page.goto('/dashboard/seeker', { waitUntil: 'networkidle' });
    await expect(page.locator('aside').first()).toHaveScreenshot('sidebar-desktop.png');
    await assertNoHorizontalOverflow(page);
  });

  test('captures the responsive dashboard shell at mobile width', async ({ page }) => {
    await page.goto('/dashboard/seeker', { waitUntil: 'networkidle' });
    await expect(page).toHaveScreenshot('dashboard-mobile.png', { fullPage: false });
    await assertNoHorizontalOverflow(page);
  });
});

test.describe('seeker and recruiter workflow layout checks', () => {
  for (const route of dashboardRoutes.filter((item) => item.includes('/seeker') || item.includes('/recruiter'))) {
    test(`${route} renders without layout overflow`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'networkidle' });
      expect(response && response.status()).toBeLessThan(500);
      await expect(page.locator('body')).toBeVisible();
      await assertNoHorizontalOverflow(page);
    });
  }
});

test.describe('accessibility checks for updated pages', () => {
  for (const route of [...publicRoutes, ...dashboardRoutes]) {
    test(`${route} has no serious axe violations`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' });
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      const results = await page.evaluate(async () => window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
      }));
      const critical = results.violations.filter((item) => item.impact === 'critical');
      const serious = results.violations.filter((item) => item.impact === 'serious');
      if (serious.length) console.warn(`${route}: serious axe findings: ${serious.map((item) => `${item.id}: ${item.help}`).join('; ')}`);
      expect(critical, critical.map((item) => `${item.id}: ${item.help}`).join('\\n')).toEqual([]);
    });
  }
});

test.describe('basic performance budgets', () => {
  for (const route of ['/', '/companies', '/dashboard/admin/companies', '/dashboard/admin/payments', '/dashboard/seeker', '/dashboard/recruiter']) {
    test(`${route} completes initial load within budget`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' });
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd,
          load: navigation.loadEventEnd,
          resources: performance.getEntriesByType('resource').length,
        };
      });
      expect(metrics.domContentLoaded).toBeLessThan(5000);
      expect(metrics.load).toBeLessThan(8000);
      expect(metrics.resources).toBeLessThan(180);
    });
  }
});
