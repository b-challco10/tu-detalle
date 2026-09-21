const data = window.__TUDETALLE_DATA__ || {};
const tituloEl = document.getElementById("titulo");
const subtituloEl = document.getElementById("subtitulo");
const audioEl = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const galleryBtn = document.getElementById("galleryBtn");
const galleryModal = document.getElementById("galleryModal");
const closeGallery = document.getElementById("closeGallery");
const carouselTrack = document.getElementById("carouselTrack");
const dotsContainer = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

/* Textos */
if (data.titulo) {
  tituloEl.textContent = data.titulo;
} else {
  tituloEl.textContent = "🌸 Para ti, con todo mi corazón 🌸";
}

if (data.subtitulo) {
  subtituloEl.textContent = data.subtitulo;
} else {
  subtituloEl.textContent = "Cada pétalo es un latido que late por ti";
}

/* Música */
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

/* ===== GALERÍA / CARRUSEL ===== */
const photos = [data.photo1, data.photo2, data.photo3].filter(Boolean);
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

/* Partículas */
window.addEventListener("load", () => {
  document.body.classList.remove("container");

  function createParticles() {
    const container = document.body;
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 6 + 2}px;
        height: ${Math.random() * 6 + 2}px;
        background: radial-gradient(circle, #ff6b9d, #ff1493);
        border-radius: 50%;
        left: ${Math.random() * 100}vw;
        bottom: ${Math.random() * 80 + 10}%;
        animation: floatParticle ${Math.random() * 3 + 2}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
        opacity: ${Math.random() * 0.5 + 0.3};
        filter: blur(${Math.random() * 2}px);
        pointer-events: none;
        z-index: 5;
      `;
      container.appendChild(particle);
    }
  }
  setTimeout(createParticles, 500);
});