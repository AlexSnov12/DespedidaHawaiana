// Fecha y hora de la despedida. Cambia esto a la fecha real (formato ISO, hora local).
const PARTY_DATE = new Date("2027-03-14T18:00:00");

document.getElementById("party-date-text").textContent =
  PARTY_DATE.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });

function updateCountdown() {
  const now = new Date();
  let diff = PARTY_DATE - now;

  if (diff <= 0) {
    document.getElementById("countdown").innerHTML = "<p>¡La fiesta ya fue!</p>";
    clearInterval(countdownInterval);
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);
  const mins = Math.floor(diff / (1000 * 60));
  diff -= mins * (1000 * 60);
  const secs = Math.floor(diff / 1000);

  document.getElementById("cd-days").textContent = String(days).padStart(2, "0");
  document.getElementById("cd-hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("cd-mins").textContent = String(mins).padStart(2, "0");
  document.getElementById("cd-secs").textContent = String(secs).padStart(2, "0");
}

updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);
