import { httpClient } from "@/lib/httpClient"
import { 
  operadorSchema,
  listaOperadorSchema,
  type CrearOperadorInput,
  type EditarOperadorInput, 
  type Operador} from "../schemas/operadores"
import { parseOrThrow } from "@/lib/parseOrThrow"
import { okResponseSchema } from "@/lib/commonSchemas"


export async function listarOperadores(): Promise <Operador[]> {
  const response = await httpClient('/operadores');
  return parseOrThrow(response, listaOperadorSchema)
};

export async function crearOperador(data: CrearOperadorInput): Promise <Operador> {
  const response = await httpClient('/operadores', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return parseOrThrow(response,operadorSchema)
};

export async function editarOperador(id: string, data: EditarOperadorInput): Promise <Operador> {
  const response = await httpClient(`/operadores/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return parseOrThrow(response,operadorSchema)
};

export async function desactivarOperador(id: string): Promise <void> {
  const response = await httpClient(`/operadores/${id}`, { method: 'DELETE'});
  await parseOrThrow(response, okResponseSchema)
};

export async function reactivarOperador(id: string): Promise <void>{
  const response = await httpClient(`/operadores/${id}/reactivar`, { method: 'PATCH'});
  await parseOrThrow(response,okResponseSchema)
};