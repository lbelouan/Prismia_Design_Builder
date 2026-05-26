#!/usr/bin/env node
/* Dashboard local Prismia — mode B (compositeur).
   Modules Node natifs uniquement. AUCUNE clé / API : la génération se fait dans Claude Code
   (session = tes tokens). Ce serveur ne fait que lire/écrire des .md locaux + servir la SPA. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PUB = path.join(__dirname, 'public');
const PROSPECTS = path.join(ROOT, 'knowledge', 'prospects');
const CLIENTS = path.join(ROOT, 'clients');   // 1 dossier par entreprise : brief + deck + pdf + context
const KNOWLEDGE = path.join(ROOT, 'knowledge');
const SCENARIOS = path.join(ROOT, 'scenarios');
const PORT = process.env.PORT || 4317;

const TYPES = { 'r1-decouverte': 'R1 Découverte', 'r1-pilote': 'R1 Pilote', 'r1-carto': 'R1 Carto', 'suivi-libre': 'Suivi libre (R2+)' };
const FREE_TYPES = new Set(['suivi-libre']);   // scénarios à composition libre (pas de socle R1 imposé)

function send(res, code, body, type = 'application/json') {
  res.writeHead(code, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}
function slugify(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' et ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}
function parseFm(txt) {
  const m = txt.match(/^---\n([\s\S]*?)\n---/); const fm = {}; if (!m) return fm;
  m[1].split('\n').forEach(line => {
    const mm = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (mm) fm[mm[1]] = mm[2].trim().replace(/\s+#.*$/, '').replace(/^["']|["']$/g, '');
  });
  return fm;
}
function readBody(req) { return new Promise(r => { const c = []; req.on('data', d => c.push(d)); req.on('end', () => r(Buffer.concat(c))); }); }
function listMd(dir) { try { return fs.readdirSync(dir).filter(f => f.endsWith('.md') && !f.startsWith('_') && f.toLowerCase() !== 'readme.md'); } catch (e) { return []; } }
/* Inventaire des decks : 1 dossier clients/<slug>/ par entreprise (deck .html + .pdf assorti). */
function listDecks() {
  const out = [];
  let slugs = [];
  try { slugs = fs.readdirSync(CLIENTS, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name); } catch (e) { return out; }
  for (const slug of slugs.sort()) {
    let files = [];
    try { files = fs.readdirSync(path.join(CLIENTS, slug)); } catch (e) { continue; }
    for (const f of files.filter(x => x.endsWith('.html')).sort()) {
      const pdf = f.replace(/\.html?$/i, '.pdf');
      out.push({ slug, file: f, url: `clients/${slug}/${f}`, pdf: files.includes(pdf) ? `clients/${slug}/${pdf}` : null });
    }
  }
  return out;
}
/* Sert un fichier sous clients/ (deck .html / pdf), avec garde anti-traversée. dl=1 → téléchargement. */
function serveClientFile(req, res, u) {
  const rel = path.normalize(decodeURIComponent(u.pathname)).replace(/^\/+/, '');
  const abs = path.join(ROOT, rel);
  if (!abs.startsWith(CLIENTS + path.sep) || !fs.existsSync(abs) || !fs.statSync(abs).isFile()) return send(res, 404, 'not found', 'text/plain');
  const ext = path.extname(abs).toLowerCase();
  const type = ext === '.pdf' ? 'application/pdf' : ext === '.html' ? 'text/html; charset=utf-8' : 'application/octet-stream';
  const headers = { 'Content-Type': type, 'Access-Control-Allow-Origin': '*' };
  if (u.searchParams.get('dl') === '1') headers['Content-Disposition'] = `attachment; filename="${path.basename(abs)}"`;
  res.writeHead(200, headers); res.end(fs.readFileSync(abs));
}

/* ---- Pont vers le CLI `claude` : lance l'orchestrateur prismia-deck DANS ta session
   (= tes tokens, AUCUNE clé). Sortie STREAMÉE (stream-json) → on voit l'agent travailler en
   direct (outils, écriture du deck…). `--resume <session_id>` garde le fil (zéro perte d'infos).
   stdin sur /dev/null (stdio 'ignore') sinon le CLI attend des données stdin et échoue. ---- */

/* Lance `claude -p` en streaming NDJSON (stream-json) et pipe la sortie dans la réponse HTTP.
   stdin sur /dev/null (sinon le CLI attend des données et échoue). AUCUNE clé : session = tes tokens. */
function streamClaude(res, prompt, { resume = null, timeoutMs = 600000 } = {}) {
  const args = ['-p', prompt, '--output-format', 'stream-json', '--verbose', '--dangerously-skip-permissions'];
  if (resume) args.push('--resume', resume);
  res.writeHead(200, { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache' });
  const emitErr = msg => { try { res.write(JSON.stringify({ type: 'error', message: msg }) + '\n'); } catch (x) {} };
  let cp;
  try { cp = spawn('claude', args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { emitErr('CLI `claude` introuvable (' + e.message + '). Vérifie que Claude Code est installé et dans le PATH du serveur.'); res.end(); return; }
  let timedOut = false, sawOutput = false;
  const to = setTimeout(() => { timedOut = true; try { cp.kill('SIGKILL'); } catch (e) {} }, timeoutMs);
  let errbuf = '';
  cp.stdout.on('data', d => { sawOutput = true; try { res.write(d); } catch (x) {} });
  cp.stderr.on('data', d => { errbuf += d; });
  cp.on('error', e => { clearTimeout(to); emitErr('Lancement de `claude` impossible : ' + e.message); res.end(); });
  cp.on('close', code => {
    clearTimeout(to);
    const err = errbuf.trim();
    if (timedOut) {
      emitErr(`Délai dépassé (${Math.round(timeoutMs / 1000)} s) : la génération a été interrompue avant la fin. Relance, ou réponds à l'agent pour reprendre.` + (err ? `\nDernière sortie : ${err.slice(-500)}` : ''));
    } else if (code !== 0) {
      let m = `L'agent \`claude\` s'est arrêté en erreur (code ${code}).`;
      if (err) m += `\nDétail : ${err.slice(-700)}`;
      if (!sawOutput) m += `\nAucune sortie produite — causes fréquentes : CLI non authentifié, quota épuisé, ou \`claude\` absent du PATH.`;
      m += `\n(Logs complets dans le terminal où tourne \`node dashboard/server.js\`.)`;
      emitErr(m);
    }
    res.end();
  });
}

/* ---- Export PDF d'un deck (screenshots de chaque slide → PDF) via tools/export-pdf.mjs ---- */
function runExport(relDeck) {
  return new Promise(resolve => {
    let cp;
    try { cp = spawn('node', ['tools/export-pdf.mjs', relDeck], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }); }
    catch (e) { return resolve({ ok: false, error: 'spawn node : ' + e.message }); }
    let out = '', err = '';
    const to = setTimeout(() => { try { cp.kill('SIGKILL'); } catch (e) {} resolve({ ok: false, error: 'délai dépassé (export trop long)' }); }, 240000);
    cp.stdout.on('data', d => out += d);
    cp.stderr.on('data', d => err += d);
    cp.on('error', e => { clearTimeout(to); resolve({ ok: false, error: 'node introuvable : ' + e.message }); });
    cp.on('close', () => {
      clearTimeout(to);
      try { resolve(JSON.parse(out.trim().split('\n').pop())); }
      catch (e) { resolve({ ok: false, error: (err || out).trim().slice(-300) || 'sortie illisible' }); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://localhost'); const p = u.pathname;
  try {
    if (p === '/api/opportunities' && req.method === 'GET') {
      const items = listMd(PROSPECTS).map(f => {
        const fm = parseFm(fs.readFileSync(path.join(PROSPECTS, f), 'utf8'));
        return { file: f, company: fm.company || f.replace('.md', ''), slug: fm.slug || f.replace('.md', ''), sector: fm.sector || '', stage: fm.stage || 'Prospection', status: fm.status || 'prospect' };
      });
      return send(res, 200, items);
    }
    if (p === '/api/decks' && req.method === 'GET') return send(res, 200, listDecks());
    if (p === '/api/types' && req.method === 'GET') return send(res, 200, TYPES);
    if (p === '/api/agent' && req.method === 'POST') {
      const b = JSON.parse((await readBody(req)).toString() || '{}');
      let prompt, resume = b.session_id || null;
      if (b.action === 'launch') {
        const bp = (b.brief_path || '').replace(/[^a-zA-Z0-9_\-./]/g, '');
        if (!bp) return send(res, 400, { error: 'brief_path requis' });
        const type = TYPES[b.type] ? b.type : '';
        const scen = type ? `scenarios/${type}.md` : 'scenarios/<type du brief>.md';
        const deckPath = bp.replace(/\.md$/, '.html');   // même dossier/base que le brief : clients/<slug>/<slug>-<type>.html
        const interlocLine = `INTERLOCUTEUR : le brief contient une section « Interlocuteur (visio) » (nom + poste de la personne rencontrée). Reporte-le sur la cover « Préparé pour » (ex. « <Nom>, <poste>, <Société> ») pour éviter toute confusion. S'il est marqué non renseigné, DEMANDE-le dans la gate avant de générer.\n`;
        const dateLine = `DATE DU RDV : elle doit figurer sur la cover. Si le brief ne la précise pas (champ \`rdv_date\`) et qu'elle n'est pas mentionnée dans le contexte, DEMANDE-la systématiquement dans la gate avant de générer.\n`;
        const noDashLine = `TYPOGRAPHIE (impératif) : AUCUN tiret long dans le texte des slides — ni cadratin \`—\` ni demi-cadratin \`–\` (ça « fait IA »). Utilise une virgule, un deux-points, une parenthèse ou deux phrases. Le trait d'union \`-\` des mots composés reste OK. Le template de référence en contient : SUPPRIME-les en réécrivant (y compris la méta cover).\n`;
        if (FREE_TYPES.has(type)) {
          prompt = `Projet Prismia — génération d'un deck de RENDEZ-VOUS DE SUIVI (R2 / R3 / +), scénario à composition LIBRE. Active l'orchestrateur prismia-deck pour le brief \`${bp}\`.\n`
            + `Lis IMPÉRATIVEMENT : (a) le scénario \`scenarios/suivi-libre.md\` — tu ADAPTES le NOMBRE de slides ET leur contenu au contexte, sans trame imposée ; (b) \`scenarios/_socle.md\` UNIQUEMENT pour le CONTRAT DE DESIGN (boule 3D CSS + violet/aubergine + verre, template figé, 4 compteurs Prismia fixes SI tu inclus une slide Prismia) ; (c) la knowledge \`knowledge/*.md\` à piocher au besoin.\n`
            + `CONTEXTE PRIORITAIRE : ce RDV de suivi s'appuie sur beaucoup de contexte accumulé. Lis TOUT le brief, la fiche prospect \`knowledge/prospects/<slug>.md\` et les fichiers de \`clients/<slug>/context/\`. La narration et le nombre de slides DOIVENT découler de ce contexte — pas d'un gabarit.\n`
            + `DESIGN VERROUILLÉ : clone \`templates/r1-premier-rdv.html\`, ne touche JAMAIS au \`<style>\`/\`<script>\`/à la boule/à la nav ; compose uniquement \`<div class="slides">\` en RÉUTILISANT les composants existants (cover, eyebrow/title, two-col, checklist, barres .maturity[data-width], diag-card, tabs/territoires, cases-grid, diff-chip, cta-card, timeline, pillar, stat/counter, q-grid). N'invente AUCUNE nouvelle CSS, aucun style en dur.\n`
            + `GARDE-FOU PREUVES : en slide « cas », UNIQUEMENT des CLIENTS SIGNÉS (knowledge/case-studies.md) — jamais un prospect.\n`
            + `NUMÉRO DU RDV : le brief précise \`rdv_no\` (ex. R2, R3) — cadre la narration en conséquence (rappel de l'étape précédente, ce qui a avancé depuis).\n`
            + interlocLine + dateLine + noDashLine
            + `1) GATE (suivi) : assure-toi d'avoir (a) où on en est (RDV précédents / ce qui a avancé), (b) l'OBJECTIF de ce RDV, (c) le matériau à présenter. Si l'objectif OU le matériau manque, pose UNE seule salve de questions ciblées et ARRÊTE-toi (ne génère pas encore).\n`
            + `2) Sinon, compose librement le deck (clone-and-compose) à l'emplacement EXACT \`${deckPath}\`, puis confirme ce chemin.\n`
            + `Réponds en français, concis ; pas de longs tableaux.`;
        } else {
          prompt = `Projet Prismia — génération d'un deck de PREMIER RENDEZ-VOUS${type ? ' (scénario : ' + type + ')' : ''}. Active l'orchestrateur prismia-deck pour le brief \`${bp}\`.\n`
            + `Suis IMPÉRATIVEMENT : (a) la STRUCTURE du scénario dans \`${scen}\` ; (b) le socle commun \`scenarios/_socle.md\` (DA = boule 3D CSS + violet/aubergine, template figé, 4 compteurs Prismia fixes) ; (c) la knowledge \`knowledge/*.md\`.\n`
            + `Le brief peut contenir une section « Contexte entreprise (recherche — SECONDAIRE) » : utilise-la seulement en complément, sans qu'elle prenne JAMAIS le pas sur le transcript et le contexte additionnel de Timeo.\n`
            + interlocLine + dateLine + noDashLine
            + `1) Applique d'abord la GATE de complétude (selon le scénario). S'il manque des infos minimales, pose UNE seule salve de questions ciblées et ARRÊTE-toi (ne génère pas encore).\n`
            + `2) Sinon, génère le deck (clone-and-compose depuis templates/r1-premier-rdv.html, en suivant la structure du scénario) à l'emplacement EXACT \`${deckPath}\` (même dossier que le brief), puis confirme ce chemin.\n`
            + `Réponds en français, concis ; pas de longs tableaux.`;
        }
        resume = null;
      } else if (b.action === 'reply') {
        if (!resume) return send(res, 400, { error: 'session_id requis' });
        prompt = String(b.message || '').trim();
        if (!prompt) return send(res, 400, { error: 'message requis' });
      } else { return send(res, 400, { error: 'action invalide' }); }
      streamClaude(res, prompt, { resume });
      return;
    }
    if (p === '/api/enrich' && req.method === 'POST') {
      const b = JSON.parse((await readBody(req)).toString() || '{}');
      const company = (b.company || '').trim();
      const slug = slugify(b.slug || company);
      if (!company || !slug) return send(res, 400, { error: 'company requis' });
      const website = String(b.website || '').trim().replace(/[`\n\r]/g, '').slice(0, 200);
      const transcript = String(b.transcript || '').trim();
      const ctxExtra = String(b.context_extra || '').trim();
      const prim = (transcript + ' ' + ctxExtra).trim().length;
      const cap = prim > 600 ? Math.min(prim, 2200) : 1200;   // ≤ matériau de Timeo s'il est substantiel ; sinon plancher utile, toujours borné
      fs.mkdirSync(path.join(CLIENTS, slug), { recursive: true });
      const outFile = `clients/${slug}/contexte-entreprise.md`;
      const primaryBlock = (transcript || ctxExtra)
        ? `\nMatériau PRIMAIRE de Timeo (NE PAS dupliquer — c'est la source prioritaire) :\n«««\n${[transcript && 'TRANSCRIPT :\n' + transcript, ctxExtra && 'CONTEXTE ADDITIONNEL :\n' + ctxExtra].filter(Boolean).join('\n\n')}\n»»»\n`
        : `\n(Aucun transcript / contexte additionnel fourni pour l'instant — reste tout de même bref.)\n`;
      const prompt = `Projet Prismia — AGENT DE VÉRIFICATION & ENRICHISSEMENT DU CONTEXTE pour « ${company} »${website ? ` (site officiel : ${website})` : ''}.\n`
        + `Objectif : vérifier l'entreprise et réunir un contexte UTILE pour préparer un premier rendez-vous commercial. Appuie-toi sur tes connaissances ET sur une recherche web (outil WebSearch${website ? `, en partant de ${website}` : ''}).\n`
        + `RÈGLES DE PRIORISATION (impératives) :\n`
        + `- Le matériau de Timeo (transcript + contexte additionnel) est la source PRIMAIRE et prioritaire. Toi tu es SECONDAIRE : tu complètes / vérifies, tu ne réécris pas et tu ne contredis pas.\n`
        + `- VOLUME BORNÉ : ton résultat doit rester PLUS COURT que ce matériau et ne JAMAIS dépasser ~${cap} caractères (~${Math.round(cap / 6)} mots). Puces courtes, zéro remplissage.\n`
        + `- N'invente rien. Distingue [vérifié] de [à confirmer]. Si une info de Timeo semble contredite, signale-le en UNE ligne, sans trancher à sa place.\n`
        + primaryBlock
        + `STRUCTURE (puces courtes, dans cet ordre ; omets une rubrique si rien de fiable) :\n`
        + `1. Activité & secteur · 2. Taille / effectif / implantations · 3. Actualités & enjeux récents (≤3) · 4. Maturité IA / tech (si trouvable) · 5. À vérifier au RDV (≤3).\n`
        + `LIVRABLE : écris UNIQUEMENT le fichier \`${outFile}\` (Markdown : le contenu ci-dessus, sans préambule ni méta). NE génère AUCUN deck. Réponds en français, très concis.`;
      streamClaude(res, prompt, { timeoutMs: 300000 });
      return;
    }
    if (p === '/api/company-context') {
      if (req.method === 'GET') {
        const slug = slugify(u.searchParams.get('slug') || '');
        if (!slug) return send(res, 400, { error: 'slug requis' });
        const fp = path.join(CLIENTS, slug, 'contexte-entreprise.md');
        return send(res, 200, { slug, content: fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : '' });
      }
      if (req.method === 'POST') {
        const b = JSON.parse((await readBody(req)).toString() || '{}');
        const slug = slugify(b.slug || ''); if (!slug) return send(res, 400, { error: 'slug requis' });
        fs.mkdirSync(path.join(CLIENTS, slug), { recursive: true });
        fs.writeFileSync(path.join(CLIENTS, slug, 'contexte-entreprise.md'), String(b.content || ''));
        return send(res, 200, { ok: true });
      }
    }
    if (p === '/api/opportunity' && req.method === 'POST') {
      const b = JSON.parse((await readBody(req)).toString() || '{}');
      const company = (b.company || '').trim(); if (!company) return send(res, 400, { error: 'company requis' });
      const slug = (b.slug && b.slug.trim()) || slugify(company);
      const file = path.join(PROSPECTS, slug + '.md');
      if (fs.existsSync(file)) return send(res, 200, { slug, existed: true });
      const today = new Date().toISOString().slice(0, 10);
      let tpl = fs.readFileSync(path.join(PROSPECTS, '_TEMPLATE.md'), 'utf8')
        .replace('"<Nom de l\'entreprise>"', JSON.stringify(company))
        .replace('"<slug-kebab>"', JSON.stringify(slug))
        .replace('"<secteur>"', JSON.stringify(b.sector || ''))
        .replace(/"<YYYY-MM-DD>"/g, JSON.stringify(today))
        .replace('# <Nom> — fiche prospect', '# ' + company + ' — fiche prospect');
      fs.writeFileSync(file, tpl);
      return send(res, 200, { slug, created: true });
    }
    if (p === '/api/upload' && req.method === 'POST') {
      const slug = slugify(u.searchParams.get('slug') || 'divers') || 'divers'; const name = path.basename(u.searchParams.get('name') || 'fichier');
      const dir = path.join(CLIENTS, slug, 'context'); fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, name), await readBody(req));
      return send(res, 200, { path: `clients/${slug}/context/${name}` });
    }
    if (p === '/api/brief' && req.method === 'POST') {
      const b = JSON.parse((await readBody(req)).toString() || '{}');
      const type = b.type, slug = b.slug, company = b.company || slug;
      if (!TYPES[type] || !slug) return send(res, 400, { error: 'type/slug invalides' });
      const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const website = String(b.website || '').trim();
      const contactName = String(b.contact_name || '').trim();
      const contactRole = String(b.contact_role || '').trim();
      const rdvDate = String(b.rdv_date || '').trim();
      // Suivi (R2+) : suffixe de fichier `-r<N>` pour ne pas écraser un RDV précédent.
      let variant = '';
      if (FREE_TYPES.has(type) && String(b.rdv_no || '').trim()) {
        const s = slugify(b.rdv_no); variant = /^\d+$/.test(s) ? 'r' + s : s;
      }
      const base = variant ? `${slug}-${type}-${variant}` : `${slug}-${type}`;
      const rdvLabel = /^r\d+$/.test(variant) ? variant.toUpperCase() : variant;
      const ctx = (b.context_files || []).map(f => `  - ${JSON.stringify(f)}`).join('\n') || '  - ';
      const conv = Array.isArray(b.conversation) ? b.conversation : [];
      const convMd = conv.map(m => `**${m.role === 'assistant' ? 'Assistant' : 'Timeo'}** : ${(m.text || '').trim()}`).join('\n\n');
      const transcript = (b.transcript && b.transcript.trim()) || conv.filter(m => m.role !== 'assistant').map(m => (m.text || '').trim()).filter(Boolean).join('\n');
      const companyCtx = String(b.context_company || '').trim();
      const dir = path.join(CLIENTS, slug); fs.mkdirSync(dir, { recursive: true });
      if (companyCtx) fs.writeFileSync(path.join(dir, 'contexte-entreprise.md'), companyCtx + '\n');   // garde l'artefact du dossier en phase avec l'édition
      const ctxSection = companyCtx
        ? `\n## Contexte entreprise (recherche — SECONDAIRE)\n> Complément vérifié. PRIORITÉ absolue au transcript et au contexte additionnel ci-dessus ; ceci ne sert qu'à compléter, sans jamais dominer.\n\n${companyCtx}\n`
        : '';
      const contactLine = (contactName || contactRole)
        ? `- ${[contactName, contactRole].filter(Boolean).join(', ')} — interlocuteur rencontré en visio (à utiliser tel quel sur la cover « Préparé pour »)\n`
        : '- (interlocuteur non renseigné — à demander dans la gate)\n';
      const interlocSection = `\n## Interlocuteur (visio)\n${contactLine}`;
      const md = `---\ntype: ${JSON.stringify(type)}\nclient: ${JSON.stringify(company)}\nslug: ${JSON.stringify(slug)}\n${website ? `website: ${JSON.stringify(website)}\n` : ''}${contactName ? `contact_name: ${JSON.stringify(contactName)}\n` : ''}${contactRole ? `contact_role: ${JSON.stringify(contactRole)}\n` : ''}${rdvLabel ? `rdv_no: ${JSON.stringify(rdvLabel)}\n` : ''}${rdvDate ? `rdv_date: ${JSON.stringify(rdvDate)}\n` : ''}created: ${JSON.stringify(now)}\nstatus: "à générer"\ncontext_files:\n${ctx}\n---\n${interlocSection}\n## Transcript du cold-call\n${transcript}\n\n## Contexte additionnel (jugé pertinent par Timeo)\n${b.context_extra || ''}\n${convMd ? `\n## Conversation de cadrage (dashboard)\n${convMd}\n` : ''}${ctxSection}`;
      fs.writeFileSync(path.join(dir, `${base}.md`), md);
      return send(res, 200, { path: `clients/${slug}/${base}.md`, dir: `clients/${slug}`, deck: `clients/${slug}/${base}.html`, type_label: TYPES[type] + (rdvLabel ? ` · ${rdvLabel}` : '') });
    }
    if (p === '/api/knowledge' && req.method === 'GET') {
      return send(res, 200, listMd(KNOWLEDGE).map(f => ({ file: f, title: f.replace('.md', '') })));
    }
    if (p.startsWith('/api/knowledge/')) {
      const name = path.basename(decodeURIComponent(p.slice('/api/knowledge/'.length)));
      if (!name.endsWith('.md') || !listMd(KNOWLEDGE).includes(name)) return send(res, 400, { error: 'fichier invalide' });
      const fp = path.join(KNOWLEDGE, name);
      if (req.method === 'GET') return send(res, 200, { file: name, content: fs.readFileSync(fp, 'utf8') });
      if (req.method === 'POST') { fs.writeFileSync(fp, (await readBody(req)).toString()); return send(res, 200, { ok: true, file: name }); }
    }
    if (p === '/api/scenarios' && req.method === 'GET') {
      let files = []; try { files = fs.readdirSync(SCENARIOS).filter(f => f.endsWith('.md')); } catch (e) {}
      files.sort((a, b) => (a === '_socle.md' ? -1 : b === '_socle.md' ? 1 : a.localeCompare(b)));
      return send(res, 200, files.map(f => ({ file: f, title: f === '_socle.md' ? 'Socle (commun)' : f.replace('.md', '') })));
    }
    if (p.startsWith('/api/scenarios/')) {
      const name = path.basename(decodeURIComponent(p.slice('/api/scenarios/'.length)));
      let files = []; try { files = fs.readdirSync(SCENARIOS).filter(f => f.endsWith('.md')); } catch (e) {}
      if (!name.endsWith('.md') || !files.includes(name)) return send(res, 400, { error: 'fichier invalide' });
      const fp = path.join(SCENARIOS, name);
      if (req.method === 'GET') return send(res, 200, { file: name, content: fs.readFileSync(fp, 'utf8') });
      if (req.method === 'POST') { fs.writeFileSync(fp, (await readBody(req)).toString()); return send(res, 200, { ok: true, file: name }); }
    }
    if (p === '/api/export-pdf' && req.method === 'POST') {
      const b = JSON.parse((await readBody(req)).toString() || '{}');
      const rel = path.normalize(String(b.deck || '')).replace(/^\/+/, '');   // clients/<slug>/<deck>.html
      const abs = path.join(ROOT, rel);
      if (!rel.endsWith('.html') || !abs.startsWith(CLIENTS + path.sep) || !fs.existsSync(abs)) return send(res, 400, { error: 'deck invalide' });
      const r = await runExport(rel);   // export-pdf.mjs écrit le .pdf À CÔTÉ du deck (même dossier client)
      if (r && r.ok) return send(res, 200, { pdf: rel.replace(/\.html?$/i, '.pdf'), slides: r.slides, pages: r.pages });
      return send(res, 200, { error: (r && r.error) || 'échec de l\'export' });
    }
    if (p.startsWith('/clients/')) return serveClientFile(req, res, u);
    // SPA statique
    const file = p === '/' ? 'index.html' : path.basename(p);
    const fp = path.join(PUB, file);
    if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
      const ext = path.extname(fp);
      const t = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' }[ext] || 'text/plain';
      return send(res, 200, fs.readFileSync(fp), t);
    }
    send(res, 404, 'not found', 'text/plain');
  } catch (e) { send(res, 500, { error: String((e && e.message) || e) }); }
});
server.listen(PORT, () => console.log(`\n  Prismia dashboard → http://localhost:${PORT}\n  (mode B local — génération dans Claude Code, aucune clé API)\n`));
