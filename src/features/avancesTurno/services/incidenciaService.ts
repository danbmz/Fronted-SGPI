import { httpClient } from "@/lib/httpClient";
import { parseOrThrow } from "@/lib/parseOrThrow";
import { incidenciaSchema, listaIncidenciaSchema } from "../schemas/incidencia";
import type {
  CrearIncidenciaInput,
  ConfirmarIncidenciaMolinoInput,
  ResolverIncidenciaInput,
  Incidencia,
} from "../schemas/incidencia";


export interface FiltroIncidencias {
  resuelto?: boolean;
  destino?: "STOCK" | "MOLINO";
  avanceTurnoId?: string; 
}

export async function listarIncidencias(filtro?: FiltroIncidencias): Promise<Incidencia[]> {
  const params = new URLSearchParams();
  if (filtro?.resuelto !== undefined) params.set("resuelto", String(filtro.resuelto));
  if (filtro?.destino !== undefined) params.set("destino", filtro.destino);
  if (filtro?.avanceTurnoId !== undefined) params.set("avanceTurnoId", filtro.avanceTurnoId);

  const query = params.toString();
  const response = await httpClient(`/incidencias-mal-pigmentado${query ? `?${query}` : ""}`);
  return parseOrThrow(response, listaIncidenciaSchema);
}

export async function crearIncidencia(
  avanceTurnoId: string,
  data: CrearIncidenciaInput
): Promise<Incidencia> {
  const response = await httpClient(`/avances-turno/${avanceTurnoId}/incidencia-mal-pigmentado`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, incidenciaSchema);
}

export async function confirmarIncidenciaMolino(
  id: string,
  data: ConfirmarIncidenciaMolinoInput
): Promise<Incidencia> {
  const response = await httpClient(`/incidencias-mal-pigmentado/${id}/confirmar-molino`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, incidenciaSchema);
}

export async function resolverIncidencia(
  id: string,
  data: ResolverIncidenciaInput
): Promise<Incidencia> {
  const response = await httpClient(`/incidencias-mal-pigmentado/${id}/resolver`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, incidenciaSchema);
}