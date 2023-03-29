const DOM = {
  searchMovieButton: document.querySelector("#searchMovie"),
  clearButton: document.querySelector("#clearButton"),
  contents: document.querySelector("#contents"),
  loader: document.querySelector("#loader"),
  movieNameInput: document.querySelector("#movieName"),
};

function init() {
  DOM.searchMovieButton.addEventListener("click", handleSearch);
  DOM.clearButton.addEventListener("click", clearButton);
}
init();
async function handleSearch() {
  try {
    showLoader();
    let result = await getMovieName(DOM.movieNameInput.value);
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      const movieName = element.Title;
      const movieId = element.imdbID;
      const picture = element.Poster;

      drawMovies(movieName, movieId, picture);
    }
  } catch (error) {
    console.log("ERROR");

    swal({
      class: "swal-modal",
      title: "Something went wrong!",
      text: "Movie not found",
      icon: "error",
      button: {
        text: "Close",
      },
    });
  } finally {
    DOM.movieNameInput.value = "";
    removeLoader();
  }
}
function drawMovies(name, id, picture) {
  const div = document.createElement("div");
  div.classList.add("postDiv");
  div.addEventListener("click", getMovieDescription);
  div.id = id;
  const img = getImg(picture);
  const movieNameH5 = document.createElement("h5");
  movieNameH5.classList.add("movieNameH5");
  movieNameH5.innerText = name;
  const movieId = document.createElement("p");
  movieId.classList.add("movieID");
  movieId.innerText = `Movie ID - ${id}`;
  div.append(img, movieNameH5, movieId);
  DOM.contents.append(div);
}
async function getMovieDescription(currentMovieDiv) {
  try {
    showLoader();
    const result = await getMovieID(currentMovieDiv.currentTarget.id);
    const name = result.Title;
    const year = result.Year;
    const picture = result.Poster;
    const genre = `Genre ${result.Genre}`;
    const rating = `Rating ${result.imdbRating}`;
    const time = `Watch Time ${result.Runtime}`;
    drawMoviesPlot(name, year, picture, genre, rating, time);
  } catch (error) {
    swal({
      title: "Something went wrong!",
      text: "Movie not found",
      icon: "error",
    });
  } finally {
    removeLoader();
  }
}

function drawMoviesPlot(name, year, picture, genre, rating, time) {
  // main div
  const div = document.createElement("div");
  div.classList.add("mainDiv");
  // img
  const imgDiv = document.createElement("div");
  imgDiv.classList.add("imgDiv");
  const img = getImg(picture);
  imgDiv.append(img);
  //plot div
  const plotDiv = document.createElement("div");
  plotDiv.classList.add("plotDiv");
  const movieName = document.createElement("h5");
  movieName.innerText = name;
  const date = document.createElement("p");
  date.innerText = year;
  const genree = document.createElement("p");
  genree.innerText = genre;
  const ratingg = document.createElement("p");
  ratingg.innerText = rating;
  const timee = document.createElement("p");
  timee.innerText = time;
  plotDiv.append(movieName, date, genree, ratingg, time);

  div.append(imgDiv, plotDiv);
  DOM.contents.append(div);
}
async function getMovieName(title) {
  const result = await fetch(
    `https://www.omdbapi.com/?s=${title}&apikey=bf402164`
  );
  const json = await result.json();
  return json.Search;
}
async function getMovieID(movieId) {
  const result = await fetch(
    `https://www.omdbapi.com/?i=${movieId}&apikey=bf402164`
  );
  const json = await result.json();
  return json;
}
function clearButton() {
  DOM.movieNameInput.value = "";
  DOM.contents.innerHTML = "";
}
