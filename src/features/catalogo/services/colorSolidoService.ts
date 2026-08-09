import { httpClient } from "@/lib/httpClient"
import { colorSolidoSchema, listaColorSolido, type CrearColorSolidoInput, type EditarColorSolidoInput } from "../schemas/colorSolido";
import { parseOrThrow } from "@/lib/parseOrThrow";
import { okResponseSchema } from "@/lib/commonSchemas";

export async function listarColorSolido() {
  const response = await httpClient('/colores-solidos');
  return parseOrThrow(response, listaColorSolido)
}

export async function crearColorSolido(data: CrearColorSolidoInput) {
  const response = await httpClient('/colores-solidos',{
    method: 'POST',
    body: JSON.stringify(data),
  })
  return parseOrThrow(response, colorSolidoSchema)
}

export async function editarColorSolido(id: string, data: EditarColorSolidoInput){
  const response = await httpClient(`/colores-solidos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, colorSolidoSchema)
} 

export async function desactivarColorSolido(id: string) {
  const response = await httpClient(`/colores-solidos/${id}`,{ method: 'DELETE' });
  return parseOrThrow(response, okResponseSchema)
}

export async function reactivarColorSolido(id: string) {
  const response = await httpClient(`/colores-solidos/${id}/reactivar`, { method: 'PATCH'});
  return parseOrThrow(response, colorSolidoSchema)
}