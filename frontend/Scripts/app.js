const API =
  "https://fantastic-invention-jj5rg46jjg6gfq7xg-3000.app.github.dev/api/movies";

// Selectores de contenedores
const getContenedor = () => {
  return (
    document.querySelector(".seccion-resultados #contenedor-resultados") ||
    document.querySelector(".seccion-explorar .rejilla-peliculas") ||
    document.querySelector(".rejilla-peliculas")
  );
};
const $contenedorRecomendados = document.querySelector(
  ".seccion-peliculas .rejilla-peliculas",
);

// Estado global de filtros
let filtroCategoriaActual = null;
let filtroSagaActual = null;

/**
 * Función principal: Carga, Filtra y Ordena el contenido
 */
async function LoadMovies(
  categoriaID = null,
  ordenAño = "desc",
  sagaID = null,
) {
  filtroCategoriaActual = categoriaID;
  filtroSagaActual = sagaID;

  const $contenedorPrincipal = getContenedor();

  try {
    const response = await fetch(API);
    const data = await response.json();
    let movies = data.movies;

    const path = window.location.pathname;
    const esHome = path.endsWith("index.html") || path === "/" || path === "";
    const esPaginaSeries = path.includes("series.html");
    const esPaginaPeliculas = path.includes("peliculas.html");

    // 1. FILTRADO MULTIPLE (Tipo + Categoría + Saga)
    let filtrados = movies.filter((item) => {
      // Filtro por página (Serie vs Película)
      let pasaTipo =
        esHome ||
        (esPaginaSeries ? item.SeriePelicula === 0 : item.SeriePelicula === 1);

      // Filtro por categoría (Género)
      let pasaCategoria = !categoriaID || item.categoria_id == categoriaID;

      // Filtro por Saga (Columna 'saga' de la base de datos)
      let pasaSaga = !sagaID || item.saga == sagaID;

      return pasaTipo && pasaCategoria && pasaSaga;
    });

    // 2. ORDENACIÓN POR AÑO
    filtrados.sort((a, b) => {
      return ordenAño === "desc" ? b.año - a.año : a.año - b.año;
    });

    // 3. GENERADOR DE HTML (Incluye link al Reproductor)
    const renderHTML = (lista) => {
      return lista
        .map(
          (peli) => `
                <div class="tarjeta-pelicula" onclick="window.location.href='player.html?id=${peli.id}'" style="cursor:pointer;">
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

    // 4. INYECTAR EN EL HTML
    if ($contenedorPrincipal) {
      $contenedorPrincipal.innerHTML = renderHTML(filtrados);
    }

    // Renderizado de recomendados (solo si no hay filtros activos)
    if ($contenedorRecomendados && !categoriaID && !sagaID) {
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
    console.error("Error en LoadMovies:", error);
    if ($contenedorPrincipal)
      $contenedorPrincipal.innerHTML =
        "<p>Error al conectar con la base de datos.</p>";
  }
}

// Exportar funciones para que year.js y otros scripts externos las vean
window.LoadMovies = LoadMovies;
window.getCategoriaActual = () => filtroCategoriaActual;
window.getSagaActual = () => filtroSagaActual;

/**
 * Inicialización de Eventos al cargar el DOM
 */
document.addEventListener("DOMContentLoaded", () => {
  LoadMovies();

  // Eventos para CATEGORÍAS (Géneros)
  const categoryLinks = document.querySelectorAll(
    ".dropdown-categorias .menu-desplegable a",
  );
  const botonGeneroTexto = document.querySelector(".boton-filtro-genero");

  categoryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.hasAttribute("data-categoria")) {
        e.preventDefault();
        const catId = link.getAttribute("data-categoria");

        if (botonGeneroTexto) {
          botonGeneroTexto.innerHTML = `${link.textContent} <span class="material-symbols-outlined">expand_more</span>`;
        }

        const btnYear = document.getElementById("btn-ordenar-año");
        const orden = btnYear ? btnYear.getAttribute("data-orden") : "desc";

        LoadMovies(catId, orden, filtroSagaActual);
      }
    });
  });

  // Eventos para SAGAS
  const sagaLinks = document.querySelectorAll(
    ".dropdown-sagas .menu-desplegable a",
  );
  const botonSagaTexto = document.querySelector(".boton-filtro-saga");

  sagaLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.hasAttribute("data-saga")) {
        e.preventDefault();
        const sId = link.getAttribute("data-saga");

        if (botonSagaTexto) {
          botonSagaTexto.innerHTML = `${link.textContent} <span class="material-symbols-outlined">expand_more</span>`;
        }

        const btnYear = document.getElementById("btn-ordenar-año");
        const orden = btnYear ? btnYear.getAttribute("data-orden") : "desc";

        LoadMovies(filtroCategoriaActual, orden, sId);
      }
    });
  });

  // Efecto visual Navbar
  const nav = document.querySelector(".barra-navegacion");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.style.background = "rgba(10, 8, 13, 1)";
    } else {
      nav.style.background =
        "linear-gradient(to bottom, rgba(10, 8, 13, 1) 65%, transparent)";
    }
  });
});
