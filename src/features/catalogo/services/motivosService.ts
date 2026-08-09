import { httpClient } from "@/lib/httpClient"
import { 
  listaMotivoParo,
  motivoParoSchema,
  type CrearMotivoParoInput,
  type EditarMotivoParoInput, 
  type MotivoParo} from "../schemas/motivosParo";
import { parseOrThrow } from "@/lib/parseOrThrow";
import { okResponseSchema } from "@/lib/commonSchemas";

export async function listarMotivosParo(): Promise <MotivoParo[]>{
  const response = await httpClient('/motivos-paro');
  return parseOrThrow(response, listaMotivoParo)
}

export async function crearMotivoParo(data: CrearMotivoParoInput): Promise <MotivoParo>{
  const response = await httpClient('/motivos-paro', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return parseOrThrow(response, motivoParoSchema)
}

export async function editarMotivoParo(id: string, data: EditarMotivoParoInput): Promise <MotivoParo>{
  const response = await httpClient(`/motivos-paro/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return parseOrThrow(response, motivoParoSchema)
}

export async function desactivarMotivoParo(id: string): Promise <void> {
  const response = await httpClient(`/motivos-paro/${id}`, {
    method: 'DELETE',
  });
  await parseOrThrow(response, okResponseSchema)
}

export async function reactivarMotivoParo(id: string): Promise <void>{
  const response = await httpClient(`/motivos-paro/${id}/reactivar`,{
    method: 'PATCH',
  });
  await parseOrThrow(response, okResponseSchema)
}
