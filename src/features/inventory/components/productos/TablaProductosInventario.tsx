import { useState } from "react";
import type { InventarioProductoItem } from "../../schemas/inventario.schema";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import DialogHistorialMovimientos from "../movimientos/DialogHistorialMovimientos";

interface Props {
  productos: InventarioProductoItem[];
}

export default function TablaProductosInventario({ productos }: Props) {
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<InventarioProductoItem | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Stock actual</TableHead>
            <TableHead>Movimientos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((item) => (
            <TableRow key={`${item.productoId}-${item.pigmentoId}`}>
              <TableCell className="font-medium">{item.productoNombre}</TableCell>
              <TableCell>{item.color}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{item.categoriaColor}</TableCell>
              <TableCell className="font-medium">{item.cantidadActual}</TableCell>
              <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => setMateriaSeleccionada(item)}>
                    <History size={16} />
                  </Button>
              </TableCell>
            </TableRow>
          ))}
          {productos.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                No hay productos en inventario.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DialogHistorialMovimientos
        open={materiaSeleccionada !== null}
        onClose={() => setMateriaSeleccionada(null)}
        tipoInventario="PRODUCTO"
        productoId={materiaSeleccionada?.productoId}
        pigmentoId={materiaSeleccionada?.pigmentoId}
        titulo={`Historial — ${materiaSeleccionada?.productoNombre ?? ""} ${materiaSeleccionada?.color} ${materiaSeleccionada?.categoriaColor}`}
      />
    </>
  );
}