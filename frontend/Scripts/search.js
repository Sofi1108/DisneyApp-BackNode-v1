const inputBusqueda = document.getElementById("input-busqueda");
const btnLimpiar = document.getElementById("btn-limpiar");
const tituloResultados = document.getElementById("titulo-resultados");
const $contenedor = document.querySelector(".rejilla-peliculas");

const API_BASE =
  "https://fantastic-invention-jj5rg46jjg6gfq7xg-3000.app.github.dev/api/movies";

function renderMovies(movies) {
  if (!movies || movies.length === 0) {
    $contenedor.innerHTML =
      "<p class='mensaje-vacio'>No se encontraron resultados para tu búsqueda.</p>";
    return;
  }

  $contenedor.innerHTML = movies
    .map(
      (peli) => `
        <div class="tarjeta-pelicula">
            <div class="portada-pelicula">
                <img src="${peli.url_portada}" alt="${peli.titulo}" loading="lazy" />
            </div>
            <div class="info-tarjeta">
                <span>${peli.titulo}</span>
            </div>
        </div>
    `,
    )
    .join("");
}

async function performSearch(query) {
  try {
    const response = await fetch(
      `${API_BASE}/search/q?query=${encodeURIComponent(query)}`,
    );
    const data = await response.json();

    if (data.ok) {
      renderMovies(data.movies);
    }
  } catch (error) {
    console.error("Error en la búsqueda:", error);
    $contenedor.innerHTML = "<p>Error al conectar con el servidor.</p>";
  }
}

async function loadInitialContent() {
  try {
    const response = await fetch(API_BASE);
    const data = await response.json();
    if (data.ok) renderMovies(data.movies);
  } catch (error) {
    console.error("Error inicial:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadInitialContent);

// Escuchar escritura
inputBusqueda.addEventListener("input", (e) => {
  const valor = e.target.value.trim();

  // Control del botón limpiar
  btnLimpiar.style.display = valor.length > 0 ? "block" : "none";

  if (valor.length > 0) {
    tituloResultados.textContent = `Resultados para: ${valor}`;
    performSearch(valor);
  } else {
    tituloResultados.textContent = "Explora contenido relacionado";
    loadInitialContent();
  }
});

// Botón de limpiar
btnLimpiar.addEventListener("click", () => {
  inputBusqueda.value = "";
  btnLimpiar.style.display = "none";
  tituloResultados.textContent = "Explora contenido relacionado";
  loadInitialContent();
  inputBusqueda.focus();
});
