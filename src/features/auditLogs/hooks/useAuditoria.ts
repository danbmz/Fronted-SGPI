import { useQuery } from "@tanstack/react-query";
import { listarAuditoria } from "../services/auditoriaService";

interface FiltroAuditoria {
  modulo?: string;
  usuarioId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  pagina?: number;
  limite?: number;
}

export function useAuditoria(filtro?: FiltroAuditoria) {
  return useQuery({
    queryKey: ["audit-logs", filtro],
    queryFn: () => listarAuditoria(filtro),
  });
}