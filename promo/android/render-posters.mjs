import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = 'file://' + path.join(__dirname, 'poster.html');

const targets = [
  { id: 'square', file: 'highlight-android-square-1080.png' },
  { id: 'story',  file: 'highlight-android-story-1080x1920.png' },
  { id: 'og',     file: 'highlight-android-og-1200x630.png' },
];

const browser = await chromium.launch({ args: ['--force-color-profile=srgb'] });
const page = await browser.newPage({ deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(300);

for (const t of targets) {
  const el = await page.$('#' + t.id);
  const out = path.join(__dirname, t.file);
  await el.screenshot({ path: out });
  console.log('saved', t.file);
}

await browser.close();
