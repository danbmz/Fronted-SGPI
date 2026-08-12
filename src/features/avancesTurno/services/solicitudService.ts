import { httpClient } from "@/lib/httpClient";
import { parseOrThrow } from "@/lib/parseOrThrow";
import {
  solicitudMaterialSchema,
  listaSolicitudMaterialSchema,
  type SolicitudMaterial,
  type CrearSolicitudMaterialInput
} from "../schemas/solicitudMaterial";
import { okResponseSchema } from "@/lib/commonSchemas";

// --- Lista las de un avance 
export async function listarSolicitudesMaterial(avanceTurnoId: string): Promise<SolicitudMaterial[]> {
  const response = await httpClient(`/avances-turno/${avanceTurnoId}/solicitudes-material`);
  return parseOrThrow(response, listaSolicitudMaterialSchema);
}

// --- Lista absolutamente todas las solicitudes sin confirmar
interface FiltroSolicitudes {
  confirmado?: boolean;
}

export async function listarTodasSolicitudesMaterial(filtro?: FiltroSolicitudes): Promise<SolicitudMaterial[]> {
  const params = new URLSearchParams();
  if (filtro?.confirmado !== undefined) params.set("confirmado", String(filtro.confirmado));
  const query = params.toString();
  const response = await httpClient(`/solicitudes-material${query ? `?${query}` : ""}`);
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