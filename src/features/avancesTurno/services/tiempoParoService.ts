import { httpClient } from "@/lib/httpClient";
import { parseOrThrow } from "@/lib/parseOrThrow";
import { tiempoParoSchema, listaTiempoParoSchema, type TiempoParo, type CrearTiempoParoInput } from "../schemas/tiempoParo";

export async function listarTiemposParo(avanceTurnoId: string): Promise<TiempoParo[]> {
  const response = await httpClient(`/avances-turno/${avanceTurnoId}/tiempos-paro`);
  return parseOrThrow(response, listaTiempoParoSchema);
}

export async function crearTiempoParo(
  avanceTurnoId: string,
  data: CrearTiempoParoInput
): Promise<TiempoParo> {
  const response = await httpClient(`/avances-turno/${avanceTurnoId}/tiempos-paro`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, tiempoParoSchema);
}