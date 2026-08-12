import { httpClient } from "@/lib/httpClient";
import { parseOrThrow } from "@/lib/parseOrThrow";
import {
  solicitudMaterialSchema,
  listaSolicitudMaterialSchema,
  type SolicitudMaterial,
  type CrearSolicitudMaterialInput
} from "../schemas/solicitudMaterial";
import { okResponseSchema } from "@/lib/commonSchemas";

export async function listarSolicitudesMaterial(avanceTurnoId: string): Promise<SolicitudMaterial[]> {
  const response = await httpClient(`/avances-turno/${avanceTurnoId}/solicitudes-material`);
  return parseOrThrow(response, listaSolicitudMaterialSchema);
}

export async function crearSolicitudMaterial(
  avanceTurnoId: string,
  data: CrearSolicitudMaterialInput
): Promise<SolicitudMaterial> {
  const response = await httpClient(`/avances-turno/${avanceTurnoId}/solicitudes-material`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return parseOrThrow(response, solicitudMaterialSchema);
}

export async function confirmarSolicitudMaterial(id: string): Promise<void> {
  const response = await httpClient(`/solicitudes-material/${id}/confirmar`, {
    method: "PATCH",
  });
  await parseOrThrow(response, okResponseSchema);
}