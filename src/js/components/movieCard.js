import { formatDate, formatRating, truncateText } from "../utils/format";
import { getPosterSrcSet, getPosterUrl } from "../utils/images";

export function createMovieCard(movie) {
  const title = movie.title || movie.name || "Untitled";
  const releaseDate = formatDate(movie.release_date || movie.first_air_date);
  const rating = formatRating(movie.vote_average);
  const overview = truncateText(movie.overview, 82);
  const posterSrcSet = getPosterSrcSet(movie.poster_path);

  return `
    <article class="movie-card">
      <a href="movie.html?id=${encodeURIComponent(movie.id)}" aria-label="View details for ${escapeHtml(title)}">
        <img
          class="movie-card__poster"
          src="${getPosterUrl(movie.poster_path)}"
          ${posterSrcSet ? `srcset="${posterSrcSet}"` : ""}
          sizes="(max-width: 600px) 46vw, (max-width: 960px) 30vw, 220px"
          alt="${escapeHtml(title)} poster"
          loading="lazy"
          decoding="async"
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

export function renderMovieGrid(mount, movies = [], { append = false } = {}) {
  if (!mount) return;

  if (!movies.length) {
    if (!append) mount.innerHTML = "";
    return;
  }

  const markup = movies.map((movie) => createMovieCard(movie)).join("");
  if (append) {
    mount.insertAdjacentHTML("beforeend", markup);
  } else {
    mount.innerHTML = markup;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
