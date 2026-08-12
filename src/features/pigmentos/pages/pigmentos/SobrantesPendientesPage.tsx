import { useState } from "react";
import { useAvancesTurno } from "@/features/avancesTurno/hooks/useAvanceTurno";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DialogConfirmarSobrante from "../../components/pigmentos/DialogConfirmarSobrante";
import type { AvanceTurno } from "@/features/avancesTurno/schemas/avanceTurno";

export default function SobrantesPendientesPage() {
  const [avanceSeleccionado, setAvanceSeleccionado] = useState<AvanceTurno | null>(null);

  const { data: avances, isLoading, error } = useAvancesTurno({
    sobranteConfirmado: false,
  });

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm text-muted-foreground">
        Kilogramos sobrantes reportados por supervisores, pendientes de confirmar recepción.
      </p>

      {isLoading && <p className="text-muted-foreground py-4">Cargando...</p>}
      {error && <p className="text-red-500">Error al cargar: {error.message}</p>}

      {!isLoading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orden</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Kg sobrante</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(avances ?? []).map((avance) => (
              <TableRow key={avance.id}>
                <TableCell className="font-mono font-medium">{avance.ordenFolio}</TableCell>
                <TableCell className="text-sm">{avance.supervisorNombre}</TableCell>
                <TableCell>
                  <Badge variant="outline">{avance.tipoMaterialSobrante}</Badge>
                </TableCell>
                <TableCell className="font-medium">{avance.kgSobrante} kg</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => setAvanceSeleccionado(avance)}>
                    Confirmar recepción
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!avances || avances.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No hay sobrantes pendientes de confirmar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <DialogConfirmarSobrante
        open={avanceSeleccionado !== null}
        avance={avanceSeleccionado}
        onClose={() => setAvanceSeleccionado(null)}
      />
    </div>
  );
}