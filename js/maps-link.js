(function () {
  const link = document.getElementById("party-place-link");
  if (!link) return;

  const isAndroid = /Android/i.test(navigator.userAgent);

  if (isAndroid) {
    link.href = "https://www.google.com/maps/search/?api=1&query=27.992518,-111.000396";
  }
  // iPhone/iPad y el resto (desktop, etc.) se quedan con el link de Apple Maps del HTML.
})();
