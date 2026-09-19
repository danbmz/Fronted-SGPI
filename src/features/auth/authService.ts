import { httpClient } from "@/lib/httpClient";
import type { Role } from "@/types/enums";

interface LoginResponse {
  usuario: {
    id: string;
    nombre: string;
    role: Role;
  };
}

export async function login(usuario: string, password: string): Promise<LoginResponse> {
  const response = await httpClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({ usuario, password }),
    skipAuthRetry: true, // el login nunca debe intentar refrescar
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error ?? "Error al iniciar sesión");
  }

  return response.json();
}

export async function logout(motivo: "EXPLICITO" | "INACTIVIDAD" = "EXPLICITO"): Promise<void> {
  await httpClient("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ motivo }),
    skipAuthRetry: true,
  });
}

export async function obtenerSesionActual(): Promise<LoginResponse["usuario"] | null> {
  const response = await httpClient("/auth/me", { skipAuthRetry: true });
  if (!response.ok) return null;
  return response.json();
}