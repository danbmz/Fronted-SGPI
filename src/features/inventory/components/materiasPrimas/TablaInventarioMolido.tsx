import { useState } from "react"
import type { InventarioMolido } from "@/validations/inventario/inventarioValidations"
import { categoriaColores } from "@/features/catalogo/components/pigmentos/TablaPigmentos"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import DialogAjusteManualMolido from "./DialogAjusteManualMolido"
import { Badge } from "@/components/ui/badge"
import DialogHistorialMovimientos from "../movimientos/DialogHistorialMovimientos"

interface Props {
  molido: InventarioMolido[]
  onActualizado: (actualizado: InventarioMolido) => void
}

export default function TablaInventarioMolido({ molido, onActualizado }: Props) {
  const [seleccionado, setSeleccionado] = useState<InventarioMolido | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState<"ajustar" | "historial" | null>(null)

  const abrirDialog = (tipo: "ajustar" | "historial",m: InventarioMolido) => {
    setSeleccionado(m)
    setDialogAbierto(tipo)
  }

  const cerrarDialog = () => {
    setSeleccionado(null)
    setDialogAbierto(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material base</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Color aproximado</TableHead>
            <TableHead>Stock actual</TableHead>
            <TableHead>Última entrada</TableHead>
            <TableHead>Orden origen</TableHead>
            <TableHead>Observaciones</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {molido.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="font-medium">{m.materialBase}</TableCell>
              <TableCell className="font-mono text-sm">{m.codigoInterno}</TableCell>
              <TableCell>
                <Badge className={`${categoriaColores[m.colorAproximado]}`}>
                    {m.colorAproximado}
                </Badge>
              </TableCell>
              <TableCell>{m.stockActual} kg</TableCell>
              <TableCell className="text-muted-foreground text-sm">{m.ultimaEntrada}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {m.ordenOrigen ?? "—"}
              </TableCell>
              <TableCell className="text-sm max-w-48 truncate" title={m.observaciones}>
                {m.observaciones}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => abrirDialog("ajustar", m)}>
                      Ajuste manual
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => abrirDialog("historial", m)}>
                      Historial de ajustes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {molido.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No hay registros de molido.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DialogAjusteManualMolido
        open={dialogAbierto === "ajustar"}
        molido={seleccionado}
        onClose={cerrarDialog}
        onSuccess={onActualizado}
      />

      <DialogHistorialMovimientos
        open={dialogAbierto === "historial"}
        onClose={cerrarDialog}
        inventarioId={seleccionado?.id ?? ""}
        tipoInventario="molido"
        titulo={seleccionado?.colorAproximado ?? ""}
        subtitulo={seleccionado?.codigoInterno}
      />
    </>
  )
}