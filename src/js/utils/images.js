import { TMDB_IMAGE_BASE_URL } from "../api/config";

const POSTER_PLACEHOLDER = "https://placehold.co/500x750/0f172a/e2e8f0?text=No+Poster";
const BACKDROP_PLACEHOLDER = "https://placehold.co/1280x720/111827/e5e7eb?text=No+Backdrop";

export function getPosterUrl(path, size = "w500") {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : POSTER_PLACEHOLDER;
}

export function getPosterSrcSet(path, sizes = ["w342", "w500", "w780"]) {
  if (!path) return "";
  return sizes.map((size) => `${TMDB_IMAGE_BASE_URL}/${size}${path} ${size.slice(1)}w`).join(", ");
}

export function getBackdropUrl(path, size = "w1280") {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : BACKDROP_PLACEHOLDER;
}

export function getBackdropSrcSet(path, sizes = ["w780", "w1280", "original"]) {
  if (!path) return "";

  return sizes
    .map((size) => {
      const width = size === "original" ? "2000w" : `${size.slice(1)}w`;
      return `${TMDB_IMAGE_BASE_URL}/${size}${path} ${width}`;
    })
    .join(", ");
}
