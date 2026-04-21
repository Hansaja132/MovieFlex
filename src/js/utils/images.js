import { TMDB_IMAGE_BASE_URL } from "../api/config";

const POSTER_PLACEHOLDER = "https://placehold.co/500x750/0f172a/e2e8f0?text=No+Poster";
const BACKDROP_PLACEHOLDER = "https://placehold.co/1280x720/111827/e5e7eb?text=No+Backdrop";

export function getPosterUrl(path, size = "w500") {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : POSTER_PLACEHOLDER;
}

export function getBackdropUrl(path, size = "w1280") {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : BACKDROP_PLACEHOLDER;
}
