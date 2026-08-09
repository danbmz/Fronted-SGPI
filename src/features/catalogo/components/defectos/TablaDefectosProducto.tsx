import { useState } from "react";
import type { DefectoProducto } from "../../schemas/defectos";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import DialogEditarDefectoProducto from "./DialogEditarDefectoProducto";
import DialogToggleEstadoDefecto from "./DialogToggleEstadoDefecto";

interface Props {
  defectos: DefectoProducto[];
}

export default function TablaDefectosProducto({ defectos }: Props) {
  const [defectoSeleccionado, setDefectoSeleccionado] = useState<DefectoProducto | null>(null);
  const [dialogAbierto, setDialogAbierto] = useState<"editar" | "toggle" | null>(null);

  const abrirDialog = (tipo: "editar" | "toggle", defecto: DefectoProducto) => {
    setDefectoSeleccionado(defecto);
    setDialogAbierto(tipo);
  };

  const cerrarDialog = () => {
    setDefectoSeleccionado(null);
    setDialogAbierto(null);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {defectos.map((defecto) => (
            <TableRow key={defecto.id}>
              <TableCell className="font-medium">{defecto.nombre}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  defecto.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {defecto.activo ? "Activo" : "Inactivo"}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => abrirDialog("editar", defecto)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {defecto.activo ? (
                      <DropdownMenuItem variant="destructive" onClick={() => abrirDialog("toggle", defecto)}>
                        Desactivar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="text-green-600 hover:text-green-600! hover:bg-green-100!" onClick={() => abrirDialog("toggle", defecto)}>
                        Reactivar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {defectos.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                No hay defectos registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DialogEditarDefectoProducto
        open={dialogAbierto === "editar"}
        defecto={defectoSeleccionado}
        onClose={cerrarDialog}
      />

      <DialogToggleEstadoDefecto
        open={dialogAbierto === "toggle"}
        defecto={defectoSeleccionado}
        onClose={cerrarDialog}
      />
    </>
  );
}