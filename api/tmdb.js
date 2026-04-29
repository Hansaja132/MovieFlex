const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = process.env.TMDB_BEARER_TOKEN || process.env.VITE_TMDB_BEARER_TOKEN || "";
const CACHE_TTL_MS = 60_000;
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60_000;

const cache = new Map();
const rateBuckets = new Map();

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end("Method not allowed");
    return;
  }

  if (!TOKEN) {
    res.statusCode = 500;
    res.end("TMDB token is not configured on the server.");
    return;
  }

  const ip = getClientIp(req);
  if (!isAllowed(ip)) {
    res.statusCode = 429;
    res.setHeader("Retry-After", "60");
    res.end("Rate limit exceeded. Please try again shortly.");
    return;
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const tmdbPath = requestUrl.pathname.replace(/^\/api\/tmdb/, "") || "/";
  const tmdbUrl = new URL(`${TMDB_BASE_URL}${tmdbPath}`);
  tmdbUrl.search = requestUrl.search;

  const cacheKey = tmdbUrl.toString();
  const cached = getCached(cacheKey);
  if (cached) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=60");
    res.end(cached);
    return;
  }

  try {
    const tmdbResponse = await fetch(tmdbUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${TOKEN}`
      }
    });

    const body = await tmdbResponse.text();
    res.statusCode = tmdbResponse.status;
    res.setHeader("Content-Type", tmdbResponse.headers.get("content-type") || "application/json");
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=60");

    if (tmdbResponse.ok) {
      setCached(cacheKey, body);
    }

    res.end(body);
  } catch {
    res.statusCode = 502;
    res.end("TMDB proxy request failed.");
  }
};

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.payload;
}

function setCached(key, payload) {
  cache.set(key, { payload, expiresAt: Date.now() + CACHE_TTL_MS });
}

function isAllowed(ip) {
  const now = Date.now();
  const entry = rateBuckets.get(ip) || { count: 0, resetAt: now + RATE_WINDOW_MS };

  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_WINDOW_MS;
  }

  entry.count += 1;
  rateBuckets.set(ip, entry);
  return entry.count <= RATE_LIMIT;
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || "unknown";
}
