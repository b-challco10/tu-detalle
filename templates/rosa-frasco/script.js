/* ============================================================
   DATOS DINÁMICOS (vienen del editor de la plataforma)
   ============================================================ */
const data = window.__TUDETALLE_DATA__ || {};

/* ============================================================
   MENSAJES PREDETERMINADOS
   ============================================================ */
const mensajes = [
  "Como esta rosa en su frasco, te guardo con cuidado para que nada te dañe.",
  "Los pétalos caen, pero lo que siento por ti no se marchita jamás.",
  "Encerré una rosa en cristal para que dure para siempre… igual que mi cariño por ti.",
  "Cada pétalo que cae es un 'te quiero' que se escapa de mi pecho.",
  "No hay frasco que contenga todo lo que siento por ti.",
];

/* ============================================================
   ELEMENTOS DEL DOM
   ============================================================ */
const tituloEl   = document.getElementById("titulo");
const revealBtn  = document.getElementById("revealBtn");
const card       = document.getElementById("card");
const cardText   = document.getElementById("cardText");
const closeCard  = document.getElementById("closeCard");

const audioEl    = document.getElementById("bgMusic");
const musicBtn   = document.getElementById("musicBtn");

const galleryBtn = document.getElementById("galleryBtn");
const galleryModal = document.getElementById("galleryModal");
const closeGallery = document.getElementById("closeGallery");
const carouselTrack = document.getElementById("carouselTrack");
const dotsContainer = document.getElementById("dots");
const prevBtn    = document.getElementById("prevBtn");
const nextBtn    = document.getElementById("nextBtn");

/* ============================================================
   TEXTOS PERSONALIZADOS
   ============================================================ */
if (data.titulo) {
  tituloEl.textContent = data.titulo;
} else {
  tituloEl.textContent = "Para ti, que floreces incluso en la oscuridad";
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
   ANIMACIÓN CANVAS - ROSA EN FRASCO
   ============================================================ */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let time = 0;
let animationFrame;
let fallenPetals = [];
let spawnCounter = 0;
const SPAWN_INTERVAL = 150;

class FallingPetal {
  constructor(x, y, width, height) {
    const size = Math.min(window.innerWidth, window.innerHeight);
    const baseSize = 800;
    const sizeScale = Math.min(size / baseSize, 1.2);

    this.x = x + width * 0.1 + Math.random() * width * 0.8;
    this.y = y + height * 0.25 + Math.random() * height * 0.65;
    this.length = 90 * sizeScale;
    this.petalWidth = 30 * sizeScale;
    this.scale = (0.9 + Math.random() * 0.2) * sizeScale;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.005;
    this.targetRotation = Math.random() * Math.PI * 2;
    this.fallSpeed = (0.25 + Math.random() * 0.35) * sizeScale;
    this.swingSpeed = 0.008 + Math.random() * 0.008;
    this.swingAmount = (15 + Math.random() * 20) * sizeScale;
    this.swingOffset = Math.random() * Math.PI * 2;
    this.opacity = 0.7 + Math.random() * 0.3;

    const colorSet = this.getColorSet();
    this.colorA = colorSet.a;
    this.colorB = colorSet.b;

    this.born = time;
    this.life = 800 + Math.random() * 400;
    this.glassX = x;
    this.glassY = y;
    this.glassWidth = width;
    this.glassHeight = height;
    this.isSettled = false;
    this.settleY = 0;
    this.floatOffset = Math.random() * 20;
    this.floatSpeed = 0.02 + Math.random() * 0.02;
  }

  getColorSet() {
    const sets = [
      { a: "#7a0f4a", b: "#9c1560" },
      { a: "#9c1560", b: "#c41a70" },
      { a: "#c41a70", b: "#e0357f" },
      { a: "#e0357f", b: "#ec5b9c" },
      { a: "#ec5b9c", b: "#ff85b8" },
      { a: "#ff85b8", b: "#ff9ec9" }
    ];
    return sets[Math.floor(Math.random() * sets.length)];
  }

  update() {
    if (this.isSettled) {
      this.rotation += this.rotationSpeed * 0.3;
      return;
    }

    this.y += this.fallSpeed;
    this.rotation += this.rotationSpeed;
    this.x += Math.sin(time * this.swingSpeed + this.swingOffset) * 0.15;

    if (this.y < this.glassY + this.glassHeight * 0.4) {
      this.x += Math.sin(time * this.floatSpeed + this.floatOffset) * 0.1;
    }

    const maxY = this.glassY + this.glassHeight - 25;
    if (this.y >= maxY) {
      this.y = maxY;
      this.isSettled = true;
      this.fallSpeed = 0;
      this.rotationSpeed *= 0.2;
      this.settleY = this.y;
    }

    const margin = 15;
    if (this.x < this.glassX + margin) {
      this.x = this.glassX + margin;
      this.swingOffset += Math.PI;
    }
    if (this.x > this.glassX + this.glassWidth - margin) {
      this.x = this.glassX + this.glassWidth - margin;
      this.swingOffset += Math.PI;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);
    ctx.globalAlpha = this.opacity;

    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;

    const length = this.length;
    const width = this.petalWidth;

    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(-width, -length * 0.35);
    ctx.lineTo(0, -length);
    ctx.lineTo(width, -length * 0.35);
    ctx.closePath();

    const grad = ctx.createLinearGradient(-width, 0, width, 0);
    grad.addColorStop(0, this.colorA);
    grad.addColorStop(1, this.colorB);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(0, -length);
    ctx.stroke();

    ctx.strokeStyle = "rgba(50,5,30,0.4)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
  }

  isDead() {
    return time - this.born > this.life && this.isSettled;
  }
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const size = Math.min(canvas.width, canvas.height);
  const w = Math.min(430, size * 0.6);
  const h = w * 1.77;
  const x = canvas.width / 2 - w / 2;
  const y = canvas.height / 2 - h / 2 - 20;

  fallenPetals.forEach(petal => {
    petal.glassX = x;
    petal.glassY = y;
    petal.glassWidth = w;
    petal.glassHeight = h;

    const newScale = Math.min(Math.min(window.innerWidth, window.innerHeight) / 800, 1.2);
    const oldScale = petal.scale / (petal.length / 90);
    petal.scale = (petal.length / 90) * newScale;
    petal.length = 90 * newScale;
    petal.petalWidth = 30 * newScale;
    petal.fallSpeed = (petal.fallSpeed / oldScale) * newScale;
    petal.swingAmount = (petal.swingAmount / oldScale) * newScale;

    if (petal.isSettled) {
      petal.x = Math.min(Math.max(petal.x, x + 15), x + w - 15);
      petal.y = y + h - 25;
    } else {
      petal.x = Math.min(Math.max(petal.x, x + 15), x + w - 15);
      petal.y = Math.min(petal.y, y + h - 25);
    }
  });
}

window.addEventListener("resize", resize);
resize();

function roundTopRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
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

function drawKitePetal(length, width, colorA, colorB) {
  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.lineTo(-width, -length * 0.35);
  ctx.lineTo(0, -length);
  ctx.lineTo(width, -length * 0.35);
  ctx.closePath();

  const grad = ctx.createLinearGradient(-width, 0, width, 0);
  grad.addColorStop(0, colorA);
  grad.addColorStop(1, colorB);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 8);
  ctx.lineTo(0, -length);
  ctx.stroke();

  ctx.strokeStyle = "rgba(50,5,30,0.45)";
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

function stemCurvePoints(cx, top, bottom, wave) {
  return [
    { x: cx, y: top },
    { x: cx + 12 + wave, y: top + 120 },
    { x: cx - 20 + wave, y: top + 260 },
    { x: cx - 8 + wave, y: bottom }
  ];
}

function cubicBezierAt(p, t) {
  const mt = 1 - t;
  return {
    x: mt * mt * mt * p[0].x + 3 * mt * mt * t * p[1].x + 3 * mt * t * t * p[2].x + t * t * t * p[3].x,
    y: mt * mt * mt * p[0].y + 3 * mt * mt * t * p[1].y + 3 * mt * t * t * p[2].y + t * t * t * p[3].y
  };
}

function drawRose(cx, cy, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;
  [-70, -35, 0, 35, 70].forEach(a => {
    ctx.save();
    ctx.rotate(a * Math.PI / 180);
    drawKitePetal(130, 70, "#7a0f4a", "#9c1560");
    ctx.restore();
  });
  ctx.shadowBlur = 0;
  [-55, -20, 12, 45, 78].forEach(a => {
    ctx.save();
    ctx.rotate(a * Math.PI / 180);
    ctx.translate(0, 6);
    drawKitePetal(100, 50, "#c41a70", "#e0357f");
    ctx.restore();
  });
  [-25, 8, 38].forEach(a => {
    ctx.save();
    ctx.rotate(a * Math.PI / 180);
    ctx.translate(0, 14);
    drawKitePetal(90, 30, "#ec5b9c", "#ff85b8");
    ctx.restore();
  });
  ctx.restore();
}

function drawStem(cx, top, bottom, wave = 0) {
  ctx.save();
  const p = stemCurvePoints(cx, top, bottom, wave);
  ctx.beginPath();
  ctx.moveTo(p[0].x, p[0].y);
  ctx.bezierCurveTo(
    p[1].x, p[1].y,
    p[2].x, p[2].y,
    p[3].x, p[3].y
  );
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;
  const g = ctx.createLinearGradient(cx - 8, 0, cx + 8, 0);
  g.addColorStop(0, "#0d4d15");
  g.addColorStop(0.5, "#1f8a2c");
  g.addColorStop(1, "#0d4d15");
  ctx.strokeStyle = g;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = "#0d4d15";
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    const offset = (i - 1) * 4;
    ctx.beginPath();
    ctx.moveTo(cx + offset, top + 50);
    ctx.bezierCurveTo(
      cx + offset + 2, top + 150,
      cx + offset - 3, top + 250,
      cx + offset - 1, bottom - 50
    );
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawLeaf(x, y, size, angle, time = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  const wave = Math.sin(time * 0.002 + x * 0.01) * 2;
  ctx.translate(0, wave);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size * 0.32, -size * 0.3);
  ctx.lineTo(size * 0.12, -size * 0.9);
  ctx.lineTo(0, -size * 1.15);
  ctx.lineTo(-size * 0.12, -size * 0.9);
  ctx.lineTo(-size * 0.32, -size * 0.3);
  ctx.closePath();
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;
  const g = ctx.createLinearGradient(-size * 0.3, 0, size * 0.3, -size);
  g.addColorStop(0, "#0d3d14");
  g.addColorStop(0.5, "#1c6b26");
  g.addColorStop(1, "#2c8a35");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(180,255,180,0.35)";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.05);
  ctx.lineTo(0, -size * 1.1);
  ctx.stroke();
  ctx.strokeStyle = "rgba(140,220,150,0.25)";
  ctx.lineWidth = 0.8;
  for (let i = 1; i <= 3; i++) {
    const yPos = -size * 0.25 * i;
    ctx.beginPath();
    ctx.moveTo(0, yPos);
    ctx.lineTo(size * 0.18, yPos - size * 0.12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, yPos);
    ctx.lineTo(-size * 0.18, yPos - size * 0.12);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(5,25,8,0.4)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function drawSepals(cx, cy, wave = 0) {
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.25)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy - 8);
  ctx.quadraticCurveTo(cx - 10, cy + 18, cx, cy + 26);
  ctx.quadraticCurveTo(cx + 10, cy + 18, cx + 14, cy - 8);
  ctx.quadraticCurveTo(cx, cy - 2, cx - 14, cy - 8);
  ctx.closePath();
  const baseGrad = ctx.createLinearGradient(cx, cy - 8, cx, cy + 26);
  baseGrad.addColorStop(0, "#1f8a2c");
  baseGrad.addColorStop(1, "#0d4d15");
  ctx.fillStyle = baseGrad;
  ctx.fill();
  const colors = ["#1c7527", "#1f8a2c", "#1c7527"];
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(cx + i * 6, cy - 6);
    ctx.quadraticCurveTo(
      cx + i * 30 + wave,
      cy + 20 + Math.abs(i) * 4,
      cx + i * 34 + wave,
      cy + 4 + Math.abs(i) * 2
    );
    ctx.quadraticCurveTo(
      cx + i * 14,
      cy - 4,
      cx + i * 6,
      cy - 6
    );
    ctx.closePath();
    const grad = ctx.createLinearGradient(cx + i * 6, cy - 6, cx + i * 34, cy + 20);
    grad.addColorStop(0, colors[i + 1]);
    grad.addColorStop(1, "#0d4d15");
    ctx.fillStyle = grad;
    ctx.fill();
  }
  ctx.restore();
}

function spawnFallingPetals(glassX, glassY, glassWidth, glassHeight) {
  if (spawnCounter >= SPAWN_INTERVAL && fallenPetals.length < 30) {
    const petal = new FallingPetal(glassX, glassY, glassWidth, glassHeight);
    fallenPetals.push(petal);
    spawnCounter = 0;
  } else {
    spawnCounter++;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const bgGrad = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 100,
    canvas.width / 2, canvas.height / 2, canvas.width / 1.5
  );
  bgGrad.addColorStop(0, "#0a0a0a");
  bgGrad.addColorStop(0.5, "#050505");
  bgGrad.addColorStop(1, "#000000");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glow = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2 - 200, 50,
    canvas.width / 2, canvas.height / 2 - 200, 400
  );
  glow.addColorStop(0, "rgba(255,200,200,0.05)");
  glow.addColorStop(1, "rgba(255,200,200,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const size = Math.min(canvas.width, canvas.height);
  const w = Math.min(430, size * 0.6);
  const h = w * 1.77;
  const x = canvas.width / 2 - w / 2;
  const y = canvas.height / 2 - h / 2 - 20;

  ctx.shadowBlur = 0;
  drawGlass(x, y, w, h);

  spawnFallingPetals(x, y, w, h);

  fallenPetals = fallenPetals.filter(petal => {
    petal.update();
    petal.draw(ctx);
    return !petal.isDead();
  });

  const stemBottom = y + h * 0.96;
  const stemTop = y + h * 0.43;
  const cx = canvas.width / 2;
  const wave = Math.sin(time * 0.001) * 3;
  drawStem(cx, stemTop, stemBottom, wave);

  const stemPts = stemCurvePoints(cx, stemTop, stemBottom, wave);

  const leafScale = Math.min(1, size / 800);
  const leafSize = 95 * leafScale;

  const leafPoint1 = cubicBezierAt(stemPts, 0.42);
  drawLeaf(leafPoint1.x, leafPoint1.y, leafSize, -0.9, time);

  const leafPoint2 = cubicBezierAt(stemPts, 0.62);
  drawLeaf(leafPoint2.x, leafPoint2.y, leafSize, 0.9, time);

  drawSepals(cx, stemTop, wave);

  const roseScale = Math.min(1.2, size / 600);
  drawRose(
    canvas.width / 2,
    y + h * 0.415,
    roseScale
  );

  ctx.shadowBlur = 0;
  const sparkle = ctx.createRadialGradient(
    x + w * 0.15, y + h * 0.2, 2,
    x + w * 0.15, y + h * 0.2, 30
  );
  sparkle.addColorStop(0, "rgba(255,255,255,0.3)");
  sparkle.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sparkle;
  ctx.fillRect(x, y, w, h);

  const sparkle2 = ctx.createRadialGradient(
    x + w * 0.85, y + h * 0.15, 1,
    x + w * 0.85, y + h * 0.15, 15
  );
  sparkle2.addColorStop(0, "rgba(255,255,255,0.2)");
  sparkle2.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sparkle2;
  ctx.fillRect(x, y, w, h);

  time++;
  animationFrame = requestAnimationFrame(draw);
}

draw();