import { useTodasSolicitudesMaterial } from "@/features/avancesTurno/hooks/useSolicitudMaterial";
import { useIncidencias } from "@/features/avancesTurno/hooks/useIncidencia";

export function useAlertasPigmentos(habilitado: boolean) {
  const { data: solicitudesPendientes } = useTodasSolicitudesMaterial({ confirmado: false },{ enabled: habilitado });
  const { data: incidenciasPendientes } = useIncidencias({ resuelto: false }, { enabled: habilitado });

  if (!habilitado) return 0;

  const totalAlertas =
    (solicitudesPendientes?.length ?? 0) +
    (incidenciasPendientes?.length ?? 0);

  return totalAlertas;
}