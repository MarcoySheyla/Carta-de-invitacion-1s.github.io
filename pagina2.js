window.addEventListener("load", () => {

  // Música
  const music = document.getElementById("music");
  if (music) {
    music.volume = 0.35;
    music.play().catch(() => {});
  }

  // Video
  const video = document.getElementById("butterflyVideo");
  if (video) {
    video.play().catch(() => {});
  }

});