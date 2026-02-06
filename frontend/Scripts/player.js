const API =
  "https://fantastic-invention-jj5rg46jjg6gfq7xg-3000.app.github.dev/api/movies";

// Elementos del DOM
const dom = {
  poster: document.getElementById("detalle-poster"),
  titulo: document.getElementById("detalle-titulo"),
  anio: document.getElementById("meta-anio"),
  tipo: document.getElementById("meta-tipo"),
  descripcion: document.getElementById("detalle-descripcion"),
  btnReproducir: document.getElementById("btn-reproducir"),
  videoOverlay: document.getElementById("video-overlay"),
  videoPlayer: document.getElementById("video-player"),
  cerrarVideo: document.getElementById("cerrar-video"),
};

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const movieID = params.get("id");

  if (!movieID) {
    window.location.href = "peliculas.html";
    return;
  }

  try {
    const response = await fetch(API);
    const data = await response.json();
    const movies = data.movies;

    // El ID en la URL es string, asegurar comparación correcta
    const movie = movies.find((m) => m.id == movieID);

    if (!movie) {
      alert("No se encontró la película.");
      window.location.href = "peliculas.html";
      return;
    }

    // --- RENDERIZAR DETALLES ---

    // 1. Imagen y Textos Básicos
    dom.poster.src = movie.url_portada;
    dom.titulo.textContent = movie.titulo;

    // Descripción (con fallback a string vacío si es null)
    // NOTA: La base de datos usa 'Sinopsis' con mayúscula
    dom.descripcion.textContent =
      movie.Sinopsis || "Descripción no disponible.";

    // AÑO
    // NOTA: La base de datos usa 'año' con ñ
    dom.anio.textContent = movie.año || "----";

    // TIPO (Serie o Película)
    // Basado en lógica vista en app.js: 0 = Serie, 1 = Película
    let tipoTexto = "Desconocido";
    if (movie.SeriePelicula === 1) tipoTexto = "Película";
    else if (movie.SeriePelicula === 0) tipoTexto = "Serie";

    dom.tipo.textContent = tipoTexto;

    // Actualizar Title
    document.title = `${movie.titulo} | PureStream`;

    // --- LOGICA DE REPRODUCCIÓN ---
    const videoUrl = movie.url_pelicula || movie.video_url;

    dom.btnReproducir.addEventListener("click", () => {
      if (videoUrl) {
        let embedUrl = videoUrl;
        if (videoUrl.includes("youtube.com/watch?v=")) {
          const videoId = videoUrl.split("v=")[1].split("&")[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        } else if (videoUrl.includes("youtu.be/")) {
          const videoId = videoUrl.split("youtu.be/")[1];
          embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }

        dom.videoPlayer.src = embedUrl;
        dom.videoOverlay.style.display = "flex";
      } else {
        alert("Video no disponible por el momento (Próximamente)");
      }
    });

    dom.cerrarVideo.addEventListener("click", () => {
      dom.videoOverlay.style.display = "none";
      dom.videoPlayer.src = ""; // Detener video
    });

    // --- MÁS COMO ESTO (CARRUSEL MOCK) ---
    // Simplemente cogemos 6 películas aleatorias del array 'movies' (excluyendo la actual)
    const otrasPeliculas = movies.filter((m) => m.id != movieID);
    // Barajar array
    const barajadas = otrasPeliculas.sort(() => 0.5 - Math.random());
    const similares = barajadas.slice(0, 6);

    let htmlSimilares = "";
    similares.forEach((p) => {
      htmlSimilares += `
                <div class="tarjeta-pelicula" onclick="window.location.href='player.html?id=${p.id}'">
                    <div class="portada-pelicula">
                        <img src="${p.url_portada}" alt="${p.titulo}" loading="lazy" />
                    </div>
                </div>
            `;
    });
    // dom.contenedorSimilares.innerHTML = htmlSimilares; // This line is removed as contenedorSimilares is no longer in dom
  } catch (error) {
    console.error("Error general:", error);
  }
});
