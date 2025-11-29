// 1) Leer de Vite env, con un fallback seguro:
const DEFAULT_API_BASE = 'http://localhost:3000/api/v1';

const API_BASE =
  (import.meta.env && import.meta.env.VITE_API_BASE_URL) || DEFAULT_API_BASE;

const DEFAULT_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 5000;
const DEFAULT_MAX_RETRIES = 2;

async function httpRequest(
  path,
  {
    method = 'GET',
    body,
    headers = {},
    timeoutMs = DEFAULT_TIMEOUT_MS,
    maxRetries = DEFAULT_MAX_RETRIES,
  } = {}
) {
  const url = `${API_BASE}${path}`;

  // headers base: auth + JSON
  const baseHeaders = {
    ...getAuthHeaders(),
    ...headers,
  };

  // Serializar body si existe
  const fetchOptions = {
    method,
    headers: baseHeaders,
  };

  if (body !== undefined && body !== null) {
    fetchOptions.body = JSON.stringify(body);
  }

  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Si la respuesta no es OK, normalizamos el error según status
      if (!response.ok) {
        const msg = normalizeHttpError(response.status);
          throw new HttpError(response.status, msg);
      }

      // Intentar parsear JSON; si no hay body, devolver null
      const text = await response.text();
      return text ? JSON.parse(text) : null;
    } catch (err) {
      clearTimeout(timeoutId);
      let message;

      if (err instanceof HttpError) {
        // Ya es un error HTTP normalizado (404, 500, etc.)
        message = err.message;
      } else {
        // Timeout o fallo de red
        message = normalizeNetworkError(err);
      }
        lastError = new Error(message);

      const isLastAttempt = attempt === maxRetries;
      const shouldRetry = !isLastAttempt && shouldRetryError(message);

      if (!shouldRetry) {
        // Ya no vamos a reintentar, rompemos el ciclo
        break;
      }
      // Si sí debemos reintentar, continúa el for y reintenta
    }
  }

  // Si llegamos aquí, es que todos los intentos fallaron
  throw lastError || new Error('Network error');
}

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

function normalizeHttpError(status) {
  if (status >= 500) {
    return 'Server error';
  }
  if (status === 408) {
    return 'Timeout';
  }
  return `Request failed ${status}`;
}

function normalizeNetworkError(err) {
  if (err?.name === 'AbortError') {
    return 'Timeout';
  }

  // Podríamos inspeccionar `err.message` para más matices si hace falta
  return 'Network error';
}

function shouldRetryError(normalizedMessage) {
  // Política simple:
  // - Reintentar en errores de red y timeout
  // - NO reintentar en errores de request (4xx o similares)
  return normalizedMessage === 'Network error' || normalizedMessage === 'Timeout';
}


function getAuthHeaders() {
  const token = localStorage.getItem('accessToken') || 'dummy';
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getSuggestions(period = 'daily') {
    const data = await httpRequest(
        `/notifications/summary?period=${encodeURIComponent(period)}`,
        {
            method: 'GET',
        }
    );

    // El backend devuelve un array de sugerencias directamente
    return Array.isArray(data) ? data : [];
}

export async function confirmAction(ids, action) {
    const data = await httpRequest('/notifications/confirm', {
        method: 'POST',
        body: { ids, action },
    });

    // Mantenemos el contrato actual: devolver lo que el backend diga
    return data;
}

export async function getHistory(page = 1, perPage = 20) {
  const result = await httpRequest(
    `/notifications/history?page=${page}&perPage=${perPage}`
  );
      return Array.isArray(result?.data) ? result.data : [];

}


