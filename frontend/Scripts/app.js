const API =
  "https://fictional-space-parakeet-97j695975pg29pp-3000.app.github.dev/api/movies"; // Ruta corregida

const $contenedor = document.querySelector(".rejilla-peliculas");

async function LoadMovies() {
  try {
    const response = await fetch(API);
    const data = await response.json(); // Aquí recibes { ok: true, movies: [...] }

    $contenedor.innerHTML = "";

    // IMPORTANTE: Accedemos a data.movies que es donde están las pelis
    data.movies.forEach((peli) => {
      $contenedor.innerHTML += `
        <div class="tarjeta-pelicula">
            <div class="portada-pelicula">
                <img src="${peli.url_portada}" alt="${peli.titulo}" />
            </div>
            <div class="info-tarjeta">
                <span>${peli.titulo}</span>
            </div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error al cargar:", error);
  }
}

LoadMovies();
