export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const BASE_URL = import.meta.env.BASE_URL || "/";
const NORMALIZED_BASE_URL = BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`;
export const TMDB_PROXY_BASE_URL =
  import.meta.env.VITE_TMDB_PROXY_URL?.trim() || `${NORMALIZED_BASE_URL}api/tmdb`;
export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY?.trim() || "";
export const TMDB_BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN?.trim() || "";

export function getPreferredLanguage() {
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language;
  }

  return "en-US";
}
