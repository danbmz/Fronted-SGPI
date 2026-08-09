import { useState } from "react"
import type { Maquina } from "../../schemas/maquina"
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
import DialogEditarMaquina from "./DialogEditarMaquina"
import DialogCambiarEstadoMaquina from "./DialogCambiarEstadoMaquina"

interface Props {
  maquinas: Maquina[]
}

const colorEstado: Record<string, string> = {
  ACTIVA:           "bg-green-100 text-green-700",
  MANTENIMIENTO: "bg-yellow-100 text-yellow-700",
  INACTIVA:         "bg-red-100 text-red-700"
}

export default function TablaMaquinas({ maquinas }: Props) {
  const [maquinaSeleccionada, setMaquinaSeleccionada] = useState<Maquina | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState<"editar" | "cambiarEstado" | null>(null)

  const abrirDialog = (tipo: "editar" | "cambiarEstado", maquina: Maquina) => {
    setMaquinaSeleccionada(maquina)
    setDialogAbierto(tipo)
  }

  const cerrarDialog = () => {
    setMaquinaSeleccionada(null)
    setDialogAbierto(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>N° Máquina</TableHead>
            <TableHead>Proceso</TableHead>
            <TableHead>Capacidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {maquinas.map((maquina) => (
            <TableRow key={maquina.id}>
              <TableCell className="font-medium">{maquina.nombre}</TableCell>
              <TableCell>{maquina.codigo}</TableCell>
              <TableCell>{maquina.numero}</TableCell>
              <TableCell>{maquina.tipoProceso}</TableCell>
              <TableCell>
                {maquina.capacidadTon ? `${maquina.capacidadTon} Ton` : "—"}
              </TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorEstado[maquina.estado]}`}>
                  {maquina.estado}
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
                    <DropdownMenuItem onClick={() => abrirDialog("editar", maquina)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => abrirDialog("cambiarEstado", maquina)}>
                      Cambiar estado
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {maquinas.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No hay máquinas registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      

      <DialogEditarMaquina
        open={dialogAbierto === "editar"}
        maquina={maquinaSeleccionada}
        onClose={cerrarDialog}
      />

      <DialogCambiarEstadoMaquina
        open={dialogAbierto === "cambiarEstado"}
        maquina={maquinaSeleccionada}
        onClose={cerrarDialog}
      />
    </>
  )
}