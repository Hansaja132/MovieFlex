import { getMovieDetails } from "../api/movies";
import { clearState, setErrorState, setLoadingState } from "../components/state";
import { formatDate, formatGenres, formatRating } from "../utils/format";
import { getBackdropUrl, getPosterUrl } from "../utils/images";
import { getQueryParam } from "../utils/url";

export async function initMoviePage() {
  const movieId = getQueryParam("id");
  const stateMount = document.getElementById("movie-state");

  if (!movieId) {
    setErrorState(stateMount, "Movie ID is missing. Open a movie from the home or search page.");
    return;
  }

  setLoadingState(stateMount, "Loading movie details...");

  try {
    const movie = await getMovieDetails(movieId);
    hydrateMovieDetails(movie);
    clearState(stateMount);
  } catch (error) {
    setErrorState(stateMount, error.message || "Unable to load movie details.");
  }
}

function hydrateMovieDetails(movie) {
  const detailsCard = document.getElementById("movie-details-card");
  const backdrop = document.getElementById("movie-backdrop");

  if (detailsCard) detailsCard.classList.remove("hidden");

  const title = movie.title || "Untitled";
  document.title = `MovieFlex | ${title}`;

  setText("movie-title", title);
  setText("movie-overview", movie.overview || "No overview available.");
  setText("movie-rating", formatRating(movie.vote_average));
  setText("movie-release-date", formatDate(movie.release_date));
  setText("movie-genres", formatGenres(movie.genres));

  const poster = document.getElementById("movie-poster");
  if (poster) {
    poster.src = getPosterUrl(movie.poster_path, "w780");
    poster.alt = `${title} poster`;
  }

  if (backdrop) {
    backdrop.style.setProperty("--backdrop-image", `url('${getBackdropUrl(movie.backdrop_path)}')`);
  }
}

function setText(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) element.textContent = value;
}
