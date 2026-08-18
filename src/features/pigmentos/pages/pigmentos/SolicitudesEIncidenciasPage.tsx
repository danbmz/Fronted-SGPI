import { useState } from "react";
import { useTodasSolicitudesMaterial, useConfirmarSolicitudMaterial } from "@/features/avancesTurno/hooks/useSolicitudMaterial";
import { useIncidencias } from "@/features/avancesTurno/hooks/useIncidencia";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import DialogResolverIncidencia from "../../components/pigmentos/DialogResolverIncidencia";
import type { Incidencia } from "@/features/avancesTurno/schemas/incidencia";

export default function SolicitudesEIncidenciasPage() {
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState<Incidencia | null>(null);

  const { data: solicitudes, isLoading: cargandoSolicitudes } = useTodasSolicitudesMaterial({
    confirmado: false,
  });
  const { data: incidencias, isLoading: cargandoIncidencias } = useIncidencias({
    resuelto: false,
  });

  const confirmarSolicitudMutation = useConfirmarSolicitudMaterial();

  const handleConfirmarSolicitud = async (id: string, avanceTurnoId: string) => {
    try {
      await confirmarSolicitudMutation.mutateAsync({ id, avanceTurnoId });
      toast.success("Solicitud confirmada — salida de inventario registrada.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al confirmar la solicitud.");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Solicitudes de material pendientes</h2>
        {cargandoSolicitudes && <p className="text-muted-foreground py-2">Cargando...</p>}
        {!cargandoSolicitudes && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Kg solicitados</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Máquina</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(solicitudes ?? []).map((s) => (
                <TableRow key={s.id}>
                  <TableCell><Badge variant="outline">{s.tipoMaterial}</Badge></TableCell>
                  <TableCell className="text-sm font-medium">{s.materiaPrimaNombre}</TableCell>
                  <TableCell className="text-sm">
                    {s.tipoMaterial === "VIRGEN" ? s.pigmentoColor : s.colorSolidoNombre}
                  </TableCell>
                  <TableCell className="font-medium">{s.kgSolicitados} kg</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.supervisorNombre}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{s.maquinaNombre}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => handleConfirmarSolicitud(s.id, s.avanceTurnoId)}>
                      Confirmar salida
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!solicitudes || solicitudes.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No hay solicitudes pendientes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Incidencias de material mal pigmentado sin resolver</h2>
        {cargandoIncidencias && <p className="text-muted-foreground py-2">Cargando...</p>}
        {!cargandoIncidencias && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Materia prima</TableHead>
                <TableHead>Pigmento</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(incidencias ?? []).map((inc) => (
                <TableRow key={inc.id}>
                  <TableCell className="font-mono text-sm">{inc.ordenFolio}</TableCell>
                  <TableCell className="text-sm font-medium">{inc.materiaPrimaNombre}</TableCell>
                  <TableCell className="text-sm">{inc.pigmentoColor}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => setIncidenciaSeleccionada(inc)}>
                      Resolver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!incidencias || incidencias.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No hay incidencias pendientes de resolver.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <DialogResolverIncidencia
        open={incidenciaSeleccionada !== null}
        incidencia={incidenciaSeleccionada}
        onClose={() => setIncidenciaSeleccionada(null)}
      />
    </div>
  );
}