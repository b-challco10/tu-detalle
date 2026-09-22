/* ============================================================
   IMPORT DE THREE.JS
   ============================================================ */
import * as THREE from 'three';

/* ============================================================
   DATOS DINÁMICOS (vienen del editor de la plataforma)
   ============================================================ */
const data = window.__TUDETALLE_DATA__ || {};

/* ============================================================
   MENSAJES PREDETERMINADOS
   ============================================================ */
const mensajes = [
  "Brillas más que todas las luces de este pino juntas.",
  "Te regalaría un diciembre eterno si pudiera envolverlo.",
  "Que esta Navidad te traiga tantas alegrías como estrellas hay en el cielo.",
  "Cada puntito de luz de este pino es un deseo que pido por ti.",
  "No hay árbol de Navidad más bonito que el brillo de tus ojos.",
];

/* ============================================================
   ELEMENTOS DEL DOM
   ============================================================ */
const tituloEl  = document.getElementById("titulo");
const revealBtn = document.getElementById("revealBtn");
const card      = document.getElementById("card");
const cardText  = document.getElementById("cardText");
const closeCard = document.getElementById("closeCard");

const audioEl   = document.getElementById("bgMusic");
const musicBtn  = document.getElementById("musicBtn");

const galleryBtn    = document.getElementById("galleryBtn");
const galleryModal  = document.getElementById("galleryModal");
const closeGallery  = document.getElementById("closeGallery");
const carouselTrack = document.getElementById("carouselTrack");
const dotsContainer = document.getElementById("dots");
const prevBtn       = document.getElementById("prevBtn");
const nextBtn       = document.getElementById("nextBtn");

/* ============================================================
   TEXTOS PERSONALIZADOS
   ============================================================ */
if (data.titulo) {
  tituloEl.textContent = data.titulo;
} else {
  tituloEl.textContent = "Un pino brillante para alegrar tu Navidad";
}

/* ============================================================
   MENSAJE DE LA TARJETA (efecto máquina de escribir)
   ============================================================ */
const VELOCIDAD_ESCRITURA = 35;
let temporizadorEscritura = null;

function elegirMensaje() {
  if (data.subtitulo && data.subtitulo.trim() !== "") {
    return data.subtitulo;
  }
  const indice = Math.floor(Math.random() * mensajes.length);
  return mensajes[indice];
}

function escribirTexto(texto) {
  clearInterval(temporizadorEscritura);
  cardText.textContent = "";
  let posicion = 0;

  temporizadorEscritura = setInterval(() => {
    posicion += 1;
    cardText.textContent = texto.slice(0, posicion);

    if (posicion >= texto.length) {
      clearInterval(temporizadorEscritura);
    }
  }, VELOCIDAD_ESCRITURA);
}

function abrirTarjeta() {
  card.classList.add("is-visible");
  escribirTexto(elegirMensaje());
}

function cerrarTarjeta() {
  clearInterval(temporizadorEscritura);
  card.classList.remove("is-visible");
}

function alternarTarjeta() {
  if (card.classList.contains("is-visible")) {
    cerrarTarjeta();
  } else {
    abrirTarjeta();
  }
}

revealBtn.addEventListener("click", alternarTarjeta);
closeCard.addEventListener("click", cerrarTarjeta);

/* ============================================================
   MÚSICA DE FONDO
   ============================================================ */
if (data.bgMusic && audioEl) {
  audioEl.src = data.bgMusic;
  audioEl.volume = 0.55;
}

musicBtn.addEventListener("click", () => {
  if (!audioEl || !audioEl.src) return;
  if (audioEl.paused) {
    audioEl.play().catch(() => {});
    musicBtn.classList.add("playing");
  } else {
    audioEl.pause();
    musicBtn.classList.remove("playing");
  }
});

/* ============================================================
   GALERÍA / CARRUSEL (4 fotos)
   ============================================================ */
const photos = [
  data.photo1,
  data.photo2,
  data.photo3,
  data.photo4,
].filter(Boolean);

let currentIndex = 0;

if (photos.length === 0) {
  galleryBtn.classList.add("hidden");
} else {
  photos.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Recuerdo ${i + 1}`;
    img.loading = "lazy";

    slide.appendChild(img);
    carouselTrack.appendChild(slide);

    const dot = document.createElement("div");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
}

function updateCarousel() {
  carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
  document.querySelectorAll(".dot").forEach((d, i) => {
    d.classList.toggle("active", i === currentIndex);
  });
}

function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % photos.length;
  updateCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + photos.length) % photos.length;
  updateCarousel();
}

prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

galleryBtn.addEventListener("click", () => {
  galleryModal.classList.add("open");
});

closeGallery.addEventListener("click", () => {
  galleryModal.classList.remove("open");
});

galleryModal.addEventListener("click", (e) => {
  if (e.target === galleryModal) {
    galleryModal.classList.remove("open");
  }
});

// Swipe en móvil
let touchStartX = 0;
carouselTrack.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carouselTrack.addEventListener("touchend", (e) => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 50) {
    if (diff < 0) nextSlide();
    else prevSlide();
  }
}, { passive: true });

/* ============================================================
   ESCENA 3D — PINO NAVIDEÑO
   ============================================================ */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1a);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.domElement.style.position = "fixed";
renderer.domElement.style.inset = "0";
renderer.domElement.style.zIndex = "0";
document.body.appendChild(renderer.domElement);

const vertices = [];
const colors = [];

const height = 8;
const baseRadius = 3;
const layers = 80;
const pointsPerLayer = 100;

const colorPalette = [
  new THREE.Color(0x44ff44),
  new THREE.Color(0x44ddff),
];

console.log('Generando pino...');

for (let i = 0; i <= layers; i++) {
  const t = i / layers;
  const radius = baseRadius * (1 - t) + 0.1;
  const y = -height / 2 + t * height;
  const pointsInLayer = Math.floor(pointsPerLayer * (0.5 + 0.5 * (1 - t)));

  for (let j = 0; j < pointsInLayer; j++) {
    const angle =
      (j / pointsInLayer) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    const rVariation = radius * (0.85 + Math.random() * 0.3);
    const x = Math.cos(angle) * rVariation;
    const z = Math.sin(angle) * rVariation;
    const yVariation = y + (Math.random() - 0.5) * 0.15;

    vertices.push(x, yVariation, z);
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors.push(color.r, color.g, color.b);
  }
}

for (let i = 0; i < 80; i++) {
  const angle = Math.random() * Math.PI * 2;
  const distance = baseRadius + 0.5 + Math.random() * 2;
  const y = -height / 2 + Math.random() * height;

  const x = Math.cos(angle) * distance;
  const z = Math.sin(angle) * distance;

  vertices.push(x, y, z);
  const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  colors.push(color.r * 0.5, color.g * 0.5, color.b * 0.5);
}

console.log(`Generados ${vertices.length / 3} puntos`);

const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(vertices, 3)
);
geometry.setAttribute(
  'color',
  new THREE.Float32BufferAttribute(colors, 3)
);

const material = new THREE.PointsMaterial({
  size: 0.15,
  vertexColors: true,
  transparent: true,
  opacity: 0.95,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
  depthWrite: false,
});

const points = new THREE.Points(geometry, material);
scene.add(points);

const starVertices = [];
const starColors = [];

const outerRadius = 0.45;
const innerRadius = 0.18;
const starY = height / 2 + 0.45;
const starDepth = 0.06;

for (let i = 0; i < 5; i++) {
  const a1 = ((i * 72 - 90) * Math.PI) / 180;
  const a2 = ((i * 72 + 36 - 90) * Math.PI) / 180;
  const a3 = (((i + 1) * 72 - 90) * Math.PI) / 180;

  const p1 = new THREE.Vector2(
    Math.cos(a1) * outerRadius,
    Math.sin(a1) * outerRadius
  );

  const p2 = new THREE.Vector2(
    Math.cos(a2) * innerRadius,
    Math.sin(a2) * innerRadius
  );

  const p3 = new THREE.Vector2(
    Math.cos(a3) * outerRadius,
    Math.sin(a3) * outerRadius
  );

  for (let t = 0; t <= 1; t += 0.05) {
    const x = THREE.MathUtils.lerp(p1.x, p2.x, t);
    const y = THREE.MathUtils.lerp(p1.y, p2.y, t);

    starVertices.push(x, starY + y, (Math.random() - 0.5) * starDepth);
    starColors.push(1, 1, 0.2);
  }

  for (let t = 0; t <= 1; t += 0.05) {
    const x = THREE.MathUtils.lerp(p2.x, p3.x, t);
    const y = THREE.MathUtils.lerp(p2.y, p3.y, t);

    starVertices.push(x, starY + y, (Math.random() - 0.5) * starDepth);
    starColors.push(1, 1, 0.2);
  }
}

const starShapeGeometry = new THREE.BufferGeometry();
starShapeGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(starVertices, 3)
);
starShapeGeometry.setAttribute(
  'color',
  new THREE.Float32BufferAttribute(starColors, 3)
);

const starShapeMaterial = new THREE.PointsMaterial({
  size: 0.18,
  vertexColors: true,
  transparent: true,
  opacity: 1,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const topStar = new THREE.Points(starShapeGeometry, starShapeMaterial);
points.add(topStar);

const starGeometry = new THREE.BufferGeometry();
const starCount = 500;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  starPositions[i] = (Math.random() - 0.5) * 100;
}
starGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(starPositions, 3)
);

const starMaterial = new THREE.PointsMaterial({
  color: 0xffd700,
  size: 0.1,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

camera.position.set(8, 2, 12);
camera.lookAt(0, 0, 0);

console.log('✅ Pino generado correctamente');

function animate() {
  const t = Date.now() * 0.004;

  if (topStar.material) {
    topStar.material.size = 0.3 + Math.sin(t) * 0.05;
  }

  requestAnimationFrame(animate);

  points.rotation.y += 0.005;
  stars.rotation.y += 0.0005;
  stars.rotation.x += 0.0002;

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});