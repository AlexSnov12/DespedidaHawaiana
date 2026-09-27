const PAGE_SIZE = 24;
const BUCKET = "fotos-despedida";

const galleryGrid = document.getElementById("gallery-grid");
const loadMoreBtn = document.getElementById("gallery-load-more");
let currentOffset = 0;

async function loadGalleryPage(append) {
  const offset = append ? currentOffset : 0;

  const { data, error } = await supabaseClient.storage.from(BUCKET).list("", {
    limit: PAGE_SIZE,
    offset,
    sortBy: { column: "created_at", order: "desc" }
  });

  if (error) {
    console.error(error);
    return;
  }

  if (!append) galleryGrid.innerHTML = "";

  for (const file of data) {
    const { data: urlData } = supabaseClient.storage.from(BUCKET).getPublicUrl(file.name);
    const img = document.createElement("img");
    img.src = urlData.publicUrl;
    img.loading = "lazy";
    img.alt = "Foto de la fiesta";
    galleryGrid.appendChild(img);
  }

  currentOffset = offset + data.length;
  loadMoreBtn.hidden = data.length < PAGE_SIZE;
}

loadMoreBtn.addEventListener("click", () => loadGalleryPage(true));

async function uploadFiles(files, statusEl) {
  if (!files.length) return;
  statusEl.textContent = `Subiendo ${files.length} foto(s)...`;

  let done = 0;
  for (const file of files) {
    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const { error } = await supabaseClient.storage.from(BUCKET).upload(safeName, file);
    if (error) {
      console.error(error);
      statusEl.textContent = "Hubo un error subiendo una foto. Inténtalo de nuevo.";
      return;
    }
    done++;
    statusEl.textContent = `Subiendo ${done}/${files.length}...`;
  }

  statusEl.textContent = "¡Fotos subidas! Gracias.";
  loadGalleryPage(false);
}

document.getElementById("party-upload").addEventListener("change", (e) => {
  uploadFiles(Array.from(e.target.files), document.getElementById("party-upload-status"));
  e.target.value = "";
});

loadGalleryPage(false);
