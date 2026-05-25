#!/usr/bin/env node
/* Export PDF d'un deck Prismia : screenshot de CHAQUE slide (après son animation),
   puis concaténation des images en un seul PDF (1 slide = 1 page, 16:9). Déterministe,
   aucune clé/LLM. Utilise le Chrome du système via puppeteer-core (aucun téléchargement).

   Usage : node tools/export-pdf.mjs <chemin-du-deck.html> [sortie.pdf]
   Sortie par défaut : même dossier/nom que le deck, en .pdf.
   Réglages : CHROME_PATH (sinon Chrome/Chromium/Edge auto-détecté sur macOS/Windows/Linux),
   ANIM_MS (attente d'animation par slide, défaut 2200), TAB_MS (attente par onglet, défaut 800). */

import puppeteer from 'puppeteer-core';
import fs from 'fs';
import os from 'os';
import path from 'path';

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Localise un Chrome/Chromium/Edge système, multi-OS. CHROME_PATH force le binaire.
function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = ({
    darwin: [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
    ],
    win32: [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      (process.env.LOCALAPPDATA || '') + '\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
    ],
    linux: [
      '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium', '/usr/bin/chromium-browser', '/snap/bin/chromium',
      '/usr/bin/microsoft-edge'
    ]
  })[process.platform] || [];
  for (const p of candidates) { try { if (p && fs.existsSync(p)) return p; } catch (e) {} }
  return candidates[0] || '';
}
const CHROME = findChrome();
const ANIM = parseInt(process.env.ANIM_MS || '2200', 10);
const QUALITY = parseInt(process.env.JPEG_QUALITY || '92', 10);   // qualité JPEG des screenshots
const SCALE = parseFloat(process.env.SCALE || '2');               // densité de capture (2 = net)

const deckArg = process.argv[2];
if (!deckArg) { console.error(JSON.stringify({ ok: false, error: 'usage: export-pdf.mjs <deck.html> [out.pdf]' })); process.exit(2); }
const deckAbs = path.resolve(process.cwd(), deckArg);
if (!fs.existsSync(deckAbs)) { console.error(JSON.stringify({ ok: false, error: 'deck introuvable : ' + deckAbs })); process.exit(2); }
const outAbs = path.resolve(process.cwd(), process.argv[3] || deckAbs.replace(/\.html?$/i, '.pdf'));
if (!CHROME || !fs.existsSync(CHROME)) { console.error(JSON.stringify({ ok: false, error: 'Chrome/Chromium introuvable' + (CHROME ? ' (' + CHROME + ')' : '') + ' — installe Google Chrome ou définis CHROME_PATH' })); process.exit(2); }

let browser, tmp;
try {
  browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--force-color-profile=srgb', '--hide-scrollbars'],
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: SCALE }
  });
  const page = await browser.newPage();
  await page.goto('file://' + deckAbs, { waitUntil: 'networkidle2', timeout: 60000 });
  try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch (e) {}

  const N = await page.evaluate(() => document.querySelectorAll('.slide').length);
  if (!N) throw new Error('aucune slide (.slide) trouvée dans le deck');

  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'prismia-pdf-'));
  const shots = [];
  const TAB_MS = parseInt(process.env.TAB_MS || '800', 10);   // attente du fadeUp d'un onglet (.tab-content)
  const snap = async () => {                                  // capture du viewport 1920×1080 (la slide active)
    const f = path.join(tmp, 's' + String(shots.length + 1).padStart(3, '0') + '.jpg');
    await page.screenshot({ path: f, type: 'jpeg', quality: QUALITY });
    shots.push(f);
  };
  await page.keyboard.press('Home').catch(() => {});   // revenir slide 1 (si supporté)
  await sleep(ANIM);                                    // laisser l'animation de la 1re slide finir
  for (let i = 1; i <= N; i++) {
    if (i > 1) { await page.keyboard.press('ArrowRight'); await sleep(ANIM); }  // slide suivante + fin d'anim
    // slide à blocs interactifs (ex. Territoires IA : 3 onglets) → 1 page PDF par onglet
    const tabs = await page.evaluate(() => {
      const s = document.querySelector('.slide.active');
      return s ? s.querySelectorAll('.tab-btn').length : 0;
    });
    if (tabs > 1) {
      for (let t = 0; t < tabs; t++) {
        await page.evaluate(ti => {
          const s = document.querySelector('.slide.active');
          const b = s && s.querySelectorAll('.tab-btn')[ti];
          if (b) b.click();   // affiche le contenu de cet onglet
        }, t);
        await sleep(TAB_MS);
        await snap();
        console.error('  slide ' + i + '/' + N + ' · onglet ' + (t + 1) + '/' + tabs + ' capturé');
      }
    } else {
      await snap();
      console.error('  slide ' + i + '/' + N + ' capturée');
    }
  }

  // concaténation : une page HTML où chaque screenshot occupe une page 16:9, puis impression PDF
  const gallery = '<!doctype html><html><head><meta charset="utf-8"><style>'
    + '@page{size:1920px 1080px;margin:0}*{margin:0;padding:0}html,body{margin:0}'
    + 'img{display:block;width:1920px;height:1080px;page-break-after:always}'
    + 'img:last-child{page-break-after:auto}</style></head><body>'
    + shots.map(f => '<img src="' + path.basename(f) + '">').join('') + '</body></html>';
  fs.writeFileSync(path.join(tmp, 'gallery.html'), gallery);
  await page.goto('file://' + path.join(tmp, 'gallery.html'), { waitUntil: 'networkidle2' });
  await page.pdf({ path: outAbs, width: '1920px', height: '1080px', printBackground: true, pageRanges: '1-' + shots.length, margin: { top: 0, right: 0, bottom: 0, left: 0 } });

  await browser.close();
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
  console.log(JSON.stringify({ ok: true, pdf: outAbs, slides: N, pages: shots.length }));
} catch (e) {
  try { if (browser) await browser.close(); } catch (x) {}
  try { if (tmp) fs.rmSync(tmp, { recursive: true, force: true }); } catch (x) {}
  console.error(JSON.stringify({ ok: false, error: String((e && e.message) || e) }));
  process.exit(1);
}
