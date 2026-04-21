export function formatDate(dateValue) {
  if (!dateValue) return "Unknown";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function formatRating(voteAverage) {
  if (voteAverage === null || voteAverage === undefined) return "N/A";
  return `${Number(voteAverage).toFixed(1)} / 10`;
}

export function formatGenres(genres = []) {
  if (!genres.length) return "N/A";
  return genres.map((genre) => genre.name).join(", ");
}

export function truncateText(text, maxLength = 140) {
  if (!text) return "No description available.";
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
}
