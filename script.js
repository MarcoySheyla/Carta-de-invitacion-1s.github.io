const container = document.getElementById("container");
const flash = document.getElementById("flash");
const music = document.getElementById("music");

let started = false;

music.volume = 0.4;

container.addEventListener("click", () => {
  if (started) return;
  started = true;

  // activa animación general
  container.offsetHeight; // 🔥 fuerza reflow (clave)
  container.classList.add("open");

  // música
  music?.play().catch(() => {});

  // flash antes del final
  setTimeout(() => {
    flash.classList.add("active");
  }, 3500);

  // cambio de página final (5s total)
  setTimeout(() => {
    window.location.href = "pagina2.html";
  }, 5000);
});