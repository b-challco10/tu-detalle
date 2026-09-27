/* ============================================================
   DATOS DINÁMICOS (vienen del editor de la plataforma)
   ============================================================ */
const data = window.__TUDETALLE_DATA__ || {};

/* ============================================================
   ELEMENTOS DEL DOM
   ============================================================ */
const envelopeWrapper = document.getElementById('envelopeWrapper');
const envelopeFlap = document.getElementById('envelopeFlap');
const waxSeal = document.getElementById('waxSeal');
const letter = document.getElementById('letter');
const instruction = document.getElementById('instruction');
const typedText = document.getElementById('typedText');
const heartsContainer = document.getElementById('heartsContainer');
const letterTitle = document.getElementById('letterTitle');
const letterDate = document.getElementById('letterDate');

let isOpen = false;

/* ============================================================
   TÍTULO DE LA CARTA
   ============================================================ */
if (data.titulo && data.titulo.trim() !== "") {
  letterTitle.textContent = data.titulo;
}

/* ============================================================
   FECHA AUTOMÁTICA (fecha actual al abrir la carta)
   ============================================================ */
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function setCurrentDate() {
  const now = new Date();
  const dia = now.getDate();
  const mes = MESES[now.getMonth()];
  const anio = now.getFullYear();
  letterDate.textContent = `${dia} de ${mes}, ${anio}`;
}
setCurrentDate();

/* ============================================================
   MENSAJE DE LA CARTA
   ============================================================ */
const DEFAULT_MESSAGE = "Quería recordarte lo especial que eres para mí. Cada momento a tu lado se ha convertido en un recuerdo invaluable que guardo en mi corazón. Gracias por estar siempre ahí, por tu sonrisa que ilumina mis días y por hacer de lo cotidiano algo extraordinario. Esta carta es solo un pequeño detalle para decirte... te quiero. 💕";

const message = (data.subtitulo && data.subtitulo.trim() !== "")
  ? data.subtitulo
  : DEFAULT_MESSAGE;

/* ============================================================
   FOTOS EN LOS POLAROIDS (3 fotos)
   ============================================================ */
function setPolaroidPhoto(elementId, src) {
  const el = document.getElementById(elementId);
  if (!el || !src) return;

  // Limpiar contenido por defecto (emoji)
  el.innerHTML = "";
  el.style.background = "none";

  // Insertar imagen
  const img = document.createElement("img");
  img.src = src;
  img.alt = "Recuerdo";
  img.loading = "lazy";
  el.appendChild(img);
}

if (data.photo1) setPolaroidPhoto("photo1", data.photo1);
if (data.photo2) setPolaroidPhoto("photo2", data.photo2);
if (data.photo3) setPolaroidPhoto("photo3", data.photo3);

/* ============================================================
   ANIMACIÓN DE ENTRADA
   ============================================================ */
window.addEventListener('load', () => {
  envelopeWrapper.style.opacity = '0';
  envelopeWrapper.style.transform = 'translateY(50px) scale(0.8)';
  envelopeWrapper.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

  setTimeout(() => {
    envelopeWrapper.style.opacity = '1';
    envelopeWrapper.style.transform = 'translateY(0) scale(1)';
  }, 300);
});

/* ============================================================
   ABRIR SOBRE
   ============================================================ */
function openEnvelope() {
  if (isOpen) return;
  isOpen = true;

  instruction.classList.add('hidden');
  waxSeal.classList.add('broken');

  createHeartBurst();

  setTimeout(() => {
    envelopeFlap.style.transform = 'rotateX(-180deg)';
  }, 300);

  setTimeout(() => {
    letter.style.transform = 'translateX(-50%) translateY(-180px) scale(1)';
    letter.style.zIndex = '50';
  }, 800);

  setTimeout(() => {
    letter.classList.add('expanded');
    setTimeout(() => {
      startTyping();
    }, 400);
  }, 1600);
}

/* ============================================================
   EFECTO DE ESCRITURA
   ============================================================ */
function startTyping() {
  let i = 0;
  typedText.innerHTML = '';

  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  typedText.appendChild(cursor);

  const typeInterval = setInterval(() => {
    if (i < message.length) {
      const char = message.charAt(i);
      const textNode = document.createTextNode(char);
      typedText.insertBefore(textNode, cursor);
      i++;
    } else {
      clearInterval(typeInterval);
      setTimeout(() => {
        cursor.style.transition = 'opacity 0.5s';
        cursor.style.opacity = '0';
        setTimeout(() => cursor.remove(), 500);
      }, 1000);
    }
  }, 35);
}

/* ============================================================
   EXPLOSIÓN DE CORAZONES
   ============================================================ */
function createHeartBurst() {
  const hearts = ['❤️', '💖', '💕', '💗', '💓', '💘', '🌸', '✨'];
  const rect = waxSeal.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 24; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.left = centerX + 'px';
    heart.style.top = centerY + 'px';
    heart.style.fontSize = (14 + Math.random() * 16) + 'px';

    const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.5;
    const distance = 80 + Math.random() * 120;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    heart.style.setProperty('--tx', tx + 'px');
    heart.style.setProperty('--ty', ty + 'px');
    heart.style.setProperty('--rot', (Math.random() * 360 - 180) + 'deg');
    heart.style.animationDelay = (Math.random() * 0.3) + 's';

    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 3500);
  }
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
waxSeal.addEventListener('click', (e) => {
  e.stopPropagation();
  openEnvelope();
});

envelopeWrapper.addEventListener('click', (e) => {
  if (!isOpen && e.target !== waxSeal && !waxSeal.contains(e.target)) {
    openEnvelope();
  }
});

/* Parallax con el mouse */
document.addEventListener('mousemove', (e) => {
  if (isOpen) return;

  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  envelopeWrapper.style.transform =
    `translateY(${Math.sin(Date.now() / 1000) * 5}px) rotateX(${-y}deg) rotateY(${x}deg)`;
});

/* Touch */
document.addEventListener('touchstart', (e) => {
  if (!isOpen && envelopeWrapper.contains(e.target)) {
    e.preventDefault();
    openEnvelope();
  }
}, { passive: false });

/* Scroll dentro de la carta */
letter.addEventListener('wheel', (e) => {
  if (letter.classList.contains('expanded')) {
    e.stopPropagation();
  }
}, { passive: true });