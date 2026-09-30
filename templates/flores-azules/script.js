/* ============================================================
   DATOS DINÁMICOS
   ============================================================ */
const data = window.__TUDETALLE_DATA__ || {};

/* ============================================================
   MENSAJES PREDETERMINADOS
   ============================================================ */
const mensajesDefault = [
  "Este ramo azul no se marchita porque está hecho de código, igual que mi cariño por ti no se acaba.",
  "Si pudiera regalarte flores de verdad, durarían días. Este ramo lo programé para que dure para siempre.",
  "Cada flor de este ramo es una razón distinta por la que me alegra tenerte cerca.",
  "No hay jardín que compita contigo, así que te construí uno solo para ti.",
];

/* ============================================================
   ELEMENTOS DEL DOM
   ============================================================ */
const tituloEl   = document.getElementById('titulo');
const revealBtn  = document.getElementById('revealBtn');
const card       = document.getElementById('card');
const cardText   = document.getElementById('cardText');
const closeCard  = document.getElementById('closeCard');
const audioEl    = document.getElementById('bgMusic');
const musicBtn   = document.getElementById('musicBtn');
const galleryBtn = document.getElementById('galleryBtn');
const galleryModal = document.getElementById('galleryModal');
const closeGallery = document.getElementById('closeGallery');
const carouselTrack = document.getElementById('carouselTrack');
const dotsContainer = document.getElementById('dots');
const prevBtn    = document.getElementById('prevBtn');
const nextBtn    = document.getElementById('nextBtn');

/* ============================================================
   TEXTOS PERSONALIZADOS
   ============================================================ */
if (data.titulo) {
  tituloEl.textContent = data.titulo;
} else {
  tituloEl.textContent = "Un ramo azul para alegrar tu día";
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
  return mensajesDefault[Math.floor(Math.random() * mensajesDefault.length)];
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
   MÚSICA
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
   GALERÍA (4 fotos)
   ============================================================ */
const photos = [data.photo1, data.photo2, data.photo3, data.photo4].filter(Boolean);
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
function goToSlide(index) { currentIndex = index; updateCarousel(); }
function nextSlide() { currentIndex = (currentIndex + 1) % photos.length; updateCarousel(); }
function prevSlide() { currentIndex = (currentIndex - 1 + photos.length) % photos.length; updateCarousel(); }

prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

galleryBtn.addEventListener("click", () => {
  galleryModal.classList.add("open");
});
closeGallery.addEventListener("click", () => {
  galleryModal.classList.remove("open");
});
galleryModal.addEventListener("click", (e) => {
  if (e.target === galleryModal) galleryModal.classList.remove("open");
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
   RAMO — GENERACIÓN DE FLORES
   ============================================================ */
const floresContainer = document.getElementById('flores');

const posiciones = [
  [50,  5,   0],
  [36, 15,  -9],
  [64, 15,   9],
  [24, 28, -16],
  [76, 28,  16],
  [40, 26,  -6],
  [60, 26,   6],
  [30, 40, -12],
  [70, 40,  12],
  [48, 38,  -2],
  [52, 48,   3],
  [38, 56,  -8],
  [62, 56,   8]
];

function crearFlor(x, y, rotacion, delay) {
  const flor = document.createElement('div');
  flor.classList.add('flor');
  flor.style.left = `${x}%`;
  flor.style.top = `${y}%`;
  flor.style.setProperty('--rotacion', `${rotacion}deg`);
  flor.style.animationDelay = `${delay}s`;

  // 6 pétalos traseros
  let petalosHTML = '';
  for (let i = 0; i < 6; i++) {
    const angulo = i * 60;
    petalosHTML += `<div class="petalo atras" style="transform: rotate(${angulo}deg) translateY(-8px);"></div>`;
  }

  // 6 pétalos frontales alternados
  for (let i = 0; i < 6; i++) {
    const angulo = i * 60 + 30;
    petalosHTML += `<div class="petalo frente" style="transform: rotate(${angulo}deg) translateY(-6px);"></div>`;
  }

  // 8 estambres
  let estambresHTML = '';
  for (let i = 0; i < 8; i++) {
    const angulo = i * 45;
    estambresHTML += `<div class="estambre" style="transform: rotate(${angulo}deg) translateY(-10px);"></div>`;
  }

  flor.innerHTML = `
    <div class="cabeza">
      ${petalosHTML}
      ${estambresHTML}
      <div class="centro"></div>
    </div>
    <div class="tallo"></div>
    <div class="hoja hoja-izq"></div>
    <div class="hoja hoja-der"></div>
  `;

  floresContainer.appendChild(flor);
}

window.addEventListener('DOMContentLoaded', () => {
  posiciones.forEach((pos, i) => {
    const [x, y, rot] = pos;
    crearFlor(x, y, rot, i * 0.1);
  });
});