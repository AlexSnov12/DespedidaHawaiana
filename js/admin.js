const RSVP_TABLE = "rsvps_despedida";
const PHOTOS_BUCKET = "fotos-despedida";

const loginCard = document.getElementById("admin-login");
const panel = document.getElementById("admin-panel");
const passwordInput = document.getElementById("admin-password");
const loginBtn = document.getElementById("admin-login-btn");
const loginStatus = document.getElementById("admin-login-status");

loginBtn.addEventListener("click", () => {
  if (passwordInput.value === ADMIN_PASSWORD) {
    loginCard.hidden = true;
    panel.hidden = false;
    loadRsvps();
    loadGallery();
  } else {
    loginStatus.textContent = "Contraseña incorrecta.";
  }
});

passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loginBtn.click();
});

async function loadRsvps() {
  const tbody = document.getElementById("rsvp-tbody");
  const summary = document.getElementById("rsvp-summary");
  tbody.innerHTML = "";
  summary.textContent = "Cargando...";

  const { data, error } = await supabaseClient
    .from(RSVP_TABLE)
    .select("*")
    .order("creado", { ascending: false });

  if (error) {
    summary.textContent = "Error al cargar: " + error.message;
    return;
  }

  const confirmados = data.filter((r) => r.asistencia === "si");
  const totalPersonas = confirmados.reduce((sum, r) => sum + (r.acompanantes || 1), 0);
  summary.textContent = `${confirmados.length} confirmaciones de "sí" (${totalPersonas} personas en total) de ${data.length} respuestas.`;

  for (const row of data) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(row.nombre)}</td>
      <td>${row.asistencia === "si" ? "Sí" : "No"}</td>
      <td>${row.acompanantes ?? ""}</td>
      <td>${escapeHtml(row.restricciones || "")}</td>
      <td>${escapeHtml(row.mensaje || "")}</td>
      <td>${row.creado ? new Date(row.creado).toLocaleString("es-ES") : ""}</td>
    `;
    tbody.appendChild(tr);
  }
}

async function loadGallery() {
  const gallery = document.getElementById("admin-gallery");
  const summary = document.getElementById("gallery-summary");
  gallery.innerHTML = "";
  summary.textContent = "Cargando...";

  const { data, error } = await supabaseClient.storage.from(PHOTOS_BUCKET).list("", {
    limit: 1000,
    sortBy: { column: "created_at", order: "desc" }
  });

  if (error) {
    summary.textContent = "Error al cargar: " + error.message;
    return;
  }

  summary.textContent = `${data.length} foto(s).`;

  for (const file of data) {
    const { data: urlData } = supabaseClient.storage.from(PHOTOS_BUCKET).getPublicUrl(file.name);

    const wrap = document.createElement("div");
    wrap.className = "admin-photo";

    const img = document.createElement("img");
    img.src = urlData.publicUrl;
    img.loading = "lazy";
    img.alt = "Foto de la fiesta";

    const btn = document.createElement("button");
    btn.textContent = "Eliminar";
    btn.addEventListener("click", async () => {
      if (!confirm("¿Eliminar esta foto? No se puede deshacer.")) return;
      btn.disabled = true;
      btn.textContent = "Eliminando...";
      const { error: delError } = await supabaseClient.storage.from(PHOTOS_BUCKET).remove([file.name]);
      if (delError) {
        alert("Error al eliminar: " + delError.message);
        btn.disabled = false;
        btn.textContent = "Eliminar";
        return;
      }
      wrap.remove();
      summary.textContent = `${gallery.children.length} foto(s).`;
    });

    wrap.appendChild(img);
    wrap.appendChild(btn);
    gallery.appendChild(wrap);
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
