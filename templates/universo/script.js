import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

/* ========== DATA (TuDetalle) ========== */
function readData() {
  const raw = window.__TUDETALLE_DATA__ || {};
  return {
    title: raw.title || "",
    subtitle: raw.subtitle || "",
    message: raw.message || "",
    photo1: raw.photo1 || "",
    photo2: raw.photo2 || "",
    photo3: raw.photo3 || "",
    bgMusic: raw.bgMusic || "",
    primaryColor: raw.primaryColor || "#ff66aa",
    secondaryColor: raw.secondaryColor || "#88ccff",
  };
}

let data = readData();

/* Aplicar textos y colores al DOM */
function applyUI(d) {
  const titleEl = document.getElementById("title");
  const subtitleEl = document.getElementById("subtitle");
  const messageEl = document.getElementById("message");
  const panel = document.getElementById("panel");

  document.documentElement.style.setProperty("--primary", d.primaryColor || "#ff66aa");
  document.documentElement.style.setProperty("--secondary", d.secondaryColor || "#88ccff");

  if (d.title) {
    titleEl.textContent = d.title;
    titleEl.style.display = "";
  } else {
    titleEl.style.display = "none";
  }
  if (d.subtitle) {
    subtitleEl.textContent = d.subtitle;
    subtitleEl.style.display = "";
  } else {
    subtitleEl.style.display = "none";
  }
  if (d.message) {
    messageEl.textContent = d.message;
    messageEl.style.display = "";
  } else {
    messageEl.style.display = "none";
  }

  if (d.title || d.subtitle || d.message) {
    setTimeout(() => panel.classList.add("visible"), 350);
  }
}

/* Sincronizar imgs y audio ocultos (por si la plataforma inyecta por ID) */
function syncMediaElements(d) {
  const p1 = document.getElementById("photo1");
  const p2 = document.getElementById("photo2");
  const p3 = document.getElementById("photo3");
  const audioEl = document.getElementById("bgMusic");

  if (d.photo1 && p1) p1.src = d.photo1;
  if (d.photo2 && p2) p2.src = d.photo2;
  if (d.photo3 && p3) p3.src = d.photo3;
  if (d.bgMusic && audioEl) {
    audioEl.src = d.bgMusic;
  }
}

applyUI(data);
syncMediaElements(data);

/* Música */
const musicBtn = document.getElementById("musicBtn");
const audioEl = document.getElementById("bgMusic");
let audioReady = false;

if (data.bgMusic && audioEl) {
  audioEl.volume = 0.55;
  audioReady = true;
}

musicBtn.addEventListener("click", () => {
  if (!audioReady || !audioEl.src) return;
  if (audioEl.paused) {
    audioEl.play().catch(() => {});
    musicBtn.classList.add("playing");
  } else {
    audioEl.pause();
    musicBtn.classList.remove("playing");
  }
});

/* ========== THREE.JS ========== */
function hexToColor(hex) {
  try {
    return new THREE.Color(hex);
  } catch {
    return new THREE.Color(0xff66aa);
  }
}

const primaryCol = hexToColor(data.primaryColor);
const secondaryCol = hexToColor(data.secondaryColor);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);
scene.fog = new THREE.FogExp2(0x050510, 0.012);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 6, 14);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.35;
controls.enableZoom = true;
controls.zoomSpeed = 1.1;
controls.rotateSpeed = 0.7;
controls.maxPolarAngle = Math.PI * 0.85;
controls.minDistance = 4;
controls.maxDistance = 28;
controls.target.set(0, 0, 0);

const hintEl = document.getElementById("hint");
controls.addEventListener("start", () => {
  controls.autoRotate = false;
  if (hintEl) hintEl.classList.add("hidden");
});

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.75, 0.35, 0.15
);
composer.addPass(bloomPass);

/* Textura corazón */
function createHeartTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const cx = size / 2;
  const cy = size / 2 + 2;
  const s = size * 0.38;
  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.3);
  ctx.bezierCurveTo(cx, cy, cx - s, cy - s * 0.5, cx - s, cy - s * 1.1);
  ctx.bezierCurveTo(cx - s, cy - s * 1.7, cx, cy - s * 1.5, cx, cy - s * 0.9);
  ctx.bezierCurveTo(cx, cy - s * 1.5, cx + s, cy - s * 1.7, cx + s, cy - s * 1.1);
  ctx.bezierCurveTo(cx + s, cy - s * 0.5, cx, cy, cx, cy + s * 0.3);
  ctx.closePath();
  const grad = ctx.createRadialGradient(cx, cy - 4, 0, cx, cy, s * 1.4);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,180,220,0.95)");
  grad.addColorStop(0.7, "rgba(255,100,160,0.7)");
  grad.addColorStop(1, "rgba(255,60,120,0)");
  ctx.fillStyle = grad;
  ctx.fill();
  return new THREE.CanvasTexture(canvas);
}
const heartTexture = createHeartTexture();

/* Galaxia de corazones */
function crearUniversoDeAmor() {
  const grupo = new THREE.Group();
  const colores = [
    primaryCol.clone(),
    secondaryCol.clone(),
    new THREE.Color(0xff88cc),
    new THREE.Color(0xffaaee),
    new THREE.Color(0xcc88ff),
    new THREE.Color(0xff6699),
  ];

  const num = 9000;
  const radio = 5.2;
  const grosor = 1.1;
  const brazos = 4;
  const torsion = 1.55;

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(num * 3);
  const colors = new Float32Array(num * 3);
  const sizes = new Float32Array(num);

  for (let i = 0; i < num; i++) {
    const r = Math.random() * radio;
    const angulo = Math.random() * Math.PI * 2;
    const anguloTorsion = r * torsion;
    const anguloFinal = angulo + anguloTorsion;
    const probabilidadBrazo = Math.sin(angulo * brazos) * 0.5 + 0.5;
    const radioAjustado = r * (0.28 + 0.72 * probabilidadBrazo);

    const x = Math.cos(anguloFinal) * radioAjustado * 1.55;
    const z = Math.sin(anguloFinal) * radioAjustado * 1.75;
    const alturaFactor = 1 - (r / radio) * 0.55;
    const y = (Math.random() - 0.5) * grosor * 0.28 * alturaFactor;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const color = colores[Math.floor(Math.random() * colores.length)].clone();
    const brillo = 0.55 + 0.55 * (1 - r / radio);
    color.multiplyScalar(brillo + 0.25);

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    sizes[i] = 0.04 + Math.random() * 0.09;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.14,
    map: heartTexture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    vertexColors: true,
    sizeAttenuation: true,
    opacity: 0.92,
  });
  grupo.add(new THREE.Points(geometry, material));

  // Núcleo
  const nucleoCount = 600;
  const nucleoGeo = new THREE.BufferGeometry();
  const nucleoPos = new Float32Array(nucleoCount * 3);
  const nucleoCol = new Float32Array(nucleoCount * 3);
  for (let i = 0; i < nucleoCount; i++) {
    const r = Math.random() * 0.85;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    nucleoPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    nucleoPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.32;
    nucleoPos[i * 3 + 2] = r * Math.cos(phi);
    const c = primaryCol.clone().lerp(new THREE.Color(0xffcc88), 0.4);
    const b = 0.85 + Math.random() * 0.2;
    nucleoCol[i * 3] = c.r * b;
    nucleoCol[i * 3 + 1] = c.g * b * 0.75;
    nucleoCol[i * 3 + 2] = c.b * b * 0.55;
  }
  nucleoGeo.setAttribute("position", new THREE.BufferAttribute(nucleoPos, 3));
  nucleoGeo.setAttribute("color", new THREE.BufferAttribute(nucleoCol, 3));
  grupo.add(new THREE.Points(nucleoGeo, new THREE.PointsMaterial({
    size: 0.09,
    map: heartTexture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    vertexColors: true,
    sizeAttenuation: true,
    opacity: 0.85,
  })));

  return grupo;
}

const galaxia = crearUniversoDeAmor();
scene.add(galaxia);

/* Estrellas de fondo */
function crearEstrellasFondo() {
  const geometry = new THREE.BufferGeometry();
  const count = 3500;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 180;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 180;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 180;
    const c = Math.random() > 0.7 ? primaryCol : new THREE.Color(0xffffff);
    const b = 0.5 + Math.random() * 0.5;
    colors[i * 3] = c.r * b;
    colors[i * 3 + 1] = c.g * b;
    colors[i * 3 + 2] = c.b * b;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return new THREE.Points(geometry, new THREE.PointsMaterial({
    size: 0.09,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
    vertexColors: true,
    depthWrite: false,
  }));
}
scene.add(crearEstrellasFondo());

/* Fotos flotantes */
const photoGroup = new THREE.Group();
scene.add(photoGroup);
const loader = new THREE.TextureLoader();
const frames = [];

function getPhotoUrl(id) {
  // Prioridad: window.TUDETALLE_DATA → src del <img id="...">
  if (data[id]) return data[id];
  const el = document.getElementById(id);
  if (el && el.src && !el.src.endsWith(window.location.pathname) && el.src !== window.location.href) {
    return el.src;
  }
  return "";
}

function createPhotoFrame(url, index, total) {
  if (!url) return;
  const geo = new THREE.PlaneGeometry(1.6, 1.6);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);

  const borderGeo = new THREE.PlaneGeometry(1.72, 1.72);
  const borderMat = new THREE.MeshBasicMaterial({
    color: primaryCol,
    transparent: true,
    opacity: 0.55,
    side: THREE.DoubleSide,
  });
  const border = new THREE.Mesh(borderGeo, borderMat);
  border.position.z = -0.01;

  const group = new THREE.Group();
  group.add(border);
  group.add(mesh);

  const angle = (index / Math.max(total, 1)) * Math.PI * 2 + Math.PI / 4;
  const radius = 7.5 + (index % 2) * 1.2;
  group.position.set(
    Math.cos(angle) * radius,
    (Math.random() - 0.5) * 2.2,
    Math.sin(angle) * radius
  );
  group.lookAt(0, group.position.y, 0);

  group.userData = {
    baseY: group.position.y,
    phase: Math.random() * Math.PI * 2,
    speed: 0.4 + Math.random() * 0.35,
  };

  loader.load(
    url,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      mat.map = tex;
      mat.needsUpdate = true;
    },
    undefined,
    () => {}
  );

  frames.push(group);
  photoGroup.add(group);
}

const photoIds = ["photo1", "photo2", "photo3"];
const photoUrls = photoIds.map(getPhotoUrl).filter(Boolean);
photoUrls.forEach((url, i) => createPhotoFrame(url, i, photoUrls.length));

/* Hover sobre fotos */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let hoveredFrame = null;

window.addEventListener("pointermove", (e) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

/* Animación */
let time = 0;
function animar() {
  time += 0.008;
  galaxia.rotation.y += 0.0009;
  galaxia.rotation.x = Math.sin(time * 0.08) * 0.018;
  galaxia.rotation.z = Math.cos(time * 0.07) * 0.015;

  frames.forEach((f) => {
    f.position.y = f.userData.baseY + Math.sin(time * f.userData.speed + f.userData.phase) * 0.35;
    f.rotation.y += 0.002;
  });

  if (frames.length) {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(frames, true);
    if (intersects.length) {
      const obj = intersects[0].object.parent || intersects[0].object;
      if (hoveredFrame !== obj) {
        if (hoveredFrame) hoveredFrame.scale.setScalar(1);
        hoveredFrame = obj;
        hoveredFrame.scale.setScalar(1.18);
      }
    } else if (hoveredFrame) {
      hoveredFrame.scale.setScalar(1);
      hoveredFrame = null;
    }
  }

  controls.update();
  composer.render();
  requestAnimationFrame(animar);
}
animar();

/* Resize */
window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
  bloomPass.resolution.set(w, h);
});

/* Re-leer data por si la plataforma la inyecta un poco más tarde */
setTimeout(() => {
  const fresh = readData();
  const changed =
    fresh.title !== data.title ||
    fresh.subtitle !== data.subtitle ||
    fresh.message !== data.message ||
    fresh.photo1 !== data.photo1 ||
    fresh.photo2 !== data.photo2 ||
    fresh.photo3 !== data.photo3 ||
    fresh.bgMusic !== data.bgMusic ||
    fresh.primaryColor !== data.primaryColor ||
    fresh.secondaryColor !== data.secondaryColor;

  if (changed) {
    data = fresh;
    applyUI(data);
    syncMediaElements(data);
    // Re-crear fotos si llegaron tarde
    if (frames.length === 0) {
      const urls = ["photo1", "photo2", "photo3"].map(getPhotoUrl).filter(Boolean);
      urls.forEach((url, i) => createPhotoFrame(url, i, urls.length));
    }
    if (data.bgMusic && audioEl && !audioEl.src) {
      audioEl.src = data.bgMusic;
      audioReady = true;
    }
  }
}, 800);

setInterval(() => {
  const fresh = readData();

  const changed =
    JSON.stringify(fresh) !== JSON.stringify(data);

  if (changed) {
    data = fresh;

    console.log("Datos actualizados:", data);

    applyUI(data);
    syncMediaElements(data);
  }
}, 500);