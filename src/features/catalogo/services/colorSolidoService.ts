import { httpClient } from "@/lib/httpClient"
import { colorSolidoSchema, listaColorSolido, type ColorSolido, type CrearColorSolidoInput, type EditarColorSolidoInput } from "../schemas/colorSolido";
import { parseOrThrow } from "@/lib/parseOrThrow";
import { okResponseSchema } from "@/lib/commonSchemas";

export async function listarColorSolido(): Promise<ColorSolido[]> {
  const response = await httpClient('/colores-solidos');
  return parseOrThrow(response, listaColorSolido)
}

export async function crearColorSolido(data: CrearColorSolidoInput): Promise <ColorSolido> {
  const response = await httpClient('/colores-solidos',{
    method: 'POST',
    body: JSON.stringify(data),
  })
  return parseOrThrow(response, colorSolidoSchema)
}

export async function editarColorSolido(id: string, data: EditarColorSolidoInput): Promise <ColorSolido>{
  const response = await httpClient(`/colores-solidos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, colorSolidoSchema)
} 

export async function desactivarColorSolido(id: string): Promise <void> {
  const response = await httpClient(`/colores-solidos/${id}`,{ method: 'DELETE' });
  await parseOrThrow(response, okResponseSchema)
}

export async function reactivarColorSolido(id: string): Promise <void> {
  const response = await httpClient(`/colores-solidos/${id}/reactivar`, { method: 'PATCH'});
  await parseOrThrow(response, colorSolidoSchema)
}