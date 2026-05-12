// src/components/catalogos/operadores/TablaOperadores.tsx
import { useState } from "react"
import type { Operador } from "@/types/operadoresCatalogo"
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
import DialogEditarOperador from "./DialogEditarOperador"
import DialogDesactivarOperador from "./DialogDesactivarOperador"
import DialogReactivarOperador from "./DialogReactivarOperador"

interface Props {
  operadores: Operador[]
  onOperadorEditado: (operador: Operador) => void
  onOperadorDesactivado: (operador: Operador) => void
  onOperadorReactivado: (operador: Operador) => void
}

export default function TablaOperadores({operadores, onOperadorEditado, onOperadorDesactivado, onOperadorReactivado }: Props) {
  const [operadorSeleccionado, setOperadorSeleccionado] = useState<Operador | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState<"editar" | "desactivar" | "reactivar" | null>(null)

  const abrirDialog = (tipo: "editar" | "desactivar" | "reactivar", operador: Operador) => {
    setOperadorSeleccionado(operador)
    setDialogAbierto(tipo)
  }

  const cerrarDialog = () => {
    setOperadorSeleccionado(null)
    setDialogAbierto(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>N° Empleado</TableHead>
            <TableHead>Turno</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operadores.map((operador) => (
            <TableRow key={operador.id}>
              <TableCell className="font-medium">{operador.nombre}</TableCell>
              <TableCell>{operador.numeroEmpleado}</TableCell>
              <TableCell>{operador.turnoHabitual}</TableCell>
              <TableCell>{operador.area}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  operador.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {operador.activo ? "Activo" : "Inactivo"}
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
                    <DropdownMenuItem onClick={() => abrirDialog("editar", operador)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {operador.activo ? (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => abrirDialog("desactivar", operador)}
                      >
                        Desactivar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="text-green-600"
                        onClick={() => abrirDialog("reactivar", operador)}
                      >
                        Reactivar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {operadores.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No hay operadores registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>



      <DialogEditarOperador
        open={dialogAbierto === "editar"}
        operador={operadorSeleccionado}
        onClose={cerrarDialog}
        onSuccess={onOperadorEditado}
      />

      <DialogDesactivarOperador
        open={dialogAbierto === "desactivar"}
        operador={operadorSeleccionado}
        onClose={cerrarDialog}
        onSuccess={onOperadorDesactivado}
      />

      <DialogReactivarOperador
        open={dialogAbierto === "reactivar"}
        operador={operadorSeleccionado}
        onClose={cerrarDialog}
        onSuccess={onOperadorReactivado}
      />
    </>
  )
}