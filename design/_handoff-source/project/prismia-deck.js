// ============================
// Prismia × Aledia — deck logic
// Navigation, scaling, interactions
// ============================
(function () {
  const stage = document.querySelector('.stage');
  const wrap = document.querySelector('.stage-wrap');
  const slides = document.querySelectorAll('.slide');
  const total = slides.length;
  const progressBar = document.getElementById('progress-bar');
  const navCurrent = document.getElementById('nav-current');
  const navTotal = document.getElementById('nav-total');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  let idx = 0;

  if (navTotal) navTotal.textContent = String(total).padStart(2, '0');

  // ============================
  // Fit stage to viewport
  // ============================
  function fitStage() {
    const rect = wrap.getBoundingClientRect();
    const sx = rect.width / 1920;
    const sy = rect.height / 1080;
    const s = Math.min(sx, sy);
    stage.style.setProperty('--stage-scale', s);
  }
  window.addEventListener('resize', fitStage);
  fitStage();

  // ============================
  // Navigation
  // ============================
  function update() {
    slides.forEach((s, i) => {
      s.classList.remove('active', 'prev');
      if (i === idx) s.classList.add('active');
      else if (i < idx) s.classList.add('prev');
    });
    progressBar.style.width = ((idx + 1) / total * 100) + '%';

    if (navCurrent) navCurrent.textContent = String(idx + 1).padStart(2, '0');
    if (btnPrev) btnPrev.disabled = idx === 0;
    if (btnNext) btnNext.disabled = idx === total - 1;

    // Notify 3D scene
    if (window.__threeScene) window.__threeScene.setSlide(idx + 1);

    // Notify speaker notes
    try { window.parent.postMessage({ slideIndexChanged: idx }, '*'); } catch (e) {}

    // Animate bars, counters on entry
    runSlideAnimations(slides[idx]);
  }

  function goTo(i) { idx = Math.max(0, Math.min(total - 1, i)); update(); }
  function next() { if (idx < total - 1) { idx++; update(); } }
  function prev() { if (idx > 0) { idx--; update(); } }

  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    if (e.key === 'Home') goTo(0);
    if (e.key === 'End') goTo(total - 1);
  });

  // ============================
  // Tabs (territoires slide)
  // ============================
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      const container = btn.closest('.slide');
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const el = container.querySelector('#' + target);
      if (el) el.classList.add('active');
    });
  });

  // ============================
  // Mouse-tracked spotlight on cards
  // ============================
  document.querySelectorAll('.glass, .diag-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--mx', mx + '%');
      card.style.setProperty('--my', my + '%');
    });
  });

  // ============================
  // Per-slide animations
  // ============================
  function runSlideAnimations(slide) {
    // Maturity bars: reset width to 0 then set to target
    slide.querySelectorAll('.maturity .fill').forEach(f => {
      const target = f.dataset.width || '0';
      f.style.width = '0%';
      // force reflow
      void f.offsetWidth;
      f.style.width = target + '%';
    });
    // Counters
    slide.querySelectorAll('.counter-num').forEach(el => {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const v = target * eased;
        el.textContent = prefix + v.toFixed(decimals).replace('.', ',') + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + (decimals > 0 ? target.toFixed(decimals).replace('.', ',') : target.toLocaleString('fr-FR')) + suffix;
      }
      requestAnimationFrame(tick);
    });
  }

  // Init
  update();
})();
