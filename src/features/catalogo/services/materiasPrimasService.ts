import { httpClient } from "@/lib/httpClient";
import {
  materiaPrimaSchema,
  listaMateriaPrimaSchema,
  type CrearMateriaPrimaInput,
  type EditarMateriaPrimaInput,
} from "../schemas/materiaPrima";
import { parseOrThrow } from "@/lib/parseOrThrow"
import { okResponseSchema } from "@/lib/commonSchemas";


export async function listarMateriasPrimas() {
  const response = await httpClient("/materias-primas");
  return parseOrThrow(response, listaMateriaPrimaSchema);
}

export async function crearMateriaPrima(data: CrearMateriaPrimaInput) {
  const response = await httpClient("/materias-primas", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, materiaPrimaSchema);
}

export async function editarMateriaPrima(id: string, data: EditarMateriaPrimaInput) {
  const response = await httpClient(`/materias-primas/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, materiaPrimaSchema);
}

export async function desactivarMateriaPrima(id: string) {
  const response = await httpClient(`/materias-primas/${id}`, { method: "DELETE" });
  await parseOrThrow(response, okResponseSchema)
}

export async function reactivarMateriaPrima(id: string) {
  const response = await httpClient(`/materias-primas/${id}/reactivar`, { method: "PATCH" });
  await parseOrThrow(response, okResponseSchema)
}