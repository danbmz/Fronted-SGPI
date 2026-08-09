import { httpClient } from "@/lib/httpClient"
import { 
  operadorSchema,
  listaOperadorSchema,
  type CrearOperadorInput,
  type EditarOperadorInput } from "../schemas/operadores"
import { parseOrThrow } from "@/lib/parseOrThrow"
import { okResponseSchema } from "@/lib/commonSchemas"


export async function listarOperadores(){
  const response = await httpClient('/operadores');
  return parseOrThrow(response, listaOperadorSchema)
};

export async function crearOperador(data: CrearOperadorInput){
  const response = await httpClient('/operadores', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return parseOrThrow(response,operadorSchema)
};

export async function editarOperador(id: string, data: EditarOperadorInput){
  const response = await httpClient(`/operadores/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return parseOrThrow(response,operadorSchema)
};

export async function desactivarOperador(id: string){
  const response = await httpClient(`/operadores/${id}`, { method: 'DELETE'});
  return parseOrThrow(response, okResponseSchema)
};

export async function reactivarOperador(id: string){
  const response = await httpClient(`/operadores/${id}/reactivar`, { method: 'PATCH'});
  return parseOrThrow(response,okResponseSchema)
};