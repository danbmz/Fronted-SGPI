import { useState } from "react"
import type { Pigmento, CategoriaColor } from "@/validations/catalogo/pigmentosValidations"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import DialogEditarPigmento from "./DialogEditarPigmento"
import DialogDesactivarPigmento from "./DialogDesactivarPigmento"
import DialogReactivarPigmento from "./DialogReactivarPigmento"

interface Props {
  pigmentos: Pigmento[]
  onPigmentoEditado: (pigmento: Pigmento) => void
  onPigmentoDesactivado: (pigmento: Pigmento) => void
  onPigmentoReactivado: (pigmento: Pigmento) => void
}

export const colorCategoria: Record<CategoriaColor, string> = {
  "Sólidos":           "bg-blue-100 text-blue-700",
  "Sólidos Pasteles":  "bg-pink-100 text-pink-700",
  "Neón Traslucidos":  "bg-green-100 text-green-700",
  "Jarra Neón Pastel": "bg-orange-100 text-orange-700"
}

export const colorTipo: Record<string, string> = {
  master: "bg-purple-100 text-purple-700",
  polvo:  "bg-yellow-100 text-yellow-700"
}

export const categoriaColores: Record<string, string> = {
    natural: "bg-stone-100 text-stone-700",
    amarillo: "bg-yellow-100 text-yellow-700",
    verde: "bg-green-100 text-green-700",
    naranja: "bg-orange-100 text-orange-700",
    azul: "bg-blue-100 text-blue-700",
    "azul pastel": "bg-blue-100 text-blue-700",
    rojo: "bg-red-100 text-red-700",
    morado: "bg-purple-100 text-purple-700",
    blanco: "bg-gray-100 text-gray-500",
    rosa: "bg-pink-100 text-pink-700",
    beige: "bg-amber-100 text-amber-700",
    crema: "bg-yellow-50 text-yellow-600",
}

export default function TablaPigmentos({
  pigmentos,
  onPigmentoEditado,
  onPigmentoDesactivado,
  onPigmentoReactivado
}: Props) {
  const [pigmentoSeleccionado, setPigmentoSeleccionado] = useState<Pigmento | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState<"editar" | "desactivar" | "reactivar" | null>(null)

  const abrirDialog = (tipo: "editar" | "desactivar" | "reactivar", pigmento: Pigmento) => {
    setPigmentoSeleccionado(pigmento)
    setDialogAbierto(tipo)
  }

  const cerrarDialog = () => {
    setPigmentoSeleccionado(null)
    setDialogAbierto(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Color</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Aplicación</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pigmentos.map((pigmento) => (
            <TableRow key={pigmento.id}>
              <TableCell className="font-medium">
                {pigmento.color}
              </TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorCategoria[pigmento.categoriaColor]}`}>
                  {pigmento.categoriaColor}
                </span>
              </TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorTipo[pigmento.tipo]}`}>
                  {pigmento.tipo}
                </span>
              </TableCell>
              <TableCell>{pigmento.aplicacion}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  pigmento.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {pigmento.activo ? "Activo" : "Inactivo"}
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
                    <DropdownMenuItem onClick={() => abrirDialog("editar", pigmento)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {pigmento.activo ? (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => abrirDialog("desactivar", pigmento)}
                      >
                        Desactivar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="text-green-600"
                        onClick={() => abrirDialog("reactivar", pigmento)}
                      >
                        Reactivar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {pigmentos.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No hay pigmentos registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DialogEditarPigmento
        open={dialogAbierto === "editar"}
        pigmento={pigmentoSeleccionado}
        onClose={cerrarDialog}
        onSuccess={onPigmentoEditado}
      />

      <DialogDesactivarPigmento
        open={dialogAbierto === "desactivar"}
        pigmento={pigmentoSeleccionado}
        onClose={cerrarDialog}
        onSuccess={onPigmentoDesactivado}
      />

      <DialogReactivarPigmento
        open={dialogAbierto === "reactivar"}
        pigmento={pigmentoSeleccionado}
        onClose={cerrarDialog}
        onSuccess={onPigmentoReactivado}
      />
    </>
  )
}