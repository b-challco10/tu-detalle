/* ============================================================
   DATOS DINÁMICOS (vienen del editor de la plataforma)
   ============================================================ */
const data = window.__TUDETALLE_DATA__ || {};

/* ============================================================
   MENSAJES PREDETERMINADOS (si no hay mensaje personalizado)
   ============================================================ */
const mensajes = [
  "Este ramo no se marchita porque está hecho de código, igual que mi cariño por ti no se acaba porque está hecho de costumbre.",
  "Si pudiera regalarte flores de verdad, durarían unos días. Este ramo lo programé para que dure para siempre.",
  "Cada pétalo es un motivo distinto por el que me alegra tenerte cerca.",
  "No hay jardín que compita contigo, así que te construí uno solo para ti.",
  "Amarillo como el sol que traes cada vez que entras en una habitación.",
];

/* ============================================================
   ELEMENTOS DEL DOM
   ============================================================ */
const tituloEl    = document.getElementById("titulo");
const flower      = document.getElementById("flower");
const revealBtn   = document.getElementById("revealBtn");
const card        = document.getElementById("card");
const cardText    = document.getElementById("cardText");
const closeCard   = document.getElementById("closeCard");

const audioEl     = document.getElementById("bgMusic");
const musicBtn    = document.getElementById("musicBtn");

const galleryBtn  = document.getElementById("galleryBtn");
const galleryModal = document.getElementById("galleryModal");
const closeGallery = document.getElementById("closeGallery");
const carouselTrack = document.getElementById("carouselTrack");
const dotsContainer = document.getElementById("dots");
const prevBtn     = document.getElementById("prevBtn");
const nextBtn     = document.getElementById("nextBtn");

/* ============================================================
   TEXTOS PERSONALIZADOS
   ============================================================ */
if (data.titulo) {
  tituloEl.textContent = data.titulo;
} else {
  tituloEl.textContent = "Para alguien que ilumina el cuarto";
}

/* ============================================================
   MENSAJE DE LA TARJETA
   ============================================================ */
let hasOpenedOnce = false;
const VELOCIDAD_ESCRITURA = 35;
let temporizadorEscritura = null;

function elegirMensaje() {
  // Si hay mensaje personalizado desde la plataforma, úsalo
  if (data.subtitulo && data.subtitulo.trim() !== "") {
    return data.subtitulo;
  }
  // Si no, elige uno aleatorio
  const indice = Math.floor(Math.random() * mensajes.length);
  return mensajes[indice];
}

function escribirTexto(texto) {
  clearInterval(temporizadorEscritura);
  cardText.textContent = "";
  cardText.classList.add("is-typing");

  let posicion = 0;

  temporizadorEscritura = setInterval(() => {
    posicion += 1;
    cardText.textContent = texto.slice(0, posicion);

    if (posicion >= texto.length) {
      clearInterval(temporizadorEscritura);
      cardText.classList.remove("is-typing");
    }
  }, VELOCIDAD_ESCRITURA);
}

function abrirTarjeta() {
  card.classList.add("is-visible");
  flower.classList.add("is-open");
  flower.setAttribute("aria-expanded", "true");
  hasOpenedOnce = true;

  escribirTexto(elegirMensaje());

  requestAnimationFrame(() => {
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function cerrarTarjeta() {
  clearInterval(temporizadorEscritura);
  cardText.classList.remove("is-typing");
  card.classList.remove("is-visible");
  flower.classList.remove("is-open");
  flower.setAttribute("aria-expanded", "false");
}

function alternarTarjeta() {
  if (card.classList.contains("is-visible")) {
    cerrarTarjeta();
  } else {
    abrirTarjeta();
  }
}

flower.addEventListener("click", alternarTarjeta);
revealBtn.addEventListener("click", alternarTarjeta);
closeCard.addEventListener("click", cerrarTarjeta);

flower.setAttribute("aria-expanded", "false");

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
   GALERÍA / CARRUSEL (4 FOTOS)
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
  // Crear slides
  photos.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "carousel-slide";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Recuerdo ${i + 1}`;
    img.loading = "lazy";

    slide.appendChild(img);
    carouselTrack.appendChild(slide);

    // Dots
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