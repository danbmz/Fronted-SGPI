import { useTodasSolicitudesMaterial } from "@/features/avancesTurno/hooks/useSolicitudMaterial";
import { useIncidencias } from "@/features/avancesTurno/hooks/useIncidencia";

export function useAlertasPigmentos() {
  const { data: solicitudesPendientes } = useTodasSolicitudesMaterial({ confirmado: false });
  const { data: incidenciasPendientes } = useIncidencias({ resuelto: false });

  const totalAlertas =
    (solicitudesPendientes?.length ?? 0) +
    (incidenciasPendientes?.length ?? 0);

  return totalAlertas;
}