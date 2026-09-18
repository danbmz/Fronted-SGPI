import { httpClient } from "@/lib/httpClient";
import { parseOrThrow } from "@/lib/parseOrThrow";
import { listaAuditLogSchema, type ListaAuditLog } from "../schemas/auditoria.schema";

interface FiltroAuditoria {
  modulo?: string;
  usuarioId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  pagina?: number;
  limite?: number;
}

export async function listarAuditoria(filtro?: FiltroAuditoria): Promise<ListaAuditLog> {
  const params = new URLSearchParams();
  if (filtro?.modulo !== undefined) params.set("modulo", filtro.modulo);
  if (filtro?.usuarioId !== undefined) params.set("usuarioId", filtro.usuarioId);
  if (filtro?.fechaDesde !== undefined) params.set("fechaDesde", filtro.fechaDesde);
  if (filtro?.fechaHasta !== undefined) params.set("fechaHasta", filtro.fechaHasta);
  if (filtro?.pagina !== undefined) params.set("pagina", String(filtro.pagina));
  if (filtro?.limite !== undefined) params.set("limite", String(filtro.limite));

  const query = params.toString();
  const response = await httpClient(`/audit-logs${query ? `?${query}` : ""}`);
  return parseOrThrow(response, listaAuditLogSchema);
}