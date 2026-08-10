import type { InventarioMolidoItem } from "../../schemas/inventario.schema";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import DialogHistorialMovimientos from "../movimientos/DialogHistorialMovimientos";
import { useState } from "react";

interface Props {
  molido: InventarioMolidoItem[];
}

const origenColor: Record<string, string> = {
  INTERNO: "bg-blue-100 text-blue-700",
  COMPRADO: "bg-amber-100 text-amber-700",
};

export default function TablaInventarioMolido({ molido }: Props) {
    const [materiaSeleccionada, setMateriaSeleccionada] = useState<InventarioMolidoItem | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Stock actual</TableHead>
            <TableHead>Movimientos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {molido.map((item, index) => (
            <TableRow key={`${item.materiaPrimaId}-${item.origen}-${item.colorSolidoId}-${index}`}>
              <TableCell className="font-medium">{item.materiaPrimaNombre}</TableCell>
              <TableCell>
                <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${origenColor[item.origen]}`}>
                  {item.origen}
                </Badge>
              </TableCell>
              <TableCell>{item.colorSolidoNombre}</TableCell>
              <TableCell className="font-medium">{item.cantidadActual}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => setMateriaSeleccionada(item)}>
                  <History size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {molido.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                No hay material molido registrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DialogHistorialMovimientos
        open={materiaSeleccionada !== null}
        onClose={() => setMateriaSeleccionada(null)}
        tipoInventario="MOLIDO"
        materiaPrimaId={materiaSeleccionada?.materiaPrimaId}
        colorSolidoId={materiaSeleccionada?.colorSolidoId}
        origen={materiaSeleccionada?.origen}
        titulo={`Historial — Molido ${materiaSeleccionada?.materiaPrimaNombre ?? ""} ${materiaSeleccionada?.colorSolidoNombre ?? ""}`}
      />
    </>
  );
}