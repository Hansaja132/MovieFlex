import { renderFooter, renderHeader } from "./components/layout";
import { initHomePage } from "./pages/home";
import { initMoviePage } from "./pages/movie";
import { initSearchPage } from "./pages/search";

function init() {
  renderHeader();
  renderFooter();

  const page = document.body.dataset.page;

  if (page === "home") {
    initHomePage();
    return;
  }

  if (page === "movie") {
    initMoviePage();
    return;
  }

  if (page === "search") {
    initSearchPage();
  }
}

init();
