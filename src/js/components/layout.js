export function renderHeader() {
  const mount = document.getElementById("site-header");
  if (!mount) return;

  const activePage = document.body?.dataset?.page || "";
  const navLinks = [
    { href: "index.html", label: "Home", page: "home" },
    { href: "search.html", label: "Search", page: "search" }
  ];

  mount.className = "site-header";
  mount.innerHTML = `
    <div class="site-header__inner">
      <a class="brand" href="index.html">Movie<span>Flex</span></a>
      <nav class="nav" aria-label="Main navigation">
        ${navLinks
          .map((link) => {
            const isActive = link.page === activePage;
            return `<a href="${link.href}" ${isActive ? 'aria-current="page"' : ""}>${link.label}</a>`;
          })
          .join("")}
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
