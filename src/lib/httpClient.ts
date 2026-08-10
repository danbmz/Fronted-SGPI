const BASE_URL = import.meta.env.VITE_API_URL;

interface RequestOptions extends RequestInit {
  skipAuthRetry?: boolean; // evita loop infinito en el propio /auth/refresh
}

let refreshPromise: Promise<boolean> | null = null;

async function intentarRefresh(): Promise<boolean> {
  // Si ya hay un refresh en curso, todas las peticiones esperan el mismo resultado
  // en vez de disparar varios /auth/refresh al mismo tiempo.
  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.ok)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function httpClient(path: string, options: RequestOptions = {}) {
  const { skipAuthRetry, ...fetchOptions } = options;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    credentials: "include", // imprescindible: así viajan las cookies httpOnly
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  // Si no es 401, o ya es un reintento (o es el propio /auth/refresh), regresamos tal cual
  if (response.status !== 401 || skipAuthRetry) {
    return response;
  }

  // Intentamos refrescar la sesión una sola vez
  const refrescoExitoso = await intentarRefresh();

  if (!refrescoExitoso) {
    // La sesión ya no es recuperable — lo resolvemos en el siguiente bloque (Zustand)
    window.dispatchEvent(new CustomEvent("sesion-expirada"));
    return response;
  }

  // Reintentamos la petición original, ahora con el access token ya renovado
  return fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });
}