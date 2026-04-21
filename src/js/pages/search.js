import { searchMovies } from "../api/movies";
import { renderMovieGrid } from "../components/movieCard";
import { clearState, setEmptyState, setErrorState, setLoadingState } from "../components/state";
import { getQueryParam, updateQueryParams } from "../utils/url";

export function initSearchPage() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");

  if (!form || !input) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = input.value.trim();
    await runSearch(query);
    updateQueryParams({ q: query || null });
  });

  const initialQuery = getQueryParam("q") || "";
  input.value = initialQuery;

  if (initialQuery) {
    runSearch(initialQuery);
  } else {
    setEmptyState(document.getElementById("search-state"), "Try searching for a movie title.");
  }
}

async function runSearch(query) {
  const stateMount = document.getElementById("search-state");
  const gridMount = document.getElementById("search-results");

  if (!query) {
    if (gridMount) gridMount.innerHTML = "";
    setEmptyState(stateMount, "Enter a movie title to search.");
    return;
  }

  setLoadingState(stateMount, `Searching for \"${query}\"...`);
  if (gridMount) gridMount.innerHTML = "";

  try {
    const data = await searchMovies(query, 1);
    const movies = data?.results || [];

    if (!movies.length) {
      setEmptyState(stateMount, "No matching movies found.");
      return;
    }

    renderMovieGrid(gridMount, movies.slice(0, 24));
    clearState(stateMount);
  } catch (error) {
    setErrorState(stateMount, error.message || "Search failed.");
  }
}
