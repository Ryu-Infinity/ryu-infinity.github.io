import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = pw;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = 'file://' + path.join(__dirname, 'reel.html');
const FFMPEG = '/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux';
const OUT = path.join(__dirname, 'highlight-android-reel-1080x1920.webm');

const FPS = 30;
const W = 1080, H = 1920;

const browser = await chromium.launch({ args: ['--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle' });
const DURATION = await page.evaluate(() => window.DURATION);
const total = Math.round(DURATION * FPS);
console.log(`rendering ${total} frames @ ${FPS}fps (${DURATION}s)`);

// This bundled ffmpeg has no PNG decoder, but it does have the mjpeg decoder,
// so we pipe JPEG frames in and encode VP8/webm out.
const ff = spawn(FFMPEG, [
  '-y',
  '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', 'pipe:0',
  '-c:v', 'libvpx', '-b:v', '6M', '-crf', '9', '-pix_fmt', 'yuv420p',
  '-deadline', 'good', '-cpu-used', '2', '-auto-alt-ref', '0', '-an', OUT,
]);
let ffErr = '';
ff.stderr.on('data', d => { ffErr += d.toString(); });
ff.stdin.on('error', e => { if (e.code !== 'EPIPE') console.error('stdin err', e); });
ff.on('close', c => { if (c !== 0) console.error('ffmpeg exit', c, '\n' + ffErr.slice(-2000)); });

const write = buf => new Promise((res) => {
  if (ff.stdin.write(buf)) res();
  else ff.stdin.once('drain', res);
});

for (let f = 0; f < total; f++) {
  const t = f / FPS;
  await page.evaluate(tt => window.seek(tt), t);
  const buf = await page.screenshot({ clip: { x: 0, y: 0, width: W, height: H }, type: 'jpeg', quality: 94 });
  await write(buf);
  if (f % 30 === 0) process.stdout.write(`\r  frame ${f}/${total}`);
}
process.stdout.write(`\r  frame ${total}/${total}\n`);

ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.log('encoded', OUT);
