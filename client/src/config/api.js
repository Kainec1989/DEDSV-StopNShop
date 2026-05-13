/**
 * REST API base including `/api` (e.g. `http://localhost:5000/api`).
 * Override with `VITE_API_URL` when deploying.
 */
export function getApiUrl() {
  return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
}
