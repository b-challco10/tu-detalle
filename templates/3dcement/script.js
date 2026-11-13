import * as THREE from "three";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
/* ============================================================
   TUS 3 CANCIONES POR DEFECTO
   ============================================================ */
const DEFAULT_TRACKS = [
  { src: "/templates/cementerio/cancion1.mp3", title: " Dueles" },
  { src: "/templates/cementerio/cancion2.aac", title: "Ecos de amor" },
  { src: "/templates/cementerio/cancion3.mp3", title: "Yo te quiero" },
];

/* ============================================================
   MODELOS 3D (.glb)
   ============================================================ */
const GHOST_MODELS = [
  { url: "/templates/3dcement/9189b7c5-ba7c-44a3-a11e-0769129fd163.glb", tint: 0xffd27a, panel: "gallery" },
  { url: "/templates/3dcement/fantasma2.glb", tint: 0x8fb7ff, panel: "music"   },
  { url: "/templates/3dcement/fantasma3.glb", tint: 0xff8fc0, panel: "letter"  },
];

/* ============================================================
   DATOS DEL EDITOR
   ============================================================ */
const data = window.__TUDETALLE_DATA__ || {};

const $ = (id) => document.getElementById(id);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
const str = (v) => (typeof v === "string" ? v.trim() : "");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile =
  Math.min(window.innerWidth, window.innerHeight) < 700 ||
  window.matchMedia("(pointer: coarse)").matches;

/* ============================================================
   TEXTOS
   ============================================================ */
const DEFAULT_SCENE_TITLE = "Noche de fantasmas";
const DEFAULT_LETTER_TITLE = "Una carta desde el más allá";
const DEFAULT_LETTER =
  "Querido mortal,\n\nDesde esta lápida te escribo para decirte que, aun entre sombras y niebla, tú eres la luz que mis fantasmas más quieren cuidar.\n\nGracias por existir.";

const sceneTitle = str(data.titulo) || DEFAULT_SCENE_TITLE;
const letterTitle = str(data.tituloCarta) || DEFAULT_LETTER_TITLE;
const letterText = str(data.mensaje) || DEFAULT_LETTER;
const letterSign = str(data.firma);

$("titulo").textContent = sceneTitle;
document.title = sceneTitle;

{
  const len = sceneTitle.length;
  const rem = len <= 18 ? 3.2 : len <= 32 ? 2.5 : len <= 50 ? 2 : 1.6;
  $("titulo").style.fontSize = `clamp(1.3rem, ${(rem * 3.1).toFixed(2)}vw, ${rem}rem)`;
}

const photos = [1, 2, 3, 4, 5, 6].map((i) => str(data[`photo${i}`])).filter(Boolean);

/* ============================================================
   FOTO AMPLIADA
   ============================================================ */
const lightbox = $("lightbox");
const lightboxImg = $("lightboxImg");

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}

$("lightboxClose").addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

/* ============================================================
   GALERÍA (carrusel 3D)
   ============================================================ */
const gTrack = $("gTrack");
const gDots = $("gDots");
const gCount = $("gCount");
const gPrev = $("gPrev");
const gNext = $("gNext");

let slides = [];
let gCur = 0;
let gAuto = null;
let gResume = null;

function buildGalleryDots() {
  gDots.textContent = "";

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "gdot";
    dot.setAttribute("aria-label", `Ir a la foto ${i + 1}`);
    dot.addEventListener("click", () => galleryUserGo(i));
    gDots.appendChild(dot);
  });

  const many = slides.length > 1;

  gDots.hidden = !many;
  gPrev.hidden = !many;
  gNext.hidden = !many;
}

function galleryLayout() {
  const n = slides.length;

  slides.forEach((s, i) => {
    let off = i - gCur;

    if (n > 1) {
      if (off > n / 2) off -= n;
      if (off < -n / 2) off += n;
    }

    const abs = Math.abs(off);
    const el = s.el;

    if (abs > 2) {
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
      el.style.zIndex = "0";
      el.style.transform = `translateX(-50%) translateX(${off * 60}%) scale(0.6)`;
      return;
    }

    el.style.pointerEvents = "auto";
    el.style.opacity = abs === 0 ? "1" : abs === 1 ? "0.8" : "0.4";
    el.style.zIndex = String(10 - abs);
    el.style.filter = `brightness(${1 - abs * 0.28})`;
    el.style.transform = `translateX(-50%) translateX(${off * 62}%) translateZ(${
      -abs * 120
    }px) rotateY(${-off * 36}deg) scale(${1 - abs * 0.1})`;
  });

  [...gDots.children].forEach((dot, i) => dot.classList.toggle("active", i === gCur));

  gCount.textContent = n ? `${gCur + 1} / ${n}` : "";
}

function galleryGo(i) {
  if (!slides.length) return;

  gCur = (i + slides.length) % slides.length;
  galleryLayout();
}

function galleryStopAuto() {
  clearInterval(gAuto);
  clearTimeout(gResume);
}

function galleryStartAuto() {
  galleryStopAuto();

  if (reduceMotion || slides.length < 2) return;

  gAuto = setInterval(() => {
    if (document.hidden || lightbox.classList.contains("open")) return;
    galleryGo(gCur + 1);
  }, 4200);
}

function galleryUserGo(i) {
  galleryStopAuto();
  galleryGo(i);
  gResume = setTimeout(galleryStartAuto, 9000);
}

function removeSlide(slide) {
  const index = slides.indexOf(slide);
  if (index < 0) return;

  slide.el.remove();
  slides.splice(index, 1);

  if (gCur >= slides.length) gCur = 0;

  if (!slides.length) {
    $("gCar").hidden = true;
    $("gFoot").hidden = true;
    $("gEmpty").hidden = false;
    galleryStopAuto();
  }

  buildGalleryDots();
  galleryLayout();
}

function buildGallery() {
  slides = photos.map((src, i) => {
    const el = document.createElement("div");
    el.className = "gslide";

    const img = new Image();
    img.src = src;
    img.alt = `Recuerdo ${i + 1}`;
    img.loading = "lazy";
    img.draggable = false;

    const slide = { el, src };

    img.addEventListener("error", () => removeSlide(slide));

    el.appendChild(img);
    gTrack.appendChild(el);

    return slide;
  });

  if (!slides.length) {
    $("gCar").hidden = true;
    $("gFoot").hidden = true;
    $("gEmpty").hidden = false;
    return;
  }

  buildGalleryDots();
  galleryLayout();
}

// Deslizar con el dedo o el mouse
let gStartX = null;
let gMoved = 0;

gTrack.addEventListener("pointerdown", (e) => {
  gStartX = e.clientX;
  gMoved = 0;
});

gTrack.addEventListener("pointermove", (e) => {
  if (gStartX !== null) gMoved = Math.max(gMoved, Math.abs(e.clientX - gStartX));
});

gTrack.addEventListener("pointerup", (e) => {
  if (gStartX === null) return;

  const dx = e.clientX - gStartX;
  gStartX = null;

  if (Math.abs(dx) > 40) {
    galleryUserGo(dx < 0 ? gCur + 1 : gCur - 1);
    return;
  }

  if (gMoved < 8 && e.target instanceof Element) {
    const el = e.target.closest(".gslide");
    const index = slides.findIndex((s) => s.el === el);

    if (index === gCur) {
      galleryStopAuto();
      openLightbox(slides[index].src);
    } else if (index >= 0) {
      galleryUserGo(index);
    }
  }
});

gTrack.addEventListener("pointercancel", () => {
  gStartX = null;
});

gPrev.addEventListener("click", () => galleryUserGo(gCur - 1));
gNext.addEventListener("click", () => galleryUserGo(gCur + 1));

buildGallery();

/* ============================================================
   REPRODUCTOR DE MÚSICA
   ============================================================ */
const audio = $("player");

const tracks = [1, 2, 3]
  .map((n) => {
    const uploaded = str(data[`musica${n}`]);
    const fallback = DEFAULT_TRACKS[n - 1];
    const src = uploaded || (fallback ? fallback.src : "");
    const customTitle = str(data[`tituloMusica${n}`]);

    const title =
      customTitle || (uploaded ? `Canción ${n}` : fallback ? fallback.title : `Canción ${n}`);

    return { src, title };
  })
  .filter((t) => t.src);

let trackIndex = 0;
let loadedIndex = -1;
let failsInRow = 0;
let isPlaying = false;
let seeking = false;

const mPlay = $("mPlay");
const tracklist = $("tracklist");
const playerError = $("playerError");
const seekBar = $("seek");

function fmtTime(s) {
  if (!Number.isFinite(s) || s < 0) return "0:00";

  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);

  return `${m}:${String(r).padStart(2, "0")}`;
}

function showPlayerError(text) {
  playerError.textContent = text;
  playerError.hidden = !text;
}

function updateProgress() {
  const d = audio.duration;
  const p = Number.isFinite(d) && d > 0 ? clamp(audio.currentTime / d, 0, 1) : 0;

  $("seekFill").style.width = `${p * 100}%`;
  $("seekKnob").style.left = `${p * 100}%`;
  $("timeNow").textContent = fmtTime(audio.currentTime);
  $("timeTotal").textContent = fmtTime(d);

  seekBar.setAttribute("aria-valuenow", String(Math.round(p * 100)));
}

function renderPlayer() {
  if (!tracks.length) return;

  const t = tracks[trackIndex];

  $("trackCount").textContent = `Canción ${trackIndex + 1} de ${tracks.length}`;
  $("trackTitle").textContent = t.title;
  $("nowTitle").textContent = t.title;

  [...tracklist.children].forEach((li, i) => {
    const btn = li.firstElementChild;

    btn.classList.toggle("active", i === trackIndex);
    btn.classList.toggle("is-playing", isPlaying);
  });

  updateProgress();
}

function buildTracklist() {
  tracklist.textContent = "";

  tracks.forEach((t, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");

    btn.type = "button";
    btn.className = "track";

    const num = document.createElement("span");
    num.className = "track__n";
    num.textContent = String(i + 1);

    const name = document.createElement("span");
    name.className = "track__name";
    name.textContent = t.title;

    const eq = document.createElement("span");
    eq.className = "eq";
    eq.setAttribute("aria-hidden", "true");
    eq.innerHTML = "<i></i><i></i><i></i><i></i>";

    btn.append(num, name, eq);
    btn.addEventListener("click", () => loadTrack(i, true));

    li.appendChild(btn);
    tracklist.appendChild(li);
  });
}

function loadTrack(i, autoplay) {
  if (!tracks.length) return;

  trackIndex = (i + tracks.length) % tracks.length;

  if (loadedIndex !== trackIndex) {
    showPlayerError("");
    audio.src = tracks[trackIndex].src;
    loadedIndex = trackIndex;
  }

  renderPlayer();

  if (autoplay) audio.play().catch(() => {});
}

function togglePlay() {
  if (!tracks.length) return;

  if (loadedIndex === -1) {
    loadTrack(trackIndex, true);
    return;
  }

  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

function prevTrack() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
  } else {
    loadTrack(trackIndex - 1, true);
  }
}

function setPlaying(value) {
  isPlaying = value;

  mPlay.classList.toggle("is-playing", value);
  mPlay.setAttribute("aria-label", value ? "Pausar" : "Reproducir");
  $("disc").classList.toggle("spinning", value);

  renderPlayer();
  updateNowPill();

  ghostStates[1].playing = value;
}

audio.addEventListener("play", () => setPlaying(true));
audio.addEventListener("pause", () => setPlaying(false));
audio.addEventListener("ended", () => loadTrack(trackIndex + 1, true));
audio.addEventListener("timeupdate", () => {
  if (!seeking) updateProgress();
});
audio.addEventListener("loadedmetadata", updateProgress);

audio.addEventListener("playing", () => {
  failsInRow = 0;
  showPlayerError("");
});

audio.addEventListener("error", () => {
  if (loadedIndex === -1) return;

  failsInRow += 1;
  showPlayerError("No se pudo cargar esta canción.");

  if (tracks.length > 1 && failsInRow < tracks.length) {
    setTimeout(() => loadTrack(trackIndex + 1, true), 700);
  }
});

$("mPlay").addEventListener("click", togglePlay);
$("mNext").addEventListener("click", () => loadTrack(trackIndex + 1, true));
$("mPrev").addEventListener("click", prevTrack);

function seekFromEvent(e) {
  const r = seekBar.getBoundingClientRect();
  const p = clamp((e.clientX - r.left) / r.width, 0, 1);

  if (Number.isFinite(audio.duration)) audio.currentTime = p * audio.duration;

  updateProgress();
}

seekBar.addEventListener("pointerdown", (e) => {
  seeking = true;
  seekBar.setPointerCapture(e.pointerId);
  seekFromEvent(e);
});

seekBar.addEventListener("pointermove", (e) => {
  if (seeking) seekFromEvent(e);
});

seekBar.addEventListener("pointerup", () => {
  seeking = false;
});

seekBar.addEventListener("pointercancel", () => {
  seeking = false;
});

seekBar.addEventListener("keydown", (e) => {
  if (!Number.isFinite(audio.duration)) return;

  if (e.key === "ArrowRight") audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
  if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 5);
});

if (tracks.length) {
  buildTracklist();
  renderPlayer();
} else {
  $("playerBody").hidden = true;
  $("musicEmpty").hidden = false;
}

function updateNowPill() {
  const show = isPlaying && activePanel !== "music";

  $("nowPlaying").hidden = !show;
}

$("nowPlaying").addEventListener("click", () => openPanel("music"));

/* ============================================================
   CARTA DE HALLOWEEN
   ============================================================ */
const letter = $("letter");
const paper = $("paper");
const cartaTexto = $("cartaTexto");
const paperScroll = $("paperScroll");

$("cartaTitulo").textContent = letterTitle;

if (letterSign) {
  $("cartaFirma").textContent = `— ${letterSign}`;
  $("cartaFirma").hidden = false;
}

function webPath() {
  const SPOKES = 8;
  const RINGS = 6;
  const R = 108;
  const angles = Array.from({ length: SPOKES }, (_, k) => ((k * 90) / (SPOKES - 1) * Math.PI) / 180);

  let d = "";

  angles.forEach((a) => {
    d += `M0 0L${(R * Math.cos(a)).toFixed(1)} ${(R * Math.sin(a)).toFixed(1)}`;
  });

  for (let j = 1; j <= RINGS; j++) {
    const r = R * Math.pow(j / RINGS, 1.15);
    const pts = angles.map((a) => [r * Math.cos(a), r * Math.sin(a)]);

    d += `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;

    for (let k = 1; k < pts.length; k++) {
      const cx = ((pts[k - 1][0] + pts[k][0]) / 2) * 0.82;
      const cy = ((pts[k - 1][1] + pts[k][1]) / 2) * 0.82;

      d += `Q${cx.toFixed(1)} ${cy.toFixed(1)} ${pts[k][0].toFixed(1)} ${pts[k][1].toFixed(1)}`;
    }
  }

  return d;
}

$("webA").setAttribute("d", webPath());
$("webB").setAttribute("d", webPath());

function jaggedClip() {
  const pts = [];

  for (let x = 0; x <= 100; x += 4) pts.push(`${x}% ${(Math.random() * 1.3).toFixed(2)}%`);
  for (let y = 6; y <= 94; y += 8) pts.push(`${(100 - Math.random() * 0.9).toFixed(2)}% ${y}%`);
  for (let x = 100; x >= 0; x -= 4) pts.push(`${x}% ${(100 - Math.random() * 1.3).toFixed(2)}%`);
  for (let y = 94; y >= 6; y -= 8) pts.push(`${(Math.random() * 0.9).toFixed(2)}% ${y}%`);

  return `polygon(${pts.join(",")})`;
}

paper.style.clipPath = jaggedClip();

function fitLetter() {
  let size = clamp(window.innerWidth * 0.052, 17, 24);

  cartaTexto.style.fontSize = `${size}px`;

  for (
    let i = 0;
    i < 30 && paperScroll.scrollHeight > paperScroll.clientHeight + 1 && size > 14;
    i++
  ) {
    size -= 0.5;
    cartaTexto.style.fontSize = `${size}px`;
  }
}

let letterTimers = [];
let letterTyping = null;
let letterTyped = false;

function later(fn, ms) {
  letterTimers.push(setTimeout(fn, ms));
}

function finishLetterTyping() {
  clearInterval(letterTyping);
  cartaTexto.textContent = letterText;
  cartaTexto.classList.remove("typing");
  letterTyped = true;
}

function typeLetter() {
  cartaTexto.textContent = letterText;
  fitLetter();

  if (reduceMotion || letterTyped) {
    finishLetterTyping();
    return;
  }

  const delay = letterText.length > 400 ? 9 : letterText.length > 200 ? 16 : 24;
  let i = 0;

  cartaTexto.textContent = "";
  cartaTexto.classList.add("typing");

  letterTyping = setInterval(() => {
    i += 1;
    cartaTexto.textContent = letterText.slice(0, i);

    if (i >= letterText.length) finishLetterTyping();
  }, delay);
}

cartaTexto.addEventListener("click", () => {
  if (cartaTexto.classList.contains("typing")) finishLetterTyping();
});

function resetLetter() {
  letterTimers.forEach(clearTimeout);
  letterTimers = [];
  clearInterval(letterTyping);

  letter.className = "letter";
  cartaTexto.classList.remove("typing");
}

function onLetterOpen() {
  resetLetter();

  if (reduceMotion) {
    letter.classList.add("s-done");
    typeLetter();
    return;
  }

  if (letterTyped) {
    letter.classList.add("s-done", "s-quick");
    finishLetterTyping();
    fitLetter();
    return;
  }

  letter.classList.add("s-in");
  later(() => letter.classList.add("s-crack"), 1100);
  later(() => letter.classList.add("s-open"), 1600);
  later(() => letter.classList.add("s-paper", "s-done"), 2200);
  later(typeLetter, 3300);
}

function onLetterClose() {
  resetLetter();

  if (cartaTexto.textContent !== letterText && letterTyped) {
    cartaTexto.textContent = letterText;
  }
}

/* ============================================================
   PANELES
   ============================================================ */
const panels = {
  gallery: $("panelGallery"),
  music: $("panelMusic"),
  letter: $("panelLetter"),
};

const PANEL_GHOST = { gallery: 0, music: 1, letter: 2 };

let activePanel = null;
let lastOpener = null;

function openPanel(name, opener) {
  if (activePanel === name) return;
  if (activePanel) closePanel(true);

  activePanel = name;
  lastOpener = opener || null;

  panels[name].classList.add("open");
  panels[name].setAttribute("aria-hidden", "false");
  document.body.classList.add("panel-open");
  document.body.classList.add("hint-off");

  if (name === "gallery") {
    galleryLayout();
    galleryStartAuto();
  }

  if (name === "music") {
    renderPlayer();

    if (tracks.length && loadedIndex === -1) loadTrack(0, true);
  }

  if (name === "letter") onLetterOpen();

  ghostStates.forEach((g, i) => {
    g.active = i === PANEL_GHOST[name];
  });

  updateNowPill();

  setTimeout(() => {
    const btn = panels[name].querySelector(".panel__close");
    if (btn) btn.focus({ preventScroll: true });
  }, 400);
}

function closePanel(silent) {
  if (!activePanel) return;

  const name = activePanel;

  panels[name].classList.remove("open");
  panels[name].setAttribute("aria-hidden", "true");

  if (name === "gallery") galleryStopAuto();
  if (name === "letter") onLetterClose();

  activePanel = null;
  document.body.classList.remove("panel-open");

  ghostStates.forEach((g) => {
    g.active = false;
  });

  updateNowPill();

  if (!silent && lastOpener && lastOpener.focus) {
    lastOpener.focus({ preventScroll: true });
  }
}

document.querySelectorAll("[data-close]").forEach((el) => {
  el.addEventListener("click", () => closePanel(false));
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;

  if (lightbox.classList.contains("open")) closeLightbox();
  else closePanel(false);
});

document.querySelectorAll(".tag").forEach((tag) => {
  tag.addEventListener("click", () => openPanel(tag.dataset.panel, tag));
});

/* ============================================================
   LOS TRES FANTASMAS (estados)
   ============================================================ */
const GW = 320;
const GH = 360;

const GHOSTS = [
  { kind: "feliz", panel: "gallery", tint: "#ffd27a", light: 0xffd27a },
  { kind: "sonador", panel: "music", tint: "#8fb7ff", light: 0x8fb7ff },
  { kind: "enamorado", panel: "letter", tint: "#ff8fc0", light: 0xff8fc0 },
];

const ghostStates = GHOSTS.map((def, i) => {
  const canvas = document.createElement("canvas");
  canvas.width = GW;
  canvas.height = GH;

  return {
    ...def,
    index: i,
    canvas,
    ctx: canvas.getContext("2d"),
    blink: false,
    nextBlink: 1.5 + i * 1.1,
    glance: 0,
    excited: 0,
    hover: false,
    active: false,
    playing: false,
  };
});

function updateGhostState(g, t) {
  if (t >= g.nextBlink + 0.14) {
    g.nextBlink = t + 2.4 + Math.random() * 3.4;
  }

  g.blink = t >= g.nextBlink && t < g.nextBlink + 0.14;
  g.glance = Math.sin(t * 0.8 + g.index);
  g.excited = lerp(g.excited, g.hover || g.active ? 1 : 0, 0.12);
}

/* ============================================================
   ESCENA 3D
   ============================================================ */
function rng(seed) {
  let s = seed;

  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function radialTexture(size, stops) {
  const c = document.createElement("canvas");
  c.width = c.height = size;

  const g = c.getContext("2d");
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);

  stops.forEach(([o, color]) => grad.addColorStop(o, color));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;

  return tex;
}

function moonTexture() {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;

  const g = c.getContext("2d");
  const base = g.createRadialGradient(100, 96, 10, 128, 128, 140);
  base.addColorStop(0, "#fffbe8");
  base.addColorStop(0.6, "#efe2b4");
  base.addColorStop(1, "#c9b97f");
  g.fillStyle = base;
  g.fillRect(0, 0, size, size);

  const r = rng(7);

  for (let i = 0; i < 14; i++) {
    const x = r() * size;
    const y = r() * size;
    const rad = 8 + r() * 26;
    const cr = g.createRadialGradient(x, y, 0, x, y, rad);

    cr.addColorStop(0, "rgba(150, 135, 90, 0.35)");
    cr.addColorStop(0.8, "rgba(150, 135, 90, 0.12)");
    cr.addColorStop(1, "rgba(150, 135, 90, 0)");
    g.fillStyle = cr;
    g.beginPath();
    g.arc(x, y, rad, 0, Math.PI * 2);
    g.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;

  return tex;
}

function batTexture(up) {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 64;

  const g = c.getContext("2d");

  g.translate(64, 32);
  g.fillStyle = "#07040c";
  g.strokeStyle = "rgba(160, 110, 255, 0.4)";
  g.lineWidth = 1.2;

  for (const dir of [1, -1]) {
    g.save();
    g.scale(dir, 1);
    g.rotate(up ? -0.5 : 0.35);

    g.beginPath();
    g.moveTo(2, -2);
    g.bezierCurveTo(10, -22, 34, -24, 56, -10);
    g.quadraticCurveTo(48, -4, 44, 8);
    g.quadraticCurveTo(38, 2, 32, 12);
    g.quadraticCurveTo(24, 4, 16, 14);
    g.quadraticCurveTo(10, 6, 3, 9);
    g.closePath();
    g.fill();
    g.stroke();
    g.restore();
  }

  g.beginPath();
  g.ellipse(0, 4, 5, 10, 0, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.arc(0, -8, 5, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.moveTo(-4, -11);
  g.lineTo(-3, -19);
  g.lineTo(0, -13);
  g.moveTo(4, -11);
  g.lineTo(3, -19);
  g.lineTo(0, -13);
  g.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;

  return tex;
}

function mergeParts(parts) {
  const positions = [];
  const normals = [];

  for (const { geo, matrix } of parts) {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();

    g.applyMatrix4(matrix);
    positions.push(g.attributes.position.array);
    normals.push(g.attributes.normal.array);

    g.dispose();
    geo.dispose();
  }

  const total = positions.reduce((n, a) => n + a.length, 0);
  const pos = new Float32Array(total);
  const nor = new Float32Array(total);

  let offset = 0;

  positions.forEach((a, i) => {
    pos.set(a, offset);
    nor.set(normals[i], offset);
    offset += a.length;
  });

  const merged = new THREE.BufferGeometry();

  merged.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  merged.setAttribute("normal", new THREE.BufferAttribute(nor, 3));

  return merged;
}

function makeTreeGeometry(rand, height, thick) {
  const parts = [];
  const up = new THREE.Vector3(0, 1, 0);

  function segment(origin, dir, length, radius) {
    const geo = new THREE.CylinderGeometry(radius * 0.64, radius, length, 6, 1, true);

    geo.translate(0, length / 2, 0);

    const q = new THREE.Quaternion().setFromUnitVectors(up, dir);
    const m = new THREE.Matrix4().compose(origin, q, new THREE.Vector3(1, 1, 1));

    parts.push({ geo, matrix: m });
  }

  function grow(origin, dir, length, radius, depth) {
    segment(origin, dir, length, radius);

    if (depth <= 0) return;

    const tip = origin.clone().addScaledVector(dir, length);
    const children = depth === 4 ? 3 : 2;

    for (let i = 0; i < children; i++) {
      const random = new THREE.Vector3(rand() - 0.5, rand() * 0.3, rand() - 0.5);
      const perp = new THREE.Vector3().crossVectors(dir, random).normalize();

      if (perp.lengthSq() < 0.001) continue;

      const angle = 0.45 + rand() * 0.75;
      const nd = dir.clone().applyAxisAngle(perp, (rand() < 0.5 ? -1 : 1) * angle);

      nd.y = nd.y * 0.8 + 0.12;
      nd.normalize();

      grow(tip, nd, length * (0.66 + rand() * 0.14), radius * 0.62, depth - 1);
    }
  }

  const trunkDir = new THREE.Vector3((rand() - 0.5) * 0.15, 1, (rand() - 0.5) * 0.15).normalize();

  grow(new THREE.Vector3(0, -0.1, 0), trunkDir, height * 0.38, thick, 4);

  return mergeParts(parts);
}

function initScene() {
  const canvas = $("scene");

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: (window.devicePixelRatio || 1) < 2,
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.6 : 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();

  scene.fog = new THREE.FogExp2(0x1b0f36, 0.034);

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 140);
  const BASE_CAM = new THREE.Vector3(0, 2.3, 9.5);
  const LOOK = new THREE.Vector3(0, 2.3, 0);

  /* ---------- Luces ---------- */
  scene.add(new THREE.AmbientLight(0x7a84c8, 1.15));
  scene.add(new THREE.HemisphereLight(0x9aa6ff, 0x1a1420, 0.9));

  const moonLight = new THREE.DirectionalLight(0xb4c0ff, 1.7);

  moonLight.position.set(-10, 14, -8);
  scene.add(moonLight);
// Controles de interacción libre
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;          // movimiento suave
controls.dampingFactor = 0.08;
controls.enablePan = true;              // poder arrastrar la cámara
controls.enableZoom = true;             // rueda del mouse / pellizcar
controls.minDistance = 5;               // no acercarse demasiado
controls.maxDistance = 18;              // no alejarse demasiado
controls.maxPolarAngle = Math.PI * 0.48; // no pasar por debajo del suelo
controls.target.set(0, 2.3, 0);         // punto al que mira la cámara
controls.update();
  /* ---------- Estrellas ---------- */
  {
    const r = rng(11);
    const count = isMobile ? 260 : 460;
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = r() * Math.PI * 2;
      const phi = Math.acos(0.06 + r() * 0.94);
      const radius = 100;

      arr[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      arr[i * 3 + 1] = Math.cos(phi) * radius;
      arr[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius - 20;
    }

    const geo = new THREE.BufferGeometry();

    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));

    var stars = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
        fog: false,
        depthWrite: false,
      })
    );

    scene.add(stars);
  }

  /* ---------- Luna ---------- */
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3.4, 32, 32),
    new THREE.MeshBasicMaterial({ map: moonTexture(), fog: false })
  );

  const moonGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: radialTexture(256, [
        [0, "rgba(255, 244, 205, 0.95)"],
        [0.25, "rgba(255, 236, 180, 0.45)"],
        [1, "rgba(255, 236, 180, 0)"],
      ]),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
      transparent: true,
      opacity: 0.7,
    })
  );

  moonGlow.scale.set(24, 24, 1);
  scene.add(moon, moonGlow);

  /* ---------- Suelo ---------- */
  {
    const geo = new THREE.PlaneGeometry(90, 70, 60, 46);

    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const r = rng(3);
    const c1 = new THREE.Color("#22301f");
    const c2 = new THREE.Color("#121a14");
    const tmp = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      const h =
        Math.sin(x * 0.7) * Math.cos(z * 0.6) * 0.14 + Math.sin(x * 0.23 + z * 0.31) * 0.22;

      pos.setY(i, h);

      tmp.copy(c2).lerp(c1, 0.25 + r() * 0.6);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    const ground = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 1,
        metalness: 0,
        flatShading: true,
      })
    );

    ground.position.set(0, 0, -12);
    scene.add(ground);
  }

  /* ---------- Lápidas ---------- */
  const r = rng(21);

  const stoneMats = [0x6c6a78, 0x585766, 0x7b7a88].map(
    (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.95, metalness: 0, flatShading: true })
  );

  const archShape = new THREE.Shape();

  archShape.moveTo(-0.45, 0);
  archShape.lineTo(-0.45, 0.8);
  archShape.absarc(0, 0.8, 0.45, Math.PI, 0, true);
  archShape.lineTo(0.45, 0);
  archShape.closePath();

  const archGeo = new THREE.ExtrudeGeometry(archShape, {
    depth: 0.22,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 1,
    curveSegments: 10,
  });

  archGeo.translate(0, 0, -0.11);

  const crossV = new THREE.BoxGeometry(0.2, 1.5, 0.2);
  const crossH = new THREE.BoxGeometry(0.85, 0.2, 0.2);
  const obelisk = new THREE.CylinderGeometry(0.1, 0.3, 1.9, 4);
  const moundGeo = new THREE.SphereGeometry(0.7, 10, 6);
  const moundMat = new THREE.MeshStandardMaterial({ color: 0x1c2619, roughness: 1, flatShading: true });

  const graveSpots = [];

  for (let i = 0; i < 24; i++) {
    const z = -2 - r() * 15;
    const side = r() < 0.5 ? -1 : 1;
    const x = side * (2.3 + r() * 13);

    if (z > -5 && Math.abs(x) < 3.2) continue;

    const kind = r();
    const group = new THREE.Group();
    const mat = stoneMats[Math.floor(r() * stoneMats.length)];

    if (kind < 0.62) {
      const m = new THREE.Mesh(archGeo, mat);

      m.scale.setScalar(0.85 + r() * 0.5);
      group.add(m);
    } else if (kind < 0.84) {
      const v = new THREE.Mesh(crossV, mat);
      const h = new THREE.Mesh(crossH, mat);

      v.position.y = 0.75;
      h.position.y = 1.05;
      group.add(v, h);
    } else {
      const o = new THREE.Mesh(obelisk, mat);

      o.position.y = 0.95;
      group.add(o);
    }

    group.position.set(x, 0.05, z);
    group.rotation.y = (r() - 0.5) * 0.7;
    group.rotation.z = (r() - 0.5) * 0.14;
    group.rotation.x = (r() - 0.5) * 0.1;
    scene.add(group);

    const mound = new THREE.Mesh(moundGeo, moundMat);

    mound.scale.set(1.1, 0.22, 1.6);
    mound.position.set(x, 0.04, z + 0.9);
    mound.rotation.y = group.rotation.y;
    scene.add(mound);

    graveSpots.push({ x, z });
  }

  /* ---------- Velas de las tumbas ---------- */
  const flameTex = radialTexture(128, [
    [0, "rgba(255, 244, 200, 1)"],
    [0.3, "rgba(255, 170, 70, 0.7)"],
    [1, "rgba(255, 120, 30, 0)"],
  ]);

  const candles = [];

  graveSpots.slice(0, 7).forEach((spot, i) => {
    const wax = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.24, 8),
      new THREE.MeshStandardMaterial({ color: 0xe9e2cf, roughness: 0.8 })
    );

    wax.position.set(spot.x + 0.7, 0.17, spot.z + 1.1);
    scene.add(wax);

    const flame = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: flameTex,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        fog: false,
      })
    );

    flame.position.set(wax.position.x, 0.42, wax.position.z);
    flame.scale.set(0.9, 0.9, 1);
    scene.add(flame);

    candles.push({ flame, seed: i * 1.7 });
  });

  /* ---------- Árboles secos ---------- */
  const treeMat = new THREE.MeshStandardMaterial({
    color: 0x1a1219,
    roughness: 1,
    metalness: 0,
    flatShading: true,
    side: THREE.DoubleSide,
  });

  const trees = [
    [-7, -4, 7.5, 0.3],
    [6.8, -6, 8.5, 0.34],
    [-12.5, -10, 9, 0.38],
    [11.5, -12, 8, 0.32],
    [-3.6, -15.5, 7, 0.28],
    [3.2, -17.5, 8.5, 0.34],
    [-10.5, 1.5, 8, 0.36],
    [10, 0.8, 7.5, 0.32],
  ];

  trees.forEach(([x, z, h, thick], i) => {
    const mesh = new THREE.Mesh(makeTreeGeometry(rng(100 + i * 13), h, thick), treeMat);

    mesh.position.set(x, 0, z);
    mesh.rotation.y = r() * Math.PI * 2;
    scene.add(mesh);
  });

  /* ---------- Reja del fondo ---------- */
  {
    const posts = 44;
    const postGeo = new THREE.BoxGeometry(0.09, 1.7, 0.09);
    const tipGeo = new THREE.ConeGeometry(0.09, 0.28, 4);
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x0f0c14, roughness: 0.7, metalness: 0.4 });

    const postMesh = new THREE.InstancedMesh(postGeo, ironMat, posts);
    const tipMesh = new THREE.InstancedMesh(tipGeo, ironMat, posts);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < posts; i++) {
      const x = -22 + i * (44 / (posts - 1));

      dummy.position.set(x, 0.85, -19);
      dummy.updateMatrix();
      postMesh.setMatrixAt(i, dummy.matrix);

      dummy.position.set(x, 1.84, -19);
      dummy.updateMatrix();
      tipMesh.setMatrixAt(i, dummy.matrix);
    }

    scene.add(postMesh, tipMesh);

    for (const y of [0.45, 1.25]) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(44, 0.07, 0.07), ironMat);

      bar.position.set(0, y, -19);
      scene.add(bar);
    }
  }

  /* ---------- Niebla baja ---------- */
  const mistTex = radialTexture(256, [
    [0, "rgba(150, 150, 210, 0.5)"],
    [1, "rgba(150, 150, 210, 0)"],
  ]);

  const mists = [];

  for (let i = 0; i < (isMobile ? 7 : 11); i++) {
    const sp = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: mistTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.16 + r() * 0.12,
      })
    );

    const s = 9 + r() * 8;

    sp.scale.set(s, s * 0.35, 1);
    sp.position.set(-14 + r() * 28, 0.6 + r() * 0.9, -12 + r() * 16);
    scene.add(sp);

    mists.push({ sp, baseX: sp.position.x, speed: 0.06 + r() * 0.08, phase: r() * 6 });
  }

  /* ---------- Murciélagos ---------- */
  const batTexUp = batTexture(true);
  const batTexDown = batTexture(false);

  const batMats = [
    new THREE.SpriteMaterial({ map: batTexUp, transparent: true, depthWrite: false, fog: false }),
    new THREE.SpriteMaterial({ map: batTexDown, transparent: true, depthWrite: false, fog: false }),
  ];

  const bats = [];

  for (let i = 0; i < 6; i++) {
    const mat = batMats[i % 2].clone();
    const sp = new THREE.Sprite(mat);

    sp.scale.set(3.2, 1.6, 1);
    scene.add(sp);

    bats.push({
      sp,
      mat,
      phase: r() * 6,
      radius: 5 + r() * 6,
      speed: 0.25 + r() * 0.25,
      cy: 6 + r() * 4,
      flap: 5 + r() * 3,
    });
  }

  /* ---------- Fantasmas (GLB) ---------- */
  const loader = new GLTFLoader();
  const ghosts = [];

  // Contenedores vacíos
  ghostStates.forEach((g, i) => {
    const root = new THREE.Group();
    scene.add(root);

    const light = new THREE.PointLight(GHOST_MODELS[i].tint, 22, 8, 2);
    scene.add(light);

    ghosts.push({
      g,
      root,
      mixer: null,
      actions: [],
      light,
      base: new THREE.Vector3(),
      target: new THREE.Vector3(),
      size: 2.6,
      pop: 0,
      phase: i * 2.1,
      loaded: false,
      tint: GHOST_MODELS[i].tint,
      panel: GHOST_MODELS[i].panel,
    });
  });

  // Carga de los 3 modelos
  ghosts.forEach((entry, i) => {
    loader.load(
      GHOST_MODELS[i].url,
      (gltf) => {
        const model = gltf.scene;

        // Normalizar tamaño
        const box = new THREE.Box3().setFromObject(model);
        const sizeVec = new THREE.Vector3();
        box.getSize(sizeVec);
        const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) || 1;
        const desired = 2.2;
        const scale = desired / maxDim;
        model.scale.setScalar(scale);

        // Centrar
        box.setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);
        model.position.y += box.getSize(new THREE.Vector3()).y * 0.5;

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = false;
            child.frustumCulled = false;
          }
        });

        entry.root.add(model);
        entry.model = model;
        entry.loaded = true;

        // Animaciones del .glb
        if (gltf.animations && gltf.animations.length) {
          entry.mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = entry.mixer.clipAction(clip);
            action.play();
            entry.actions.push(action);
          });
        }

        console.log(`Fantasma ${i + 1} cargado`);
      },
      undefined,
      (err) => {
        console.error(`No se pudo cargar ${GHOST_MODELS[i].url}`, err);
      }
    );
  });

  // Raycast
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  /* ---------- Tamaño y posición de los fantasmas ---------- */
  const tagEls = [$("tag0"), $("tag1"), $("tag2")];

  function layout() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;

    renderer.setSize(w, h, false);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * BASE_CAM.z;
    const halfW = halfH * aspect;
    const portrait = aspect < 0.9;

    const size = portrait ? clamp(halfW * 0.95, 1.8, 2.8) : clamp(halfH * 0.58, 2.4, 3.2);
    const spots = portrait
      ? [
          [-halfW * 0.4, 4.4, 0.3],
          [halfW * 0.46, 2.9, 0.6],
          [-halfW * 0.34, 1.2, 0.9],
        ]
      : [
          [-clamp(halfW * 0.5, 2.6, 6), 3.0, 0.4],
          [0, 3.7, -0.8],
          [clamp(halfW * 0.5, 2.6, 6), 2.9, 0.4],
        ];

    ghosts.forEach((gs, i) => {
      gs.size = size;
      gs.target.set(spots[i][0], spots[i][1], spots[i][2]);

      if (gs.base.lengthSq() === 0) gs.base.copy(gs.target);
    });

    // Luna
    const dist = BASE_CAM.z + 30;
    const mHalfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist * aspect;

    moon.position.set(-clamp(mHalfW * 0.55, 6, 20), portrait ? 11 : 10, -30);
    moonGlow.position.copy(moon.position);
    moonGlow.position.z -= 0.5;
  }

  /* ---------- Interacción ---------- */
  let px = 0;
  let py = 0;
  let tx = 0;
  let ty = 0;
  let downX = 0;
  let downY = 0;
  let downT = 0;
  let dragging = false;

  function pick(clientX, clientY) {
    pointer.x = (clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const targets = ghosts.filter((e) => e.loaded).map((e) => e.root);
    const hits = raycaster.intersectObjects(targets, true);
    if (!hits.length) return -1;

    let obj = hits[0].object;
    while (obj && !ghosts.some((e) => e.root === obj)) obj = obj.parent;
    return ghosts.findIndex((e) => e.root === obj);
  }

  canvas.addEventListener("pointermove", (e) => {
    if (activePanel) return;

    tx = (e.clientX / window.innerWidth) * 2 - 1;
    ty = (e.clientY / window.innerHeight) * 2 - 1;

    if (e.pointerType === "mouse") {
      const hit = pick(e.clientX, e.clientY);

      ghosts.forEach((gs, i) => {
        gs.g.hover = i === hit;
      });

      canvas.style.cursor = hit >= 0 ? "pointer" : dragging ? "grabbing" : "grab";

      tagEls.forEach((el, i) => el.classList.toggle("hot", i === hit));
    }
  });

  canvas.addEventListener("pointerdown", (e) => {
    downX = e.clientX;
    downY = e.clientY;
    downT = performance.now();
    dragging = true;
  });

  canvas.addEventListener("pointerup", (e) => {
    dragging = false;

    if (activePanel) return;

    const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
    const quick = performance.now() - downT < 500;

    if (moved < 10 && quick) {
      const hit = pick(e.clientX, e.clientY);

      if (hit >= 0) {
        ghosts[hit].pop = 1;
        openPanel(ghosts[hit].g.panel, tagEls[hit]);
      }
    }
  });

  canvas.addEventListener("pointerleave", () => {
    dragging = false;
    ghosts.forEach((gs) => {
      gs.g.hover = false;
    });
    tagEls.forEach((el) => el.classList.remove("hot"));
  });

  window.addEventListener("resize", layout);

  layout();

  /* ---------- Bucle de dibujo ---------- */
  const proj = new THREE.Vector3();
  let frame = 0;
  let first = true;

  function animate(now) {
    requestAnimationFrame(animate);
    controls.update();   // ← importante para que el damping funcione

    frame += 1;
    if (activePanel && frame % 2 === 0) return;

    const t = now * 0.001;



    // Fantasmas (GLB)
    ghosts.forEach((entry) => {
      const g = entry.g;

      updateGhostState(g, t);

      entry.base.lerp(entry.target, 0.08);

      const bob  = reduceMotion ? 0 : Math.sin(t * 1.4 + entry.phase) * 0.2;
      const sway = reduceMotion ? 0 : Math.sin(t * 0.7 + entry.phase) * 0.14;

      entry.pop = Math.max(0, entry.pop - 0.04);

      const dimmed = activePanel && !g.active ? 0.35 : 1;
      const grow   = 1 + g.excited * 0.07 + Math.sin(entry.pop * Math.PI) * 0.18;

      entry.root.position.set(entry.base.x + sway, entry.base.y + bob, entry.base.z);
      entry.root.scale.setScalar(0.3 + 0.7 * dimmed + (grow - 1));

      if (!reduceMotion) {
        entry.root.rotation.y = Math.sin(t * 0.9 + entry.phase) * 0.15;
      }

      entry.light.position.set(
        entry.root.position.x,
        entry.root.position.y + 1.2,
        entry.root.position.z + 1
      );
      entry.light.intensity =
        (20 + g.excited * 14) *
        (0.9 + Math.sin(t * 3 + entry.phase) * 0.1) *
        dimmed;

      if (entry.mixer) entry.mixer.update(0.016);

      // Etiqueta sigue al modelo
      proj.copy(entry.root.position);
      proj.y -= entry.size * 0.45;
      proj.project(camera);

      const sx = (proj.x * 0.5 + 0.5) * window.innerWidth;
      const sy = (-proj.y * 0.5 + 0.5) * window.innerHeight;

      tagEls[g.index].style.transform =
        `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) translate(-50%, 0)`;
    });

    // Velas, niebla, murciélagos, estrellas
    candles.forEach((c) => {
      const f = 0.85 + Math.sin(t * 9 + c.seed) * 0.1 + Math.sin(t * 5.3 + c.seed * 2) * 0.08;

      c.flame.scale.set(0.9 * f, 0.9 * f, 1);
    });

    if (!reduceMotion) {
      mists.forEach((m) => {
        m.sp.position.x = m.baseX + Math.sin(t * m.speed + m.phase) * 3;
      });

      bats.forEach((b) => {
        const a = t * b.speed + b.phase;

        b.sp.position.set(Math.cos(a) * b.radius - 4, b.cy + Math.sin(a * 2) * 0.8, -12 + Math.sin(a) * 6);

        const up = Math.sin(t * b.flap + b.phase) > 0;

        b.mat.map = up ? batTexUp : batTexDown;
      });

      stars.material.opacity = 0.75 + Math.sin(t * 0.8) * 0.12;
    }

    renderer.render(scene, camera);

    if (first) {
      first = false;
      document.body.classList.add("ready");
    }
  }

  requestAnimationFrame(animate);
}

/* ============================================================
   RESPALDO SIN 3D
   ============================================================ */
function initFallback() {
  const box = $("fallback");

  box.hidden = false;
  $("tags").hidden = true;
  $("scene").hidden = true;

  const labels = ["Fotos", "Música", "Carta"];

  ghostStates.forEach((g, i) => {
    const btn = document.createElement("button");

    btn.type = "button";
    btn.className = "ghost2d";
    btn.setAttribute("aria-label", `Abrir ${labels[i].toLowerCase()}`);

    const label = document.createElement("span");

    label.textContent = labels[i];
    btn.append(g.canvas, label);

    btn.addEventListener("click", () => openPanel(g.panel, btn));
    btn.addEventListener("pointerenter", () => {
      g.hover = true;
    });
    btn.addEventListener("pointerleave", () => {
      g.hover = false;
    });

    box.appendChild(btn);
  });

  document.body.classList.add("ready");
}

/* ============================================================
   INICIO
   ============================================================ */
try {
  initScene();
} catch (error) {
  console.error("No se pudo iniciar el 3D, se usa la versión simple:", error);
  initFallback();
}

window.addEventListener("resize", () => {
  if (activePanel === "letter") fitLetter();
});

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    if (activePanel === "letter") fitLetter();
  });
}