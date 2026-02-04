const API =
  "https://fantastic-invention-jj5rg46jjg6gfq7xg-3000.app.github.dev/api/movies";
const $contenedor = document.querySelector(".rejilla-peliculas");

async function LoadMovies() {
  try {
    const response = await fetch(API);
    const data = await response.json();
    const allItems = data.movies;

    const path = window.location.pathname;

    const esHome = path.endsWith("index.html") || path === "/" || path === "";
    const esPaginaSeries = path.includes("series.html");
    const esPaginaPeliculas = path.includes("peliculas.html");

    const filtrados = allItems.filter((item) => {
      if (esHome) {
        return true;
      } else if (esPaginaSeries) {
        return item.SeriePelicula === 0;
      } else if (esPaginaPeliculas) {
        return item.SeriePelicula === 1;
      }
      return true;
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

LoadMovies();
