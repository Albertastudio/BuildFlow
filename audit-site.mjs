import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

const BASE = process.env.BASE_URL || 'http://localhost:8765';
const OUT = path.join(process.cwd(), 'audit-screenshots');

const pages = [
  { name: 'home', url: '/index.html' },
  { name: 'services', url: '/services.html' },
  { name: 'pricing', url: '/pricing.html' },
  { name: 'about', url: '/about.html' },
  { name: 'contact', url: '/contact.html' },
  { name: 'login', url: '/login.html' },
];

const report = [];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: 'dark',
});

for (const pageDef of pages) {
  const page = await context.newPage();
  const issues = [];
  const consoleErrors = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('requestfailed', (req) => {
    failedRequests.push(`${req.failure()?.errorText || 'failed'}: ${req.url()}`);
  });
  page.on('response', (res) => {
    const u = res.url();
    if (res.status() >= 400 && u.includes('localhost')) {
      failedRequests.push(`${res.status()}: ${u}`);
    }
  });

  const fullUrl = `${BASE}${pageDef.url}`;
  try {
    const res = await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });
    if (!res || !res.ok()) issues.push(`HTTP ${res?.status() ?? 'no response'}`);

    await page.waitForTimeout(800);

    // Full page screenshot
    await page.screenshot({
      path: path.join(OUT, `${pageDef.name}-full.png`),
      fullPage: true,
    });

    // Nav links visible?
    const nav = page.locator('nav');
    if ((await nav.count()) === 0) issues.push('Missing <nav>');

    // Footer
    const footer = page.locator('footer');
    if ((await footer.count()) === 0) issues.push('Missing <footer>');
    else {
      const footerBox = await footer.first().boundingBox();
      if (footerBox && footerBox.width < 200) issues.push('Footer layout too narrow');
    }

    // Broken images on page
    const brokenImgs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('img'))
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.src || img.getAttribute('src') || '(no src)')
    );
    if (brokenImgs.length) issues.push(`Broken images: ${brokenImgs.join(', ')}`);

    // Services: check 5 service photos
    if (pageDef.name === 'services') {
      const svcImgs = page.locator('.svc-vis-frame img');
      const count = await svcImgs.count();
      if (count !== 5) issues.push(`Expected 5 service images, found ${count}`);
      for (let i = 0; i < count; i++) {
        const box = await svcImgs.nth(i).boundingBox();
        if (!box || box.width < 100 || box.height < 100) {
          issues.push(`Service image #${i + 1} too small or hidden`);
        }
      }
      // Scroll each svc-big into view and screenshot
      const cards = page.locator('.svc-big');
      const cardCount = await cards.count();
      for (let i = 0; i < cardCount; i++) {
        await cards.nth(i).scrollIntoViewIfNeeded();
        await page.waitForTimeout(400);
        await cards.nth(i).screenshot({
          path: path.join(OUT, `services-card-${i + 1}.png`),
        });
      }
    }

    // Click through main nav from home
    if (pageDef.name === 'home') {
      const navLinks = ['Services', 'Pricing', 'About Us', 'Contact'];
      for (const label of navLinks) {
        const link = page.locator('.nav-links a', { hasText: label });
        if ((await link.count()) === 0) {
          issues.push(`Nav link missing: ${label}`);
        }
      }
    }
  } catch (e) {
    issues.push(`Load error: ${e.message}`);
  }

  report.push({
    page: pageDef.name,
    url: fullUrl,
    issues,
    consoleErrors: [...new Set(consoleErrors)].slice(0, 8),
    failedRequests: [...new Set(failedRequests)].slice(0, 12),
  });

  await page.close();
}

// Nav flow: start at home, click each nav item
const flowPage = await context.newPage();
const flowIssues = [];
try {
  await flowPage.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  const navHrefs = [
    { text: 'Services', expectPath: 'services.html' },
    { text: 'Pricing', expectPath: 'pricing.html' },
    { text: 'About Us', expectPath: 'about.html' },
    { text: 'Contact', expectPath: 'contact.html' },
    { text: 'Home', expectPath: 'index.html' },
  ];
  for (const item of navHrefs) {
    await flowPage.goto(`${BASE}/index.html`, { waitUntil: 'domcontentloaded' });
    await flowPage.locator('.nav-links a', { hasText: item.text }).click();
    await flowPage.waitForLoadState('networkidle');
    const url = flowPage.url();
    if (!url.includes(item.expectPath)) {
      flowIssues.push(`Nav "${item.text}" → ${url} (expected ${item.expectPath})`);
    }
    await flowPage.screenshot({
      path: path.join(OUT, `nav-flow-${item.text.toLowerCase().replace(/\s+/g, '-')}.png`),
    });
  }
} catch (e) {
  flowIssues.push(`Nav flow: ${e.message}`);
}
await flowPage.close();

await browser.close();

const summary = {
  testedAt: new Date().toISOString(),
  baseUrl: BASE,
  pages: report,
  navFlowIssues: flowIssues,
  allOk: report.every((p) => p.issues.length === 0) && flowIssues.length === 0,
};

await writeFile(path.join(OUT, 'report.json'), JSON.stringify(summary, null, 2));

console.log(JSON.stringify(summary, null, 2));
process.exit(summary.allOk ? 0 : 1);
