
// ========================================
// Init + DOMContentLoaded (VERSIÓN LIMPIA)
// ========================================
(() => {
  "use strict";

  // ---------- Viewport fix: --vh (fallback real en móviles) ----------
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  // Throttle con requestAnimationFrame para no recalcular de más
  let rafId = null;
  const onResize = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(setVH);
  };

  setVH();
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", () => setTimeout(setVH, 250), { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", onResize, { passive: true });
  }

  // ---------- Helpers ----------
  const byId = (id) => document.getElementById(id);

  // ---------- Main ----------
  document.addEventListener("DOMContentLoaded", () => {
    const container = byId("container");
    const contentPage2 = byId("content-page2");
    const flash = byId("flash");

    const music = byId("music");
    const audioToggle = byId("audio-toggle");

    let started = false;
    let countdownTimer = null;

    // ===== AUDIO (botón) =====
    const updateAudioButton = () => {
      if (!music || !audioToggle) return;
      const isPlaying = !music.paused;
      audioToggle.textContent = isPlaying ? "⏸ Pausar música" : "▶ Reproducir música";
      audioToggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
      audioToggle.classList.toggle("playing", isPlaying);
    };

    if (music && audioToggle) {
      music.volume = 0.35;

      audioToggle.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          if (music.paused) await music.play();
          else music.pause();
        } catch {
          // Autoplay/Play bloqueado por políticas del navegador
          // El usuario puede volver a pulsar el botón.
        }
        updateAudioButton();
      });

      music.addEventListener("play", updateAudioButton);
      music.addEventListener("pause", updateAudioButton);
      updateAudioButton();
    }

    // ===== COUNTDOWN (se inicia cuando se abre el sobre) =====
    const startCountdown = () => {
      const elDays = byId("days");
      const elHours = byId("hours");
      const elMinutes = byId("minutes");
      const elSeconds = byId("seconds");

      if (!elDays || !elHours || !elMinutes || !elSeconds) return;

      const targetDate = new Date("August 1, 2026 00:00:00").getTime();
      const fmt = (n, p) => String(n).padStart(p, "0");

      const tick = () => {
        const distance = targetDate - Date.now();

        if (distance <= 0) {
          elDays.textContent = "000";
          elHours.textContent = "00";
          elMinutes.textContent = "00";
          elSeconds.textContent = "00";
          if (countdownTimer) clearInterval(countdownTimer);
          return;
        }

        const days = Math.floor(distance / 86400000);
        const hours = Math.floor((distance % 86400000) / 3600000);
        const minutes = Math.floor((distance % 3600000) / 60000);
        const seconds = Math.floor((distance % 60000) / 1000);

        elDays.textContent = fmt(days, 3);
        elHours.textContent = fmt(hours, 2);
        elMinutes.textContent = fmt(minutes, 2);
        elSeconds.textContent = fmt(seconds, 2);
      };

      tick();
      countdownTimer = setInterval(tick, 1000);
    };

    // ===== ANIMACIONES (IntersectionObserver) =====
    const setupAnimations = () => {
      const els = document.querySelectorAll(".animate");
      if (!els.length) return;

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: "50px" });

      els.forEach((el) => observer.observe(el));
    };

    setupAnimations(); // puede ejecutarse ya

    // ===== SOBRE -> ABRIR =====
    const openEnvelope = async () => {
      if (!container || !contentPage2) return;
      if (started) return;
      started = true;

      document.body.style.overflow = "hidden";
      void container.offsetHeight; // reflow para disparar transición

      container.classList.add("open");

      setTimeout(() => flash?.classList.add("active"), 900);

      setTimeout(async () => {
        container.style.display = "none";
        contentPage2.classList.remove("content-page2-hidden");
        contentPage2.classList.add("content-page2-visible");

        document.body.style.overflow = "auto";
        window.scrollTo(0, 0);

        // Iniciar contador cuando ya está visible
        startCountdown();

        // Reproducir música (hay gesto del usuario)
        if (music) {
          try { await music.play(); } catch {}
          updateAudioButton();
        }
      }, 1400);
    };

    if (container) {
      // Accesibilidad: también por teclado en desktop/móvil
      container.setAttribute("role", "button");
      container.setAttribute("tabindex", "0");
      container.setAttribute("aria-label", "Haz clic para abrir la invitación");

      container.addEventListener("click", openEnvelope);
      container.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openEnvelope();
        }
      });
    }
  });
})();
