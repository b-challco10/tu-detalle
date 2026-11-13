import * as THREE from 'three';

/* ============================================================
   DATOS DEL EDITOR + DOM
   ============================================================ */
const data = window.__TUDETALLE_DATA__ || {};
const $ = (id) => document.getElementById(id);

const hintEl = $('hint');
const audioEl = $('bgMusic'), musicBtn = $('musicBtn');
const galleryModal = $('galleryModal'), closeGallery = $('closeGallery');
const carouselTrack = $('carouselTrack'), dotsContainer = $('dots'), prevBtn = $('prevBtn'), nextBtn = $('nextBtn');

/* ============================================================
   MÚSICA (por defecto + inicio automático)
   ============================================================ */
const DEFAULT_MUSIC = '/audio/navidad.mp3';   // música por defecto
let userPaused = false;

if (audioEl) {
  audioEl.src = data.bgMusic || DEFAULT_MUSIC; // si el cliente sube una, usa esa
  audioEl.volume = 0.55;
}

function syncMusicBtn() {
  const playing = !audioEl.paused;
  musicBtn.classList.toggle('playing', playing);
  musicBtn.setAttribute('aria-pressed', String(playing));
}
audioEl.addEventListener('play', syncMusicBtn);
audioEl.addEventListener('pause', syncMusicBtn);

// Si el navegador bloquea el inicio automático, arranca en el primer toque
const unlock = (e) => {
  if (e.target.closest('#musicBtn')) return;   // el botón lo maneja él mismo
  if (!userPaused) audioEl.play().catch(() => {});
};
audioEl.addEventListener('play', () => removeEventListener('pointerup', unlock));
addEventListener('pointerup', unlock);
audioEl.play().catch(() => {});                // intento de inicio automático

musicBtn.addEventListener('click', () => {
  if (audioEl.paused) { userPaused = false; audioEl.play().catch(() => {}); }
  else { userPaused = true; audioEl.pause(); }
});

/* ============================================================
   GALERÍA
   ============================================================ */
const photos = [data.photo1, data.photo2, data.photo3, data.photo4].filter(Boolean);
let current = 0;

photos.forEach((src, i) => {
  const slide = document.createElement('div');
  slide.className = 'carousel-slide';
  const img = document.createElement('img');
  img.src = src; img.alt = `Recuerdo ${i + 1}`; img.loading = 'lazy';
  slide.appendChild(img);
  carouselTrack.appendChild(slide);
  const dot = document.createElement('div');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
});

function goTo(i) {
  current = (i + photos.length) % photos.length;
  carouselTrack.style.transform = `translateX(-${current * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, k) => d.classList.toggle('active', k === current));
}
const abrirGaleria = (i = 0) => { goTo(i); galleryModal.classList.add('open'); };
prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));
closeGallery.addEventListener('click', () => galleryModal.classList.remove('open'));
galleryModal.addEventListener('click', (e) => { if (e.target === galleryModal) galleryModal.classList.remove('open'); });

let tx = 0;
carouselTrack.addEventListener('touchstart', (e) => { tx = e.changedTouches[0].screenX; }, { passive: true });
carouselTrack.addEventListener('touchend', (e) => {
  const d = e.changedTouches[0].screenX - tx;
  if (Math.abs(d) > 50) goTo(current + (d < 0 ? 1 : -1));
}, { passive: true });

/* ============================================================
   ESCENA
   ============================================================ */
const LOW = (navigator.hardwareConcurrency || 4) <= 4 || Math.min(innerWidth, innerHeight) < 420;
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const Y_AXIS = new THREE.Vector3(0, 1, 0);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070b1f);
scene.fog = new THREE.FogExp2(0x070b1f, 0.026);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 200);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: !LOW });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, LOW ? 1.5 : 2));
document.body.appendChild(renderer.domElement);

/* Luces */
scene.add(new THREE.AmbientLight(0x5b6ba0, 0.9));
scene.add(new THREE.HemisphereLight(0xaac8ff, 0x1a2a20, 0.6));
const moon = new THREE.DirectionalLight(0x9db8ff, 1.1);
moon.position.set(6, 10, 6);
scene.add(moon);
const headlight = new THREE.PointLight(0xffd9a0, 140, 0, 2); // luz cálida que acompaña a la cámara
camera.add(headlight);

/* Textura de brillo suave */
function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
const glowTex = glowTexture();

/* ============================================================
   ÁRBOL: pisos de ramas + agujas con instancing
   ============================================================ */
const TIERS = 12, BASE_Y = -3, TOP_Y = 4.2, MAXR = 3.2;
const tierY = (t) => BASE_Y + t * (TOP_Y - BASE_Y - 0.6);
const envR = (y) => {
  const t = clamp((y - BASE_Y) / (TOP_Y - BASE_Y - 0.6), 0, 1.05);
  return MAXR * Math.pow(Math.max(1 - t, 0), 0.85) + 0.35;
};

// Tronco, base y punta
const barkMat = new THREE.MeshStandardMaterial({ color: 0x4a2f1c, roughness: 1 });
const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.42, TOP_Y + 4, 8), barkMat);
trunk.position.y = (TOP_Y - 4) / 2;
scene.add(trunk);

const spire = new THREE.Mesh(
  new THREE.ConeGeometry(0.3, 1.4, 7),
  new THREE.MeshStandardMaterial({ color: 0x1f5a2c, roughness: 0.9, flatShading: true })
);
spire.position.y = TOP_Y - 0.1;
scene.add(spire);

// Datos de ramas
const branches = [];
for (let i = 0; i < TIERS; i++) {
  const t = i / (TIERS - 1);
  const n = Math.round(14 - t * 7);
  for (let j = 0; j < 2; j++) {
    const y = tierY(t) - j * 0.5;
    const R = (MAXR * Math.pow(1 - t, 0.85) + 0.35) * (j ? 1.08 : 1);
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2 + (j * Math.PI) / n + rand(-0.12, 0.12);
      const droop = 0.25 + 0.25 * (1 - t) + rand(-0.05, 0.05);
      const d = new THREE.Vector3(Math.cos(a) * Math.cos(droop), -Math.sin(droop), Math.sin(a) * Math.cos(droop));
      branches.push({ s: new THREE.Vector3(0, y, 0), d, L: (R * rand(0.9, 1.05)) / Math.cos(droop) });
    }
  }
}

const dummy = new THREE.Object3D();
const color = new THREE.Color();

// Ramas (madera)
const branchGeo = new THREE.CylinderGeometry(0.018, 0.05, 1, 5);
branchGeo.translate(0, 0.5, 0);
const branchMesh = new THREE.InstancedMesh(branchGeo, barkMat, branches.length);
branches.forEach((b, i) => {
  dummy.position.copy(b.s);
  dummy.quaternion.setFromUnitVectors(Y_AXIS, b.d);
  dummy.scale.set(1, b.L, 1);
  dummy.updateMatrix();
  branchMesh.setMatrixAt(i, dummy.matrix);
});
branchMesh.frustumCulled = false;
scene.add(branchMesh);

// Agujas
const NEEDLES = LOW ? 16 : 28;
const needleGeo = new THREE.ConeGeometry(0.05, 0.55, 4);
needleGeo.translate(0, 0.275, 0);
const needleMesh = new THREE.InstancedMesh(
  needleGeo,
  new THREE.MeshStandardMaterial({ roughness: 0.9, flatShading: true }),
  branches.length * NEEDLES
);
const dir = new THREE.Vector3(), rnd = new THREE.Vector3();
let idx = 0;
branches.forEach((b) => {
  for (let n = 0; n < NEEDLES; n++) {
    const s = rand(0.08, 1);
    dummy.position.copy(b.s).addScaledVector(b.d, b.L * s);
    rnd.set(rand(-1, 1), rand(-0.7, 1), rand(-1, 1));
    dir.copy(b.d).multiplyScalar(0.8).addScaledVector(rnd, 0.75).normalize();
    dummy.quaternion.setFromUnitVectors(Y_AXIS, dir);
    const len = (1.2 - s * 0.5) * rand(0.8, 1.3);
    dummy.scale.set(rand(0.8, 1.3), len, rand(0.8, 1.3));
    dummy.updateMatrix();
    needleMesh.setMatrixAt(idx, dummy.matrix);
    needleMesh.setColorAt(idx, color.setHSL(0.34 + rand(-0.02, 0.03), 0.5, 0.13 + 0.14 * s + rand(0, 0.06)));
    idx++;
  }
});
needleMesh.frustumCulled = false;
scene.add(needleMesh);

/* ============================================================
   GUIRNALDA EN ESPIRAL + JUEGOS DE LUCES
   ============================================================ */
const LIGHT_SETS = [
  { name: 'Cálido',        colors: ['#FFF3B0', '#FFB703'] },
  { name: 'Clásico',       colors: ['#FF2A54', '#00E676', '#2979FF', '#FFD600'] },
  { name: 'Hielo',         colors: ['#FFFFFF', '#4CC9F0', '#A8DADC'] },
  { name: 'Rojo y blanco', colors: ['#E63946', '#F1FAEE'] },
  { name: 'Neón',          colors: ['#FF007F', '#00F5D4', '#9B5DE5'] },
  { name: 'Pastel',        colors: ['#FFAFCC', '#BDE0FE', '#CDB4DB'] },
];
const DEFAULT_LIGHTS = 1;

const BULBS = LOW ? 100 : 170;
const GAR_BOTTOM = -2.6, GAR_TOP = tierY(1) - 0.3;

// Brillo con núcleo sólido y halo corto: luces más nítidas
function lightTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.22, 'rgba(255,255,255,1)');
  gr.addColorStop(0.45, 'rgba(255,255,255,0.4)');
  gr.addColorStop(0.75, 'rgba(255,255,255,0.08)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
const lightTex = lightTexture();

const bulbMesh = new THREE.InstancedMesh(
  new THREE.SphereGeometry(0.04, 8, 8),
  new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false }),
  BULBS
);
const bulbCur = [], bulbTarget = [], bulbPhase = [], garlandPos = [];
for (let k = 0; k < BULBS; k++) {
  const u = k / (BULBS - 1);
  const y = GAR_BOTTOM + u * (GAR_TOP - GAR_BOTTOM), ang = u * Math.PI * 2 * 8, r = envR(y) * 0.84 + 0.18;
  const x = Math.cos(ang) * r, z = Math.sin(ang) * r;
  dummy.position.set(x, y, z); dummy.quaternion.identity(); dummy.scale.set(1, 1, 1); dummy.updateMatrix();
  bulbMesh.setMatrixAt(k, dummy.matrix);
  bulbCur.push(new THREE.Color()); bulbTarget.push(new THREE.Color());
  bulbPhase.push(rand(0, 6.28));
  garlandPos.push(x, y, z);
}
bulbMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(BULBS * 3), 3);
bulbMesh.frustumCulled = false;
scene.add(bulbMesh);

// Halo suave de color (resplandor) + núcleo pequeño casi blanco (el filamento)
const glowGeo = new THREE.BufferGeometry();
glowGeo.setAttribute('position', new THREE.Float32BufferAttribute(garlandPos, 3));
glowGeo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(BULBS * 3), 3));
const glowPts = new THREE.Points(glowGeo, new THREE.PointsMaterial({
  size: 0.75, map: glowTex, vertexColors: true, transparent: true,
  blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
}));
glowPts.frustumCulled = false;
scene.add(glowPts);

const coreGeo = new THREE.BufferGeometry();
coreGeo.setAttribute('position', new THREE.Float32BufferAttribute(garlandPos, 3));
coreGeo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(BULBS * 3), 3));
const corePts = new THREE.Points(coreGeo, new THREE.PointsMaterial({
  size: 0.17, map: lightTex, vertexColors: true, transparent: true,
  blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
}));
corePts.frustumCulled = false;
scene.add(corePts);

const wire = new THREE.Line(glowGeo.clone(), new THREE.LineBasicMaterial({ color: 0x6b5a2a, transparent: true, opacity: 0.6 }));
scene.add(wire);

/* Efectos de parpadeo: devuelven el brillo (0..1) de la bombilla k.
   u = posición a lo largo de la espiral (0..1), t = tiempo, p = fase aleatoria de esa bombilla */
const FX = [
  { name: 'Fijo',        f: () => 1 },
  { name: 'Lento',       f: (k, u, t, p) => 0.6 + 0.4 * Math.sin(t * 1.2 + p) },
  { name: 'Rápido',      f: (k, u, t, p) => 0.25 + 0.75 * Math.pow(0.5 + 0.5 * Math.sin(t * 9 + p * 3), 2) },
  { name: 'Alternado',   f: (k, u, t) => 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * 3 + (k % 2) * Math.PI)) },
  { name: 'Onda',        f: (k, u, t) => 0.15 + 0.85 * Math.pow(0.5 + 0.5 * Math.sin(u * Math.PI * 20 - t * 4.5), 2) },
  { name: 'Respiración', f: (k, u, t) => 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 1.6)) },
  { name: 'Destellos',   f: (k, u, t, p) => 0.4 + 0.6 * Math.max(0, Math.sin(t * 2.1 + p * 7) * Math.sin(t * 3.3 + p * 3)) },
];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DEFAULT_FX = REDUCED ? 0 : 1;
const AUTO_SET_SEC = 9;  // cada cuántos segundos cambia el juego de colores (modo Auto)
const AUTO_FX_SEC = 6;   // cada cuántos segundos cambia el efecto (modo Auto)

let lightIndex = DEFAULT_LIGHTS, fxCur = DEFAULT_FX, fxPrev = DEFAULT_FX, fxMix = 1;
let autoOn = !REDUCED, autoSetT = 0, autoFxT = 0;

/* Selector de luces dentro de la pantalla del árbol */
const lightsBtn = $('lightsBtn'), lightsPanel = $('lightsPanel'), lightsGrid = $('lightsGrid'), lightsName = $('lightsName');
const fxList = $('fxList'), autoBtn = $('autoBtn');

function updateLightsUI() {
  lightsName.textContent = `${LIGHT_SETS[lightIndex].name} · ${FX[fxCur].name}`;
  [...lightsGrid.children].forEach((btn, j) => {
    btn.classList.toggle('active', j === lightIndex);
    btn.setAttribute('aria-pressed', String(j === lightIndex));
  });
  [...fxList.children].forEach((btn, j) => {
    btn.classList.toggle('active', j === fxCur);
    btn.setAttribute('aria-pressed', String(j === fxCur));
  });
  autoBtn.classList.toggle('active', autoOn);
  autoBtn.setAttribute('aria-pressed', String(autoOn));
}
function setAuto(on) {
  autoOn = on; autoSetT = 0; autoFxT = 0;
  updateLightsUI();
}
function setLightSet(i, instant, manual) {
  if (manual) autoOn = false;
  lightIndex = i;
  const cols = LIGHT_SETS[i].colors;
  for (let k = 0; k < BULBS; k++) {
    bulbTarget[k].set(cols[k % cols.length]);
    if (instant) bulbCur[k].copy(bulbTarget[k]);
  }
  updateLightsUI();
}
function setEffect(i, manual) {
  if (manual) autoOn = false;
  if (i !== fxCur) { fxPrev = fxCur; fxCur = i; fxMix = 0; } // mezcla suave entre efectos
  updateLightsUI();
}
function closeLights() {
  lightsPanel.classList.remove('open');
  lightsBtn.classList.remove('active');
  lightsBtn.setAttribute('aria-expanded', 'false');
}

LIGHT_SETS.forEach((set, i) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'swatch';
  btn.setAttribute('aria-label', set.name);
  const n = set.colors.length;
  btn.style.background = `conic-gradient(${set.colors.map((c, j) => `${c} ${(j / n) * 100}% ${((j + 1) / n) * 100}%`).join(',')})`;
  btn.addEventListener('click', () => setLightSet(i, false, true));
  lightsGrid.appendChild(btn);
});
FX.forEach((fx, i) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'fx-chip';
  btn.textContent = fx.name;
  btn.addEventListener('click', () => setEffect(i, true));
  fxList.appendChild(btn);
});
autoBtn.addEventListener('click', () => setAuto(!autoOn));
lightsBtn.addEventListener('click', () => {
  const open = lightsPanel.classList.toggle('open');
  lightsBtn.classList.toggle('active', open);
  lightsBtn.setAttribute('aria-expanded', String(open));
});
setLightSet(DEFAULT_LIGHTS, true);

/* ============================================================
   BOLAS: texturas bola1..bola4.jpg + bolas lisas
   ============================================================ */
const BOLA_PATH = '/textures/arbol-navidad/'; // ruta absoluta: archivos en public/textures/arbol-navidad/
const BOLA_FILES = ['bola1.jpg', 'bola2.jpg', 'bola3.jpg', 'bola4.jpg'];
const BOLA_FALLBACK = [0xb3202a, 0x1f7a4d, 0xc9d2e0, 0x1b2f6b]; // color mientras carga (o si falla la imagen)
const PER_TEXTURE = LOW ? 4 : 6; // bolas por cada textura
const PLAIN = LOW ? 6 : 10;      // bolas lisas

const ballGeo = new THREE.SphereGeometry(0.2, 24, 24);
const texLoader = new THREE.TextureLoader();
const maxAniso = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);

// Reparte las bolas de una malla por la superficie del árbol
function placeBalls(mesh, count, colors) {
  for (let k = 0; k < count; k++) {
    const t = rand(0.05, 0.9), y = tierY(t) - rand(0, 0.4), a = rand(0, 6.28), r = envR(y) * rand(0.7, 0.95) + 0.25;
    dummy.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
    dummy.rotation.set(rand(-0.3, 0.3), rand(0, 6.28), 0); // cada bola muestra otra zona del patrón
    dummy.scale.setScalar(rand(0.85, 1.25));
    dummy.updateMatrix();
    mesh.setMatrixAt(k, dummy.matrix);
    if (colors) mesh.setColorAt(k, color.setHex(colors[k % colors.length]));
  }
  dummy.rotation.set(0, 0, 0);
  mesh.frustumCulled = false;
  scene.add(mesh);
}

// Bolas con textura
BOLA_FILES.forEach((file, i) => {
  const mat = new THREE.MeshStandardMaterial({ color: BOLA_FALLBACK[i % BOLA_FALLBACK.length], roughness: 0.35, metalness: 0.3 });
  texLoader.load(
    BOLA_PATH + file,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
      mat.map = tex;
      mat.emissiveMap = tex;      // un poco de luz propia para que no se apaguen en la oscuridad
      mat.emissive.set(0xffffff);
      mat.emissiveIntensity = 0.45;
      mat.color.set(0xffffff);
      mat.needsUpdate = true;
    },
    undefined,
    () => console.warn('No se pudo cargar la textura', BOLA_PATH + file)
  );
  placeBalls(new THREE.InstancedMesh(ballGeo, mat, PER_TEXTURE), PER_TEXTURE);
});

// Bolas lisas (dorada, plateada, roja, azul)
placeBalls(
  new THREE.InstancedMesh(ballGeo, new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.35, emissive: 0x222222 }), PLAIN),
  PLAIN,
  [0xf2b632, 0xdfe6f2, 0xd62839, 0x3a86ff]
);

const hitTargets = [];
const cards = [];
const cardTiers = [0.2, 0.45, 0.66, 0.33];
const frameMat = new THREE.MeshStandardMaterial({ color: 0xf7f1e3, emissive: 0x2a2620, roughness: 0.8 });
const pinMat = new THREE.MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.9 });
const stringMat = new THREE.LineBasicMaterial({ color: 0xe9dcc0 });
const loader = new THREE.TextureLoader();
loader.setCrossOrigin('anonymous');

photos.forEach((src, k) => {
  const a = k * 2.4 + 0.5, y = tierY(cardTiers[k % 4]), r = envR(y) * 0.9 + 0.45;

  // pivote en la rama: de aquí cuelga la tarjeta y se balancea
  const pivot = new THREE.Group();
  pivot.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
  pivot.rotation.y = Math.atan2(Math.cos(a), Math.sin(a)); // la foto mira hacia afuera

  const card = new THREE.Group();
  card.position.y = -0.62;
  card.scale.setScalar(1.25);

  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.78, 0.025), frameMat);
  const photoMat = new THREE.MeshBasicMaterial({ color: 0xcfc6b2 });
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), photoMat);
  photo.position.set(0, 0.07, 0.014);
  const pin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.06), pinMat);
  pin.position.y = 0.43;
  const cord = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.5, 0), new THREE.Vector3(0, 0.5 + 0.45, 0)]),
    stringMat
  );
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffd47a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.scale.setScalar(1.6);
  halo.position.z = -0.06;
  const hit = new THREE.Mesh(new THREE.SphereGeometry(0.62, 8, 8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  hit.userData = { index: k };

  card.add(frame, photo, pin, cord, halo, hit);
  pivot.add(card);
  scene.add(pivot);
  hitTargets.push(hit);
  cards.push({ pivot, halo, phase: rand(0, 6.28), opened: false });

  // foto real recortada en cuadrado (cover)
  loader.load(src, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    const asp = tex.image.width / tex.image.height;
    if (asp > 1) { tex.repeat.x = 1 / asp; tex.offset.x = (1 - 1 / asp) / 2; }
    else { tex.repeat.y = asp; tex.offset.y = (1 - asp) / 2; }
    photoMat.map = tex; photoMat.color.set(0xffffff); photoMat.needsUpdate = true;
  });
});

/* ============================================================
   ESTRELLA DE LA PUNTA
   ============================================================ */
const starShape = new THREE.Shape();
for (let i = 0; i < 10; i++) {
  const rr = i % 2 ? 0.2 : 0.5, aa = (i / 10) * Math.PI * 2 + Math.PI / 2;
  i ? starShape.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr) : starShape.moveTo(Math.cos(aa) * rr, Math.sin(aa) * rr);
}
starShape.closePath();
const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.16, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 1 });
starGeo.translate(0, 0, -0.08);
const starMat = new THREE.MeshStandardMaterial({ color: 0xffd24a, emissive: 0xffa800, emissiveIntensity: 0.9, roughness: 0.3, metalness: 0.5 });
const star = new THREE.Mesh(starGeo, starMat);
star.position.y = TOP_Y + 0.65;
const starGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffcf5a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
starGlow.scale.setScalar(2.6);
star.add(starGlow);
const starLight = new THREE.PointLight(0xffc860, 10, 7, 2);
star.add(starLight);
scene.add(star);

/* ============================================================
   REGALOS, SUELO, NIEVE Y ESTRELLAS DE FONDO
   ============================================================ */
function gift(x, z, s, col, rotY, y = 0) {
  const g = new THREE.Group();
  g.position.set(x, -4 + y + s / 2, z); g.rotation.y = rotY;
  g.add(new THREE.Mesh(new THREE.BoxGeometry(s, s, s), new THREE.MeshStandardMaterial({ color: col, roughness: 0.6 })));
  const rib = new THREE.MeshStandardMaterial({ color: 0xffd24a, roughness: 0.4, metalness: 0.4 });
  g.add(new THREE.Mesh(new THREE.BoxGeometry(s * 1.02, s * 1.02, s * 0.16), rib));
  g.add(new THREE.Mesh(new THREE.BoxGeometry(s * 0.16, s * 1.02, s * 1.02), rib));
  scene.add(g);
}
gift(2.2, 1.6, 0.9, 0xc1121f, 0.3);
gift(-2.3, 1.9, 0.7, 0x2a6fdb, -0.4);
gift(0.9, -2.6, 0.8, 0x1b8a4b, 0.8);
gift(-1.6, -1.9, 0.55, 0x9b5de5, 0.1);
gift(3.0, -0.4, 0.75, 0xf2b632, 0.5);
gift(-0.6, 2.9, 0.6, 0xd62839, 0.2);
gift(-2.9, -0.3, 0.8, 0x2ec4b6, -0.7);
gift(2.2, 1.6, 0.5, 0x2a6fdb, 0.9, 0.9);     // encima, y = 0.9 (el tamaño del de abajo)
gift(-2.3, 1.9, 0.4, 0x1b8a4b, -0.5, 0.7);    // encima, y = 0.7
gift(0.9, -2.6, 0.5, 0xf2b632, 0.6, 0.8);     // encima, y = 0.8
gift(-1.6, -1.9, 0.35, 0xd62839, 0.2, 0.6);   // encima, y = 0.6
const ground = new THREE.Mesh(new THREE.CircleGeometry(10, 48), new THREE.MeshStandardMaterial({ color: 0xdfe9ff, roughness: 1, emissive: 0x16203c }));
ground.rotation.x = -Math.PI / 2; ground.position.y = -4;
scene.add(ground);

const SNOW = LOW ? 500 : 1100;
const snowPos = new Float32Array(SNOW * 3), snowSpd = new Float32Array(SNOW);
for (let i = 0; i < SNOW; i++) {
  snowPos.set([rand(-14, 14), rand(-4, 14), rand(-14, 14)], i * 3);
  snowSpd[i] = rand(0.6, 1.6);
}
const snowGeo = new THREE.BufferGeometry();
snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));
const snow = new THREE.Points(snowGeo, new THREE.PointsMaterial({
  size: 0.16, map: glowTex, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false,
}));
snow.frustumCulled = false;
scene.add(snow);

const bgStars = new THREE.BufferGeometry();
const bgPos = new Float32Array(400 * 3);
for (let i = 0; i < 400; i++) {
  const v = new THREE.Vector3(rand(-1, 1), rand(0.05, 1), rand(-1, 1)).normalize().multiplyScalar(70);
  bgPos.set([v.x, v.y, v.z], i * 3);
}
bgStars.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
scene.add(new THREE.Points(bgStars, new THREE.PointsMaterial({ color: 0xffeebb, size: 0.35, fog: false, transparent: true, opacity: 0.8 })));

/* ============================================================
   CONTROLES LIBRES (arrastrar, pellizcar, rueda)
   ============================================================ */
const el = renderer.domElement;
const target = new THREE.Vector3(0, 0.7, 0);
let theta = 0.6, phi = 1.3, radius = innerWidth < innerHeight ? 24 : 17;
let tTheta = theta, tPhi = phi, tRadius = radius, idle = 0;
const ptrs = new Map();
let pinchDist = 0, down = null;
const pinchNow = () => { const p = [...ptrs.values()]; return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); };

el.addEventListener('pointerdown', (e) => {
  closeLights();
  el.setPointerCapture(e.pointerId);
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptrs.size === 1) down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false };
  if (ptrs.size === 2) { pinchDist = pinchNow(); down.moved = true; }
  idle = 0;
});
el.addEventListener('pointermove', (e) => {
  const p = ptrs.get(e.pointerId);
  if (!p) return;
  const dx = e.clientX - p.x, dy = e.clientY - p.y;
  p.x = e.clientX; p.y = e.clientY;
  if (ptrs.size === 1) {
    tTheta -= dx * 0.006;
    tPhi = clamp(tPhi - dy * 0.005, 0.45, 1.65);
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) down.moved = true;
  } else if (ptrs.size === 2) {
    const d = pinchNow();
    tRadius = clamp((tRadius * pinchDist) / d, 6, 30);
    pinchDist = d;
  }
  idle = 0;
});
const endPtr = (e) => {
  ptrs.delete(e.pointerId);
  if (!ptrs.size && down && !down.moved && performance.now() - down.t < 500 && e.type === 'pointerup') pick(e);
  if (!ptrs.size) down = null;
};
el.addEventListener('pointerup', endPtr);
el.addEventListener('pointercancel', endPtr);
el.addEventListener('wheel', (e) => { e.preventDefault(); tRadius = clamp(tRadius + e.deltaY * 0.01, 6, 30); idle = 0; }, { passive: false });

/* ============================================================
   INTERACCIÓN: tocar adornos y estrella
   ============================================================ */
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
let opened = 0, starPulse = 0;

function updateProgress() {
  if (photos.length && opened === photos.length) {
    hintEl.textContent = '¡Descubriste todos los recuerdos!';
    hintEl.classList.remove('is-gone');
    starPulse = 1;
  }
}

function pick(e) {
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(hitTargets, false)[0];
  if (!hit) return;
  hintEl.classList.add('is-gone');
  const c = cards[hit.object.userData.index];
  if (!c.opened) { c.opened = true; opened++; updateProgress(); }
  abrirGaleria(hit.object.userData.index);
}

if (!photos.length) hintEl.hidden = true;
setTimeout(() => hintEl.classList.add('is-gone'), 14000);

/* ============================================================
   ANIMACIÓN
   ============================================================ */
const clock = new THREE.Clock();
const gcol = new THREE.Color(), WHITE = new THREE.Color(0xffffff);

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05), time = clock.elapsedTime;

  // Cámara: orbita sola si nadie la toca
  idle += dt;
  if (idle > 3) tTheta += dt * 0.15;
  theta += (tTheta - theta) * 0.1; phi += (tPhi - phi) * 0.1; radius += (tRadius - radius) * 0.1;
  camera.position.set(
    target.x + radius * Math.sin(phi) * Math.sin(theta),
    target.y + radius * Math.cos(phi),
    target.z + radius * Math.sin(phi) * Math.cos(theta)
  );
  camera.lookAt(target);

  // Modo Auto: cambia solo de colores y de efecto cada cierto tiempo
  if (autoOn) {
    autoSetT += dt; autoFxT += dt;
    if (autoSetT > AUTO_SET_SEC) { autoSetT = 0; setLightSet((lightIndex + 1) % LIGHT_SETS.length); }
    if (autoFxT > AUTO_FX_SEC) { autoFxT = 0; setEffect((fxCur + 1) % FX.length); }
  }

  // Luces de la guirnalda: colores con transición suave + efecto de parpadeo
  fxMix = Math.min(1, fxMix + dt / 0.7);
  const fxNow = FX[fxCur].f, fxOld = FX[fxPrev].f;
  const haloAttr = glowGeo.attributes.color, coreAttr = coreGeo.attributes.color;
  for (let k = 0; k < BULBS; k++) {
    bulbCur[k].lerp(bulbTarget[k], Math.min(1, dt * 6));
    const u = k / (BULBS - 1);
    let b = fxNow(k, u, time, bulbPhase[k]);
    if (fxMix < 1) b = fxOld(k, u, time, bulbPhase[k]) * (1 - fxMix) + b * fxMix;
    gcol.copy(bulbCur[k]).multiplyScalar(b);
    bulbMesh.setColorAt(k, gcol);
    gcol.multiplyScalar(0.6);                                  // halo: color suave
    haloAttr.setXYZ(k, gcol.r, gcol.g, gcol.b);
    gcol.copy(bulbCur[k]).lerp(WHITE, 0.55).multiplyScalar(b); // núcleo: casi blanco
    coreAttr.setXYZ(k, gcol.r, gcol.g, gcol.b);
  }
  bulbMesh.instanceColor.needsUpdate = true;
  haloAttr.needsUpdate = true;
  coreAttr.needsUpdate = true;

  // Tarjetas: se balancean y brillan hasta que se abren
  cards.forEach((c) => {
    c.pivot.rotation.z = Math.sin(time * 1.1 + c.phase) * 0.07;
    c.pivot.rotation.x = Math.sin(time * 0.8 + c.phase) * 0.04;
    c.halo.visible = !c.opened;
    c.halo.scale.setScalar(1.5 + 0.35 * Math.sin(time * 3 + c.phase));
  });

  // Estrella
  star.rotation.y = time * 0.8;
  const pulse = 1 + (starPulse ? 0.25 + 0.2 * Math.sin(time * 5) : 0.06 * Math.sin(time * 2));
  starGlow.scale.setScalar(2.6 * pulse);
  starMat.emissiveIntensity = 0.9 * pulse;

  // Nieve
  for (let i = 0; i < SNOW; i++) {
    const p = i * 3;
    snowPos[p + 1] -= snowSpd[i] * dt;
    snowPos[p] += Math.sin(time + i) * 0.15 * dt;
    if (snowPos[p + 1] < -4) snowPos[p + 1] = 14;
  }
  snowGeo.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});