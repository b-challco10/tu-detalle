import * as THREE from 'three';

/* ============================================================
   DATOS DEL EDITOR + DOM
   ============================================================ */
const data = window.__TUDETALLE_DATA__ || {};
const $ = (id) => document.getElementById(id);
const hintEl = $('hint'), bubbleEl = $('bubble');
const audioEl = $('bgMusic'), musicBtn = $('musicBtn');
const shakeBtn = $('shakeBtn'), ballBtn = $('ballBtn');

const NOMBRE = (data.nombre || '').trim().slice(0, 28);
const MENSAJE = (data.mensaje || '').trim().slice(0, 90);

/* ============================================================
   MÚSICA (por defecto + inicio automático)
   ============================================================ */
const DEFAULT_MUSIC = '/audio/navidad.mp3';
let userPaused = false;

audioEl.src = data.bgMusic || DEFAULT_MUSIC;
audioEl.volume = 0.55;

function syncMusicBtn() {
  const playing = !audioEl.paused;
  musicBtn.classList.toggle('playing', playing);
  musicBtn.setAttribute('aria-pressed', String(playing));
}
audioEl.addEventListener('play', syncMusicBtn);
audioEl.addEventListener('pause', syncMusicBtn);

const unlockAudio = (e) => {
  if (e.target.closest('#musicBtn')) return;
  if (!userPaused) audioEl.play().catch(() => {});
};
audioEl.addEventListener('play', () => removeEventListener('pointerup', unlockAudio));
addEventListener('pointerup', unlockAudio);
audioEl.play().catch(() => {});

musicBtn.addEventListener('click', () => {
  if (audioEl.paused) { userPaused = false; audioEl.play().catch(() => {}); }
  else { userPaused = true; audioEl.pause(); }
});

/* ============================================================
   UTILIDADES
   ============================================================ */
const LOW = (navigator.hardwareConcurrency || 4) <= 4 || Math.min(innerWidth, innerHeight) < 420;
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const angDiff = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
const UP = new THREE.Vector3(0, 1, 0), ID_Q = new THREE.Quaternion();

function canvasTex(c, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  return canvasTex(c, false);
}
const glowTex = glowTexture();

/* Grano de nieve para el relieve */
function noiseTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const im = g.createImageData(128, 128);
  for (let i = 0; i < im.data.length; i += 4) {
    im.data[i] = im.data[i + 1] = im.data[i + 2] = 120 + Math.random() * 135;
    im.data[i + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  const t = canvasTex(c, false);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 3);
  return t;
}

/* ============================================================
   ESCENA
   ============================================================ */
const scene = new THREE.Scene();
(() => { // fondo: cielo nocturno degradado
  const c = document.createElement('canvas');
  c.width = 4; c.height = 256;
  const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, '#060a1c'); gr.addColorStop(0.55, '#14214f'); gr.addColorStop(1, '#2a3573');
  g.fillStyle = gr; g.fillRect(0, 0, 4, 256);
  scene.background = canvasTex(c);
})();

const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 200);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: !LOW });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, LOW ? 1.5 : 2));
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0x8fa3d9, 0.8));
scene.add(new THREE.HemisphereLight(0xbcd2ff, 0x2a2f55, 0.7));
const moon = new THREE.DirectionalLight(0xcfe0ff, 1.5);
moon.position.set(5, 8, 6);
scene.add(moon);
const headlight = new THREE.PointLight(0xffd9a0, 110, 0, 2); // luz cálida que acompaña a la cámara
camera.add(headlight);

// Estrellas lejanas
{
  const pos = new Float32Array(350 * 3);
  for (let i = 0; i < 350; i++) {
    const v = new THREE.Vector3(rand(-1, 1), rand(-0.2, 1), rand(-1, 1)).normalize().multiplyScalar(80);
    pos.set([v.x, v.y, v.z], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffeebb, size: 0.4, transparent: true, opacity: 0.85 })));
}

/* ============================================================
   GLOBO: base, placa con nombre, nieve del suelo y árboles
   ============================================================ */
const GC = new THREE.Vector3(0, 0.5, 0);   // centro del globo
const GR = 4.2;                              // radio del cristal
const FLOOR = -2.5;                          // plano superior de la base
const MOUND_R = 2.9, MOUND_H = 0.52;
const moundY = (x, z) => FLOOR + MOUND_H * Math.sqrt(Math.max(0, 1 - (x * x + z * z) / (MOUND_R * MOUND_R)));

const globe = new THREE.Group();
scene.add(globe);

const snowMat = new THREE.MeshStandardMaterial({ color: 0xf4f8ff, roughness: 0.95, bumpMap: noiseTexture(), bumpScale: 1.2 });
const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4a73a, roughness: 0.35, metalness: 0.6, emissive: 0x2a1c00 });

// Sombra suave bajo el globo
const shadow = new THREE.Mesh(
  new THREE.PlaneGeometry(11, 11),
  new THREE.MeshBasicMaterial({ map: glowTex, color: 0x000000, transparent: true, opacity: 0.6, depthWrite: false })
);
shadow.rotation.x = -Math.PI / 2; shadow.position.y = -3.92;
scene.add(shadow);

// Base
const baseMesh = new THREE.Mesh(
  new THREE.CylinderGeometry(3.5, 3.5, 1.4, 64),
  new THREE.MeshStandardMaterial({ color: 0x8d1f2c, roughness: 0.5, metalness: 0.1 })
);
baseMesh.position.y = -3.2;
globe.add(baseMesh);
[-2.5, -3.9].forEach((y) => {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.11, 10, 64), goldMat);
  ring.rotation.x = Math.PI / 2; ring.position.y = y;
  globe.add(ring);
});

// Placa con el nombre (texto dibujado en canvas)
const plaqueCanvas = document.createElement('canvas');
plaqueCanvas.width = 1536; plaqueCanvas.height = 232;
const plaqueTex = canvasTex(plaqueCanvas);
plaqueTex.anisotropy = 4;
function drawPlaque() {
  const g = plaqueCanvas.getContext('2d');
  const text = NOMBRE || 'Feliz Navidad';
  g.fillStyle = '#24130c'; g.fillRect(0, 0, 1536, 232);
  g.strokeStyle = '#d4a73a'; g.lineWidth = 8; g.strokeRect(14, 14, 1508, 204);
  let size = 150;
  g.font = `italic 600 ${size}px Fraunces, Georgia, serif`;
  while (g.measureText(text).width > 1340 && size > 40) { size -= 6; g.font = `italic 600 ${size}px Fraunces, Georgia, serif`; }
  g.fillStyle = '#f3d27a'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, 768, 122);
  plaqueTex.needsUpdate = true;
}
drawPlaque();
if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawPlaque);

const plaque = new THREE.Mesh(
  new THREE.CylinderGeometry(3.52, 3.52, 0.85, 40, 1, true, -0.8, 1.6),
  new THREE.MeshStandardMaterial({ map: plaqueTex, roughness: 0.5 })
);
plaque.position.y = -3.2;
globe.add(plaque);

// Montículo de nieve
const mound = new THREE.Mesh(new THREE.SphereGeometry(MOUND_R, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), snowMat);
mound.scale.y = MOUND_H / MOUND_R;
mound.position.y = FLOOR;
globe.add(mound);

// Pinitos decorativos
function pine(x, z, s) {
  const g = new THREE.Group();
  g.position.set(x, moundY(x, z) - 0.05, z);
  g.scale.setScalar(s);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.35, 6), new THREE.MeshStandardMaterial({ color: 0x4a2f1c }));
  trunk.position.y = 0.17;
  g.add(trunk);
  const green = new THREE.MeshStandardMaterial({ color: 0x24663f, roughness: 0.9, flatShading: true });
  [[0.55, 0.8, 0.65], [0.42, 0.7, 1.1], [0.3, 0.6, 1.5]].forEach(([r, h, y]) => {
    const c = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), green);
    c.position.y = y; g.add(c);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(r * 0.62, h * 0.5, 8), snowMat);
    cap.position.y = y + h * 0.27; g.add(cap);
  });
  globe.add(g);
}
pine(-2.0, -1.0, 0.8); pine(1.9, -1.3, 0.9); pine(-1.3, 1.9, 0.55); pine(2.1, 1.2, 0.6); pine(0.3, -2.2, 0.7);

/* ============================================================
   EL MUÑECO DE NIEVE
   ============================================================ */
const S = 1.2, MAN_Y = -2.0;
const man = new THREE.Group();
man.scale.setScalar(S); man.position.y = MAN_Y;
globe.add(man);

const ball = (r, y) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 28), snowMat); m.position.y = y; man.add(m); return m; };
const bottom = ball(1.0, 0.95);
const middle = ball(0.75, 2.45);

const coalMat = new THREE.MeshStandardMaterial({ color: 0x15151a, roughness: 0.35 });
const twigMat = new THREE.MeshStandardMaterial({ color: 0x5a3a22, roughness: 1 });

// Botones de carbón
[0.45, 0.05, -0.35].forEach((dy) => {
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 12), coalMat);
  b.position.set(0, 2.45 + dy, Math.sqrt(0.75 * 0.75 - dy * dy));
  man.add(b);
});

// Bufanda
const scarfMat = new THREE.MeshStandardMaterial({ color: 0xc1121f, roughness: 0.9 });
const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.14, 12, 32), scarfMat);
scarf.rotation.x = Math.PI / 2; scarf.position.y = 3.05;
man.add(scarf);
const tailPivot = new THREE.Group();
tailPivot.position.set(0.28, 3.0, 0.42);
const tail = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.85, 0.07), scarfMat);
tail.position.y = -0.4;
const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.1, 0.075), new THREE.MeshStandardMaterial({ color: 0xf1faee }));
stripe.position.y = -0.55;
tailPivot.add(tail, stripe);
tailPivot.rotation.z = 0.08;
man.add(tailPivot);

// Brazos de ramita (con pivote en el hombro para saludar)
function arm(side) {
  const pivot = new THREE.Group();
  pivot.position.set(0.68 * side, 2.6, 0);
  const a = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.05, 1.1, 6), twigMat);
  a.rotation.z = -Math.PI / 2 * side;
  a.position.x = 0.55 * side;
  [0.6, -0.6].forEach((rz) => {
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.03, 0.38, 5), twigMat);
    f.position.set(0.04 * rz, 0.28, 0); f.rotation.z = rz;
    a.add(f);
  });
  pivot.add(a);
  man.add(pivot);
  return pivot;
}
const armR = arm(1), armL = arm(-1);

// Cabeza: pivote (sacudida) > orientación (mira al puntero) > cara y sombrero
const headPivot = new THREE.Group();
headPivot.position.set(0, 3.55, 0);
man.add(headPivot);
const headLook = new THREE.Group();
headPivot.add(headLook);
const headSphere = new THREE.Mesh(new THREE.SphereGeometry(0.55, 40, 28), snowMat);
headLook.add(headSphere);

const HR2 = 0.55 * 0.55;
const eyes = [-1, 1].map((sd) => {
  const e = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), coalMat);
  e.position.set(0.2 * sd, 0.13, Math.sqrt(HR2 - 0.04 - 0.0169));
  e.scale.z = 0.6;
  headLook.add(e);
  return e;
});
for (let i = 0; i < 5; i++) { // sonrisa
  const x = -0.22 + i * 0.11, y = -0.23 + 0.07 * (x / 0.22) * (x / 0.22);
  const m = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), coalMat);
  m.position.set(x, y, Math.sqrt(Math.max(HR2 - x * x - y * y, 0)));
  headLook.add(m);
}
const nose = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.55, 12), new THREE.MeshStandardMaterial({ color: 0xff7a1a, roughness: 0.6 }));
nose.rotation.x = Math.PI / 2; nose.position.set(0, -0.02, 0.77);
headLook.add(nose);
[-1, 1].forEach((sd) => { // mejillas
  const ch = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), new THREE.MeshStandardMaterial({ color: 0xff9fb0, emissive: 0x552030, roughness: 1 }));
  ch.position.set(0.33 * sd, -0.07, 0.43); ch.scale.z = 0.3;
  headLook.add(ch);
});

// Sombrero de copa
const hat = new THREE.Group();
hat.position.set(0, 0.5, 0); hat.rotation.z = 0.12;
const hatMat = new THREE.MeshStandardMaterial({ color: 0x16161d, roughness: 0.6 });
const hatTop = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.55, 24), hatMat);
hatTop.position.y = 0.3;
const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.05, 28), hatMat);
const hatBand = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.1, 24), new THREE.MeshStandardMaterial({ color: 0xc1121f, roughness: 0.7 }));
hatBand.position.y = 0.1;
hat.add(hatTop, hatBrim, hatBand);
headLook.add(hat);

/* Cristal del globo (se añade al final para que se dibuje encima) */
const glass = new THREE.Mesh(
  new THREE.SphereGeometry(GR, 56, 40),
  new THREE.MeshPhysicalMaterial({ color: 0xcfe6ff, transparent: true, opacity: 0.13, roughness: 0.04, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false })
);
glass.position.copy(GC);
glass.renderOrder = 2;
globe.add(glass);

/* ============================================================
   NIEVE DENTRO DEL GLOBO (se revuelve al agitar)
   ============================================================ */
const FLAKES = LOW ? 450 : 900, FR = 3.7;
const fp = new Float32Array(FLAKES * 3), fv = new Float32Array(FLAKES * 3), ffall = new Float32Array(FLAKES);
function spawnFlake(i, top) {
  let x, y, z;
  do { x = rand(-1, 1); y = rand(-1, 1); z = rand(-1, 1); } while (x * x + y * y + z * z > 1);
  if (top) { fp.set([x * 2.4, GC.y + rand(3.0, 3.6), z * 2.4], i * 3); }
  else { fp.set([x * FR, GC.y + y * FR, z * FR], i * 3); }
  ffall[i] = rand(0.3, 0.75);
}
for (let i = 0; i < FLAKES; i++) spawnFlake(i, false);
const flakeGeo = new THREE.BufferGeometry();
flakeGeo.setAttribute('position', new THREE.BufferAttribute(fp, 3));
const flakes = new THREE.Points(flakeGeo, new THREE.PointsMaterial({
  size: 0.2, map: glowTex, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false,
}));
flakes.frustumCulled = false; flakes.renderOrder = 3;
scene.add(flakes);

/* Salpicadura de nieve (cuando le llega una bola) */
const BURST = 90;
const bp = new Float32Array(BURST * 3), bv = new Float32Array(BURST * 3), bc = new Float32Array(BURST * 3), blife = new Float32Array(BURST);
const burstGeo = new THREE.BufferGeometry();
burstGeo.setAttribute('position', new THREE.BufferAttribute(bp, 3));
burstGeo.setAttribute('color', new THREE.BufferAttribute(bc, 3));
const burst = new THREE.Points(burstGeo, new THREE.PointsMaterial({
  size: 0.16, map: glowTex, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
}));
burst.frustumCulled = false; burst.renderOrder = 3;
scene.add(burst);
let burstNext = 0;
function emit(n, center, spread, speed) {
  for (let k = 0; k < n; k++) {
    const i = burstNext; burstNext = (burstNext + 1) % BURST;
    bp.set([center.x + rand(-spread, spread), center.y + rand(-spread, spread), center.z + rand(-spread, spread)], i * 3);
    bv.set([rand(-1, 1) * speed, rand(0.2, 1) * speed, rand(-1, 1) * speed], i * 3);
    blife[i] = rand(0.7, 1.3);
  }
}

/* ============================================================
   BOLA DE NIEVE
   ============================================================ */
const snowball = new THREE.Mesh(new THREE.SphereGeometry(0.25, 20, 16), snowMat);
snowball.visible = false;
scene.add(snowball);
const sb = { on: false, t: 0, a: new THREE.Vector3(), b: new THREE.Vector3() };

function throwBall() {
  if (sb.on) return;
  const mw = new THREE.Vector3();
  middle.getWorldPosition(mw);
  sb.a.set(0.9, -0.8, -2.2); camera.localToWorld(sb.a);
  sb.b.copy(mw).add(camera.position.clone().sub(mw).normalize().multiplyScalar(0.95));
  sb.on = true; sb.t = 0; snowball.visible = true;
  ballBtn.disabled = true;
  hintEl.classList.add('is-gone');
}

/* ============================================================
   PERSONALIDAD: frases, reacciones, parpadeo, saludo
   ============================================================ */
const frases = ['¡Hola!', '¡Feliz Navidad!', '¡Qué frío hace!', '¡Dame un abrazo!', 'Me encanta la nieve'];
if (NOMBRE) frases.splice(1, 0, `¡Feliz Navidad, ${NOMBRE}!`);
if (MENSAJE) frases.splice(3, 0, MENSAJE);
const golpes = ['¡Ay, qué frío!', '¡Buena puntería!', '¡Eso no se hace!', '¡Guerra de nieve!'];
let fi = 0, gi = 0, bubbleTimer = null;

function say(text, ms = 2600) {
  bubbleEl.textContent = text;
  bubbleEl.classList.add('show');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => bubbleEl.classList.remove('show'), ms);
}

let time = 0, rt = 99, rkind = 'poke', waveUntil = 0, nextWave = 9, nextBlink = 2, blinkAt = -9;
let shakeAmp = 0;

function react(kind) {
  rt = 0; rkind = kind;
  if (kind === 'poke') waveUntil = time + 2.2;
}
function poke() {
  react('poke');
  say(frases[fi++ % frases.length]);
  hintEl.classList.add('is-gone');
}
function hitByBall() {
  const mw = new THREE.Vector3();
  middle.getWorldPosition(mw);
  emit(40, sb.b, 0.15, 3.2);
  emit(30, mw, 0.8, 1.4);
  react('hit');
  say(golpes[gi++ % golpes.length]);
}
function shakeGlobe() {
  shakeAmp = 1;
  for (let i = 0; i < FLAKES; i++) fv.set([rand(-4, 4), rand(2, 6), rand(-4, 4)], i * 3);
  react('hit');
  say('¡Uy, qué mareo!');
  hintEl.classList.add('is-gone');
}
shakeBtn.addEventListener('click', shakeGlobe);
ballBtn.addEventListener('click', throwBall);

/* ============================================================
   CONTROLES LIBRES (arrastrar, pellizcar, rueda) + mirada
   ============================================================ */
const el = renderer.domElement;
const target = new THREE.Vector3(0, 0.4, 0);
const fitRadius = () => Math.max(13.5, 10.8 / (innerWidth / innerHeight));
let theta = 0.25, phi = 1.35, radius = fitRadius();
let tTheta = theta, tPhi = phi, tRadius = radius;
const ptrs = new Map();
let pinchDist = 0, down = null;
const pinchNow = () => { const p = [...ptrs.values()]; return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); };

const look = { x: 0, y: 0.1, last: -99 };
const setLook = (e) => { look.x = (e.clientX / innerWidth) * 2 - 1; look.y = -(e.clientY / innerHeight) * 2 + 1; look.last = time; };

el.addEventListener('pointerdown', (e) => {
  el.setPointerCapture(e.pointerId);
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptrs.size === 1) down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false };
  if (ptrs.size === 2) { pinchDist = pinchNow(); down.moved = true; }
  setLook(e);
});
el.addEventListener('pointermove', (e) => {
  setLook(e);
  const p = ptrs.get(e.pointerId);
  if (!p) return;
  const dx = e.clientX - p.x, dy = e.clientY - p.y;
  p.x = e.clientX; p.y = e.clientY;
  if (ptrs.size === 1) {
    tTheta -= dx * 0.006;
    tPhi = clamp(tPhi - dy * 0.005, 0.5, 1.62);
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) down.moved = true;
  } else if (ptrs.size === 2) {
    const d = pinchNow();
    tRadius = clamp((tRadius * pinchDist) / d, 7, 30);
    pinchDist = d;
  }
});
const endPtr = (e) => {
  ptrs.delete(e.pointerId);
  if (!ptrs.size && down && !down.moved && performance.now() - down.t < 500 && e.type === 'pointerup') pick(e);
  if (!ptrs.size) down = null;
};
el.addEventListener('pointerup', endPtr);
el.addEventListener('pointercancel', endPtr);
el.addEventListener('wheel', (e) => { e.preventDefault(); tRadius = clamp(tRadius + e.deltaY * 0.01, 7, 30); }, { passive: false });

const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
const manParts = [bottom, middle, headSphere, hatTop, hatBrim];
function pick(e) {
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects([...manParts, baseMesh, plaque], false)[0];
  if (!hit) return;
  if (manParts.includes(hit.object)) poke(); else shakeGlobe();
}

/* ============================================================
   ANIMACIÓN
   ============================================================ */
const clock = new THREE.Clock();
const hp = new THREE.Vector3(), tp = new THREE.Vector3(), mtx = new THREE.Matrix4();
const qW = new THREE.Quaternion(), qP = new THREE.Quaternion(), qC = new THREE.Quaternion(), qT = new THREE.Quaternion();
const ndcLook = new THREE.Vector2();
const proj = new THREE.Vector3();
let armRv = -0.45, armLv = 0.45;

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  time += dt; rt += dt;

  // Cámara
  theta += (tTheta - theta) * 0.1; phi += (tPhi - phi) * 0.1; radius += (tRadius - radius) * 0.1;
  camera.position.set(
    target.x + radius * Math.sin(phi) * Math.sin(theta),
    target.y + radius * Math.cos(phi),
    target.z + radius * Math.sin(phi) * Math.cos(theta)
  );
  camera.lookAt(target);
  camera.updateMatrixWorld();

  // Agitado del globo
  shakeAmp *= Math.exp(-dt * 1.6);
  globe.rotation.z = Math.sin(time * 28) * shakeAmp * 0.06;
  globe.rotation.x = Math.cos(time * 23) * shakeAmp * 0.05;

  // El muñeco se va girando hacia quien lo mira
  man.rotation.y += angDiff(theta, man.rotation.y) * (1 - Math.exp(-dt * 1.5));

  // Reacciones (rebote al tocarlo, golpe al recibir una bola)
  const k = Math.exp(-3.2 * rt);
  const sq = Math.sin(rt * 20) * k * 0.1;
  const breathe = 1 + 0.01 * Math.sin(time * 1.6);
  man.scale.set(S * breathe * (1 - sq * 0.5), S * breathe * (1 + sq), S * breathe * (1 - sq * 0.5));
  man.position.y = MAN_Y + (rkind === 'poke' && rt < 0.5 ? Math.sin((rt / 0.5) * Math.PI) * 0.35 : 0);
  headPivot.rotation.z = rkind === 'hit' ? Math.sin(rt * 25) * k * 0.25 : 0;

  // Mirada: la cabeza sigue el dedo o el mouse (y si no hay, te mira a ti)
  if (time - look.last < 3) ndcLook.set(look.x, look.y); else ndcLook.set(0, 0.1);
  ray.setFromCamera(ndcLook, camera);
  headPivot.getWorldPosition(hp);
  ray.ray.at(camera.position.distanceTo(hp), tp);
  mtx.lookAt(tp, hp, UP);
  qW.setFromRotationMatrix(mtx);
  headPivot.parent.getWorldQuaternion(qP);
  qC.copy(qP).invert().multiply(qW);
  const ang = qC.angleTo(ID_Q);
  if (ang > 0.75) { qT.copy(ID_Q).slerp(qC, 0.75 / ang); qC.copy(qT); }
  headLook.quaternion.slerp(qC, 1 - Math.exp(-dt * 7));

  // Parpadeo
  if (time > nextBlink) { blinkAt = time; nextBlink = time + rand(2.2, 5); }
  const ey = time - blinkAt < 0.14 ? 0.12 : 1;
  eyes.forEach((e) => { e.scale.y += (ey - e.scale.y) * 0.6; });

  // Saludo automático de vez en cuando
  if (time > nextWave) { waveUntil = time + 2; nextWave = time + rand(9, 14); }
  const waving = time < waveUntil;
  const flail = Math.sin(rt * 18) * k * 0.5;
  armRv += ((waving ? 0.95 + Math.sin(time * 11) * 0.35 : -0.45 + Math.sin(time * 1.3) * 0.04) + flail - armRv) * (1 - Math.exp(-dt * 10));
  armLv += ((0.45 + Math.sin(time * 1.3 + 1) * 0.04) - flail - armLv) * (1 - Math.exp(-dt * 10));
  armR.rotation.z = armRv; armL.rotation.z = armLv;
  tailPivot.rotation.z = 0.08 + Math.sin(time * 2) * 0.06 + (rkind === 'hit' ? Math.sin(rt * 25) * k * 0.4 : 0);

  // Bola de nieve en vuelo
  if (sb.on) {
    sb.t += dt / 0.6;
    const u = Math.min(sb.t, 1);
    snowball.position.lerpVectors(sb.a, sb.b, u);
    snowball.position.y += Math.sin(u * Math.PI) * 1.2;
    snowball.rotation.x += dt * 9;
    if (u >= 1) { sb.on = false; snowball.visible = false; ballBtn.disabled = false; hitByBall(); }
  }

  // Nieve del globo
  const relax = 1 - Math.exp(-dt * 0.9);
  for (let i = 0; i < FLAKES; i++) {
    const p = i * 3;
    fv[p] += (Math.sin(time * 0.5 + i) * 0.15 - fv[p]) * relax;
    fv[p + 1] += (-ffall[i] - fv[p + 1]) * relax;
    fv[p + 2] += (Math.cos(time * 0.4 + i * 1.7) * 0.15 - fv[p + 2]) * relax;
    fp[p] += fv[p] * dt; fp[p + 1] += fv[p + 1] * dt; fp[p + 2] += fv[p + 2] * dt;
    const dx = fp[p] - GC.x, dy = fp[p + 1] - GC.y, dz = fp[p + 2] - GC.z;
    const d2 = dx * dx + dy * dy + dz * dz;
    if (d2 > FR * FR) { const s = FR / Math.sqrt(d2); fp[p] = GC.x + dx * s; fp[p + 1] = GC.y + dy * s; fp[p + 2] = GC.z + dz * s; fv[p] *= 0.5; fv[p + 1] *= 0.5; fv[p + 2] *= 0.5; }
    if (fp[p + 1] < moundY(fp[p], fp[p + 2]) + 0.02) spawnFlake(i, true);
  }
  flakeGeo.attributes.position.needsUpdate = true;

  // Salpicadura
  for (let i = 0; i < BURST; i++) {
    const p = i * 3;
    if (blife[i] > 0) {
      blife[i] -= dt;
      bv[p + 1] -= 4 * dt;
      bp[p] += bv[p] * dt; bp[p + 1] += bv[p + 1] * dt; bp[p + 2] += bv[p + 2] * dt;
      const f = clamp(blife[i], 0, 1);
      bc[p] = bc[p + 1] = bc[p + 2] = f;
    } else { bc[p] = bc[p + 1] = bc[p + 2] = 0; }
  }
  burstGeo.attributes.position.needsUpdate = true;
  burstGeo.attributes.color.needsUpdate = true;

  // Globo de diálogo siguiendo la cabeza
  if (bubbleEl.classList.contains('show')) {
    headPivot.getWorldPosition(proj);
    proj.y += 1.3;
    proj.project(camera);
    const x = clamp((proj.x * 0.5 + 0.5) * innerWidth, 80, innerWidth - 80);
    const y = clamp((-proj.y * 0.5 + 0.5) * innerHeight, 70, innerHeight - 20);
    bubbleEl.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
  }

  renderer.render(scene, camera);
}
animate();

setTimeout(() => { react('poke'); say('¡Hola!'); }, 1500);
setTimeout(() => hintEl.classList.add('is-gone'), 14000);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});