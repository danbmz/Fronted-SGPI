import { httpClient } from "@/lib/httpClient";
import { parseOrThrow } from "@/lib/parseOrThrow";
import { avanceTurnoSchema, listaAvanceTurnoSchema } from "../schemas/avanceTurno";
import type {
  AvanceTurno,
  CrearAvanceTurnoInput,
  ActualizarAvanceTurnoInput,
  CerrarAvanceTurnoInput,
  ConfirmarMolinoInput,
  ConfirmarSobranteInput,
} from "../schemas/avanceTurno";

export interface FiltroAvances {
  estado?: "ABIERTO" | "CERRADO";
  confirmacionMolinoConfirmado?: boolean;
  sobranteConfirmado?: boolean;
}

export async function listarAvancesTurno(filtro?: FiltroAvances): Promise<AvanceTurno[]> {
  const params = new URLSearchParams();
  if (filtro?.estado !== undefined) params.set("estado", filtro.estado);
  if (filtro?.confirmacionMolinoConfirmado !== undefined) {
    params.set("confirmacionMolinoConfirmado", String(filtro.confirmacionMolinoConfirmado));
  }
  if (filtro?.sobranteConfirmado !== undefined) {
    params.set("sobranteConfirmado", String(filtro.sobranteConfirmado));
  }
  
  const query = params.toString();
  const response = await httpClient(`/avances-turno${query ? `?${query}` : ""}`);
  return parseOrThrow(response, listaAvanceTurnoSchema);
}

export async function obtenerAvanceTurno(id: string): Promise<AvanceTurno> {
  const response = await httpClient(`/avances-turno/${id}`);
  return parseOrThrow(response, avanceTurnoSchema);
}

export async function crearAvanceTurno(data: CrearAvanceTurnoInput): Promise<AvanceTurno> {
  const response = await httpClient("/avances-turno", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, avanceTurnoSchema);
}

export async function actualizarAvanceTurno(
  id: string,
  data: ActualizarAvanceTurnoInput
): Promise<AvanceTurno> {
  const response = await httpClient(`/avances-turno/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, avanceTurnoSchema);
}

export async function cerrarAvanceTurno(id: string, data: CerrarAvanceTurnoInput): Promise<AvanceTurno> {
  const response = await httpClient(`/avances-turno/${id}/cerrar`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, avanceTurnoSchema);
}

export async function confirmarMolino(id: string, data: ConfirmarMolinoInput): Promise<AvanceTurno> {
  const response = await httpClient(`/avances-turno/${id}/confirmar-molino`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, avanceTurnoSchema);
}

export async function confirmarSobrante(id: string, data: ConfirmarSobranteInput): Promise<AvanceTurno> {
  const response = await httpClient(`/avances-turno/${id}/confirmar-sobrante`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, avanceTurnoSchema);
}