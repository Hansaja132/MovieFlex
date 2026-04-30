import {
  TMDB_API_KEY,
  TMDB_BASE_URL,
  TMDB_BEARER_TOKEN,
  TMDB_PROXY_BASE_URL,
  getPreferredLanguage
} from "./config";

const REQUEST_TIMEOUT_MS = 9000;
const RETRY_LIMIT = 1;

export async function tmdbRequest(path, params = {}) {
  const useDirect = Boolean(TMDB_API_KEY || TMDB_BEARER_TOKEN);
  const url = buildRequestUrl(path, params, useDirect);
  const response = await fetchWithRetry(url.toString(), RETRY_LIMIT, useDirect);

  if (!response.ok) {
    const data = await safeJson(response);
    const apiMessage = data?.status_message || "Unknown TMDB error";
    throw new Error(buildUserMessage(response.status, apiMessage));
  }

  return response.json();
}

function buildRequestUrl(path, params, useDirect) {
  const baseUrl = useDirect
    ? new URL(TMDB_BASE_URL)
    : new URL(TMDB_PROXY_BASE_URL, window.location.origin);
  const basePath = useDirect ? baseUrl.pathname.replace(/\/$/, "") : baseUrl.pathname.replace(/\/$/, "");
  const url = new URL(`${basePath}${path}`, baseUrl);
  const searchParams = new URLSearchParams({ language: getPreferredLanguage(), ...params });
  if (useDirect && TMDB_API_KEY) {
    searchParams.set("api_key", TMDB_API_KEY);
  }
  url.search = searchParams.toString();
  return url;
}

async function fetchWithRetry(url, retriesLeft, useDirect) {
  try {
    const response = await fetchWithTimeout(url, REQUEST_TIMEOUT_MS, useDirect);
    if (response.status >= 500 && retriesLeft > 0) {
      await wait(300);
      return fetchWithRetry(url, retriesLeft - 1, useDirect);
    }

    return response;
  } catch (error) {
    if (retriesLeft > 0) {
      await wait(300);
      return fetchWithRetry(url, retriesLeft - 1, useDirect);
    }

    if (error?.name === "AbortError") {
      throw new Error("The request timed out. Please try again.");
    }

    throw new Error("Network error. Please check your connection and try again.");
  }
}

async function fetchWithTimeout(url, timeoutMs, useDirect) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const headers = {
    Accept: "application/json"
  };
  if (useDirect && TMDB_BEARER_TOKEN) {
    headers.Authorization = `Bearer ${TMDB_BEARER_TOKEN}`;
  }

  try {
    return await fetch(url, {
      method: "GET",
      headers,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildUserMessage(status, apiMessage) {
  if (status === 401) {
    return "TMDB authorization failed. Please verify the server token.";
  }

  if (status === 404) {
    return "We couldn't find that movie.";
  }

  if (status === 429) {
    return "TMDB rate limit reached. Please wait a moment and try again.";
  }

  if (status >= 500) {
    return "TMDB is having trouble right now. Please try again soon.";
  }

  return apiMessage || "Something went wrong.";
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function wait(delayMs) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}
