import { useAvancesTurno } from "@/features/avancesTurno/hooks/useAvanceTurno";
import { useIncidencias } from "@/features/avancesTurno/hooks/useIncidencia";
import { usePendientesMoler, useMoliendas } from "@/features/molino/hooks/useMolienda";
import { AlertTriangle, PackageSearch, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MolinoAdminPage() {
  const { data: avancesPendientes } = useAvancesTurno({
    estado: "CERRADO",
    confirmacionMolinoConfirmado: false,
  });
  const { data: incidenciasPendientes } = useIncidencias({ destino: "MOLINO", resuelto: false });
  const { data: pendientesMoler } = usePendientesMoler();
  const { data: moliendas } = useMoliendas();

  const incidenciasSinConfirmar = (incidenciasPendientes ?? []).filter((i) => i.confirmadoMolino === null);
  const totalPendientesConfirmar = (avancesPendientes?.length ?? 0) + incidenciasSinConfirmar.length;
  const totalPendientesMoler = (pendientesMoler?.avances.length ?? 0) + (pendientesMoler?.incidencias.length ?? 0);

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm text-muted-foreground">
        Panorama de la actividad de Molino en tiempo real.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Columna 1: Pendientes de confirmar recepción */}
        <div className="flex flex-col gap-3 border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-amber-50 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600" />
              <h2 className="text-sm font-semibold text-amber-900">Por confirmar recepción</h2>
            </div>
            <span className="flex items-center justify-center h-6 min-w-6 px-1.5 rounded-full bg-amber-600 text-white text-xs font-bold">
              {totalPendientesConfirmar}
            </span>
          </div>

          <div className="flex flex-col gap-2 px-4 pb-4 max-h-420 overflow-y-auto">
            {(avancesPendientes ?? []).map((avance) => (
              <div key={`avance-${avance.id}`} className="flex flex-col gap-1 border rounded-md p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-medium">{avance.ordenFolio}</span>
                  <Badge variant="outline" className="text-xs">Avance</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Merma {avance.kgMerma} kg · Plasta {avance.kgPlasta} kg · {avance.piezasDefectuosas} piezas malas
                </p>
              </div>
            ))}
            {incidenciasSinConfirmar.map((inc) => (
              <div key={`incidencia-${inc.id}`} className="flex flex-col gap-1 border rounded-md p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-medium">{inc.ordenFolio}</span>
                  <Badge variant="outline" className="text-xs">Incidencia</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {inc.piezasAfectadas} piezas · {inc.materiaPrimaNombre} {inc.pigmentoColor}
                </p>
              </div>
            ))}
            {totalPendientesConfirmar === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">Todo confirmado ✓</p>
            )}
          </div>
        </div>

        {/* Columna 2: Pendientes de moler */}
        <div className="flex flex-col gap-3 border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <PackageSearch size={16} className="text-blue-600" />
              <h2 className="text-sm font-semibold text-blue-900">Listos para moler</h2>
            </div>
            <span className="flex items-center justify-center h-6 min-w-6 px-1.5 rounded-full bg-blue-600 text-white text-xs font-bold">
              {totalPendientesMoler}
            </span>
          </div>

          <div className="flex flex-col gap-2 px-4 pb-4 max-h-420 overflow-y-auto">
            {(pendientesMoler?.avances ?? []).map((a) => (
              <div key={a.id} className="flex items-center justify-between border rounded-md p-3 text-sm">
                <div>
                  <p className="font-mono font-medium">{a.ordenFolio}</p>
                  <p className="text-xs text-muted-foreground">{a.ordenTipoMaterial}</p>
                </div>
                <Badge variant="outline">{a.pigmentoColor}</Badge>
              </div>
            ))}
            {(pendientesMoler?.incidencias ?? []).map((i) => (
              <div key={i.id} className="flex items-center justify-between border rounded-md p-3 text-sm">
                <div>
                  <p className="font-mono font-medium">{i.ordenFolio}</p>
                  <p className="text-xs text-muted-foreground">{i.ordenTipoMaterial}</p>
                </div>
                <Badge variant="outline">{i.pigmentoColor}</Badge>
              </div>
            ))}
            {totalPendientesMoler === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">Nada pendiente de moler</p>
            )}
          </div>
        </div>

        {/* Columna 3: Últimas moliendas */}
        <div className="flex flex-col gap-3 border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <History size={16} className="text-emerald-600" />
              <h2 className="text-sm font-semibold text-emerald-900">Últimas moliendas</h2>
            </div>
            <span className="flex items-center justify-center h-6 min-w-6 px-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold">
              {moliendas?.length ?? 0}
            </span>
          </div>

          <div className="flex flex-col gap-2 px-4 pb-4 max-h-420 overflow-y-auto">
            {(moliendas ?? []).slice(0, 10).map((m) => (
              <div key={m.id} className="flex flex-col gap-1 border rounded-md p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{m.tipoMaterial}</span>
                  <span className="text-xs text-muted-foreground">{m.fecha}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{m.colorSolidoNombre}</span>
                  <span className="font-medium text-foreground">{m.kgIngresados} kg</span>
                </div>
              </div>
            ))}
            {(moliendas ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">Sin moliendas registradas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}