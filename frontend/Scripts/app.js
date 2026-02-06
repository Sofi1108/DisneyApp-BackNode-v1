const API =
  "https://fantastic-invention-jj5rg46jjg6gfq7xg-3000.app.github.dev/api/movies";

// Buscamos el contenedor de forma más flexible
const getContenedor = () => {
  return (
    document.querySelector(".seccion-resultados .rejilla-peliculas") ||
    document.querySelector(".seccion-explorar .rejilla-peliculas") ||
    document.querySelector(".rejilla-peliculas")
  );
};

const $contenedorRecomendados = document.querySelector(
  ".seccion-peliculas .rejilla-peliculas",
);

let categoriaActual = null;

async function LoadMovies(categoriaID = null, ordenAño = "desc") {
  categoriaActual = categoriaID;
  const $contenedorPrincipal = getContenedor();

  try {
    const response = await fetch(API);
    const data = await response.json();
    let movies = data.movies;

    const path = window.location.pathname;
    const esHome = path.endsWith("index.html") || path === "/" || path === "";
    const esPaginaSeries = path.includes("series.html");
    const esPaginaPeliculas = path.includes("peliculas.html");

    // 1. Filtrar por tipo y categoría
    let filtrados = movies.filter((item) => {
      let pasaTipo =
        esHome ||
        (esPaginaSeries ? item.SeriePelicula === 0 : item.SeriePelicula === 1);
      let pasaCategoria = !categoriaID || item.categoria_id == categoriaID;
      return pasaTipo && pasaCategoria;
    });

    // 2. Ordenar por año
    filtrados.sort((a, b) => {
      return ordenAño === "desc" ? b.año - a.año : a.año - b.año;
    });

    // Función para generar HTML
    const renderHTML = (lista) => {
      return lista
        .map(
          (peli) => `
                <div class="tarjeta-pelicula">
                    <div class="portada-pelicula">
                        <img src="${peli.url_portada}" alt="${peli.titulo}" loading="lazy" />
                    </div>
                    <div class="info-tarjeta">
                        <span>${peli.titulo}</span>
                        <small style="display:block; color:var(--gris-texto);">${peli.año}</small>
                    </div>
                </div>
            `,
        )
        .join("");
    };

    // 3. Renderizar en el contenedor principal
    if ($contenedorPrincipal) {
      $contenedorPrincipal.innerHTML = renderHTML(filtrados);
    }

    // 4. Renderizar Recomendados (si estamos en el index o paginas de tipo)
    if ($contenedorRecomendados && !categoriaID) {
      const recomendados = movies
        .filter(
          (item) =>
            esHome ||
            (esPaginaSeries
              ? item.SeriePelicula === 0
              : item.SeriePelicula === 1),
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);

      $contenedorRecomendados.innerHTML = renderHTML(recomendados);
    }
  } catch (error) {
    console.error("Error cargando pelis:", error);
    if ($contenedorPrincipal)
      $contenedorPrincipal.innerHTML = "<p>Error al cargar el contenido.</p>";
  }
}

// Exportar funciones al objeto window para year.js
window.LoadMovies = LoadMovies;
window.getCategoriaActual = () => categoriaActual;

document.addEventListener("DOMContentLoaded", () => {
  LoadMovies();

  // Eventos para los enlaces de categorías
  const categoryLinks = document.querySelectorAll(".menu-desplegable a");
  const botonTexto = document.querySelector(".boton-filtro-genero");

  categoryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // Solo actuar si tiene data-categoria (evitar cerrar sesión, etc)
      if (link.hasAttribute("data-categoria")) {
        e.preventDefault();
        const catId = link.getAttribute("data-categoria");

        if (botonTexto && !link.closest(".acciones-usuario")) {
          botonTexto.innerHTML = `${link.textContent} <span class="material-symbols-outlined">expand_more</span>`;
        }

        const btnYear = document.getElementById("btn-ordenar-año");
        const orden = btnYear ? btnYear.getAttribute("data-orden") : "desc";

        LoadMovies(catId, orden);
      }
    });
  });
});
