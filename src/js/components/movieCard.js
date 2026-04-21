import { formatDate, formatRating, truncateText } from "../utils/format";
import { getPosterUrl } from "../utils/images";

export function createMovieCard(movie) {
  const title = movie.title || movie.name || "Untitled";
  const releaseDate = formatDate(movie.release_date || movie.first_air_date);
  const rating = formatRating(movie.vote_average);
  const overview = truncateText(movie.overview, 82);

  return `
    <article class="movie-card">
      <a href="movie.html?id=${encodeURIComponent(movie.id)}" aria-label="View details for ${escapeHtml(title)}">
        <img
          class="movie-card__poster"
          src="${getPosterUrl(movie.poster_path)}"
          alt="${escapeHtml(title)} poster"
          loading="lazy"
        />
      </a>
      <div class="movie-card__body">
        <h3 class="movie-card__title">${escapeHtml(title)}</h3>
        <div class="movie-card__meta">
          <span>${escapeHtml(releaseDate)}</span>
          <span>${escapeHtml(rating)}</span>
        </div>
        <p class="movie-card__meta">${escapeHtml(overview)}</p>
      </div>
    </article>
  `;
}

export function renderMovieGrid(mount, movies = []) {
  if (!mount) return;

  if (!movies.length) {
    mount.innerHTML = "";
    return;
  }

  mount.innerHTML = movies.map((movie) => createMovieCard(movie)).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
