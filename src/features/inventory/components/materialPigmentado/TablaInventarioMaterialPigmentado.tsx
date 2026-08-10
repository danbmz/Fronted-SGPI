import { Button } from "@/components/ui/button";
import type { InventarioMaterialPigmentadoItem } from "../../schemas/inventario.schema";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { History } from "lucide-react";
import { useState } from "react";
import DialogHistorialMovimientos from "../movimientos/DialogHistorialMovimientos";

interface Props {
  materialPigmentado: InventarioMaterialPigmentadoItem[];
}

export default function TablaInventarioMaterialPigmentado({ materialPigmentado }: Props) {
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<InventarioMaterialPigmentadoItem | null>(null);

  return (
    <>
          <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Material base</TableHead>
          <TableHead>Color</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Stock actual</TableHead>
          <TableHead>Movimientos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {materialPigmentado.map((item) => (
          <TableRow key={item.combinacionId}>
            <TableCell className="font-medium">{item.materiaPrimaNombre}</TableCell>
            <TableCell>{item.pigmentoColor}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{item.pigmentoCategoria}</TableCell>
            <TableCell className="font-medium">{item.cantidadActual}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" onClick={() => setMateriaSeleccionada(item)}>
                <History size={16} />
              </Button>
            </TableCell>
            </TableRow>
        ))}
        {materialPigmentado.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
              No hay material pigmentado registrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>

      <DialogHistorialMovimientos
        open={materiaSeleccionada !== null}
        onClose={() => setMateriaSeleccionada(null)}
        tipoInventario="MATERIAL_PIGMENTADO"
        combinacionId={materiaSeleccionada?.combinacionId}
        titulo={`Historial — ${materiaSeleccionada?.materiaPrimaNombre ?? ""} ${materiaSeleccionada?.pigmentoColor ?? ""}`}
      />
    </>
  );
}