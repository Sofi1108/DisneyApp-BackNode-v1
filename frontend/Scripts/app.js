const API =
  "https://fantastic-invention-jj5rg46jjg6gfq7xg-3000.app.github.dev/api/movies";

// Seleccionamos el contenedor de la sección de exploración (donde actúan los filtros)
const $contenedorExplorar = document.querySelector(
  ".seccion-explorar .rejilla-peliculas",
);
// Seleccionamos el segundo contenedor (el de "Podría interesarte")
const $contenedorRecomendados = document.querySelector(
  ".seccion-peliculas .rejilla-peliculas",
);

/**
 * Carga y filtra películas según la página y la categoría seleccionada
 */
async function LoadMovies(categoriaID = null) {
  try {
    const response = await fetch(API);
    const data = await response.json();
    const allItems = data.movies;

    const path = window.location.pathname;
    const esHome = path.endsWith("index.html") || path === "/" || path === "";
    const esPaginaSeries = path.includes("series.html");
    const esPaginaPeliculas = path.includes("peliculas.html");

    // Lógica de filtrado
    const filtrados = allItems.filter((item) => {
      // 1. Filtro por tipo (Serie o Película)
      let pasaTipo = false;
      if (esHome) pasaTipo = true;
      else if (esPaginaSeries) pasaTipo = item.SeriePelicula === 0;
      else if (esPaginaPeliculas) pasaTipo = item.SeriePelicula === 1;

      // 2. Filtro por categoría (ID de la base de datos)
      let pasaCategoria = true;
      if (categoriaID) {
        pasaCategoria = item.categoria_id == categoriaID;
      }

      return pasaTipo && pasaCategoria;
    });

    // Construcción del HTML
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
            </div>
        </div>
      `,
        )
        .join("");
    };

    // Renderizamos en el contenedor principal de exploración
    if ($contenedorExplorar) {
      $contenedorExplorar.innerHTML = renderHTML(filtrados);
    }

    // Para la sección "Podría interesarte", mostramos una selección aleatoria o fija (solo la primera vez)
    if ($contenedorRecomendados && !categoriaID) {
      $contenedorRecomendados.innerHTML = renderHTML(allItems.slice(0, 10));
    }
  } catch (error) {
    console.error("Error al cargar:", error);
    if ($contenedorExplorar) {
      $contenedorExplorar.innerHTML =
        "<p>Error al conectar con la base de datos.</p>";
    }
  }
}

/**
 * Configuración de eventos de los filtros de categoría
 */
document.addEventListener("DOMContentLoaded", () => {
  // Inicializamos la carga de películas
  LoadMovies();

  // Selectores actualizados para el nuevo diseño Netflix
  const categoryLinks = document.querySelectorAll(
    ".dropdown-categorias .menu-desplegable a",
  );
  const botonTexto = document.querySelector(".boton-filtro-genero");

  categoryLinks.forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();

      // Manejo visual de clases activas
      categoryLinks.forEach((l) => l.classList.remove("activo"));
      link.classList.add("activo");

      const categoriaID = link.getAttribute("data-categoria");
      const nombreCategoria = link.textContent;

      // Actualizar el texto del botón desplegable
      const icono =
        '<span class="material-symbols-outlined">expand_more</span>';
      if (!categoriaID) {
        botonTexto.innerHTML = `Géneros ${icono}`;
      } else {
        botonTexto.innerHTML = `${nombreCategoria} ${icono}`;
      }

      // Ejecutar el filtrado
      await LoadMovies(categoriaID);
    });
  });

  // Efecto visual: Navegación cambia de fondo al hacer scroll
  const nav = document.querySelector(".barra-navegacion");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.style.backgroundColor = "rgba(10, 8, 13, 1)";
    } else {
      nav.style.backgroundColor = "rgba(10, 8, 13, 0.8)";
    }
  });
});
