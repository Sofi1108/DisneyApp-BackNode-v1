const API =
  "https://fictional-space-parakeet-97j695975pg29pp-3000.app.github.dev/";

// $data --> variable que de js, se diferencia de las otras variables por el simbolo $
const $data = document.getElementById("movies");

async function loadMovies() {
  const response = await fetch(API);
  const data = await response.json();
  console.log(data);
  $data.innerHTML = data.movies[0].movie;
}

loadMovies();
