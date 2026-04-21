import { TMDB_BASE_URL, TMDB_BEARER_TOKEN, assertTmdbToken } from "./config";

export async function tmdbRequest(path, params = {}) {
  assertTmdbToken();

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  const searchParams = new URLSearchParams({ language: "en-US", ...params });
  url.search = searchParams.toString();

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${TMDB_BEARER_TOKEN}`
    }
  });

  if (!response.ok) {
    const data = await safeJson(response);
    const apiMessage = data?.status_message || "Unknown TMDB error";
    throw new Error(`TMDB request failed (${response.status}): ${apiMessage}`);
  }

  return response.json();
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
