/* ============================================================
   DATOS DINÁMICOS (vienen del editor de la plataforma)
   ============================================================ */
const data = window.__TUDETALLE_DATA__ || {};

/* ============================================================
   MENSAJES PREDETERMINADOS
   ============================================================ */
const mensajes = [
  "Como este tulipán, mi cariño por ti crece aunque nadie lo riegue.",
  "Los pétalos caen uno a uno, y cada uno lleva tu nombre escrito.",
  "Te regalaría un campo entero de tulipanes si cupiera en una pantalla.",
  "Un tulipán blanco significa 'te quiero'… este significa 'te quiero para siempre'.",
  "No hay estación que se lleve lo que siento por ti.",
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
  tituloEl.textContent = "Un tulipán que nunca se marchita";
}

/* ============================================================
   MENSAJE DE LA TARJETA (con efecto máquina de escribir)
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
   ANIMACIÓN CANVAS - TULIPÁN
   ============================================================ */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

let time = 0;

// === SISTEMA DE PÉTALOS CAYENDO ===
const fallingPetals = [];

function getTulipPetals() {
  const petalPositions = [
    { x: -12, y: -15, rot: 0, color: "#fff8eb" },
    { x: 12, y: -15, rot: 0, color: "#fff8eb" },
    { x: 0, y: -18, rot: 0, color: "#fff8eb" },
    { x: -6, y: -6, rot: -0.18, color: "#fff0d8" },
    { x: 6, y: -6, rot: 0.18, color: "#fff0d8" },
  ];
  return petalPositions;
}

class FallingPetal {
  constructor(x, y, rot, color) {
    this.isSettled = false;
    this.settleX = 0;
    this.settleY = 0;
    this.settleRotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.x = x || canvas.width / 2 + (Math.random() - 0.5) * 50;
    this.y = y || canvas.height / 2 - 100 + (Math.random() - 0.5) * 20;
    this.size =
      (15 + Math.random() * 20) *
      Math.min(1, Math.min(canvas.width, canvas.height) / 650);
    this.rotation = rot || Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.fallSpeed = 0.5 + Math.random() * 1.2;
    this.swingSpeed = 0.01 + Math.random() * 0.02;
    this.swingAmount = 1 + Math.random() * 2;
    this.phase = Math.random() * Math.PI * 2;
    this.opacity = 0.7 + Math.random() * 0.3;
    this.color = color || ["#fff8eb", "#fff0d8"][Math.floor(Math.random() * 2)];
    this.originalX = this.x;
    this.originalY = this.y;
  }

  update() {
    this.y += this.fallSpeed;
    this.x +=
      Math.sin(this.phase + time * this.swingSpeed) * this.swingAmount * 0.4;
    this.rotation += this.rotationSpeed;
    this.phase += 0.01;

    if (this.y > canvas.height + 50) {
      this.reset();
    }
  }

  reset() {
    this.y = this.originalY - 50 - Math.random() * 80;
    this.x = this.originalX + (Math.random() - 0.5) * 20;
    this.fallSpeed = 0.5 + Math.random() * 1;
    this.size =
      (15 + Math.random() * 20) *
      Math.min(1, Math.min(canvas.width, canvas.height) / 650);
    this.rotation = Math.random() * Math.PI * 2;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.size / 30, this.size / 30);

    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.bezierCurveTo(-20, -10, -25, 5, -10, 15);
    ctx.bezierCurveTo(-5, 10, 5, 10, 10, 15);
    ctx.bezierCurveTo(25, 5, 20, -10, 0, -15);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = "#e8d9c0";
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.restore();
  }
}

function initFallingPetals() {
  const petals = getTulipPetals();
  const flowerX = canvas.width / 2;
  const flowerY = canvas.height / 2 + 80;

  petals.forEach((petalInfo) => {
    for (let i = 0; i < 2; i++) {
      const petal = new FallingPetal(
        flowerX + petalInfo.x + (Math.random() - 0.5) * 20,
        flowerY + petalInfo.y - 50 - Math.random() * 100,
        petalInfo.rot + (Math.random() - 0.5) * 0.5,
        petalInfo.color
      );
      petal.originalX = flowerX + petalInfo.x;
      petal.originalY = flowerY + petalInfo.y;
      fallingPetals.push(petal);
    }
  });
}

initFallingPetals();

function drawTulip(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const sway = Math.sin(time * 1.8) * 0.07;

  // Hoja izquierda
  ctx.save();
  ctx.translate(-8, 320);
  ctx.rotate(-0.15 + sway * 0.8);
  ctx.beginPath();
  ctx.moveTo(0, 50);
  ctx.quadraticCurveTo(-25, -40, -22, -140);
  ctx.quadraticCurveTo(-35, -210, -18, -350);
  ctx.quadraticCurveTo(-5, -350, 18, -200);
  ctx.quadraticCurveTo(25, -50, 8, 20);
  ctx.closePath();
  ctx.fillStyle = "#3ab14f";
  ctx.fill();
  ctx.strokeStyle = "#246f39";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // Hoja derecha
  ctx.save();
  ctx.translate(9, 320);
  ctx.rotate(0.15 + sway * 0.5);
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.quadraticCurveTo(28, -45, 25, -155);
  ctx.quadraticCurveTo(38, -225, 15, -270);
  ctx.quadraticCurveTo(0, -235, -20, -125);
  ctx.quadraticCurveTo(-22, -55, -5, 20);
  ctx.closePath();
  ctx.fillStyle = "#3ab14f";
  ctx.fill();
  ctx.strokeStyle = "#246f39";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // Pétalo trasero izquierdo
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-12, -15);
  ctx.bezierCurveTo(-48, -38, -52, -98, -26, -150);
  ctx.bezierCurveTo(-13, -158, -8, -105, 0, -15);
  ctx.closePath();
  ctx.fillStyle = "#fff8eb";
  ctx.fill();
  ctx.strokeStyle = "#e8d9c0";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Pétalo trasero derecho
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(12, -15);
  ctx.bezierCurveTo(48, -38, 52, -98, 26, -150);
  ctx.bezierCurveTo(13, -158, 8, -105, 0, -15);
  ctx.closePath();
  ctx.fillStyle = "#fff8eb";
  ctx.fill();
  ctx.strokeStyle = "#e8d9c0";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Pétalo central frontal
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.bezierCurveTo(-37, -45, -44, -105, -19, -155);
  ctx.bezierCurveTo(-6, -172, 6, -172, 19, -155);
  ctx.bezierCurveTo(44, -105, 37, -45, 0, -18);
  ctx.closePath();
  ctx.fillStyle = "#fff8eb";
  ctx.fill();
  ctx.strokeStyle = "#e8d9c0";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Pétalo intermedio izquierdo
  ctx.save();
  ctx.translate(-6, -6);
  ctx.rotate(-0.18);
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.bezierCurveTo(-39, -42, -48, -98, -17, -150);
  ctx.bezierCurveTo(-6, -157, 0, -110, 0, -18);
  ctx.closePath();
  ctx.fillStyle = "#fff0d8";
  ctx.fill();
  ctx.strokeStyle = "#e8d9c0";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Pétalo intermedio derecho
  ctx.save();
  ctx.translate(6, -6);
  ctx.rotate(0.18);
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.bezierCurveTo(39, -42, 48, -98, 17, -150);
  ctx.bezierCurveTo(6, -157, 0, -110, 0, -18);
  ctx.closePath();
  ctx.fillStyle = "#fff0d8";
  ctx.fill();
  ctx.strokeStyle = "#e8d9c0";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function drawStem(x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.beginPath();
  ctx.moveTo(0, 350);
  ctx.quadraticCurveTo(-10, 160, 6, 0);
  ctx.lineWidth = 4.8;
  ctx.strokeStyle = "#2a7f3a";
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.restore();
}

function drawGlass(x, y, w, h) {
  ctx.shadowColor = "rgba(255,255,255,0.05)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  roundTopRect(x, y, w, h, w / 2);

  const glass = ctx.createLinearGradient(x, y, x + w, y);
  glass.addColorStop(0, "rgba(255,255,255,0.25)");
  glass.addColorStop(0.15, "rgba(255,255,255,0.05)");
  glass.addColorStop(0.3, "rgba(255,255,255,0.02)");
  glass.addColorStop(0.7, "rgba(255,255,255,0.02)");
  glass.addColorStop(0.85, "rgba(255,255,255,0.05)");
  glass.addColorStop(1, "rgba(255,255,255,0.25)");
  ctx.fillStyle = glass;
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function roundTopRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const size = Math.min(canvas.width, canvas.height);
  const baseScale = Math.min(1, size / 900);
  const flowerScale = baseScale * 0.7;

  const w = Math.min(430 * baseScale, canvas.width * 0.65);
  const h = w * 1.77;
  const x = canvas.width / 2 - w / 2;
  const y = canvas.height / 2 - h / 2.6;

  ctx.shadowBlur = 0;
  drawGlass(x, y, w, h);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2 + 20;

  drawStem(centerX, centerY, flowerScale);
  drawTulip(centerX, centerY + 60 * baseScale, flowerScale);

  fallingPetals.forEach((petal) => {
    petal.update();
    petal.draw(ctx);
  });

  time += 0.008;
  requestAnimationFrame(draw);
}

draw();