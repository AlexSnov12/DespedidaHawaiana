const rsvpForm = document.getElementById("rsvp-form");
const rsvpStatus = document.getElementById("rsvp-status");

rsvpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  rsvpStatus.textContent = "Enviando...";

  const formData = new FormData(rsvpForm);
  const entry = {
    nombre: formData.get("nombre").trim(),
    asistencia: formData.get("asistencia"),
    acompanantes: Number(formData.get("acompanantes")) || 1,
    restricciones: formData.get("restricciones").trim(),
    mensaje: formData.get("mensaje").trim()
  };

  const { error } = await supabaseClient.from("rsvps_despedida").insert([entry]);

  if (error) {
    console.error(error);
    rsvpStatus.textContent = "Hubo un error al enviar. Inténtalo de nuevo.";
  } else {
    rsvpStatus.textContent = "¡Gracias! Confirmación recibida.";
    rsvpForm.reset();
  }
});
