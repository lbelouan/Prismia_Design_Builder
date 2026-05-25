// ============================
// Prismia × Aledia — 3D scene
// Glassy iridescent twisted ribbon + Tweakable
// ============================
(function () {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || !window.THREE) {
    activateFallback();
    return;
  }

  // Probe WebGL availability
  const probe = document.createElement('canvas');
  const probeCtx = probe.getContext('webgl2') || probe.getContext('webgl');
  if (!probeCtx) {
    activateFallback();
    return;
  }

  const stage = document.querySelector('.stage');
  const stageW = 1920;
  const stageH = 1080;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas, alpha: true, antialias: true, powerPreference: 'high-performance',
    });
  } catch (err) {
    activateFallback();
    return;
  }

  function activateFallback() {
    if (canvas) canvas.style.display = 'none';
    const fb = document.getElementById('three-fallback');
    if (fb) fb.style.display = 'block';
    const POS = {
      1:  { x:  62, y: 50, s: 1.0, op: 0.95 },
      2:  { x:  78, y: 30, s: 0.55, op: 0.5 },
      3:  { x:  18, y: 78, s: 0.45, op: 0.35 },
      4:  { x:  82, y: 36, s: 0.6, op: 0.45 },
      5:  { x:  85, y: 80, s: 0.45, op: 0.3 },
      6:  { x:  82, y: 22, s: 0.55, op: 0.45 },
      7:  { x:  16, y: 82, s: 0.45, op: 0.35 },
      8:  { x:  82, y: 22, s: 0.5, op: 0.4 },
      9:  { x:  82, y: 38, s: 0.55, op: 0.45 },
      10: { x:  16, y: 78, s: 0.45, op: 0.35 },
      11: { x:  60, y: 50, s: 1.1, op: 0.95 },
    };
    window.__threeScene = {
      setSlide(idx) {
        const p = POS[idx];
        if (!p || !fb) return;
        fb.style.left = p.x + '%';
        fb.style.top = p.y + '%';
        fb.style.transform = `translate(-50%,-50%) scale(${p.s * (window.__threeConfig?.scaleMul || 1)})`;
        fb.style.opacity = p.op * (window.__threeConfig?.opacityMul || 1);
      },
      setConfig(cfg) {
        Object.assign(window.__threeConfig || (window.__threeConfig = {}), cfg);
        const fb = document.getElementById('three-fallback');
        if (!fb) return;
        if (cfg.hide !== undefined) fb.style.display = cfg.hide ? 'none' : 'block';
        // accent color flows into the blob via CSS variable
        if (cfg.accent) document.documentElement.style.setProperty('--three-accent', cfg.accent);
      }
    };
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(stageW, stageH, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, stageW / stageH, 0.1, 100);
  camera.position.set(0, 0, 7);

  // Lighting
  const ambient = new THREE.AmbientLight(0x8a76d6, 1.0);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xc8b4ff, 2.0);
  key.position.set(5, 4, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xff7cf0, 1.5);
  rim.position.set(-6, -2, -3);
  scene.add(rim);
  const fill = new THREE.PointLight(0x6a4ee0, 4, 18);
  fill.position.set(-3, 3, 4);
  scene.add(fill);

  // Procedural environment for reflections
  function buildEnvTexture(accent, accent2) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 512;
    const cx = c.getContext('2d');
    const grad = cx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#1a0f3a');
    grad.addColorStop(0.4, accent || '#6a4ee0');
    grad.addColorStop(0.7, accent2 || '#e07cff');
    grad.addColorStop(1, '#1a0f3a');
    cx.fillStyle = grad;
    cx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 80; i++) {
      cx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.4) + ')';
      cx.beginPath();
      cx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 3, 0, Math.PI * 2);
      cx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  scene.environment = buildEnvTexture();

  const group = new THREE.Group();
  scene.add(group);

  // Geometry factory — can be rebuilt on shape change
  function makeGeometry(shape) {
    switch (shape) {
      case 'torus':       return new THREE.TorusGeometry(1.05, 0.34, 32, 200);
      case 'sphere':      return new THREE.SphereGeometry(1.2, 96, 96);
      case 'icosahedron': return new THREE.IcosahedronGeometry(1.25, 1);
      case 'octahedron':  return new THREE.OctahedronGeometry(1.4, 0);
      case 'capsule':     return new THREE.CapsuleGeometry(0.65, 1.0, 16, 32);
      case 'cone':        return new THREE.ConeGeometry(1.0, 1.8, 32, 1);
      case 'cylinder':    return new THREE.CylinderGeometry(0.9, 0.9, 1.7, 64, 1, false);
      case 'knot':
      default:            return new THREE.TorusKnotGeometry(1.05, 0.34, 220, 32, 2, 3);
    }
  }

  let knotGeo = makeGeometry('knot');
  const knotMat = new THREE.MeshPhysicalMaterial({
    color: 0xb89bff,
    metalness: 0.2,
    roughness: 0.08,
    transmission: 0.85,
    thickness: 1.2,
    ior: 1.45,
    iridescence: 1.0,
    iridescenceIOR: 1.6,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.3,
    transparent: true,
    opacity: 0.95,
  });
  const knot = new THREE.Mesh(knotGeo, knotMat);
  group.add(knot);

  const wireGeo = new THREE.IcosahedronGeometry(2.4, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x8b6dff, wireframe: true, transparent: true, opacity: 0.07,
  });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  group.add(wire);

  // Per-slide presets
  const PRESETS = {
    1:  { x:  2.2, y:  0.0, scale: 1.4,  rx: 0.4, ry: 0.4, op: 1.0 },
    2:  { x:  3.2, y: -0.4, scale: 0.85, rx: 0.5, ry: 0.3, op: 0.6 },
    3:  { x: -3.2, y:  1.2, scale: 0.7,  rx: 0.3, ry: 0.6, op: 0.45 },
    4:  { x:  3.4, y: -0.2, scale: 0.9,  rx: 0.2, ry: 0.5, op: 0.55 },
    5:  { x:  3.3, y: -1.0, scale: 0.7,  rx: 0.6, ry: 0.4, op: 0.4 },
    6:  { x:  3.2, y:  1.0, scale: 0.8,  rx: 0.4, ry: 0.5, op: 0.55 },
    7:  { x: -3.2, y: -1.0, scale: 0.7,  rx: 0.3, ry: 0.4, op: 0.45 },
    8:  { x:  3.2, y:  1.1, scale: 0.75, rx: 0.5, ry: 0.6, op: 0.5 },
    9:  { x:  3.3, y: -0.2, scale: 0.8,  rx: 0.4, ry: 0.5, op: 0.55 },
    10: { x: -3.2, y: -0.8, scale: 0.7,  rx: 0.3, ry: 0.4, op: 0.45 },
    11: { x:  2.2, y:  0.0, scale: 1.5,  rx: 0.4, ry: 0.6, op: 1.0 },
  };

  // Runtime config (mutated via setConfig)
  const config = {
    shape: 'knot',
    scaleMul: 1.0,
    speed: 1.0,
    opacityMul: 1.0,
    iridescence: 1.0,
    wireframe: true,
    metalness: 0.2,
    roughness: 0.08,
    transmission: 0.85,
    accent: '#b89bff',
    accent2: '#e07cff',
    visible: true,
  };
  window.__threeConfig = config;

  let target = { ...PRESETS[1] };
  let current = { x: target.x, y: target.y, scale: target.scale, rx: target.rx, ry: target.ry, op: target.op };

  window.__threeScene = {
    setSlide(idx) {
      const p = PRESETS[idx];
      if (p) target = { ...p };
    },
    setConfig(cfg) {
      Object.assign(config, cfg);
      if (cfg.shape !== undefined) {
        knot.geometry.dispose();
        knot.geometry = makeGeometry(cfg.shape);
      }
      if (cfg.accent !== undefined) {
        knotMat.color.set(cfg.accent);
        scene.environment = buildEnvTexture(cfg.accent, config.accent2);
      }
      if (cfg.accent2 !== undefined) {
        scene.environment = buildEnvTexture(config.accent, cfg.accent2);
      }
      if (cfg.iridescence !== undefined) knotMat.iridescence = cfg.iridescence;
      if (cfg.metalness !== undefined) knotMat.metalness = cfg.metalness;
      if (cfg.roughness !== undefined) knotMat.roughness = cfg.roughness;
      if (cfg.transmission !== undefined) knotMat.transmission = cfg.transmission;
      if (cfg.wireframe !== undefined) wire.visible = cfg.wireframe;
      if (cfg.visible !== undefined) group.visible = cfg.visible;
      knotMat.needsUpdate = true;
    }
  };

  function lerp(a, b, t) { return a + (b - a) * t; }

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.005 * (config.speed || 1);
    current.x = lerp(current.x, target.x, 0.04);
    current.y = lerp(current.y, target.y, 0.04);
    current.scale = lerp(current.scale, target.scale * (config.scaleMul || 1), 0.04);
    current.rx = lerp(current.rx, target.rx, 0.04);
    current.ry = lerp(current.ry, target.ry, 0.04);
    current.op = lerp(current.op, target.op * (config.opacityMul || 1), 0.04);

    group.position.set(current.x, current.y, 0);
    group.scale.setScalar(current.scale);
    knot.rotation.x = current.rx + t * 0.6;
    knot.rotation.y = current.ry + t * 0.8;
    wire.rotation.x = -t * 0.15;
    wire.rotation.y = t * 0.2;
    knotMat.opacity = current.op;
    renderer.render(scene, camera);
  }
  animate();
})();
