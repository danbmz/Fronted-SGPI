import { useState } from "react";
import { useAvancesTurno } from "@/features/avancesTurno/hooks/useAvanceTurno";
import { useIncidencias } from "@/features/avancesTurno/hooks/useIncidencia";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { AvanceTurno } from "@/features/avancesTurno/schemas/avanceTurno";
import type { Incidencia } from "@/features/avancesTurno/schemas/incidencia";
import DialogConfirmarMolino from "../../components/molino/DialogConfirmarMolino";
import DialogConfirmarIncidenciaMolino from "../../components/molino/DialogConfirmarIncidenciaMolino";

export default function PendientesConfirmacionPage() {
  const [avanceSeleccionado, setAvanceSeleccionado] = useState<AvanceTurno | null>(null);
  const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState<Incidencia | null>(null);

  const { data: avancesPendientes, isLoading: cargandoAvances } = useAvancesTurno({
    estado: "CERRADO",
    confirmacionMolinoConfirmado: false,
  });

  const { data: incidenciasPendientes, isLoading: cargandoIncidencias } = useIncidencias({
    destino: "MOLINO",
  });

  // De las incidencias con destino MOLINO, solo las que aún no han sido confirmadas
  const incidenciasSinConfirmar = (incidenciasPendientes ?? []).filter(
    (i) => i.confirmadoMolino === null
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Avances de turno pendientes de confirmar</h2>
        {cargandoAvances && <p className="text-muted-foreground py-2">Cargando...</p>}
        {!cargandoAvances && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Merma reportada</TableHead>
                <TableHead>Plasta reportada</TableHead>
                <TableHead>Piezas malas</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(avancesPendientes ?? []).map((avance) => (
                <TableRow key={avance.id}>
                  <TableCell className="font-mono font-medium">{avance.ordenFolio}</TableCell>
                  <TableCell className="text-sm">{avance.supervisorNombre}</TableCell>
                  <TableCell className="text-sm">{avance.kgMerma} kg</TableCell>
                  <TableCell className="text-sm">{avance.kgPlasta} kg</TableCell>
                  <TableCell className="text-sm">{avance.piezasDefectuosas}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => setAvanceSeleccionado(avance)}>
                      Confirmar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!avancesPendientes || avancesPendientes.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No hay avances pendientes de confirmar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold">Incidencias de material mal pigmentado pendientes</h2>
        {cargandoIncidencias && <p className="text-muted-foreground py-2">Cargando...</p>}
        {!cargandoIncidencias && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Piezas afectadas</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidenciasSinConfirmar.map((inc) => (
                <TableRow key={inc.id}>
                  <TableCell className="font-mono text-sm">{inc.ordenFolio}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inc.supervisorNombre}</TableCell>
                  <TableCell className="text-sm">{inc.piezasAfectadas}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => setIncidenciaSeleccionada(inc)}>
                      Confirmar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {incidenciasSinConfirmar.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                    No hay incidencias pendientes de confirmar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <DialogConfirmarMolino
        open={avanceSeleccionado !== null}
        avance={avanceSeleccionado}
        onClose={() => setAvanceSeleccionado(null)}
      />

      <DialogConfirmarIncidenciaMolino
        open={incidenciaSeleccionada !== null}
        incidencia={incidenciaSeleccionada}
        onClose={() => setIncidenciaSeleccionada(null)}
      />
    </div>
  );
}