const API =
  "https://fantastic-invention-jj5rg46jjg6gfq7xg-3000.app.github.dev/api/movies";

// Buscamos el contenedor de forma más flexible para que funcione en todas las páginas
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

let categoriaActual = null;

/**
 * Carga y filtra películas según la página, categoría y orden
 */
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

    // 1. Filtrar por tipo (Serie/Peli) y categoría
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

    // 3. Función para generar HTML (CON LOGICA DE REPRODUCTOR)
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

    // 4. Renderizar en el contenedor principal
    if ($contenedorPrincipal) {
      $contenedorPrincipal.innerHTML = renderHTML(filtrados);
    }

    // 5. Renderizar Recomendados (si no hay filtro activo)
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

// Exportar funciones al objeto window para que year.js pueda verlas
window.LoadMovies = LoadMovies;
window.getCategoriaActual = () => categoriaActual;

document.addEventListener("DOMContentLoaded", () => {
  // Carga inicial
  LoadMovies();

  // Eventos para los enlaces de categorías
  const categoryLinks = document.querySelectorAll(".menu-desplegable a");
  const botonTexto = document.querySelector(".boton-filtro-genero");

  categoryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // Solo actuar si tiene data-categoria (evita errores con 'Cerrar Sesión')
      if (link.hasAttribute("data-categoria")) {
        e.preventDefault();
        const catId = link.getAttribute("data-categoria");

        // Actualizar texto del botón si existe
        if (botonTexto && !link.closest(".acciones-usuario")) {
          botonTexto.innerHTML = `${link.textContent} <span class="material-symbols-outlined">expand_more</span>`;
        }

        // Mantener el orden de año actual al filtrar
        const btnYear = document.getElementById("btn-ordenar-año");
        const orden = btnYear ? btnYear.getAttribute("data-orden") : "desc";

        LoadMovies(catId, orden);
      }
    });
  });

  // Efecto visual de la barra de navegación al hacer scroll
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
