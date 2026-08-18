import { Button } from "@/components/ui/button";
import type { InventarioPigmentoItem } from "../../schemas/inventario.schema";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { AlertTriangle, History } from "lucide-react";
import { useState } from "react";
import DialogHistorialMovimientos from "../movimientos/DialogHistorialMovimientos";

interface Props {
  pigmentos: InventarioPigmentoItem[];
}

export default function TablaInventarioPigmentos({ pigmentos }: Props) {
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<InventarioPigmentoItem | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Color</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Material</TableHead>
            <TableHead>Stock actual</TableHead>
            <TableHead>Stock mínimo</TableHead>
            <TableHead>Movimientos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pigmentos.map((item) => {
            const stockBajo = item.cantidadActual < item.stockMinimo;
            return (
              <TableRow key={item.pigmentoId} className={stockBajo ? "bg-red-50" : ""}>
                <TableCell className="font-medium">{item.color}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.categoriaColor}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.tipo}</TableCell>
                <TableCell className="text-sm">{item.tipoMaterial}</TableCell>
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
          {pigmentos.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No hay pigmentos registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DialogHistorialMovimientos
        open={materiaSeleccionada !== null}
        onClose={() => setMateriaSeleccionada(null)}
        tipoInventario="PIGMENTO"
        pigmentoId={materiaSeleccionada?.pigmentoId}
        titulo={`Historial — ${materiaSeleccionada?.color ?? ""} ${materiaSeleccionada?.categoriaColor ?? ""} ${materiaSeleccionada?.tipo}`}
      />
    </>
  );
}