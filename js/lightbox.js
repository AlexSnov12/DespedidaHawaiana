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

  async function downloadCurrent() {
    const url = lightboxImg.src;
    if (!url) return;
    const label = downloadBtn.textContent;
    downloadBtn.disabled = true;
    downloadBtn.textContent = "Preparando...";
    try {
      const blob = await (await fetch(url)).blob();
      const name = decodeURIComponent(url.split("/").pop().split("?")[0]) || "foto.jpg";
      const file = new File([blob], name, { type: blob.type || "image/jpeg" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }
    } catch (err) {
      if (err.name !== "AbortError") window.open(url, "_blank");
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.textContent = label;
    }
  }

  downloadBtn.addEventListener("click", downloadCurrent);

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
