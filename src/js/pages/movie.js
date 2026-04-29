import { getMovieDetails, getMovieVideos } from "../api/movies";
import { clearState, setEmptyState, setErrorState, setLoadingState } from "../components/state";
import { STATE_MESSAGES } from "../utils/messages";
import { formatDate, formatGenres, formatRating } from "../utils/format";
import { getBackdropUrl, getPosterSrcSet, getPosterUrl } from "../utils/images";
import { getQueryParam } from "../utils/url";

export async function initMoviePage() {
  const movieId = getQueryParam("id");
  const stateMount = document.getElementById("movie-state");

  if (!movieId) {
    setErrorState(stateMount, STATE_MESSAGES.errorMovieIdMissing);
    return;
  }

  setLoadingState(stateMount, STATE_MESSAGES.loadingDetails);
  setLoadingState(document.getElementById("trailer-state"), "Loading trailer...");

  try {
    const [movie, videos] = await Promise.all([
      getMovieDetails(movieId),
      getMovieVideos(movieId).catch(() => null)
    ]);

    hydrateMovieDetails(movie);
    hydrateTrailer(videos);
    clearState(stateMount);
  } catch (error) {
    setErrorState(stateMount, error.message || STATE_MESSAGES.errorMovieDetails);
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
    poster.srcset = getPosterSrcSet(movie.poster_path, ["w342", "w500", "w780"]);
    poster.sizes = "(max-width: 680px) 70vw, (max-width: 900px) 35vw, 300px";
    poster.alt = `${title} poster`;
    poster.loading = "lazy";
    poster.decoding = "async";
  }

  if (backdrop) {
    backdrop.style.setProperty("--backdrop-image", `url('${getBackdropUrl(movie.backdrop_path)}')`);
  }
}

function hydrateTrailer(videos) {
  const trailerMount = document.getElementById("movie-trailer");
  const trailerState = document.getElementById("trailer-state");

  if (!trailerMount) return;

  if (!videos) {
    setErrorState(trailerState, STATE_MESSAGES.trailerError);
    trailerMount.innerHTML = "";
    return;
  }

  const results = videos?.results || [];
  const trailer =
    results.find((video) => video.site === "YouTube" && video.type === "Trailer") ||
    results.find((video) => video.site === "YouTube" && video.type === "Teaser");

  if (!trailer || !trailer.key) {
    setEmptyState(trailerState, STATE_MESSAGES.trailerMissing);
    trailerMount.innerHTML = "";
    return;
  }

  trailerMount.innerHTML = `
    <iframe
      title="${escapeHtml(trailer.name || "Movie trailer")}" 
      src="https://www.youtube.com/embed/${encodeURIComponent(trailer.key)}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy"
    ></iframe>
  `;

  clearState(trailerState);
}

function setText(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) element.textContent = value;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
