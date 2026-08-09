import { httpClient } from "@/lib/httpClient";
import { parseOrThrow } from "@/lib/parseOrThrow";
import {
  defectoProductoSchema,
  listaDefectoProductoSchema,
  type CrearDefectoProductoInput,
  type EditarDefectoProductoInput,
  type DefectoProducto,
} from "../schemas/defectos";
import { okResponseSchema } from "@/lib/commonSchemas";

export async function listarDefectosProducto(): Promise<DefectoProducto[]> {
  const response = await httpClient("/defectos-producto");
  return parseOrThrow(response, listaDefectoProductoSchema);
}

export async function crearDefectoProducto(
  data: CrearDefectoProductoInput
): Promise<DefectoProducto> {
  const response = await httpClient("/defectos-producto", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, defectoProductoSchema);
}

export async function editarDefectoProducto(
  id: string,
  data: EditarDefectoProductoInput
): Promise<DefectoProducto> {
  const response = await httpClient(`/defectos-producto/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, defectoProductoSchema);
}

export async function desactivarDefectoProducto(id: string): Promise<void> {
  const response = await httpClient(`/defectos-producto/${id}`, { method: "DELETE" });
  await parseOrThrow(response, okResponseSchema);
}

export async function reactivarDefectoProducto(id: string): Promise<void> {
  const response = await httpClient(`/defectos-producto/${id}/reactivar`, { method: "PATCH" });
  await parseOrThrow(response, okResponseSchema);
}