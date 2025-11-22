// 1) Leer de Vite env, con un fallback seguro:
const DEFAULT_API_BASE = 'http://localhost:3000/api/v1';

const API_BASE =
  (import.meta.env && import.meta.env.VITE_API_BASE_URL) || DEFAULT_API_BASE;

function getAuthHeaders() {
  const token = localStorage.getItem('accessToken') || 'dummy';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getSuggestions(period = 'daily') {
  const res = await fetch(
    `${API_BASE}/notifications/summary?period=${encodeURIComponent(period)}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
  // El backend devuelve un array de sugerencias directamente
  return Array.isArray(json) ? json : [];
}

export async function confirmAction(ids, action) {
  const res = await fetch(`${API_BASE}/notifications/confirm`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ids, action }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
  // Esperamos { success: true }
  return json;
}

export async function getHistory(page = 1, perPage = 20) {
  const url = `${API_BASE}/notifications/history?page=${page}&perPage=${perPage}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();

  // El backend devuelve { total, page, perPage, data: [...] }
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;

  return [];
}

