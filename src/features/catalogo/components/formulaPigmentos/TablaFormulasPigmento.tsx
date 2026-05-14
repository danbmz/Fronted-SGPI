import { useState } from "react"
import type { FormulaPigmento, CategoriaColor } from "@/types/formulasPigmentosCatalogo"
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
import DialogEditarFormulaPigmento from "./DialogEditarFormulaPigmento"
import DialogEliminarFormulaPigmento from "./DialogEliminarFormulaPigmento"
import { Badge } from "@/components/ui/badge"

interface Props {
  formulas: FormulaPigmento[]
  onFormulaEditada: (formula: FormulaPigmento) => void
  onFormulaEliminada: (id: string) => void
}

const colorCategoria: Record<CategoriaColor, string> = {
  "Sólidos":          "bg-gray-200 text-gray-700",
  "Sólidos Pasteles": "bg-pink-100 text-pink-700",
  "Neón Traslucidos": "bg-green-100 text-green-700",
  "Jarra Neón Pastel":"bg-orange-100 text-orange-700"
}

const colorTipoPigmento: Record<string, string> = {
  master: "bg-blue-100 text-blue-700",
  polvo:  "bg-purple-100 text-purple-700"
}

export default function TablaFormulasPigmento({
  formulas,
  onFormulaEditada,
  onFormulaEliminada
}: Props) {
  const [formulaSeleccionada, setFormulaSeleccionada] = useState<FormulaPigmento | null>(null)
  const [dialogAbierto, setDialogAbierto] = useState<"editar" | "eliminar" | null>(null)

  const abrirDialog = (tipo: "editar" | "eliminar", formula: FormulaPigmento) => {
    setFormulaSeleccionada(formula)
    setDialogAbierto(tipo)
  }

  const cerrarDialog = () => {
    setFormulaSeleccionada(null)
    setDialogAbierto(null)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material base</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Tipo pigmento</TableHead>
            <TableHead>Dosis (gr/kg)</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {formulas.map((formula) => (
            <TableRow key={formula.id}>
              <TableCell className="font-medium">{formula.materialBase}</TableCell>
              <TableCell>
                <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${colorCategoria[formula.categoriaColor]}`}>
                  {formula.categoriaColor}
                </Badge>
              </TableCell>
              <TableCell>{formula.color}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorTipoPigmento[formula.tipoPigmento]}`}>
                  {formula.tipoPigmento}
                </span>
              </TableCell>
              <TableCell>{formula.dosisGrPorKg}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => abrirDialog("editar", formula)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => abrirDialog("eliminar", formula)}
                    >
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {formulas.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No hay fórmulas de pigmento registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>


      <DialogEditarFormulaPigmento
        open={dialogAbierto === "editar"}
        formula={formulaSeleccionada}
        onClose={cerrarDialog}
        onSuccess={onFormulaEditada}
      />

      <DialogEliminarFormulaPigmento
        open={dialogAbierto === "eliminar"}
        formula={formulaSeleccionada}
        onClose={cerrarDialog}
        onSuccess={onFormulaEliminada}
      />
    </>
  )
}