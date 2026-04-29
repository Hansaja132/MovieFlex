import { getNowPlayingMovies, getPopularMovies, getUpcomingMovies } from "../api/movies";
import { renderMovieGrid } from "../components/movieCard";
import { clearState, setEmptyState, setErrorState, setLoadingState } from "../components/state";
import { STATE_MESSAGES } from "../utils/messages";

const SECTION_PAGE_SIZE = 12;
const SECTIONS = [
  {
    key: "popular",
    stateId: "popular-state",
    gridId: "popular-grid",
    buttonId: "popular-load-more",
    loader: getPopularMovies,
    emptyMessage: STATE_MESSAGES.emptyPopular
  },
  {
    key: "now-playing",
    stateId: "now-playing-state",
    gridId: "now-playing-grid",
    buttonId: "now-playing-load-more",
    loader: getNowPlayingMovies,
    emptyMessage: STATE_MESSAGES.emptyNowPlaying
  },
  {
    key: "upcoming",
    stateId: "upcoming-state",
    gridId: "upcoming-grid",
    buttonId: "upcoming-load-more",
    loader: getUpcomingMovies,
    emptyMessage: STATE_MESSAGES.emptyUpcoming
  }
];

export async function initHomePage() {
  await Promise.all(SECTIONS.map((section) => renderSection(section)));
}

async function renderSection(section) {
  const stateMount = document.getElementById(section.stateId);
  const gridMount = document.getElementById(section.gridId);
  const button = document.getElementById(section.buttonId);

  section.page = 1;
  section.totalPages = 1;

  if (button) {
    button.disabled = true;
    button.classList.add("hidden");
    button.addEventListener("click", async () => {
      await loadMore(section);
    });
  }

  setLoadingState(stateMount, STATE_MESSAGES.loadingMovies);
  if (gridMount) gridMount.innerHTML = "";

  try {
    const data = await section.loader(section.page);
    const movies = data?.results || [];
    section.totalPages = data?.total_pages || 1;

    if (!movies.length) {
      setEmptyState(stateMount, section.emptyMessage);
      return;
    }

    renderMovieGrid(gridMount, movies.slice(0, SECTION_PAGE_SIZE));
    clearState(stateMount);
    toggleLoadMore(button, section.page, section.totalPages);
  } catch (error) {
    setErrorState(stateMount, error.message || STATE_MESSAGES.errorSection);
  }
}

async function loadMore(section) {
  const stateMount = document.getElementById(section.stateId);
  const gridMount = document.getElementById(section.gridId);
  const button = document.getElementById(section.buttonId);

  if (section.page >= section.totalPages) return;
  section.page += 1;
  if (button) button.disabled = true;

  setLoadingState(stateMount, "Loading more movies...");

  try {
    const data = await section.loader(section.page);
    const movies = data?.results || [];

    if (movies.length) {
      renderMovieGrid(gridMount, movies.slice(0, SECTION_PAGE_SIZE), { append: true });
    }

    clearState(stateMount);
    toggleLoadMore(button, section.page, section.totalPages);
  } catch (error) {
    setErrorState(stateMount, error.message || STATE_MESSAGES.errorSection);
  }
}

function toggleLoadMore(button, page, totalPages) {
  if (!button) return;
  const hasMore = page < totalPages;
  button.disabled = !hasMore;
  button.classList.toggle("hidden", !hasMore);
}
