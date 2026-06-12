import { useState } from "react"
import type { AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations"
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
import DialogCerrarAvance from "./DialogCerrarAvance"
import DialogRegistrarParo from "./DialogRegistrarParo"
import DialogSolicitarMaterial from "./DialogSolicitarMaterial"

interface Props {
  avances: AvanceTurno[]
  onAvanceCerrado: (avance: AvanceTurno) => void
  onTiempoParoAgregado: (avance: AvanceTurno) => void
}

export default function TablaAvancesTurno({
  avances, onAvanceCerrado, onTiempoParoAgregado
}: Props) {
  const [avanceSeleccionado, setAvanceSeleccionado] = useState<AvanceTurno | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState<"cerrar" | "paro" | "material" | null>(null)


  const abrirDialog = (tipo: "cerrar" | "paro" | "material", avance: AvanceTurno) => {
    setAvanceSeleccionado(avance)
    setDialogAbierto(tipo)
  }

  const cerrarDialog = () => {
    setAvanceSeleccionado(null)
    setDialogAbierto(null)
  }

  const formatHora = (fecha: string | null) => {
    if (!fecha) return "—"
    return new Date(fecha).toLocaleTimeString("es-MX", {
      hour: "2-digit", minute: "2-digit"
    })
  }

  const minutosTotalesParo = (avance: AvanceTurno) => {
    return avance.tiemposParo.reduce((acc, t) => acc + t.minutos, 0)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Orden</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Inicio</TableHead>
            <TableHead>Fin</TableHead>
            <TableHead>Piezas buenas</TableHead>
            <TableHead>Defectuosas</TableHead>
            <TableHead>Merma (kg)</TableHead>
            <TableHead>Paros</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {avances.map((avance) => (
            <TableRow key={avance.id}>
              <TableCell className="font-mono text-sm">{avance.folio}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{avance.producto}</span>
                  <span className="text-xs text-muted-foreground">{avance.color}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm">{formatHora(avance.horaInicio)}</TableCell>
              <TableCell className="text-sm">{formatHora(avance.horaFin)}</TableCell>
              <TableCell>{avance.piezasBuenas.toLocaleString()}</TableCell>
              <TableCell>{avance.piezasDefectuosas.toLocaleString()}</TableCell>
              <TableCell>{avance.kgMerma}</TableCell>
              <TableCell>
                {avance.tiemposParo.length > 0 ? (
                  <div className="flex flex-col">
                    <span className="text-sm">{avance.tiemposParo.length} paro(s)</span>
                    <span className="text-xs text-muted-foreground">
                      {minutosTotalesParo(avance)} min total
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Sin paros</span>
                )}
              </TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  avance.estado === "abierto"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {avance.estado === "abierto" ? "En curso" : "Cerrado"}
                </span>
              </TableCell>
              <TableCell>
                {avance.estado === "abierto" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => abrirDialog("cerrar", avance)}>
                        Crear avance de turno
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => abrirDialog("paro", avance)}>
                        Registrar tiempo de paro
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => abrirDialog("material", avance)}>
                      Solicitar material adicional
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
          {avances.length === 0 && (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                No hay avances registrados en este turno.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DialogCerrarAvance
        open={dialogAbierto === "cerrar"}
        avance={avanceSeleccionado}
        onClose={cerrarDialog}
        onSuccess={onAvanceCerrado}
      />

      <DialogRegistrarParo
        open={dialogAbierto === "paro"}
        avance={avanceSeleccionado}
        onClose={cerrarDialog}
        onSuccess={onTiempoParoAgregado}
      />

      <DialogSolicitarMaterial
        open={dialogAbierto === "material"}
        avance={avanceSeleccionado}
        onClose={cerrarDialog}
        onSuccess={onTiempoParoAgregado}
        />

    </>
  )
}