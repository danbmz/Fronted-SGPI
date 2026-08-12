import { useState, useMemo } from "react";
import { useOrdenes } from "@/features/ordenes/hooks/useOrdenes";
import { useAvancesTurno } from "../../hooks/useAvanceTurno";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DialogAbrirAvance from "../../components/supervisor/DialogAbrirAvance";
import type { Orden } from "@/features/ordenes/schemas/orden.schema";

const estadoColor: Record<string, string> = {
  ACTIVA: "bg-blue-100 text-blue-700",
  EN_PROGRESO: "bg-amber-100 text-amber-700",
};

export default function OrdenesDisponiblesPage() {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<Orden | null>(null);

  const { data: ordenes, isLoading: cargandoOrdenes, error: errorOrdenes } = useOrdenes({
    excluirFinalizadas: true,
  });
  const { data: avancesAbiertos, isLoading: cargandoAvances } = useAvancesTurno({ estado: "ABIERTO" });

  // Cruce: excluimos órdenes que ya tienen un avance abierto (propio o de otro supervisor)
  const ordenesDisponibles = useMemo(() => {
    if (!ordenes || !avancesAbiertos) return [];
    const idsConAvanceAbierto = new Set(avancesAbiertos.map((a) => a.ordenId));
    return ordenes.filter(
      (o) =>
        (o.estado === "ACTIVA" || o.estado === "EN_PROGRESO") &&
        !idsConAvanceAbierto.has(o.id)
    );
  }, [ordenes, avancesAbiertos]);

  const isLoading = cargandoOrdenes || cargandoAvances;

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm text-muted-foreground">
        Órdenes disponibles para iniciar un avance de turno.
      </p>

      {isLoading && <p className="text-muted-foreground py-4">Cargando órdenes...</p>}
      {errorOrdenes && <p className="text-red-500">Error al cargar órdenes: {errorOrdenes.message}</p>}

      {!isLoading && !errorOrdenes && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Folio</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Máquina</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Piezas</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordenesDisponibles.map((orden) => (
              <TableRow key={orden.id}>
                <TableCell className="font-mono font-medium">{orden.folio}</TableCell>
                <TableCell>{orden.productoNombre}</TableCell>
                <TableCell className="text-sm">{orden.maquinaNombre}</TableCell>
                <TableCell>
                  <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor[orden.estado]}`}>
                    {orden.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{orden.totalPiezas}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => setOrdenSeleccionada(orden)}>
                    Iniciar avance
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {ordenesDisponibles.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No hay órdenes disponibles en este momento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <DialogAbrirAvance
        open={ordenSeleccionada !== null}
        orden={ordenSeleccionada}
        onClose={() => setOrdenSeleccionada(null)}
      />
    </div>
  );
}