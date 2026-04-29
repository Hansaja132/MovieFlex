export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
export const TMDB_PROXY_BASE_URL = import.meta.env.VITE_TMDB_PROXY_URL?.trim() || "/api/tmdb";

export function getPreferredLanguage() {
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language;
  }

  return "en-US";
}
