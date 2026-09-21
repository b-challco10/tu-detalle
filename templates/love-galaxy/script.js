(function () {
  "use strict";

  const data = window.__TUDETALLE_DATA__ || {};

  /*
   * Renderizar campos de texto
   */

  document
    .querySelectorAll("[data-field]")
    .forEach((element) => {
      const field = element.getAttribute("data-field");

      if (!field) {
        return;
      }

      const value = data[field];

      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return;
      }

      /*
       * Imagen
       */

      if (element.tagName === "IMG") {
        element.src = String(value);

        element.style.display = "block";

        const placeholder =
          document.querySelector(".photo-placeholder");

        if (placeholder) {
          placeholder.style.display = "none";
        }

        return;
      }

      /*
       * Audio
       */

      if (element.tagName === "AUDIO") {
        element.src = String(value);
        return;
      }

      /*
       * Texto
       */

      element.textContent = String(value);
    });

  /*
   * Música
   */

  const audio =
    document.querySelector("[data-audio]");

  const musicButton =
    document.querySelector("[data-music-button]");

  if (!audio || !musicButton) {
    return;
  }

  if (!data.song) {
    musicButton.style.display = "none";
    return;
  }

  musicButton.addEventListener("click", function () {
    if (audio.paused) {
      audio
        .play()
        .then(function () {
          musicButton.classList.add("playing");
          musicButton.textContent = "❚❚";
        })
        .catch(function () {
          console.log(
            "El navegador bloqueó la reproducción automática."
          );
        });
    } else {
      audio.pause();

      musicButton.classList.remove("playing");
      musicButton.textContent = "♪";
    }
  });

  audio.addEventListener("ended", function () {
    musicButton.classList.remove("playing");
    musicButton.textContent = "♪";
  });
})();