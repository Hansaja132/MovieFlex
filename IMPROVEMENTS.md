# MovieFlex improvements

## Security and deployment
- Move TMDB token usage to a server-side proxy or serverless function so the token is not exposed in the browser.
- Add rate limiting and basic caching on the proxy to reduce API load and improve reliability.

## Reliability and error handling
- Add request timeouts with AbortController to prevent long hangs on slow networks.
- Add a lightweight retry strategy for transient failures (e.g., one retry for 5xx or network errors).
- Surface user-friendly error messages for known API error codes.

## Accessibility and navigation
- Add a skip-to-content link at the top of each page.
- Mark the active navigation item with aria-current="page".
- Ensure visible focus styles for links and buttons using :focus-visible.
- Respect prefers-reduced-motion by disabling hero and spinner animations when requested.

## Performance and UX
- Add pagination or "Load more" for home sections and search results.
- Provide responsive image sizes with srcset/sizes and add decoding="async".
- Lazy-load movie detail poster where appropriate.
- Debounce search input if adding live search later.

## Content and consistency
- Add the favicon link to all pages (index, search, movie).
- Make the language parameter configurable (default to navigator.language).
- Consider a trailer section that fetches and embeds TMDB videos.

## Maintainability
- Update state helpers to use classList instead of overwriting className.
- Centralize empty/loading/error strings for easier reuse and localization.
