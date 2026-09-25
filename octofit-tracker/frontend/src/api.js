// Fetches an endpoint URL and normalizes both plain-array and paginated ({ results: [] }) responses.
export async function fetchCollection(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.results)) {
    return data.results;
  }

  return [];
}
