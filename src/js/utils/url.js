export function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

export function updateQueryParams(nextParams = {}) {
  const params = new URLSearchParams(window.location.search);

  Object.entries(nextParams).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      params.delete(key);
      return;
    }

    params.set(key, value);
  });

  const query = params.toString();
  const targetUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
  window.history.replaceState({}, "", targetUrl);
}
