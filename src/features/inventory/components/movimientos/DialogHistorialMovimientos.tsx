import { useHistorialInventario } from "../../hook/useInventario";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { OrigenMolido, TipoInventario, TipoMaterial } from "@/types/enums";

interface Props {
  open: boolean;
  onClose: () => void;
  tipoInventario: TipoInventario;
  materiaPrimaId?: string;
  pigmentoId?: string;
  productoId?: string;
  colorSolidoId?: string;
  origen?: OrigenMolido;
  tipoMaterial?: TipoMaterial;
  combinacionId?: string;   
  titulo: string; // ej. "Historial — Polipropileno Virgen"
}

const colorTipoMovimiento: Record<string, string> = {
  ENTRADA: "bg-green-100 text-green-700",
  SALIDA: "bg-red-100 text-red-700",
  AJUSTE: "bg-blue-100 text-blue-700",
};

export default function DialogHistorialMovimientos({
  open,
  onClose,
  tipoInventario,
  materiaPrimaId,
  pigmentoId,
  productoId,
  colorSolidoId,
  origen,
  tipoMaterial,
  combinacionId,
  titulo,
}: Props) {
  const { data: movimientos, isLoading, error } = useHistorialInventario({
    tipoInventario,
    materiaPrimaId,
    pigmentoId,
    productoId,
    colorSolidoId,
    origen,
    tipoMaterial,
    combinacionId,
    limite: 50,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>
            Últimos movimientos registrados para este material.
          </DialogDescription>
        </DialogHeader>

        {isLoading && <p className="text-muted-foreground py-4">Cargando movimientos...</p>}
        {error && <p className="text-red-500">Error al cargar el historial: {error.message}</p>}

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
      </DialogContent>
    </Dialog>
  );
}