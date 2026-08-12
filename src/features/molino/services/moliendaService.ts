import { httpClient } from "@/lib/httpClient";
import { parseOrThrow } from "@/lib/parseOrThrow";
import {
  moliendaSchema,
  listaMoliendaSchema,
  pendientesSchema,
  type Molienda,
  type Pendientes,
} from "../schemas";
import type { CrearMoliendaInput } from "../schemas";

export async function listarPendientesMoler(): Promise<Pendientes> {
  const response = await httpClient("/moliendas/pendientes");
  return parseOrThrow(response, pendientesSchema);
}

export async function listarMoliendas(): Promise<Molienda[]> {
  const response = await httpClient("/moliendas");
  return parseOrThrow(response, listaMoliendaSchema);
}

export async function crearMolienda(data: CrearMoliendaInput): Promise<Molienda> {
  const response = await httpClient("/moliendas", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, moliendaSchema);
}