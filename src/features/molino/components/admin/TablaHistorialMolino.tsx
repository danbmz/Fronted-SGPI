import { useState } from "react"
import type { Molienda } from "@/validations/molino/moliendaValidations"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface Props {
  moliendas: Molienda[]
}

export default function TablaHistorialMolino({ moliendas }: Props) {
  const [filtroMaterial, setFiltroMaterial] = useState("todos")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")

  const materiales = [...new Set(moliendas.map(m => m.materialBase))]

  const moliendasFiltradas = moliendas.filter(m => {
    const fecha = new Date(m.fecha)
    const inicio = fechaInicio ? new Date(fechaInicio) : null
    const fin = fechaFin ? new Date(`${fechaFin}T23:59:59`) : null

    if (filtroMaterial !== "todos" && m.materialBase !== filtroMaterial) return false
    if (inicio && fecha < inicio) return false
    if (fin && fecha > fin) return false
    return true
  })

  const kgTotalFiltrado = moliendasFiltradas.reduce((acc, m) => acc + m.kgIngresados, 0)

  const hayFiltros = filtroMaterial !== "todos" || fechaInicio !== "" || fechaFin !== ""

  const limpiarFiltros = () => {
    setFiltroMaterial("todos")
    setFechaInicio("")
    setFechaFin("")
  }

  const formatFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-MX", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    })

  return (
    <div className="flex flex-col gap-4">

      {/* Filtros */}
      <div className="flex items-end gap-3 flex-wrap">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Material base</Label>
          <Select value={filtroMaterial} onValueChange={setFiltroMaterial}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los materiales</SelectItem>
              {materiales.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-xs">Desde</Label>
          <Input
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            className="w-40"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-xs">Hasta</Label>
          <Input
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            className="w-40"
          />
        </div>

        {hayFiltros && (
          <Button variant="ghost" size="sm" onClick={limpiarFiltros}>
            Limpiar filtros
          </Button>
        )}

        <div className="ml-auto flex flex-col items-end gap-0.5">
          <span className="text-xs text-muted-foreground">
            {moliendasFiltradas.length} de {moliendas.length} registros
          </span>
          <span className="text-xs font-medium">
            Total: {kgTotalFiltrado.toFixed(1)} kg molidos
          </span>
        </div>
      </div>

      {/* Tabla */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Orden</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Material base</TableHead>
            <TableHead>Color aproximado</TableHead>
            <TableHead>Kg ingresados</TableHead>
            <TableHead>Observaciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {moliendasFiltradas.map(m => (
            <TableRow key={m.id}>
              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                {formatFecha(m.fecha)}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {m.folios.map(folio => (
                    <span
                      key={folio}
                      className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded"
                    >
                      {folio}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-sm">{m.materialBase}</TableCell>
              <TableCell className="text-sm">{m.colorAproximado}</TableCell>
              <TableCell className="font-medium text-green-600">
                {m.kgIngresados.toFixed(1)} kg
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-48 truncate"
                title={m.observaciones ?? ""}>
                {m.observaciones ?? "—"}
              </TableCell>
            </TableRow>
          ))}
          {moliendasFiltradas.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No hay moliendas registradas con los filtros seleccionados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}