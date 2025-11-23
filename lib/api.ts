export const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

interface ErrorResponse extends Error {
  status?: number;
  data?: string;
}

export function apiPath(path: string) {
  // path should start with '/'
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}/api${p}`;
}

export async function fetchJson(path: string, init?: RequestInit) {
  const res = await fetch(apiPath(path), init);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }
  if (!res.ok) {
    const err: ErrorResponse = new Error((data && data.message) || text || res.statusText);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function fetcher(path: string) {
  return fetchJson(path);
}
