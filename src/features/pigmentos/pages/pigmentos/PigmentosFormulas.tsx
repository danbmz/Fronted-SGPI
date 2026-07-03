import { useState, useEffect } from "react"
import { getFormulasPigmento } from "@/features/catalogo/services/formulasPigmentosService"
import type { FormulaPigmento } from "@/validations/catalogo/formulasValidations"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function PigmentosFormulas() {
  const [formulas, setFormulas] = useState<FormulaPigmento[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroMaterial, setFiltroMaterial] = useState("todos")
  const [filtroColor, setFiltroColor] = useState("")

  useEffect(() => {
    const fetchFormulas = async () => {
      try {
        const data = await getFormulasPigmento()
        setFormulas(data)
      } finally {
        setLoading(false)
      }
    }
    fetchFormulas()
  }, [])

  const materiales = [...new Set(formulas.map(f => f.materialBase))]

  const formulasFiltradas = formulas.filter(f => {
    const coincideMaterial = filtroMaterial === "todos" || f.materialBase === filtroMaterial
    const coincideColor = filtroColor === "" ||
      f.color.toLowerCase().includes(filtroColor.toLowerCase())
    return coincideMaterial && coincideColor
  })

    const colorCategoria: Record<string, string> = {
        "Sólidos":          "bg-blue-100 text-blue-700",
        "Sólidos Pasteles": "bg-pink-100 text-pink-700",
        "Neón Traslucidos": "bg-green-100 text-green-700",
        "Jarra Neón Pastel":"bg-orange-100 text-orange-700"
    }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Consulta las dosis de pigmento por material base.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={filtroMaterial} onValueChange={setFiltroMaterial}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Material base" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los materiales</SelectItem>
            {materiales.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Buscar por color..."
          value={filtroColor}
          onChange={e => setFiltroColor(e.target.value)}
          className="w-48"
        />

        <span className="text-xs text-muted-foreground ml-auto">
          {formulasFiltradas.length} de {formulas.length} fórmulas
        </span>
      </div>

      {/* Tabla */}
      {loading ? (
        <p className="text-muted-foreground">Cargando fórmulas...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material base</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Tipo pigmento</TableHead>
              <TableHead>Dosis (gr/kg)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formulasFiltradas.map(f => (
              <TableRow key={f.id}>
                <TableCell className="text-sm">{f.materialBase}</TableCell>
                <TableCell className="font-medium">{f.color}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorCategoria[f.categoriaColor] ?? "bg-gray-100 text-gray-700"}`}>
                    {f.categoriaColor}
                  </span>
                </TableCell>
                <TableCell className="text-sm">{f.tipoPigmento}</TableCell>
                <TableCell className="font-medium">{f.dosisGrPorKg} gr/kg</TableCell>
              </TableRow>
            ))}
            {formulasFiltradas.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No hay fórmulas que coincidan con los filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}