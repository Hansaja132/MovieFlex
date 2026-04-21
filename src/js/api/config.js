export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
export const TMDB_BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER_TOKEN?.trim() || "";

export function assertTmdbToken() {
  if (!TMDB_BEARER_TOKEN) {
    throw new Error(
      "TMDB token is missing. Add VITE_TMDB_BEARER_TOKEN in your .env file and restart the dev server."
    );
  }
}
