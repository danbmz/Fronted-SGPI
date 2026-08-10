import { Button } from "@/components/ui/button";
import type { InventarioMateriaPrimaItem } from "../../schemas/inventario.schema";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { AlertTriangle, History } from "lucide-react";
import { useState } from "react";
import DialogHistorialMovimientos from "../movimientos/DialogHistorialMovimientos";

interface Props {
  materiasPrimas: InventarioMateriaPrimaItem[];
}

export default function TablaInventarioMateriasPrimas({ materiasPrimas }: Props) {
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<InventarioMateriaPrimaItem | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Stock actual</TableHead>
            <TableHead>Stock mínimo</TableHead>
            <TableHead>Movimientos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materiasPrimas.map((item) => {
            const stockBajo = item.cantidadActual < item.stockMinimo;
            return (
              <TableRow key={item.materiaPrimaId} className={stockBajo ? "bg-red-50" : ""}>
                <TableCell className="font-mono text-sm">{item.codigoInterno}</TableCell>
                <TableCell className="font-medium">{item.nombre}</TableCell>
                <TableCell className="text-sm">{item.unidadMedida}</TableCell>
                <TableCell className={`font-medium ${stockBajo ? "text-red-600" : ""}`}>
                  <div className="flex items-center gap-1">
                    {stockBajo && <AlertTriangle size={14} className="text-red-600" />}
                    {item.cantidadActual}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.stockMinimo}</TableCell>
                <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setMateriaSeleccionada(item)}>
                      <History size={16} />
                    </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {materiasPrimas.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No hay materias primas registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DialogHistorialMovimientos
        open={materiaSeleccionada !== null}
        onClose={() => setMateriaSeleccionada(null)}
        tipoInventario="MATERIA_PRIMA"
        materiaPrimaId={materiaSeleccionada?.materiaPrimaId}
        titulo={`Historial — ${materiaSeleccionada?.nombre ?? ""}`}
      />
    </>
  );
}