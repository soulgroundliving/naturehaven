import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import puppeteer from 'puppeteer';

const root = path.resolve('.');
const dist = path.join(root, 'dist');
const server = http.createServer((req, res) => {
  const pathname = (req.url || '/').split('?')[0];
  // Vercel injects this in production. Keep local smoke focused on the app.
  if (pathname === '/_vercel/insights/script.js') {
    res.writeHead(200, { 'Content-Type': 'text/javascript' });
    return res.end('');
  }
  const safe = pathname === '/' ? '/index.html' : pathname;
  let target = path.join(dist, safe.replace(/^\//, ''));
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) target = path.join(dist, 'index.html');
  if (!fs.existsSync(target)) {
    res.writeHead(404);
    return res.end('not found');
  }
  const ext = path.extname(target);
  const types = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff',
  };
  res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
  if (ext === '.html') res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://the-green-haven.vercel.app https://vitals.vercel-insights.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
  return res.end(fs.readFileSync(target));
});

await new Promise((resolve) => server.listen(4174, '127.0.0.1', resolve));
const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium', headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const results = [];

for (const viewport of [{ name: 'mobile', width: 390, height: 844 }, { name: 'desktop', width: 1440, height: 900 }]) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const errors = [];
  const failed = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text().slice(0, 300)); });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message.slice(0, 300)}`));
  page.on('requestfailed', (request) => failed.push({ url: request.url(), error: request.failure()?.errorText || 'unknown' }));

  await page.goto(`http://127.0.0.1:4174/?tod=day`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => document.querySelector('#root')?.innerText.trim().length > 0, { timeout: 15000 });
  await new Promise((resolve) => setTimeout(resolve, 800));
  const state = await page.evaluate(() => ({
    h1: Boolean(document.querySelector('h1')),
    main: Boolean(document.querySelector('main#main')),
    navLabel: Boolean(document.querySelector('nav[aria-label]')),
    lineCtas: [...document.querySelectorAll('a[href*="line.me"]')].length,
    missingAlt: [...document.images].filter((image) => !image.hasAttribute('alt')).length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    menuA11y: Boolean(document.querySelector('#mobile-menu[role="dialog"][aria-hidden]')),
    decisionSummary: Boolean(document.querySelector('[data-decision-summary]')),
    decisionItems: document.querySelectorAll('[data-decision-summary] [data-decision-item]').length,
    decisionPrice: document.querySelector('[data-decision-summary]')?.innerText.includes('6,900') || false,
    bodyText: document.body.innerText.slice(0, 300),
  }));
  results.push({ viewport: viewport.name, path: '/', state, errors, failed });
  await page.close();
}

const places = await browser.newPage();
await places.setViewport({ width: 390, height: 844 });
const placesErrors = [];
const placesFailed = [];
places.on('console', (message) => { if (message.type() === 'error') placesErrors.push(message.text().slice(0, 300)); });
places.on('pageerror', (error) => placesErrors.push(`pageerror: ${error.message.slice(0, 300)}`));
places.on('requestfailed', (request) => placesFailed.push({ url: request.url(), error: request.failure()?.errorText || 'unknown' }));
await places.goto('http://127.0.0.1:4174/places', { waitUntil: 'domcontentloaded', timeout: 30000 });
await places.waitForFunction(() => document.querySelector('#root')?.innerText.trim().length > 0, { timeout: 15000 });
await places.waitForFunction(() => document.querySelectorAll('article').length > 0 || !document.body.innerText.includes('กำลังโหลดไกด์'), { timeout: 15000 });
await places.click('[aria-controls="places-category-panel"]');
await places.waitForSelector('#places-category-panel [aria-pressed]', { timeout: 5000 });
const placesState = await places.evaluate(() => ({
  h1: Boolean(document.querySelector('h1')),
  cards: document.querySelectorAll('article').length,
  filters: [...document.querySelectorAll('[aria-pressed]')].length,
  filterGroup: Boolean(document.querySelector('[role="group"][aria-label][aria-controls="places-list"]')),
  filterPanelVisible: document.querySelector('#places-category-panel') ? getComputedStyle(document.querySelector('#places-category-panel')).display !== 'none' : false,
  filterTriggerExpanded: document.querySelector('[aria-controls="places-category-panel"]')?.getAttribute('aria-expanded') === 'true',
  filterShellSticky: document.querySelector('.places-filter-shell') ? getComputedStyle(document.querySelector('.places-filter-shell')).position : 'missing',
  firstMapCta: Boolean(document.querySelector('#places-list article a[href*="maps."]')),
  errorOrLoading: document.body.innerText.includes('กำลังโหลดไกด์') || document.body.innerText.includes('Loading the guide'),
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
}));
await places.click('[aria-pressed]:not([aria-pressed="true"])');
await places.waitForFunction(() => [...document.querySelectorAll('[aria-pressed]')].filter((button) => button.getAttribute('aria-pressed') === 'true').length === 1, { timeout: 5000 });
const categoryState = await places.evaluate(() => ({
  categoryFilterActive: [...document.querySelectorAll('[aria-pressed]')].filter((button) => button.getAttribute('aria-pressed') === 'true').length,
  categoryCards: document.querySelectorAll('#places-list article').length,
}));
results.push({ viewport: 'mobile', path: '/places', state: { ...placesState, ...categoryState }, errors: placesErrors, failed: placesFailed });
await places.close();

console.log(JSON.stringify(results, null, 2));
await browser.close();
server.close();
const failedChecks = results.flatMap((result) => [
  ...result.errors.map((error) => `${result.path}@${result.viewport}: ${error}`),
  ...result.failed.map((request) => `${result.path}@${result.viewport}: request failed ${request.url}`),
  ...(result.state.overflow ? [`${result.path}@${result.viewport}: horizontal overflow`] : []),
  ...(result.path === '/' && (!result.state.h1 || !result.state.main || !result.state.navLabel || result.state.lineCtas < 1 || result.state.missingAlt > 0 || !result.state.menuA11y || !result.state.decisionSummary || result.state.decisionItems !== 5 || !result.state.decisionPrice) ? [`${result.path}@${result.viewport}: critical landmark/CTA/alt/menu/decision-summary assertion failed`] : []),
  ...(result.path === '/places' && (!result.state.h1 || result.state.cards < 1 || result.state.filters < 1 || !result.state.filterGroup || result.state.errorOrLoading || !result.state.firstMapCta || result.state.categoryFilterActive !== 1 || result.state.categoryCards < 1 || !result.state.filterPanelVisible || !result.state.filterTriggerExpanded || result.state.filterShellSticky !== 'sticky') ? [`${result.path}@${result.viewport}: places mobile redesign assertion failed`] : []),
]);
if (failedChecks.length) {
  console.error(failedChecks.join('\n'));
  process.exitCode = 1;
}
