// Base URL for the logic tier API, derived from the Codespaces name exposed via Vite env vars.
// VITE_CODESPACE_NAME must be defined (e.g. in `.env.local`) when running inside a GitHub Codespace.
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

// Fall back to localhost so the app never requests `https://undefined-8000...` when the var is unset.
export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';

// Fetches a resource collection and normalizes both plain-array and paginated ({ results: [] }) responses.
export async function fetchCollection(resource) {
  const response = await fetch(`${API_BASE_URL}/${resource}/`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${resource}: ${response.status} ${response.statusText}`);
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
