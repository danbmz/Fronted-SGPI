import { useState } from "react"
import type { MotivoParo } from "@/types/motivosCatalogo"
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
import DialogEditarMotivoParo from "./DialogEditarMotivoParo"
import DialogDesactivarMotivoParo from "./DialogDesactivarMotivoParo"
import DialogReactivarMotivoParo from "./DialogReactivarMotivoParo"

interface Props {
  motivosParo: MotivoParo[]
  onMotivoEditado: (motivo: MotivoParo) => void
  onMotivoDesactivado: (motivo: MotivoParo) => void
  onMotivoReactivado: (motivo: MotivoParo) => void
}

export default function TablaMotivosParo({
  motivosParo,
  onMotivoEditado,
  onMotivoDesactivado,
  onMotivoReactivado
}: Props) {
  const [motivoSeleccionado, setMotivoSeleccionado] = useState<MotivoParo | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState<"editar" | "desactivar" | "reactivar" | null>(null)

  const abrirDialog = (tipo: "editar" | "desactivar" | "reactivar", motivo: MotivoParo) => {
    setMotivoSeleccionado(motivo)
    setDialogAbierto(tipo)
  }

  const cerrarDialog = () => {
    setMotivoSeleccionado(null)
    setDialogAbierto(null)
  }

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
          {motivosParo.map((motivo) => (
            <TableRow key={motivo.id}>
              <TableCell className="font-medium">{motivo.nombre}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  motivo.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {motivo.activo ? "Activo" : "Inactivo"}
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
                    <DropdownMenuItem onClick={() => abrirDialog("editar", motivo)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {motivo.activo ? (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => abrirDialog("desactivar", motivo)}
                      >
                        Desactivar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="text-green-600"
                        onClick={() => abrirDialog("reactivar", motivo)}
                      >
                        Reactivar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {motivosParo.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                No hay motivos de paro registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>


      <DialogEditarMotivoParo
        open={dialogAbierto === "editar"}
        motivo={motivoSeleccionado}
        onClose={cerrarDialog}
        onSuccess={onMotivoEditado}
      />

      <DialogDesactivarMotivoParo
        open={dialogAbierto === "desactivar"}
        motivo={motivoSeleccionado}
        onClose={cerrarDialog}
        onSuccess={onMotivoDesactivado}
      />

      <DialogReactivarMotivoParo
        open={dialogAbierto === "reactivar"}
        motivo={motivoSeleccionado}
        onClose={cerrarDialog}
        onSuccess={onMotivoReactivado}
      />
    </>
  )
}