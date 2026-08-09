import { httpClient } from "@/lib/httpClient"
import { 
  pigmentoSchema,
  listaPigmentoSchema,
  type CrearPigmentoInput,
  type EditarPigmentoInput, 
  type Pigmento} from "../schemas/pigmento"
import { parseOrThrow } from "@/lib/parseOrThrow";
import { okResponseSchema } from "@/lib/commonSchemas";

export async function listarPigmentos(): Promise <Pigmento[]> {
  const response = await httpClient('/pigmentos');
  return parseOrThrow(response, listaPigmentoSchema)
}

export async function crearPigmento(data: CrearPigmentoInput): Promise <Pigmento>  {
  const response = await httpClient('/pigmentos',{
    method: 'POST',
    body: JSON.stringify(data),
  })
  return parseOrThrow(response, pigmentoSchema)
}

export async function editarPigmento(id: string, data: EditarPigmentoInput): Promise <Pigmento>{
  const response = await httpClient(`/pigmentos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, pigmentoSchema)
} 

export async function desactivarPigmento(id: string): Promise <void> {
  const response = await httpClient(`/pigmentos/${id}`,{ method: 'DELETE' });
  await parseOrThrow(response, okResponseSchema)
}

export async function reactivarPigmento(id: string): Promise <void> {
  const response = await httpClient(`/pigmentos/${id}/reactivar`, { method: 'PATCH'});
  await parseOrThrow(response, pigmentoSchema)
}