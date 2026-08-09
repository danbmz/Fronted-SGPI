import { httpClient } from "@/lib/httpClient"
import { maquinaSchema, listaMaquinaSchema, type CrearMaquinaInput, type EditarMaquinaInput, type CambiarEstadoMaquinaInput, type Maquina } from "../schemas/maquina"
import { parseOrThrow } from "@/lib/parseOrThrow"

export async function listarMaquinas(): Promise <Maquina[]>{
  const response = await httpClient('/maquinas');
  return parseOrThrow(response, listaMaquinaSchema);
}

export async function crearMaquina(data: CrearMaquinaInput): Promise <Maquina> {
  const response = await httpClient('/maquinas', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return parseOrThrow(response, maquinaSchema)
}

export async function editarMaquina(id: string, data: EditarMaquinaInput): Promise <Maquina> {
  const response = await httpClient(`/maquinas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return parseOrThrow(response, maquinaSchema)
}

export async function cambiarEstadoMaquina(id: string, data: CambiarEstadoMaquinaInput): Promise <Maquina> {
  const response = await httpClient(`/maquinas/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return parseOrThrow(response, maquinaSchema)
}