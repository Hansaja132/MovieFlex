import { getNowPlayingMovies, getPopularMovies, getUpcomingMovies } from "../api/movies";
import { renderMovieGrid } from "../components/movieCard";
import { clearState, setEmptyState, setErrorState, setLoadingState } from "../components/state";

export async function initHomePage() {
  await Promise.all([
    renderSection({
      stateId: "popular-state",
      gridId: "popular-grid",
      loader: getPopularMovies,
      emptyMessage: "No popular movies were returned."
    }),
    renderSection({
      stateId: "now-playing-state",
      gridId: "now-playing-grid",
      loader: getNowPlayingMovies,
      emptyMessage: "No now playing movies were returned."
    }),
    renderSection({
      stateId: "upcoming-state",
      gridId: "upcoming-grid",
      loader: getUpcomingMovies,
      emptyMessage: "No upcoming movies were returned."
    })
  ]);
}

async function renderSection({ stateId, gridId, loader, emptyMessage }) {
  const stateMount = document.getElementById(stateId);
  const gridMount = document.getElementById(gridId);

  setLoadingState(stateMount, "Loading movies...");
  if (gridMount) gridMount.innerHTML = "";

  try {
    const data = await loader(1);
    const movies = data?.results || [];

    if (!movies.length) {
      setEmptyState(stateMount, emptyMessage);
      return;
    }

    renderMovieGrid(gridMount, movies.slice(0, 12));
    clearState(stateMount);
  } catch (error) {
    setErrorState(stateMount, error.message || "Could not load this section.");
  }
}
