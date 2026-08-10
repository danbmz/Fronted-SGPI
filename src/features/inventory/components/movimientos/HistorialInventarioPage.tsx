import { useState } from "react";
import { useHistorialInventario } from "../../hook/useInventario";
import { TIPO_INVENTARIO } from "@/types/enums";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";

const colorTipoMovimiento: Record<string, string> = {
  ENTRADA: "bg-green-100 text-green-700",
  SALIDA: "bg-red-100 text-red-700",
  AJUSTE: "bg-blue-100 text-blue-700",
};

export default function HistorialInventarioPage() {
  const [tipoInventario, setTipoInventario] = useState<(typeof TIPO_INVENTARIO)[number]>("MATERIA_PRIMA");

  const { data: movimientos, isLoading, error } = useHistorialInventario({
    tipoInventario,
    limite: 100,
  });

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm text-muted-foreground">
        Consulta el historial general de movimientos de inventario.
      </p>

      <div className="flex flex-col gap-1 max-w-xs">
        <Select value={tipoInventario} onValueChange={(val) => setTipoInventario(val as typeof tipoInventario)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un tipo" />
          </SelectTrigger>
          <SelectContent>
            {TIPO_INVENTARIO.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="text-muted-foreground py-4">Cargando movimientos...</p>}
      {error && <p className="text-red-500">Error al cargar: {error.message}</p>}

      {!isLoading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Anterior</TableHead>
              <TableHead>Movimiento</TableHead>
              <TableHead>Nueva</TableHead>
              <TableHead>Usuario</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(movimientos ?? []).map((mov) => (
              <TableRow key={mov.id}>
                <TableCell className="text-sm">{new Date(mov.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${colorTipoMovimiento[mov.tipoMovimiento]}`}>
                    {mov.tipoMovimiento}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{mov.motivo}</TableCell>
                <TableCell className="text-sm">{mov.cantidadAnterior}</TableCell>
                <TableCell className={`text-sm font-medium ${mov.cantidadMovimiento > 0 ? "text-green-600" : "text-red-600"}`}>
                  {mov.cantidadMovimiento > 0 ? "+" : ""}{mov.cantidadMovimiento}
                </TableCell>
                <TableCell className="text-sm font-medium">{mov.cantidadNueva}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{mov.usuarioNombre}</TableCell>
              </TableRow>
            ))}
            {(movimientos ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No hay movimientos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}