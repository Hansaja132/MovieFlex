import { tmdbRequest } from "./tmdb";

export async function getPopularMovies(page = 1) {
  return tmdbRequest("/movie/popular", { page });
}

export async function getNowPlayingMovies(page = 1) {
  return tmdbRequest("/movie/now_playing", { page });
}

export async function getUpcomingMovies(page = 1) {
  return tmdbRequest("/movie/upcoming", { page });
}

export async function searchMovies(query, page = 1) {
  return tmdbRequest("/search/movie", { query, page, include_adult: false });
}

export async function getMovieDetails(movieId) {
  return tmdbRequest(`/movie/${movieId}`);
}

export async function getMovieVideos(movieId) {
  return tmdbRequest(`/movie/${movieId}/videos`);
}
