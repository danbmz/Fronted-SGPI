import { httpClient } from "@/lib/httpClient";
import { parseOrThrow } from "@/lib/parseOrThrow";
import { okResponseSchema } from "@/lib/commonSchemas";
import { ordenSchema, listaOrdenSchema, type Orden } from "../schemas/orden.schema";
import type {
  CrearOrdenInput,
  CancelarOrdenInput,
  CambiarEstadoOrdenInput,
  SustituirMaterialPigmentadoInput,
} from "../schemas";

export interface FiltroOrdenes {
  estado?: string,
  excluirFinalizadas?: boolean,
}

export async function listarOrdenes(filtro?: FiltroOrdenes): Promise<Orden[]> {
  const params = new URLSearchParams();
  if (filtro?.estado !== undefined) params.set("estado", filtro.estado);
  if (filtro?.excluirFinalizadas !== undefined) params.set("excluirFinalizadas", String(filtro.excluirFinalizadas));
  const query = params.toString();
  const response = await httpClient(`/ordenes${query ? `?${query}` : ""}`);
  return parseOrThrow(response, listaOrdenSchema);
}

export async function obtenerOrden(id: string): Promise<Orden> {
  const response = await httpClient(`/ordenes/${id}`);
  return parseOrThrow(response, ordenSchema);
}

export async function crearOrden(data: CrearOrdenInput): Promise<Orden> {
  const response = await httpClient("/ordenes", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, ordenSchema);
}

export async function cancelarOrden(id: string, data: CancelarOrdenInput): Promise<void> {
  const response = await httpClient(`/ordenes/${id}/cancelar`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  await parseOrThrow(response, okResponseSchema);
}

export async function confirmarMaterialOrden(id: string): Promise<void> {
  const response = await httpClient(`/ordenes/${id}/confirmar-material`, {
    method: "PATCH",
  });
  await parseOrThrow(response, okResponseSchema);
}

export async function sustituirMaterialPigmentado(
  id: string,
  data: SustituirMaterialPigmentadoInput
): Promise<Orden> {
  const response = await httpClient(`/ordenes/${id}/sustituir-material-pigmentado`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, ordenSchema);
}

// ---------- Cambio de estado, parametrizado ----------

type AccionEstadoOrden = "activar" | "pausar" | "reanudar";

export async function cambiarEstadoOrden(
  id: string,
  accion: AccionEstadoOrden,
  data: CambiarEstadoOrdenInput
): Promise<void> {
  const response = await httpClient(`/ordenes/${id}/${accion}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  await parseOrThrow(response, okResponseSchema);
}