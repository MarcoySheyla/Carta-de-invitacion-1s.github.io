document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // Countdown
  const targetDate = new Date("August 1, 2026 00:00:00").getTime();
  function updateCountdown() {
    const distance = targetDate - Date.now();
    if (distance < 0) {
      ["days", "hours", "minutes", "seconds"].forEach(id => {
        document.getElementById(id).textContent = id === "days" ? "000" : "00";
      });
      return;
    }
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);
    const fmt = (n, p) => String(n).padStart(p, "0");
    document.getElementById("days").textContent = fmt(days, 3);
    document.getElementById("hours").textContent = fmt(hours, 2);
    document.getElementById("minutes").textContent = fmt(minutes, 2);
    document.getElementById("seconds").textContent = fmt(seconds, 2);
  }
  if (document.getElementById("countdown")) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Audio
  const music = document.querySelector("audio");
  const audioToggle = document.getElementById("audio-toggle");
  if (music && audioToggle) {
    function updateAudioButton() {
      const isPlaying = !music.paused;
      audioToggle.textContent = isPlaying ? "⏸ Pausar música" : "▶ Reproducir música";
      audioToggle.setAttribute("aria-pressed", isPlaying ? "true" : "false");
      audioToggle.classList.toggle("playing", isPlaying);
    }
    // Reproducir automáticamente al cargar
    music.volume = 0.35;
    music.play().catch(() => console.warn("Audio bloqueado por el navegador"));
    audioToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      if (music.paused) {
        music.play().catch(() => console.warn("Audio bloqueado"));
      } else {
        music.pause();
      }
      updateAudioButton();
    });
    document.body.addEventListener("pointerdown", () => {
      if (music.paused) {
        music.play().catch(() => {});
        updateAudioButton();
      }
    }, { once: true });
    updateAudioButton();
  }

  // Animaciones
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "50px" });

  document.querySelectorAll(".animate").forEach(el => observer.observe(el));
});
