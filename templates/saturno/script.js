(function () {
  const data = window.__TUDETALLE_DATA__ || {};

  // Color de corazones
  const heartColor = data.heartColor || "#ff6b9d";
  document.documentElement.style.setProperty("--heart-color", heartColor);

  // Textos
  const setText = (id, value, fallback = "") => {
    const el = document.getElementById(id);
    if (el) el.textContent = value || fallback;
  };

  setText("mainTitle", data.mainTitle, "Nuestro Universo");
  setText("subtitle", data.subtitle, "Entre anillos y estrellas");
  setText("message", data.message, "Este es nuestro pequeño universo…");
  setText("fromName", data.fromName, "Yo");
  setText("toName", data.toName, "Tú");

  // Imágenes
  const setImage = (id, src) => {
    const img = document.getElementById(id);
    if (!img) return;
    if (src) {
      img.src = src;
      img.style.display = "block";
    } else {
      img.style.display = "none";
      const card = img.closest(".photo-card");
      if (card) card.style.display = "none";
    }
  };

  setImage("photo1", data.photo1);
  setImage("photo2", data.photo2);
  setImage("photo3", data.photo3);
  setImage("photo4", data.photo4);

  // Música
  const audio = document.getElementById("bgMusic");
  if (data.bgMusic && audio) {
    audio.src = data.bgMusic;
    audio.volume = 0.32;
    audio.play().catch(() => {});
  }

  // Estrellas
  const starsContainer = document.getElementById("stars");
  for (let i = 0; i < 140; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size = Math.random() * 2.2 + 0.4;
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.setProperty("--dur", (Math.random() * 3.5 + 1.8) + "s");
    star.style.animationDelay = Math.random() * 5 + "s";
    starsContainer.appendChild(star);
  }

  // Corazones 3D flotantes
  const heartsContainer = document.getElementById("hearts-container");
  const symbols = ["♥", "❤", "💕", "💖", "💗"];

  function spawnHeart() {
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.bottom = "-40px";
    heart.style.fontSize = (Math.random() * 16 + 14) + "px";
    const duration = Math.random() * 7 + 11;
    heart.style.animationDuration = duration + "s";
    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), duration * 1000 + 500);
  }

  // Generar continuamente
  setInterval(spawnHeart, 650);
  for (let i = 0; i < 8; i++) {
    setTimeout(spawnHeart, i * 350);
  }
})();