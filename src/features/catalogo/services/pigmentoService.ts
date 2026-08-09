import { httpClient } from "@/lib/httpClient"
import { 
  pigmentoSchema,
  listaPigmentoSchema,
  type CrearPigmentoInput,
  type EditarPigmentoInput } from "../schemas/pigmento"
import { parseOrThrow } from "@/lib/parseOrThrow";
import { okResponseSchema } from "@/lib/commonSchemas";

export async function listarPigmentos() {
  const response = await httpClient('/pigmentos');
  return parseOrThrow(response, listaPigmentoSchema)
}

export async function crearPigmento(data: CrearPigmentoInput) {
  const response = await httpClient('/pigmentos',{
    method: 'POST',
    body: JSON.stringify(data),
  })
  return parseOrThrow(response, pigmentoSchema)
}

export async function editarPigmento(id: string, data: EditarPigmentoInput){
  const response = await httpClient(`/pigmentos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, pigmentoSchema)
} 

export async function desactivarPigmento(id: string) {
  const response = await httpClient(`/pigmentos/${id}`,{ method: 'DELETE' });
  return parseOrThrow(response, okResponseSchema)
}

export async function reactivarPigmento(id: string) {
  const response = await httpClient(`/pigmentos/${id}/reactivar`, { method: 'PATCH'});
  return parseOrThrow(response, pigmentoSchema)
}