import { useState } from "react"
import type { InventarioMateriaPrima } from "@/validations/inventario/inventarioValidations"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, AlertTriangle } from "lucide-react"
import DialogAjusteManualMateriaPrima from "./DialogAjusteManualMateriaPrima"
import { colorSubtipo } from "@/features/catalogo/components/materiaPrima/TablaMateriasPrimas"


interface Props {
  materiasPrimas: InventarioMateriaPrima[]
  onActualizada: (actualizada: InventarioMateriaPrima) => void
}

export default function TablaInventarioMateriasPrimas({ materiasPrimas, onActualizada }: Props) {
  const [seleccionada, setSeleccionada] = useState<InventarioMateriaPrima | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState(false)

  const abrirDialog = (materiaPrima: InventarioMateriaPrima) => {
    setSeleccionada(materiaPrima)
    setDialogAbierto(true)
  }

  const cerrarDialog = () => {
    setSeleccionada(null)
    setDialogAbierto(false)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Subtipo</TableHead>
            <TableHead>Stock actual</TableHead>
            <TableHead>Stock mínimo</TableHead>
            <TableHead>Último movimiento</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materiasPrimas.map((m) => {
            const stockBajo = m.stockActual < m.stockMinimo
            return (
              <TableRow key={m.id} className={stockBajo ? "bg-red-50 dark:bg-red-950/20" : ""}>
                <TableCell className="font-medium">{m.nombre}</TableCell>
                <TableCell className="font-mono text-sm">{m.codigoInterno}</TableCell>
                <TableCell>{m.tipo}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorSubtipo[m.subtipo]}`}>
                    {m.subtipo}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={stockBajo ? "text-red-600 font-medium" : ""}>
                      {m.stockActual} kg
                    </span>
                    {stockBajo && (
                      <AlertTriangle size={14} className="text-red-600" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{m.stockMinimo} kg</TableCell>
                <TableCell className="text-muted-foreground text-sm">{m.ultimoMovimiento}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => abrirDialog(m)}>
                        Ajuste manual
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => abrirDialog(m)}>
                        Historial de ajustes
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
          {materiasPrimas.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No hay materias primas registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DialogAjusteManualMateriaPrima
        open={dialogAbierto}
        materiaPrima={seleccionada}
        onClose={cerrarDialog}
        onSuccess={onActualizada}
      />
    </>
  )
}