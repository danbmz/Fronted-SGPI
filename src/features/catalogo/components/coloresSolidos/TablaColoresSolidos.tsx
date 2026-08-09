import { useState } from "react";
import type { ColorSolido } from "../../schemas/colorSolido";
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
import { DialogEditarColorSolido } from "./DialogEditarColorSolido";
import { DialogDesactivarColorSolido } from "./DialogDesactivarColorSolido";
import { DialogReactivarColorSolido } from "./DialogReactivarColorSolido";

interface Props {
  coloresSolidos: ColorSolido[];
}

export function TablaColoresSolidos({ coloresSolidos }: Props) {
  const [colorSeleccionado, setColorSeleccionado] = useState<ColorSolido | null>(null);
  const [dialogAbierto, setDialogAbierto] = useState<"editar" | "desactivar" | "reactivar" | null>(null);

  const abrirDialog = (tipo: "editar" | "desactivar" | "reactivar", color: ColorSolido) => {
    setColorSeleccionado(color);
    setDialogAbierto(tipo);
  };

  const cerrarDialog = () => {
    setColorSeleccionado(null);
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
          {coloresSolidos.map((color) => (
            <TableRow key={color.id}>
              <TableCell className="font-medium">{color.nombre}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  color.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {color.activo ? "Activo" : "Inactivo"}
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
                    <DropdownMenuItem onClick={() => abrirDialog("editar", color)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {color.activo ? (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => abrirDialog("desactivar", color)}
                      >
                        Desactivar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="text-green-600"
                        onClick={() => abrirDialog("reactivar", color)}
                      >
                        Reactivar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {coloresSolidos.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                No hay colores sólidos registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DialogEditarColorSolido
        open={dialogAbierto === "editar"}
        colorSolido={colorSeleccionado}
        onClose={cerrarDialog}
      />
      <DialogDesactivarColorSolido
        open={dialogAbierto === "desactivar"}
        colorSolido={colorSeleccionado}
        onClose={cerrarDialog}
      />
      <DialogReactivarColorSolido
        open={dialogAbierto === "reactivar"}
        colorSolido={colorSeleccionado}
        onClose={cerrarDialog}
      />
    </>
  );
}