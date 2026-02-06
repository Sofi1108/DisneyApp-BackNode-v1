const inputBusqueda = document.getElementById("input-busqueda");
const btnLimpiar = document.getElementById("btn-limpiar");
const tituloResultados = document.getElementById("titulo-resultados");

const API =
  "https://fantastic-invention-jj5rg46jjg6gfq7xg-3000.app.github.dev/api/movies";
const $contenedor = document.querySelector(".rejilla-peliculas");

let currentCategory = null;

async function LoadMovies(categoriaID = null) {
  try {
    const response = await fetch(API);
    const data = await response.json();
    const allItems = data.movies;

    let htmlTemplate = "";

    filtrados.forEach((peli) => {
      htmlTemplate += `
        <div class="tarjeta-pelicula">
            <div class="portada-pelicula">
                <img src="${peli.url_portada}" alt="${peli.titulo}" loading="lazy" />
            </div>
            <div class="info-tarjeta">
                <span>${peli.titulo}</span>
            </div>
        </div>
      `;
    });

    $contenedor.innerHTML = htmlTemplate;
  } catch (error) {
    console.error("Error al cargar:", error);
    $contenedor.innerHTML = "<p>Error al conectar con la base de datos.</p>";
  }
}

// Inicializar
LoadMovies();

inputBusqueda.addEventListener("input", (e) => {
  const valor = e.target.value;

  // Mostrar/ocultar botón X
  btnLimpiar.style.display = valor.length > 0 ? "block" : "none";

  // Cambiar texto de ayuda
  if (valor.length > 0) {
    tituloResultados.textContent = `Resultados para: ${valor}`;
  } else {
    tituloResultados.textContent = "Explora contenido relacionado";
  }
});

btnLimpiar.addEventListener("click", () => {
  inputBusqueda.value = "";
  btnLimpiar.style.display = "none";
  tituloResultados.textContent = "Explora contenido relacionado";
  inputBusqueda.focus();
});
