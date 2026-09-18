import { httpClient } from "@/lib/httpClient";
import { parseOrThrow } from "@/lib/parseOrThrow";
import { reportesSchema, type Reportes } from "../schemas/reportes.schema";

interface FiltroReportes {
  fechaDesde: string;
  fechaHasta: string;
}

export async function obtenerReportes(filtro: FiltroReportes): Promise<Reportes> {
  const params = new URLSearchParams({
    fechaDesde: filtro.fechaDesde,
    fechaHasta: filtro.fechaHasta,
  });

  const response = await httpClient(`/reportes?${params.toString()}`);
  return parseOrThrow(response, reportesSchema);
}