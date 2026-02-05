const API =
  "https://fantastic-invention-jj5rg46jjg6gfq7xg-3000.app.github.dev/api/movies";
const $contenedor = document.querySelector(".rejilla-peliculas");

let currentCategory = null;

async function LoadMovies(categoriaID = null) {
  try {
    const response = await fetch(API);
    const data = await response.json();
    const allItems = data.movies;

    const path = window.location.pathname;

    const esHome = path.endsWith("index.html") || path === "/" || path === "";
    const esPaginaSeries = path.includes("series.html");
    const esPaginaPeliculas = path.includes("peliculas.html");

    // Dentro de LoadMovies(categoriaID = null)
    const filtrados = allItems.filter((item) => {
      // 1. Filtro de página (Series o Pelis)
      let pasaTipo = false;
      if (esHome) pasaTipo = true;
      else if (esPaginaSeries) pasaTipo = item.SeriePelicula === 0;
      else if (esPaginaPeliculas) pasaTipo = item.SeriePelicula === 1;

      // 2. Filtro de categoría (EL CAMBIO IMPORTANTE AQUÍ)
      let pasaCategoria = true;
      if (categoriaID) {
        pasaCategoria = item.categoria_id == categoriaID;
      }

      return pasaTipo && pasaCategoria;
    });

    // 3. Renderizado fluido
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

// Event Listeners para Categorías
document.addEventListener("DOMContentLoaded", () => {
  const categoryLinks = document.querySelectorAll(
    ".dropdown-categorias .menu-desplegable a",
  );

  categoryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const categoriaID = e.currentTarget.getAttribute("data-categoria");
      console.log("Filtrando por categoría:", categoriaID);
      LoadMovies(categoriaID);
    });
  });
});
