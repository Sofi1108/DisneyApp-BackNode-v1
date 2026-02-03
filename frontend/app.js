const API =
  "https://urban-bassoon-x5wr49655q6v36q6w-3000.app.github.dev/api/movies";

// $data --> variable que de js, se diferencia de las otras variables por el simbolo $
const $data = document.getElementById("movies");

async function loadMovies() {
  const response = await fetch(API);
  const data = await response.json();
  console.log(data);
  $data.innerHTML = data.movies[0].movie;
}

loadMovies();
