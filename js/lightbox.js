(function () {
  const grid = document.getElementById("gallery-grid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  let currentIndex = 0;

  function getImages() {
    return Array.from(grid.querySelectorAll("img"));
  }

  function openLightbox(index) {
    const images = getImages();
    if (!images.length) return;
    currentIndex = (index + images.length) % images.length;
    lightboxImg.src = images[currentIndex].dataset.full || images[currentIndex].src;
    lightbox.hidden = false;
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
  }

  function showRelative(offset) {
    openLightbox(currentIndex + offset);
  }

  grid.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
      openLightbox(getImages().indexOf(e.target));
    }
  });

  const downloadBtn = document.getElementById("lightbox-download");
  const shareBtn = document.getElementById("lightbox-share");

  // Compartir archivos solo funciona en https y en navegadores que lo soportan.
  const canShareFiles = (() => {
    try {
      const probe = new File([""], "foto.jpg", { type: "image/jpeg" });
      return !!(navigator.canShare && navigator.canShare({ files: [probe] }));
    } catch (err) {
      return false;
    }
  })();
  shareBtn.hidden = !canShareFiles;

  async function withCurrentPhoto(btn, action) {
    const url = lightboxImg.src;
    if (!url) return;
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Preparando...";
    try {
      const blob = await (await fetch(url)).blob();
      const name = decodeURIComponent(url.split("/").pop().split("?")[0]) || "foto.jpg";
      await action(blob, name);
    } catch (err) {
      if (err.name !== "AbortError") window.open(url, "_blank");
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  }

  function downloadCurrent() {
    return withCurrentPhoto(downloadBtn, (blob, name) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
  }

  function shareCurrent() {
    return withCurrentPhoto(shareBtn, (blob, name) => {
      const file = new File([blob], name, { type: blob.type || "image/jpeg" });
      return navigator.share({ files: [file] });
    });
  }

  downloadBtn.addEventListener("click", downloadCurrent);
  shareBtn.addEventListener("click", shareCurrent);

  closeBtn.addEventListener("click", closeLightbox);
  prevBtn.addEventListener("click", () => showRelative(-1));
  nextBtn.addEventListener("click", () => showRelative(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showRelative(-1);
    if (e.key === "ArrowRight") showRelative(1);
  });
})();
