// Inicialización compartida
(function init() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  window.addEventListener("resize", () => {
    document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
  });
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) document.documentElement.classList.add("ios");
  if (/Android/.test(ua)) document.documentElement.classList.add("android");
})();

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const container = document.getElementById("container");
  const flash = document.getElementById("flash");
  let lastTouchEnd = 0, started = false;

  // Prevenir zoom en doble clic
  document.addEventListener("touchend", (e) => {
    if (Date.now() - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = Date.now();
  }, false);

  // Manejar orientación
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";
    }, 100);
  });

  // Prevenir zoom multi-touch
  document.addEventListener("touchmove", (e) => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });

  if (container) {
    container.addEventListener("click", () => {
      if (started) return;
      started = true;
      document.body.style.overflow = "hidden";
      container.offsetHeight; // Fuerza reflow
      container.classList.add("open");
      setTimeout(() => flash?.classList.add("active"), 1400);
      setTimeout(() => window.location.href = "pagina2.html", 2000);
    });

    if (window.innerWidth <= 768) {
      container.style.cursor = "pointer";
      container.setAttribute("role", "button");
      container.setAttribute("aria-label", "Haz clic para continuar");
      container.setAttribute("tabindex", "0");
      container.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          container.click();
        }
      });
    }
  }
});