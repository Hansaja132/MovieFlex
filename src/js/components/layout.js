export function renderHeader() {
  const mount = document.getElementById("site-header");
  if (!mount) return;

  mount.className = "site-header";
  mount.innerHTML = `
    <div class="site-header__inner">
      <a class="brand" href="index.html">Movie<span>Flex</span></a>
      <nav class="nav" aria-label="Main navigation">
        <a href="index.html">Home</a>
        <a href="search.html">Search</a>
      </nav>
    </div>
  `;
}

export function renderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;

  mount.className = "site-footer";
  mount.innerHTML = `
    <div class="site-footer__inner">
      <span>Built with HTML, CSS, and JavaScript.</span>
      <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
    </div>
  `;
}
