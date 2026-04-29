import { searchMovies } from "../api/movies";
import { renderMovieGrid } from "../components/movieCard";
import { clearState, setEmptyState, setErrorState, setLoadingState } from "../components/state";
import { STATE_MESSAGES } from "../utils/messages";
import { getQueryParam, updateQueryParams } from "../utils/url";

const SEARCH_PAGE_SIZE = 24;
let currentQuery = "";
let currentPage = 1;
let totalPages = 1;

export function initSearchPage() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const loadMoreButton = document.getElementById("search-load-more");

  if (!form || !input) return;

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", async () => {
      await runSearch(currentQuery, { append: true });
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = input.value.trim();
    await runSearch(query, { append: false });
    updateQueryParams({ q: query || null });
  });

  const initialQuery = getQueryParam("q") || "";
  input.value = initialQuery;

  if (initialQuery) {
    runSearch(initialQuery, { append: false });
  } else {
    setEmptyState(document.getElementById("search-state"), STATE_MESSAGES.promptSearch);
  }
}

async function runSearch(query, { append }) {
  const stateMount = document.getElementById("search-state");
  const gridMount = document.getElementById("search-results");
  const loadMoreButton = document.getElementById("search-load-more");

  if (!query) {
    if (gridMount) gridMount.innerHTML = "";
    setEmptyState(stateMount, STATE_MESSAGES.promptSearchInput);
    toggleLoadMore(loadMoreButton, 1, 1);
    return;
  }

  if (!append) {
    currentQuery = query;
    currentPage = 1;
    totalPages = 1;
    if (gridMount) gridMount.innerHTML = "";
  } else {
    if (currentPage >= totalPages) return;
    currentPage += 1;
  }

  setLoadingState(stateMount, STATE_MESSAGES.loadingSearch(query));

  try {
    const data = await searchMovies(query, currentPage);
    const movies = data?.results || [];
    totalPages = data?.total_pages || 1;

    if (!movies.length) {
      if (append) {
        clearState(stateMount);
        toggleLoadMore(loadMoreButton, currentPage, currentPage);
        return;
      }

      setEmptyState(stateMount, STATE_MESSAGES.emptySearch);
      toggleLoadMore(loadMoreButton, 1, 1);
      return;
    }

    renderMovieGrid(gridMount, movies.slice(0, SEARCH_PAGE_SIZE), { append });
    clearState(stateMount);
    toggleLoadMore(loadMoreButton, currentPage, totalPages);
  } catch (error) {
    setErrorState(stateMount, error.message || STATE_MESSAGES.errorSearch);
  }
}

function toggleLoadMore(button, page, totalPages) {
  if (!button) return;
  const hasMore = page < totalPages;
  button.disabled = !hasMore;
  button.classList.toggle("hidden", !hasMore);
}
