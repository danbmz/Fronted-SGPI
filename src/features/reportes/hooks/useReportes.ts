import { useQuery } from "@tanstack/react-query";
import { obtenerReportes } from "../services/reportesService";

interface FiltroReportes {
  fechaDesde: string;
  fechaHasta: string;
}

export function useReportes(filtro: FiltroReportes) {
  return useQuery({
    queryKey: ["reportes", filtro],
    queryFn: () => obtenerReportes(filtro),
    enabled: !!filtro.fechaDesde && !!filtro.fechaHasta,
  });
}