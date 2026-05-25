const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const api = (u, opt) => fetch(u, opt).then(r => r.json());
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const slugify = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' et ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const TYPE_DESC = {
  'r1-decouverte': 'Contact large — contexte, diagnostic, valeur.',
  'r1-pilote': 'Cadrage d\'un pilote — périmètre, quick wins, ROI, planning.',
  'r1-carto': 'Audit / cartographie — diagnostic processus, roadmap.'
};
let TYPES = {}, OPPS = [], DECKS = [], KFILES = [], selType = null, ctxFiles = [], kCurrent = null, kRaw = '', CHAT = [], AGENT_SID = null, AGENT_BUSY = false, SFILES = [], sCurrent = null, AGENT_DECK = null, AGENT_SLUG = null, CHAT_FILES = [];

function toast(m) { const t = $('#toast'); t.innerHTML = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 5800); }

/* ---------- rendu markdown (léger, sans dépendance) ---------- */
function mdToHtml(md) {
  const E = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inl = s => E(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  const L = md.replace(/\r/g, '').split('\n'); let h = '', i = 0;
  while (i < L.length) {
    let l = L[i];
    if (/^```/.test(l)) { const b = []; i++; while (i < L.length && !/^```/.test(L[i])) { b.push(L[i]); i++; } i++; h += '<pre><code>' + E(b.join('\n')) + '</code></pre>'; continue; }
    if (/^---+\s*$/.test(l)) { h += '<hr>'; i++; continue; }
    const hd = l.match(/^(#{1,6})\s+(.*)$/); if (hd) { const n = hd[1].length; h += `<h${n}>${inl(hd[2])}</h${n}>`; i++; continue; }
    if (/^\s*\|/.test(l) && i + 1 < L.length && /^\s*\|?[\s:|-]+\|/.test(L[i + 1]) && L[i + 1].includes('-')) {
      const rows = []; while (i < L.length && /\|/.test(L[i])) { rows.push(L[i]); i++; }
      const cl = r => r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim());
      const hh = cl(rows[0]), bb = rows.slice(2).map(cl);
      h += '<table><thead><tr>' + hh.map(c => `<th>${inl(c)}</th>`).join('') + '</tr></thead><tbody>' + bb.map(r => '<tr>' + r.map(c => `<td>${inl(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table>'; continue;
    }
    if (/^>\s?/.test(l)) { const b = []; while (i < L.length && /^>\s?/.test(L[i])) { b.push(L[i].replace(/^>\s?/, '')); i++; } h += '<blockquote>' + inl(b.join(' ')) + '</blockquote>'; continue; }
    if (/^\s*([-*]|\d+\.)\s+/.test(l)) { const ol = /^\s*\d+\./.test(l); const b = []; while (i < L.length && /^\s*([-*]|\d+\.)\s+/.test(L[i])) { b.push(L[i].replace(/^\s*([-*]|\d+\.)\s+/, '')); i++; } h += (ol ? '<ol>' : '<ul>') + b.map(x => `<li>${inl(x)}</li>`).join('') + (ol ? '</ol>' : '</ul>'); continue; }
    if (/^\s*$/.test(l)) { i++; continue; }
    const b = []; while (i < L.length && !/^\s*$/.test(L[i]) && !/^(#{1,6}\s|>|\s*[-*]\s|\s*\d+\.\s|```|---+\s*$|\s*\|)/.test(L[i])) { b.push(L[i]); i++; } h += '<p>' + inl(b.join(' ')) + '</p>';
  }
  return h;
}

/* ---------- pop-up de validation ---------- */
function confirmDialog(title, msg) {
  return new Promise(res => {
    $('#confirmTitle').textContent = title; $('#confirmMsg').textContent = msg;
    $('#confirmModal').classList.add('show');
    const ok = $('#confirmOk'), ca = $('#confirmCancel');
    const done = v => { $('#confirmModal').classList.remove('show'); ok.onclick = ca.onclick = null; res(v); };
    ok.onclick = () => done(true); ca.onclick = () => done(false);
  });
}

async function load() {
  TYPES = await api('/api/types'); OPPS = await api('/api/opportunities');
  DECKS = await api('/api/decks'); KFILES = await api('/api/knowledge'); SFILES = await api('/api/scenarios');
  renderTypes(); renderCompanies(); renderGallery(); renderKFiles(); renderSFiles(); renderChat();
}
function switchTab(name) { $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name)); $$('[data-view]').forEach(v => v.classList.toggle('hidden', v.dataset.view !== name)); }
$$('.tab').forEach(t => t.onclick = () => switchTab(t.dataset.tab));

/* ---------- création ---------- */
function renderTypes() {
  $('#types').innerHTML = Object.keys(TYPES).map(k => `<div class="type" data-type="${k}"><div class="t">${esc(TYPES[k])}</div><div class="d">${esc(TYPE_DESC[k] || '')}</div></div>`).join('');
  $$('#types .type').forEach(el => el.onclick = () => { selType = el.dataset.type; $$('#types .type').forEach(t => t.classList.toggle('active', t.dataset.type === selType)); });
}
function renderCompanies() { $('#companies').innerHTML = OPPS.map(o => `<option value="${esc(o.company)}">`).join(''); }
function renderFiles() { $('#filelist').innerHTML = ctxFiles.map(f => `<div class="file">📎 ${esc(f)}</div>`).join(''); }
async function uploadFiles(e) {
  const company = $('#company').value.trim(); if (!company) { e.target.value = ''; return toast('Renseigne d\'abord la <b>société</b>.'); }
  const slug = slugify(company);
  for (const f of e.target.files) { const r = await api(`/api/upload?slug=${encodeURIComponent(slug)}&name=${encodeURIComponent(f.name)}`, { method: 'POST', body: f }); if (r.path) ctxFiles.push(r.path); }
  renderFiles(); toast('Fichier(s) ajouté(s).');
}
/* ---------- agent prismia-deck : interface chat STREAMÉE vers ta session Claude (CLI, AUCUNE clé) ---------- */
function renderChat() {
  const el = $('#chat'); if (!el) return;
  if (!CHAT.length) { el.innerHTML = '<div class="chat-empty">L\'agent démarre…</div>'; return; }
  el.innerHTML = CHAT.map(m => {
    if (m.role === 'user') return `<div class="msg user">${mdToHtml(m.text)}</div>`;
    const body = m.text ? mdToHtml(m.text) : (m.activity ? '' : '<span class="dots">● ● ●</span>');
    const act = m.activity ? `<div class="act">${esc(m.activity)}</div>` : '';
    return `<div class="msg bot">${body}${act}</div>`;
  }).join('');
  el.scrollTop = el.scrollHeight;
}
function setBusy(on) { AGENT_BUSY = on; const s = $('#chat-send'), c = $('#compose'); if (s) s.disabled = on; if (c) c.disabled = on; }
function toolLabel(blk) {
  const n = blk.name || 'outil', i = blk.input || {};
  const arg = i.file_path || i.path || i.pattern || i.query || (i.command ? String(i.command).slice(0, 48) : '') || '';
  const map = { Read: '📄 lecture', Write: '📝 écriture', Edit: '✏️ édition', MultiEdit: '✏️ édition', Bash: '⌨︎ commande', WebSearch: '🔎 recherche web', WebFetch: '🌐 fetch', Glob: '🔍 fichiers', Grep: '🔍 recherche', Task: '🤖 sous-agent', TodoWrite: '☑︎ plan', Skill: '🧩 skill' };
  return (map[n] || ('→ ' + n)) + (arg ? ' · ' + String(arg).replace(/^.*\//, '') : '');
}
async function streamAgent(payload, live) {
  const resp = await fetch('/api/agent', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
  const reader = resp.body.getReader(); const dec = new TextDecoder(); let buf = '';
  const grab = s => { const m = String(s || '').match(/clients\/[\w.\-]+\/[\w.\-]+\.html/); if (m) AGENT_DECK = m[0]; };
  const handle = ev => {
    if (ev.session_id) AGENT_SID = ev.session_id;
    if (ev.type === 'assistant' && ev.message && Array.isArray(ev.message.content)) {
      for (const blk of ev.message.content) {
        if (blk.type === 'text' && blk.text) { live.text += (live.text ? '\n\n' : '') + blk.text; live.activity = ''; grab(blk.text); }
        else if (blk.type === 'tool_use') { live.activity = toolLabel(blk); const i = blk.input || {}; grab(i.file_path || i.path || i.command || ''); }
      }
    } else if (ev.type === 'result') { if (ev.result) live.text = ev.result; live.activity = ''; grab(ev.result); }
    else if (ev.type === 'error') { live.text += (live.text ? '\n\n' : '') + '⚠️ ' + (ev.message || 'erreur'); live.activity = ''; }
    renderChat();
  };
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    buf += dec.decode(value, { stream: true });
    let nl; while ((nl = buf.indexOf('\n')) >= 0) { const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1); if (line) { try { handle(JSON.parse(line)); } catch (e) {} } }
  }
  if (buf.trim()) { try { handle(JSON.parse(buf.trim())); } catch (e) {} }
  live.activity = ''; renderChat();
}
function renderAgentActions() {
  const el = $('#agent-actions'); if (!el) return;
  if (!AGENT_DECK) { el.classList.add('hidden'); el.innerHTML = ''; return; }
  el.classList.remove('hidden');
  el.innerHTML = `<span style="font-family:var(--mono);font-size:12px;color:var(--soft)">Deck généré : <code>${esc(AGENT_DECK)}</code></span>`
    + `<a class="btn" href="/${esc(AGENT_DECK)}" target="_blank">Ouvrir ↗</a>`
    + `<button class="btn btn-primary" id="agent-pdf">Exporter &amp; télécharger PDF</button>`;
  $('#agent-pdf').onclick = () => exportPdf(AGENT_DECK, $('#agent-pdf'));
}
async function afterAgentTurn() {
  renderAgentActions();
  if (AGENT_DECK) { try { DECKS = await api('/api/decks'); renderGallery(); } catch (e) {} }
}
async function launchAgent(briefPath, type) {
  $('#agent-panel').classList.remove('hidden');
  AGENT_DECK = null; renderAgentActions();
  const live = { role: 'assistant', text: '', activity: 'démarrage de l\'agent…' };
  CHAT = [live]; renderChat();
  $('#agent-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  setBusy(true);
  try { await streamAgent({ action: 'launch', brief_path: briefPath, type: type }, live); }
  catch (e) { live.text += (live.text ? '\n\n' : '') + '⚠️ erreur : ' + e; live.activity = ''; renderChat(); }
  setBusy(false); await afterAgentTurn();
}
/* pièces jointes du chat : uploadées dans clients/<slug>/context/, lues par l'agent repris */
async function attachChatFiles(e) {
  const slug = AGENT_SLUG || slugify($('#company').value.trim());
  if (!slug) { e.target.value = ''; return toast('Renseigne la <b>société</b> d\'abord.'); }
  for (const f of e.target.files) {
    const r = await api(`/api/upload?slug=${encodeURIComponent(slug)}&name=${encodeURIComponent(f.name)}`, { method: 'POST', body: f });
    if (r.path) CHAT_FILES.push(r.path);
  }
  e.target.value = ''; renderChatFiles();
}
function renderChatFiles() {
  const el = $('#chat-files'); if (!el) return;
  el.innerHTML = CHAT_FILES.map((f, i) => `<span class="chip">📎 ${esc(f.split('/').pop())}<button data-rm="${i}" title="Retirer">×</button></span>`).join('');
  el.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { CHAT_FILES.splice(+b.dataset.rm, 1); renderChatFiles(); });
}
async function sendChat() {
  const box = $('#chatbox'); const text = box.value.trim(); const files = CHAT_FILES.slice();
  if ((!text && !files.length) || AGENT_BUSY) return;
  if (!AGENT_SID) return toast('Lance d\'abord l\'agent (étape 6).');
  box.value = ''; CHAT_FILES = []; renderChatFiles();
  const note = files.length ? `\n\n[Pièces jointes à lire et prendre en compte : ${files.join(', ')}]` : '';
  const names = files.map(f => f.split('/').pop()).join(', ');
  CHAT.push({ role: 'user', text: (text ? text : '') + (files.length ? `${text ? '\n\n' : ''}📎 ${names}` : '') });
  const live = { role: 'assistant', text: '', activity: 'réflexion…' }; CHAT.push(live); renderChat();
  setBusy(true);
  try { await streamAgent({ action: 'reply', session_id: AGENT_SID, message: (text || 'Voici des pièces jointes à prendre en compte.') + note }, live); }
  catch (e) { live.text += (live.text ? '\n\n' : '') + '⚠️ erreur : ' + e; live.activity = ''; renderChat(); }
  setBusy(false); await afterAgentTurn();
}

/* ---------- enrichissement du contexte entreprise (agent recherche, secondaire) ---------- */
let ENRICH_STEPS = [];
function renderEnrich(state) {
  const el = $('#enrich-status'); if (!el) return;
  if (!ENRICH_STEPS.length && state !== 'run') { el.innerHTML = ''; return; }
  const head = state === 'run' ? '<span class="spin"></span>' : state === 'done' ? '<span class="ok">✓</span>' : '<span class="ko">⚠</span>';
  el.innerHTML = `<div class="enrich-prog">${head}<div class="enrich-steps">${ENRICH_STEPS.map(s => `<div>${esc(s)}</div>`).join('')}</div></div>`;
}
function pushStep(s) { s = String(s || '').trim(); if (!s) return; if (ENRICH_STEPS[ENRICH_STEPS.length - 1] === s) return; ENRICH_STEPS.push(s); renderEnrich('run'); }
async function enrich() {
  const company = $('#company').value.trim();
  if (!company) return toast('Renseigne d\'abord la <b>société</b>.');
  const slug = slugify(company);
  const btn = $('#enrich'), old = btn.textContent;
  btn.disabled = true; btn.textContent = 'Recherche…';
  ENRICH_STEPS = ['Lancement de l\'agent de recherche…']; renderEnrich('run');
  const payload = { company, slug, website: $('#website').value.trim(), transcript: $('#transcript').value, context_extra: $('#ctxextra').value };
  try {
    const resp = await fetch('/api/enrich', { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
    const reader = resp.body.getReader(); const dec = new TextDecoder(); let buf = '';
    const handle = ev => {
      if (ev.type === 'assistant' && ev.message && Array.isArray(ev.message.content)) {
        for (const blk of ev.message.content) {
          if (blk.type === 'tool_use') pushStep(toolLabel(blk));
          else if (blk.type === 'text' && blk.text) pushStep(blk.text.replace(/\s+/g, ' ').slice(0, 90));
        }
      } else if (ev.type === 'error') pushStep('⚠️ ' + (ev.message || 'erreur'));
    };
    while (true) { const { done, value } = await reader.read(); if (done) break; buf += dec.decode(value, { stream: true }); let nl; while ((nl = buf.indexOf('\n')) >= 0) { const line = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1); if (line) { try { handle(JSON.parse(line)); } catch (e) {} } } }
    const r = await api('/api/company-context?slug=' + encodeURIComponent(slug));
    if (r.content && r.content.trim()) { $('#ctxcompany').value = r.content.trim(); pushStep('Contexte rédigé et pris en compte (éditable ci-dessous).'); renderEnrich('done'); toast('✅ Contexte entreprise enrichi.'); }
    else { pushStep('Terminé — aucun contexte écrit. Réessaie ou complète à la main.'); renderEnrich('error'); }
  } catch (e) { pushStep('⚠️ ' + e); renderEnrich('error'); }
  btn.disabled = false; btn.textContent = old;
}
/* auto-enregistrement (debounce) : pas besoin de cliquer, l'édition est conservée et prise en compte */
let _ctxSaveT = null;
function autoSaveCompanyContext() {
  const company = $('#company').value.trim(); if (!company) return;
  clearTimeout(_ctxSaveT);
  _ctxSaveT = setTimeout(() => {
    api('/api/company-context', { method: 'POST', body: JSON.stringify({ slug: slugify(company), content: $('#ctxcompany').value }), headers: { 'Content-Type': 'application/json' } }).catch(() => {});
  }, 700);
}
async function loadCompanyContext() {
  const company = $('#company').value.trim(); if (!company || $('#ctxcompany').value.trim()) return;
  try { const r = await api('/api/company-context?slug=' + encodeURIComponent(slugify(company))); if (r.content && r.content.trim()) $('#ctxcompany').value = r.content.trim(); } catch (e) {}
}

async function compose() {
  const company = $('#company').value.trim();
  if (!company) return toast('Renseigne la <b>société</b>.');
  if (!selType) return toast('Choisis un <b>type</b> de présentation.');
  const slug = slugify(company); AGENT_SLUG = slug;
  const body = { type: selType, slug, company, website: $('#website').value.trim(), rdv_date: $('#rdvdate').value, transcript: $('#transcript').value, context_extra: $('#ctxextra').value, context_company: $('#ctxcompany').value, context_files: ctxFiles };
  const r = await api('/api/brief', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });
  if (!r.path) return toast('Erreur : ' + (r.error || '?'));
  toast(`✅ Brief écrit : <code>${r.path}</code> — lancement de l'agent…`);
  launchAgent(r.path, selType);
}

/* ---------- knowledge (rendu + édition + validation) ---------- */
function renderKFiles() {
  $('#kfiles').innerHTML = KFILES.map(f => `<div class="kfile ${kCurrent === f.file ? 'active' : ''}" data-file="${esc(f.file)}">${esc(f.title)}</div>`).join('');
  $$('#kfiles .kfile').forEach(el => el.onclick = () => openK(el.dataset.file));
}
function kView() { $('#kview').innerHTML = mdToHtml(kRaw); $('#kview').style.display = ''; $('#kedit').style.display = 'none'; $('#kedit-btn').style.display = ''; $('#ksave').style.display = 'none'; $('#kcancel').style.display = 'none'; }
function kEdit() { $('#kedit').value = kRaw; $('#kview').style.display = 'none'; $('#kedit').style.display = ''; $('#kedit-btn').style.display = 'none'; $('#ksave').style.display = ''; $('#kcancel').style.display = ''; }
async function openK(file) {
  kCurrent = file; renderKFiles();
  const r = await api('/api/knowledge/' + encodeURIComponent(file));
  kRaw = r.content || ''; $('#ktitle').textContent = file; $('#kedit-btn').disabled = false; kView();
}
async function saveK() {
  if (!kCurrent) return;
  const ok = await confirmDialog('Enregistrer les modifications', `Écrire dans knowledge/${kCurrent} ? Cette action remplace le contenu du fichier.`);
  if (!ok) return;
  const r = await api('/api/knowledge/' + encodeURIComponent(kCurrent), { method: 'POST', body: $('#kedit').value, headers: { 'Content-Type': 'text/plain' } });
  if (r.ok) { kRaw = $('#kedit').value; kView(); toast(`✅ <code>knowledge/${esc(kCurrent)}</code> enregistré.`); }
  else toast('Erreur : ' + (r.error || '?'));
}

/* ---------- scénarios RDV1 (structure & orchestration — lecture seule) ---------- */
function renderSFiles() {
  const el = $('#sfiles'); if (!el) return;
  el.innerHTML = SFILES.map(f => `<div class="kfile ${sCurrent === f.file ? 'active' : ''}" data-file="${esc(f.file)}">${esc(f.title)}</div>`).join('');
  $$('#sfiles .kfile').forEach(el => el.onclick = () => openS(el.dataset.file));
}
async function openS(file) {
  sCurrent = file; renderSFiles();
  const r = await api('/api/scenarios/' + encodeURIComponent(file));
  $('#stitle').textContent = file;
  $('#sview').innerHTML = mdToHtml(r.content || '');
}

/* ---------- decks (1 dossier clients/<slug>/ par entreprise) ---------- */
function renderGallery() {
  $('#gallery').innerHTML = DECKS.map(d => {
    const pdfBtns = d.pdf
      ? `<a class="btn" href="/${esc(d.pdf)}?dl=1">Télécharger PDF</a>`
      : `<button class="btn btn-primary" data-pdf="${esc(d.url)}">Exporter PDF</button>`;
    return `<div class="deck"><div class="dn">${esc(d.slug)}</div>`
      + `<div style="font-family:var(--mono);font-size:11px;color:var(--soft);margin:2px 0 10px">${esc(d.file)}${d.pdf ? ' · PDF ✓' : ''}</div>`
      + `<div class="row" style="gap:8px;flex-wrap:wrap"><a class="btn" href="/${esc(d.url)}" target="_blank">Ouvrir ↗</a>${pdfBtns}</div></div>`;
  }).join('') || '<div class="empty">Aucun deck créé pour l\'instant.</div>';
  $$('#gallery [data-pdf]').forEach(b => b.onclick = () => exportPdf(b.dataset.pdf, b));
}
function triggerDownload(href, name) {
  const a = document.createElement('a'); a.href = href; if (name) a.download = name; a.style.display = 'none';
  document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 0);
}
async function exportPdf(deck, btn) {
  const old = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = 'Génération…'; }
  toast(`📄 Génération du PDF… (~30-45 s : screenshot de chaque slide)`);
  try {
    const r = await api('/api/export-pdf', { method: 'POST', body: JSON.stringify({ deck }), headers: { 'Content-Type': 'application/json' } });
    if (r.pdf) {
      triggerDownload('/' + r.pdf + '?dl=1', r.pdf.split('/').pop());
      toast(`✅ PDF prêt (${r.pages || r.slides} pages) — enregistré dans <code>${esc(r.pdf)}</code> et téléchargé.`);
      try { DECKS = await api('/api/decks'); renderGallery(); } catch (e) {}
    } else toast('Erreur export : ' + (r.error || '?'));
  } catch (e) { toast('Erreur : ' + e); }
  if (btn) { btn.disabled = false; btn.textContent = old; }
}

/* ---------- audio (2 micros) ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, recording = false, aTa = null, aBtn = null, aLbl = null;
function toggleMic(taId, btnId, lblId) {
  if (!SR) return toast('Reconnaissance vocale non supportée (utilise Chrome).');
  if (recording) { rec.stop(); return; }
  aTa = $('#' + taId); aBtn = $('#' + btnId); aLbl = $('#' + lblId);
  rec = new SR(); rec.lang = 'fr-FR'; rec.continuous = true; rec.interimResults = false;
  rec.onresult = e => { for (let i = e.resultIndex; i < e.results.length; i++) if (e.results[i].isFinal) aTa.value = (aTa.value ? aTa.value + ' ' : '') + e.results[i][0].transcript.trim(); };
  rec.onend = rec.onerror = () => { recording = false; if (aBtn) aBtn.classList.remove('rec'); if (aLbl) aLbl.textContent = 'Dicter (Web Speech)'; };
  rec.start(); recording = true; aBtn.classList.add('rec'); if (aLbl) aLbl.textContent = '● Enregistrement… (cliquer pour arrêter)';
}

/* ---------- bindings ---------- */
$('#mic-call').onclick = () => toggleMic('transcript', 'mic-call', 'micl-call');
$('#mic-ctx').onclick = () => toggleMic('ctxextra', 'mic-ctx', 'micl-ctx');
$('#mic-chat').onclick = () => toggleMic('chatbox', 'mic-chat', null);
$('#chat-attach-btn').onclick = () => $('#chat-attach').click();
$('#chat-attach').onchange = attachChatFiles;
$('#chat-send').onclick = sendChat;
$('#chatbox').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } });
$('#files').onchange = uploadFiles;
$('#enrich').onclick = enrich;
$('#ctxcompany').addEventListener('input', autoSaveCompanyContext);
$('#company').addEventListener('change', loadCompanyContext);
$('#compose').onclick = compose;
$('#kedit-btn').onclick = kEdit;
$('#kcancel').onclick = kView;
$('#ksave').onclick = saveK;

/* ---------- thème clair / sombre ---------- */
const ICON_SUN = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.3M12 19.1v2.3M2.6 12h2.3M19.1 12h2.3M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6"/></svg>';
const ICON_MOON = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.4A8 8 0 1 1 9.6 4a6.3 6.3 0 0 0 10.4 10.4Z"/></svg>';
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  const b = $('#theme-toggle');
  if (b) b.innerHTML = (t === 'dark' ? ICON_SUN : ICON_MOON) + `<span style="margin-left:7px">${t === 'dark' ? 'Clair' : 'Sombre'}</span>`;
}
$('#theme-toggle').onclick = () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem('prismia-theme', next); applyTheme(next);
};
applyTheme(document.documentElement.getAttribute('data-theme') || 'light');

load();
