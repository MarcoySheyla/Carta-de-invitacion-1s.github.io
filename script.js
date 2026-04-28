const container = document.getElementById("container");
const flash = document.getElementById("flash");

let started = false;


container.addEventListener("click", () => {
  if (started) return;
  started = true;

  // activa animación general
  container.offsetHeight; // 🔥 fuerza reflow (clave)
  container.classList.add("open");


// flash cerca del final (1.4s)
setTimeout(() => {
  flash.classList.add("active");
}, 1400);

// cambio de página exactamente a los 2s
setTimeout(() => {
  window.location.href = "pagina2.html";
}, 2000);

});