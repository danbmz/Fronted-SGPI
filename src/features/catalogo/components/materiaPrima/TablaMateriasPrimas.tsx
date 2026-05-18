import { useState } from "react"
import type { MateriaPrima } from "@/types/materiaPrima"
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
import DialogEditarMateriaPrima from "./DialogEditarMateriaPrima"
import DialogDesactivarMateriaPrima from "./DialogDesactivarMateriaPrima"
import DialogReactivarMateriaPrima from "./DialogReactivarMateriaPrima"
import { Badge } from "@/components/ui/badge"

interface Props {
  materiasPrimas: MateriaPrima[]
  onMateriaPrimaEditada: (materiaPrima: MateriaPrima) => void
  onMateriaPrimaDesactivada: (materiaPrima: MateriaPrima) => void
  onMateriaPrimaReactivada: (materiaPrima: MateriaPrima) => void
}

const colorTipo: Record<string, string> = {
  Polipropileno:   "bg-olive-200 text-olive-700",
  "Poliestireno-Cristal": "bg-slate-200 text-slate-700"
}
const colorSubtipo: Record<string, string> = {
  virgen:   "bg-blue-100 text-blue-700",
  reciclado: "bg-yellow-100 text-yellow-700"
}

export default function TablaMateriasPrimas({
  materiasPrimas,
  onMateriaPrimaEditada,
  onMateriaPrimaDesactivada,
  onMateriaPrimaReactivada
}: Props) {
  const [materiaPrimaSeleccionada, setMateriaPrimaSeleccionada] = useState<MateriaPrima | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState<"editar" | "desactivar" | "reactivar" | null>(null)

  const abrirDialog = (tipo: "editar" | "desactivar" | "reactivar", materiaPrima: MateriaPrima) => {
    setMateriaPrimaSeleccionada(materiaPrima)
    setDialogAbierto(tipo)
  }

  const cerrarDialog = () => {
    setMateriaPrimaSeleccionada(null)
    setDialogAbierto(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Subtipo</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead>Unidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materiasPrimas.map((materiaPrima) => (
            <TableRow key={materiaPrima.id}>
              <TableCell className="font-medium">{materiaPrima.nombre}</TableCell>
              <TableCell className="font-mono text-sm">{materiaPrima.codigoInterno}</TableCell>
              <TableCell>
                <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${colorTipo[materiaPrima.tipo]}`}>
                    {materiaPrima.tipo}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${colorSubtipo[materiaPrima.subtipo]}`}>
                  {materiaPrima.subtipo}
                </Badge>
              </TableCell>
              <TableCell>{materiaPrima.proveedor}</TableCell>
              <TableCell>{materiaPrima.unidadMedida}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  materiaPrima.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {materiaPrima.activo ? "Activo" : "Inactivo"}
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
                    <DropdownMenuItem onClick={() => abrirDialog("editar", materiaPrima)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {materiaPrima.activo ? (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => abrirDialog("desactivar", materiaPrima)}
                      >
                        Desactivar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="text-green-600"
                        onClick={() => abrirDialog("reactivar", materiaPrima)}
                      >
                        Reactivar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {materiasPrimas.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                No hay materias primas registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DialogEditarMateriaPrima
        open={dialogAbierto === "editar"}
        materiaPrima={materiaPrimaSeleccionada}
        onClose={cerrarDialog}
        onSuccess={onMateriaPrimaEditada}
      />

      <DialogDesactivarMateriaPrima
        open={dialogAbierto === "desactivar"}
        materiaPrima={materiaPrimaSeleccionada}
        onClose={cerrarDialog}
        onSuccess={onMateriaPrimaDesactivada}
      />

      <DialogReactivarMateriaPrima
        open={dialogAbierto === "reactivar"}
        materiaPrima={materiaPrimaSeleccionada}
        onClose={cerrarDialog}
        onSuccess={onMateriaPrimaReactivada}
      />
    </>
  )
}