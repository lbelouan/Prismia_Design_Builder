// ============================
// Prismia × Aledia — Tweaks App
// Aggressive design customization
// ============================

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#9b7cff", "#e07cff", "#050310", "#f3effb"],
  "accent": "#9b7cff",
  "accent2": "#e07cff",
  "theme": "dark",
  "fontDisplay": "Instrument Serif",
  "fontSans": "Inter",
  "fontMono": "JetBrains Mono",
  "displaySize": 156,
  "titleSize": 84,
  "bodySize": 17,
  "italics": true,
  "cardStyle": "glass",
  "cardRadius": 18,
  "glassBlur": 28,
  "density": "regular",
  "padX": 120,
  "padY": 88,
  "showGrid": true,
  "showOrbs": true,
  "showNoise": true,
  "showChrome": true,
  "showProgress": true,
  "animSpeed": 1.0,
  "show3D": true,
  "shape": "knot",
  "shapeScale": 1.0,
  "shapeSpeed": 1.0,
  "shapeOpacity": 1.0,
  "iridescence": 1.0,
  "metalness": 0.2,
  "roughness": 0.08,
  "transmission": 0.85,
  "wireRing": true
}/*EDITMODE-END*/;

// === Palette presets ===
// Each: [accent, accent2, bg, text]
const PALETTES = [
  { name: 'Violet',   colors: ['#9b7cff', '#e07cff', '#050310', '#f3effb'] },
  { name: 'Cobalt',   colors: ['#5b86ff', '#7cd4ff', '#040814', '#eef2ff'] },
  { name: 'Crimson',  colors: ['#ff5a78', '#ff9560', '#100408', '#fff0f3'] },
  { name: 'Emerald',  colors: ['#4ade80', '#7cd4ff', '#03100a', '#ecfff5'] },
  { name: 'Amber',    colors: ['#ffb000', '#ff5a78', '#140a02', '#fff8e8'] },
  { name: 'Magenta',  colors: ['#ff4cb1', '#9b7cff', '#0c0410', '#fde8f4'] },
  { name: 'Mono',     colors: ['#ffffff', '#c0c0c0', '#0a0a0a', '#f4f4f4'] },
  { name: 'Sand',     colors: ['#b85c00', '#7a4a1a', '#f3efe5', '#1a1208'] },
];

const SHAPES = ['knot', 'torus', 'sphere', 'icosahedron', 'octahedron', 'capsule', 'cone', 'cylinder'];

const FONTS_DISPLAY = [
  'Instrument Serif', 'Playfair Display', 'Fraunces', 'Cormorant Garamond',
  'DM Serif Display', 'Bodoni Moda', 'Libre Caslon Display', 'Inter', 'JetBrains Mono'
];
const FONTS_SANS = [
  'Inter', 'DM Sans', 'Manrope', 'Geist', 'IBM Plex Sans', 'Work Sans', 'Plus Jakarta Sans', 'Space Grotesk'
];
const FONTS_MONO = [
  'JetBrains Mono', 'IBM Plex Mono', 'Space Mono', 'Geist Mono', 'Fira Code'
];

// Inject fonts dynamically
function injectFontLink(family) {
  const id = 'gf-' + family.replace(/\s+/g, '-');
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;
  document.head.appendChild(link);
}
// Preload all to avoid jank when switching
FONTS_DISPLAY.concat(FONTS_SANS, FONTS_MONO).forEach(injectFontLink);

// === Apply tweaks to DOM ===
function applyTweaks(t) {
  const root = document.documentElement;
  const body = document.body;

  // Colors
  root.style.setProperty('--tk-accent', t.accent);
  root.style.setProperty('--tk-accent2', t.accent2);
  root.style.setProperty('--tk-bg', t.palette[2]);
  root.style.setProperty('--tk-text', t.palette[3]);

  // Fonts
  root.style.setProperty('--tk-font-display', `'${t.fontDisplay}', serif`);
  root.style.setProperty('--tk-font-sans', `'${t.fontSans}', -apple-system, sans-serif`);
  root.style.setProperty('--tk-font-mono', `'${t.fontMono}', monospace`);

  // Sizes
  root.style.setProperty('--tk-display-size', t.displaySize + 'px');
  root.style.setProperty('--tk-title-size', t.titleSize + 'px');
  root.style.setProperty('--tk-body-size', t.bodySize + 'px');
  root.style.setProperty('--tk-lead-size', (t.bodySize + 5) + 'px');

  // Layout
  root.style.setProperty('--tk-radius', t.cardRadius + 'px');
  root.style.setProperty('--tk-blur', t.glassBlur + 'px');
  root.style.setProperty('--tk-pad-x', t.padX + 'px');
  root.style.setProperty('--tk-pad-y', t.padY + 'px');
  root.style.setProperty('--tk-anim', t.animSpeed);

  // Classes
  body.classList.toggle('italics-off', !t.italics);
  body.classList.toggle('no-grid', !t.showGrid);
  body.classList.toggle('no-orbs', !t.showOrbs);
  body.classList.toggle('no-noise', !t.showNoise);
  body.classList.toggle('no-chrome', !t.showChrome);
  body.classList.toggle('no-progress', !t.showProgress);
  body.classList.toggle('theme-light', t.theme === 'light');

  // Card style — clear all then set one
  body.classList.remove('cards-glass', 'cards-solid', 'cards-outline', 'cards-flat');
  body.classList.add('cards-' + t.cardStyle);

  // 3D scene
  if (window.__threeScene && window.__threeScene.setConfig) {
    window.__threeScene.setConfig({
      visible: t.show3D,
      shape: t.shape,
      scaleMul: t.shapeScale,
      speed: t.shapeSpeed,
      opacityMul: t.shapeOpacity,
      iridescence: t.iridescence,
      metalness: t.metalness,
      roughness: t.roughness,
      transmission: t.transmission,
      wireframe: t.wireRing,
      accent: t.accent,
      accent2: t.accent2,
    });
  }
}

function PrismiaTweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply on every tweak change
  React.useEffect(() => { applyTweaks(t); }, [t]);

  // Apply once on mount even before user opens panel
  React.useEffect(() => { applyTweaks(t); }, []);

  // === When palette swatch picked, set accent/accent2 from it ===
  const onPaletteChange = (cols) => {
    setTweak({ palette: cols, accent: cols[0], accent2: cols[1] });
  };

  return (
    <TweaksPanel title="Design Tweaks">
      <TweakSection label="Palette" />
      <TweakColor
        label="Preset"
        value={t.palette}
        options={PALETTES.map(p => p.colors)}
        onChange={onPaletteChange}
      />
      <TweakColor
        label="Accent 1"
        value={t.accent}
        options={['#9b7cff','#5b86ff','#ff5a78','#4ade80','#ffb000','#ff4cb1','#ffffff','#b85c00']}
        onChange={(v) => setTweak('accent', v)}
      />
      <TweakColor
        label="Accent 2"
        value={t.accent2}
        options={['#e07cff','#7cd4ff','#ff9560','#7cd4ff','#ff5a78','#9b7cff','#c0c0c0','#7a4a1a']}
        onChange={(v) => setTweak('accent2', v)}
      />
      <TweakRadio
        label="Mode"
        value={t.theme}
        options={['dark', 'light']}
        onChange={(v) => setTweak('theme', v)}
      />

      <TweakSection label="Forme 3D" />
      <TweakToggle label="Afficher" value={t.show3D} onChange={(v) => setTweak('show3D', v)} />
      <TweakSelect
        label="Géométrie"
        value={t.shape}
        options={SHAPES}
        onChange={(v) => setTweak('shape', v)}
      />
      <TweakSlider label="Échelle" value={t.shapeScale} min={0.3} max={2.5} step={0.05} unit="×"
        onChange={(v) => setTweak('shapeScale', v)} />
      <TweakSlider label="Vitesse" value={t.shapeSpeed} min={0} max={3} step={0.05} unit="×"
        onChange={(v) => setTweak('shapeSpeed', v)} />
      <TweakSlider label="Opacité" value={t.shapeOpacity} min={0.1} max={1.0} step={0.05}
        onChange={(v) => setTweak('shapeOpacity', v)} />
      <TweakSlider label="Iridescence" value={t.iridescence} min={0} max={1} step={0.05}
        onChange={(v) => setTweak('iridescence', v)} />
      <TweakSlider label="Métallique" value={t.metalness} min={0} max={1} step={0.05}
        onChange={(v) => setTweak('metalness', v)} />
      <TweakSlider label="Rugosité" value={t.roughness} min={0} max={1} step={0.02}
        onChange={(v) => setTweak('roughness', v)} />
      <TweakSlider label="Transmission" value={t.transmission} min={0} max={1} step={0.05}
        onChange={(v) => setTweak('transmission', v)} />
      <TweakToggle label="Anneau filaire" value={t.wireRing} onChange={(v) => setTweak('wireRing', v)} />

      <TweakSection label="Typographie" />
      <TweakSelect
        label="Display (titres)"
        value={t.fontDisplay}
        options={FONTS_DISPLAY}
        onChange={(v) => setTweak('fontDisplay', v)}
      />
      <TweakSelect
        label="Sans (texte)"
        value={t.fontSans}
        options={FONTS_SANS}
        onChange={(v) => setTweak('fontSans', v)}
      />
      <TweakSelect
        label="Mono (chrome)"
        value={t.fontMono}
        options={FONTS_MONO}
        onChange={(v) => setTweak('fontMono', v)}
      />
      <TweakSlider label="Display size" value={t.displaySize} min={80} max={220} step={2} unit="px"
        onChange={(v) => setTweak('displaySize', v)} />
      <TweakSlider label="Title size" value={t.titleSize} min={40} max={140} step={2} unit="px"
        onChange={(v) => setTweak('titleSize', v)} />
      <TweakSlider label="Body size" value={t.bodySize} min={12} max={26} step={1} unit="px"
        onChange={(v) => setTweak('bodySize', v)} />
      <TweakToggle label="Italiques accents" value={t.italics}
        onChange={(v) => setTweak('italics', v)} />

      <TweakSection label="Cartes & layout" />
      <TweakRadio
        label="Style cartes"
        value={t.cardStyle}
        options={['glass', 'solid', 'outline', 'flat']}
        onChange={(v) => setTweak('cardStyle', v)}
      />
      <TweakSlider label="Rayon" value={t.cardRadius} min={0} max={36} step={1} unit="px"
        onChange={(v) => setTweak('cardRadius', v)} />
      <TweakSlider label="Flou verre" value={t.glassBlur} min={0} max={60} step={2} unit="px"
        onChange={(v) => setTweak('glassBlur', v)} />
      <TweakSlider label="Padding H" value={t.padX} min={40} max={200} step={4} unit="px"
        onChange={(v) => setTweak('padX', v)} />
      <TweakSlider label="Padding V" value={t.padY} min={30} max={160} step={4} unit="px"
        onChange={(v) => setTweak('padY', v)} />

      <TweakSection label="Décor" />
      <TweakToggle label="Grille de fond" value={t.showGrid}
        onChange={(v) => setTweak('showGrid', v)} />
      <TweakToggle label="Orbes lumineux" value={t.showOrbs}
        onChange={(v) => setTweak('showOrbs', v)} />
      <TweakToggle label="Grain" value={t.showNoise}
        onChange={(v) => setTweak('showNoise', v)} />
      <TweakToggle label="En-têtes / pieds" value={t.showChrome}
        onChange={(v) => setTweak('showChrome', v)} />
      <TweakToggle label="Barre de progression" value={t.showProgress}
        onChange={(v) => setTweak('showProgress', v)} />

      <TweakSection label="Animations" />
      <TweakSlider label="Vitesse globale" value={t.animSpeed} min={0.3} max={2.5} step={0.1} unit="×"
        onChange={(v) => setTweak('animSpeed', v)} />

      <TweakSection label="Reset" />
      <TweakButton label="↺ Réinitialiser tout" onClick={() => {
        const defaults = JSON.parse(JSON.stringify(TWEAK_DEFAULTS));
        setTweak(defaults);
      }} />
    </TweaksPanel>
  );
}

const _root = document.getElementById('tweaks-root');
if (_root) {
  ReactDOM.createRoot(_root).render(<PrismiaTweaksApp />);
}
