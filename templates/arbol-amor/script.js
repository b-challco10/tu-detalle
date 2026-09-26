/* ============================================================
   DATOS DINÁMICOS
   ============================================================ */
const data = window.__TUDETALLE_DATA__ || {};

const mensajesDefault = [
  "Como este árbol que echa raíces profundas, mi amor por ti no ha parado de crecer desde que llegaste a mi mundo.",
  "Cada corazón que florece en estas ramas representa un recuerdo, una sonrisa y una de las miles de razones por las que te elijo.",
  "Gracias por darle luz a mis días, por tu ternura infinita y por hacer de nuestra historia el lugar más hermoso donde puedo habitar.",
  "Te amo con toda mi alma, y este árbol florecerá cada día mientras tú estés conmigo.",
];

const tituloEl = document.getElementById("titulo");
if (data.titulo) tituloEl.textContent = data.titulo;

const DEDICATION_LETTER = data.subtitulo && data.subtitulo.trim() !== ""
  ? data.subtitulo
  : mensajesDefault[Math.floor(Math.random() * mensajesDefault.length)];

const plaqueTextEl = document.getElementById("plaqueText");
if (data.placa && data.placa.trim() !== "") {
  plaqueTextEl.innerText = `"${data.placa}"`;
}

/* ============================================================
   MÚSICA
   ============================================================ */
const audioEl = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const audioIcon = document.getElementById("audioIcon");

if (data.bgMusic && audioEl) {
  audioEl.src = data.bgMusic;
  audioEl.volume = 0.55;
}

musicBtn.addEventListener("click", () => {
  if (!audioEl || !audioEl.src) return;
  if (audioEl.paused) {
    audioEl.play().catch(() => {});
    audioIcon.innerText = "🔊";
  } else {
    audioEl.pause();
    audioIcon.innerText = "🎵";
  }
});

/* ============================================================
   GALERÍA (4 fotos)
   ============================================================ */
const photos = [data.photo1, data.photo2, data.photo3, data.photo4].filter(Boolean);
const galleryBtn = document.getElementById("galleryBtn");
const galleryModal = document.getElementById("galleryModal");
const closeGallery = document.getElementById("closeGallery");
const carouselTrack = document.getElementById("carouselTrack");
const dotsContainer = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

if (photos.length === 0) {
  galleryBtn.style.display = "none";
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
function goToSlide(index) { currentIndex = index; updateCarousel(); }
function nextSlide() { currentIndex = (currentIndex + 1) % photos.length; updateCarousel(); }
function prevSlide() { currentIndex = (currentIndex - 1 + photos.length) % photos.length; updateCarousel(); }

prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

galleryBtn.addEventListener("click", () => {
  galleryModal.classList.remove("opacity-0", "pointer-events-none");
});
closeGallery.addEventListener("click", () => {
  galleryModal.classList.add("opacity-0", "pointer-events-none");
});
galleryModal.addEventListener("click", (e) => {
  if (e.target === galleryModal) galleryModal.classList.add("opacity-0", "pointer-events-none");
});

let touchStartX = 0;
carouselTrack.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
carouselTrack.addEventListener("touchend", (e) => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 50) {
    if (diff < 0) nextSlide(); else prevSlide();
  }
}, { passive: true });

/* ============================================================
   AUDIO SINTETIZADOR (OPTIMIZADO)
   ============================================================ */
let audioCtx = null;
let lastChimeTime = 0;   // evita saturar el audio
const CHIME_COOLDOWN = 120; // ms mínimos entre chimes

function initAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { /* noop */ }
  }
}

function playHeartChime(freqMultiplier = 1) {
  if (!audioCtx) return;
  const nowMs = performance.now();
  if (nowMs - lastChimeTime < CHIME_COOLDOWN) return;  // ← control anti-saturación
  lastChimeTime = nowMs;

  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    const baseFreq = scale[Math.floor(Math.random() * scale.length)] * freqMultiplier;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 1.0);
  } catch (e) { /* noop */ }
}

/* ============================================================
   CANVAS — ÁRBOL FRACTAL OPTIMIZADO
   ============================================================ */
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d', { alpha: false });  // ← alpha:false mejora rendimiento

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Escala global según pantalla (para dispositivos pequeños)
function screenScale() {
  return Math.min(width, height) / 800;
}

const pointer = { x: -999, y: -999 };

function updatePointer(e) {
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  pointer.x = clientX;
  pointer.y = clientY;
}

window.addEventListener('mousemove', updatePointer, { passive: true });
window.addEventListener('touchmove', updatePointer, { passive: true });

let resizeTimeout = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initDecorations();
    resetAndGrowTree();
  }, 200);
});

/* ============================================================
   LÍMITES DE RENDIMIENTO
   ============================================================ */
const MAX_HEARTS = 120;          // ← límite máximo de corazones
const MAX_BRANCHES = 300;        // ← límite de ramas activas

let branches = [];
let leaves = [];
let fallingPetals = [];
let stars = [];
let fireflies = [];

const HEART_COLORS = [
  '#ff758c', '#ff2a5f', '#ff4b72', '#e91e63',
  '#ff9a9e', '#fecfef'
];  // quitados los oscuros que apenas se ven

/* ============================================================
   INICIALIZAR DECORACIÓN (estrellas, luciérnagas, pétalos)
   ============================================================ */
function initDecorations() {
  stars = [];
  fireflies = [];
  fallingPetals = [];

  const isMobile = width < 600;
  const starCount = isMobile ? 80 : 150;
  const fireflyCount = isMobile ? 18 : 35;
  const petalCount = isMobile ? 12 : 25;

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.4,
      alpha: Math.random(),
      speed: Math.random() * 0.012 + 0.004
    });
  }

  for (let i = 0; i < fireflyCount; i++) {
    fireflies.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.8 + 1,
      pulse: Math.random() * Math.PI
    });
  }

  for (let i = 0; i < petalCount; i++) {
    fallingPetals.push(new FallingPetal());
  }
}

/* ============================================================
   CLASES
   ============================================================ */
class Branch {
  constructor(startX, startY, angle, length, width, depth) {
    this.startX = startX;
    this.startY = startY;
    this.angle = angle;
    this.length = length;
    this.width = width;
    this.depth = depth;

    this.currentLength = 0;
    this.growSpeed = (Math.random() * 0.8 + 1.2) * (1 / (depth * 0.4 + 1));
    this.endX = startX;
    this.endY = startY;
    this.completed = false;
    this.childrenCreated = false;
  }

  update() {
    if (this.currentLength < this.length) {
      this.currentLength += this.growSpeed;
      if (this.currentLength >= this.length) {
        this.currentLength = this.length;
        this.completed = true;
      }
      this.endX = this.startX + Math.cos(this.angle) * this.currentLength;
      this.endY = this.startY + Math.sin(this.angle) * this.currentLength;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    // Color plano en lugar de gradiente por rama (más rápido)
    ctx.strokeStyle = '#4a2332';
    ctx.lineWidth = Math.max(1, this.width * (1 - (this.currentLength / this.length) * 0.15));
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

class HeartLeaf {
  constructor(x, y, maxScale) {
    this.x = x;
    this.y = y;
    this.maxScale = maxScale || Math.random() * 0.6 + 0.5;
    this.scale = 0;
    this.color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    this.angle = (Math.random() - 0.5) * 0.8;
    this.growSpeed = Math.random() * 0.035 + 0.02;
    this.sway = Math.random() * Math.PI * 2;
    this.hoverOffset = { x: 0, y: 0 };
    this.born = performance.now();
    this.isDying = false;
  }

  update() {
    if (this.scale < this.maxScale && !this.isDying) {
      this.scale += this.growSpeed;
    }
    if (this.isDying) {
      this.scale -= 0.03;
    }

    this.sway += 0.035;

    // Solo calcular proximidad si el pointer está activo
    if (pointer.x > 0) {
      const dx = pointer.x - this.x;
      const dy = pointer.y - this.y;
      const distSq = dx * dx + dy * dy;   // ← sin sqrt
      if (distSq < 6400 && distSq > 1) {  // 80^2
        const dist = Math.sqrt(distSq);
        const force = (80 - dist) / 80;
        this.hoverOffset.x = (dx / dist) * -force * 12;
        this.hoverOffset.y = (dy / dist) * -force * 12;
      } else {
        this.hoverOffset.x *= 0.88;
        this.hoverOffset.y *= 0.88;
      }
    } else {
      this.hoverOffset.x *= 0.88;
      this.hoverOffset.y *= 0.88;
    }
  }

  draw(ctx) {
    if (this.scale <= 0.01) return;
    ctx.save();
    const curX = this.x + this.hoverOffset.x + Math.sin(this.sway) * 1.5;
    const curY = this.y + this.hoverOffset.y + Math.cos(this.sway) * 1.2;

    ctx.translate(curX, curY);
    ctx.rotate(this.angle + Math.sin(this.sway) * 0.08);
    ctx.scale(this.scale, this.scale);

    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.bezierCurveTo(-12, -5, -18, 12, 0, 22);
    ctx.bezierCurveTo(18, 12, 12, -5, 0, 12);

    // ✅ SIN shadowBlur — el glow lo da el color + un halo suave
    ctx.fillStyle = this.color;
    ctx.fill();

    // Halo suave hecho con un segundo trazo semitransparente
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(0, 12, 16, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.restore();
    ctx.globalAlpha = 1;
  }

  destroy() {
    this.isDying = true;
  }
}

class FallingPetal {
  constructor() { this.reset(); }

  reset() {
    this.x = Math.random() * width;
    this.y = -20;
    this.size = Math.random() * 0.5 + 0.4;
    this.speedY = Math.random() * 1 + 0.5;
    this.speedX = Math.random() * 0.6 - 0.3;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.025;
    this.color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    this.opacity = Math.random() * 0.6 + 0.3;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y * 0.02) * 0.4;
    this.rotation += this.rotSpeed;
    if (this.y > height + 20 || this.x < -20 || this.x > width + 20) this.reset();
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.size, this.size);
    ctx.globalAlpha = this.opacity;

    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.bezierCurveTo(-8, -3, -12, 8, 0, 15);
    ctx.bezierCurveTo(12, 8, 8, -3, 0, 8);

    ctx.fillStyle = this.color;
    ctx.fill();       // ✅ sin shadowBlur

    ctx.restore();
    ctx.globalAlpha = 1;
  }
}

/* ============================================================
   SPAWN Y CONTROL DE RAMAS
   ============================================================ */
function spawnBranchChildren(branch) {
  if (branches.length >= MAX_BRANCHES) return;

  if (branch.depth >= 9) {
    const count = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < count; i++) {
      if (leaves.length >= MAX_HEARTS) break;
      leaves.push(new HeartLeaf(
        branch.endX + (Math.random() - 0.5) * 16,
        branch.endY + (Math.random() - 0.5) * 16
      ));
    }
    playHeartChime(1.1);
    return;
  }

  const numChildren = Math.random() < 0.25 ? 3 : 2;
  const angleSpread = 0.4 + Math.random() * 0.25;

  for (let i = 0; i < numChildren; i++) {
    if (branches.length >= MAX_BRANCHES) break;
    const subAngle = branch.angle + (i - (numChildren - 1) / 2) * angleSpread + (Math.random() - 0.5) * 0.15;
    const subLength = branch.length * (0.68 + Math.random() * 0.15);
    const subWidth = branch.width * 0.68;

    branches.push(new Branch(
      branch.endX, branch.endY, subAngle, subLength, subWidth, branch.depth + 1
    ));
  }

  if (branch.depth > 4 && Math.random() < 0.4) {
    if (leaves.length < MAX_HEARTS) {
      leaves.push(new HeartLeaf(branch.endX, branch.endY, 0.5));
    }
  }
}

function resetAndGrowTree() {
  branches = [];
  leaves = [];

  const trunkStartX = width / 2;
  const trunkStartY = height - 80;
  const trunkLength = Math.min(height * 0.22, 140);
  const trunkWidth = Math.min(width * 0.025, 22);

  branches.push(new Branch(
    trunkStartX, trunkStartY, -Math.PI / 2, trunkLength, trunkWidth, 1
  ));
  playHeartChime(0.8);
}

/* ============================================================
   CLICK EN CANVAS — AÑADE CORAZONES CON LÍMITE
   ============================================================ */
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  for (let i = 0; i < 4; i++) {
    if (leaves.length >= MAX_HEARTS) {
      // Eliminar el más antiguo (marcar para morir)
      const old = leaves.find(l => !l.isDying);
      if (old) old.destroy();
      // Filtrar los muertos del array en el próximo frame
    }
    leaves.push(new HeartLeaf(
      clickX + (Math.random() - 0.5) * 40,
      clickY + (Math.random() - 0.5) * 40,
      Math.random() * 0.7 + 0.6
    ));
  }
  playHeartChime(1.4);
});

/* ============================================================
   LOOP DE ANIMACIÓN
   ============================================================ */
function animate() {
  // Fondo (sin gradiente en cada frame si no cambia — lo cacheamos la primera vez)
  ctx.fillStyle = '#0a0612';
  ctx.fillRect(0, 0, width, height);

  // Estrellas (sin glow, solo círculos simples)
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0.2) s.speed = -s.speed;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 240, 245, ${Math.max(0, Math.min(1, s.alpha))})`;
    ctx.fill();
  }

  // Ramas
  for (let i = 0; i < branches.length; i++) {
    const b = branches[i];
    b.update();
    b.draw(ctx);
    if (b.completed && !b.childrenCreated) {
      b.childrenCreated = true;
      spawnBranchChildren(b);
    }
  }

  // Corazones
  for (let i = 0; i < leaves.length; i++) {
    leaves[i].update();
    leaves[i].draw(ctx);
  }

  // Eliminar corazones muertos (una vez al frame)
  leaves = leaves.filter(l => !(l.isDying && l.scale <= 0.01));

  // Pétalos cayendo
  for (let i = 0; i < fallingPetals.length; i++) {
    fallingPetals[i].update();
    fallingPetals[i].draw(ctx);
  }

  // Luciérnagas (sin shadowBlur, solo gradiente radial pequeño)
  for (let i = 0; i < fireflies.length; i++) {
    const f = fireflies[i];
    f.x += f.vx;
    f.y += f.vy;
    f.pulse += 0.03;

    if (f.x < 0 || f.x > width) f.vx *= -1;
    if (f.y < 0 || f.y > height) f.vy *= -1;

    const alpha = 0.3 + Math.sin(f.pulse) * 0.4;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 215, 0, ${Math.max(0, alpha)})`;
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

/* ============================================================
   ARRANQUE
   ============================================================ */
initDecorations();
resetAndGrowTree();
animate();

/* ============================================================
   BOTONES Y MODALES
   ============================================================ */
document.getElementById('regrowTreeBtn').addEventListener('click', resetAndGrowTree);

const letterModal = document.getElementById('letterModal');
const openLetterBtn = document.getElementById('openLetterBtn');
const closeLetterBtn = document.getElementById('closeLetterBtn');
const letterBody = document.getElementById('letterBody');

let typewriterTimeout = null;

openLetterBtn.addEventListener('click', () => {
  letterModal.classList.remove('opacity-0', 'pointer-events-none');
  letterBody.innerHTML = '';
  playHeartChime(1.3);

  let i = 0;
  function typeWriter() {
    if (i < DEDICATION_LETTER.length) {
      const char = DEDICATION_LETTER.charAt(i);
      letterBody.innerHTML += char === '\n' ? '<br>' : char;
      i++;
      typewriterTimeout = setTimeout(typeWriter, 26);
    }
  }
  typeWriter();
});

closeLetterBtn.addEventListener('click', () => {
  letterModal.classList.add('opacity-0', 'pointer-events-none');
  if (typewriterTimeout) clearTimeout(typewriterTimeout);
});

// Iniciar el audio context en el primer click en cualquier parte
document.body.addEventListener('click', () => {
  initAudio();
}, { once: true });