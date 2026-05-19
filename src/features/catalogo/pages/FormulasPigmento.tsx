import { useState, useEffect } from "react"
import { getFormulasPigmento } from "../services/formulasPigmentosService"
import type { FormulaPigmento } from "@/validations/catalogo/formulasValidations"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import TablaFormulasPigmento from "../components/formulaPigmentos/TablaFormulasPigmento"
import DialogCrearFormulaPigmento from "../components/formulaPigmentos/DialogCrearFormulaPigmento"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getMateriasPrimas } from "../services/materiasPrimasService"
import type { MateriaPrima } from "@/types/materiaPrima"
// import type { Pigmento } from "@/validations/pigmentosValidations"
// import { getPigmentos } from "../services/pigmentoService"

export default function FormulasPigmento() {
  const [formulas, setFormulas] = useState<FormulaPigmento[]>([])
  const [materiaPrima, setMateriaPrima] = useState<MateriaPrima[]>([])
  // const [pigmento, setPigmento] = useState<Pigmento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false)
  const [filtroMaterial, setFiltroMaterial] = useState("todos")
  const [filtroCategoria, setFiltroCategoria] = useState("todos")

  useEffect(() => {
    const fetchFormulas = async () => {
      try {
        const [forms, material] = await Promise.all([ // Llamadas a la API en paralelo
          getFormulasPigmento(),
          getMateriasPrimas(),
          // getPigmentos()
        ])

        // Actualizamos los estados, agregando solo los registros activos
        setFormulas(forms);
        setMateriaPrima(material.filter(m => m.activo))
        // setPigmento(pigs.filter(p => p.activo))

      } catch {
        setError("Error al cargar fórmulas de pigmento")
      } finally {
        setLoading(false)
      }
    }
    fetchFormulas()
  }, [])

  const handleFormulaCreada = (nuevaFormula: FormulaPigmento) => {
    setFormulas(prev => [...prev, nuevaFormula])
  }

  const handleFormulaEditada = (formulaEditada: FormulaPigmento) => {
    setFormulas(prev =>
      prev.map(f => f.id === formulaEditada.id ? formulaEditada : f)
    )
  }

  const handleFormulaEliminada = (id: string) => {
    setFormulas(prev => prev.filter(f => f.id !== id))
  }


  const formulasFiltradas = formulas.filter(formula => {

    const coincideFormula = filtroMaterial === "todos" || formula.materialBase === filtroMaterial

    const coincideCategoria =
      filtroCategoria === "todos" ||
      !filtroCategoria ||
      formula.categoriaColor === filtroCategoria

    return coincideFormula && coincideCategoria
  })


  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Las fórmulas definen los gramos de pigmento por kg de material base. El sistema calcula automáticamente la cantidad al crear órdenes de producción.
          </p>
        </div>
        <Button onClick={() => setDialogCrearAbierto(true)}>
          <Plus size={16} className="mr-2" />
          Nueva fórmula
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-3">
        <Select value={filtroMaterial} onValueChange={setFiltroMaterial}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Módulo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Material Base</SelectItem>
            {materiaPrima.map(m => {
              return <SelectItem key={m.id} value={m.nombre}>{m.nombre}</SelectItem>
            })}
          </SelectContent>
        </Select>

          <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Catálogo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Categoría</SelectItem>
              <SelectItem value="Sólidos">Sólidos</SelectItem>
              <SelectItem value="Sólidos Pasteles">Sólidos Pasteles</SelectItem>
              <SelectItem value="Neón Traslucidos">Neón Traslucidos</SelectItem>
              <SelectItem value="Jarra Neón Pastel">Jarra Neón Pastel</SelectItem>
            </SelectContent>
          </Select>
      </div>

      {loading && <p className="text-muted-foreground">Cargando fórmulas...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <TablaFormulasPigmento
          formulas={formulasFiltradas}
          onFormulaEditada={handleFormulaEditada}
          onFormulaEliminada={handleFormulaEliminada}
        />
      )}

      <DialogCrearFormulaPigmento
        open={dialogCrearAbierto}
        onClose={() => setDialogCrearAbierto(false)}
        onSuccess={handleFormulaCreada}
      />

    </div>
  )
}