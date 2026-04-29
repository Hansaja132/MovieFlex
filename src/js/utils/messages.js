export const STATE_MESSAGES = {
  loadingMovies: "Loading movies...",
  loadingDetails: "Loading movie details...",
  loadingSearch: (query) => `Searching for "${query}"...`,
  emptyPopular: "No popular movies were returned.",
  emptyNowPlaying: "No now playing movies were returned.",
  emptyUpcoming: "No upcoming movies were returned.",
  emptySearch: "No matching movies found.",
  promptSearch: "Try searching for a movie title.",
  promptSearchInput: "Enter a movie title to search.",
  errorSection: "Could not load this section.",
  errorSearch: "Search failed.",
  errorMovieDetails: "Unable to load movie details.",
  errorMovieIdMissing: "Movie ID is missing. Open a movie from the home or search page.",
  trailerMissing: "Trailer not available for this title.",
  trailerError: "Unable to load the trailer right now."
};
