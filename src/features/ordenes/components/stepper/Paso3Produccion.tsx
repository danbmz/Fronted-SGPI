import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paso3Schema, type Paso3Form } from "@/validations/ordenes/ordenProduccionValidations"
import { getMaquinas } from "@/features/catalogo/services/maquinasService"
import { getOperadores } from "@/features/catalogo/services/operadorService"
import type { Maquina } from "@/types/maquinasCatalogo"
import type { Operador } from "@/types/operadoresCatalogo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"

interface Props {
  defaultValues: Paso3Form | null
  onNext: (data: Paso3Form) => void
  onBack: () => void
}

export default function Paso3Produccion({ defaultValues, onNext, onBack }: Props) {
  const [maquinas, setMaquinas] = useState<Maquina[]>([])
  const [operadores, setOperadores] = useState<Operador[]>([])

  const {
    register, handleSubmit, setValue, watch, control,
    formState: { errors }
  } = useForm<Paso3Form>({
    resolver: zodResolver(paso3Schema),
    defaultValues: defaultValues ?? { operadores: [] }
  })

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [maquinasData, operadoresData] = await Promise.all([
          getMaquinas(),
          getOperadores()
        ])
        setMaquinas(maquinasData.filter(m => m.estado === "activa"))
        setOperadores(operadoresData.filter(o => o.activo))
      } catch {
        console.error("Error al cargar datos")
      }
    }
    fetchDatos()
  }, [])

  const operadoresSeleccionados = useWatch({ control, name: "operadores" }) ?? []

  const toggleOperador = (operador: Operador) => {
    const existe = operadoresSeleccionados.find(o => o.id === operador.id)
    if (existe) {
      setValue("operadores",
        operadoresSeleccionados.filter(o => o.id !== operador.id),
        { shouldValidate: true }
      )
    } else {
      setValue("operadores", [
        ...operadoresSeleccionados,
        { id: operador.id, nombre: operador.nombre, numeroEmpleado: operador.numeroEmpleado }
      ], { shouldValidate: true })
    }
  }

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4 py-2">

      {/* Máquina */}
      <div className="flex flex-col gap-1">
        <Label>Máquina</Label>
        <Select
          value={watch("maquinaId") ?? ""}
          onValueChange={val => {
            const maquina = maquinas.find(m => m.id === val)
            if (!maquina) return
            setValue("maquinaId", val, { shouldValidate: true })
            setValue("maquina", maquina.nombre)
            setValue("numeroMaquina", maquina.numero)
            setValue("proceso", maquina.tipoProceso)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una máquina" />
          </SelectTrigger>
          <SelectContent>
            {maquinas.map(m => (
              <SelectItem key={m.id} value={m.id}>
                {m.nombre} — #{m.numero}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.maquinaId && <p className="text-xs text-red-500">{errors.maquinaId.message}</p>}
      </div>

      {/* Proceso — solo lectura */}
      {watch("proceso") && (
        <div className="flex flex-col gap-1">
          <Label>Proceso</Label>
          <Input
            value={watch("proceso")}
            readOnly
            className="bg-muted cursor-not-allowed"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {/* Cavidades */}
        <div className="flex flex-col gap-1">
          <Label>Cavidades</Label>
          <Input
            type="number"
            {...register("cavidades", { valueAsNumber: true })}
            placeholder="2"
          />
          {errors.cavidades && <p className="text-xs text-red-500">{errors.cavidades.message}</p>}
        </div>

        {/* Ciclo estándar */}
        <div className="flex flex-col gap-1">
          <Label>Ciclo estándar (seg)</Label>
          <Input
            type="number"
            step="0.1"
            {...register("cicloEstandarSeg", { valueAsNumber: true })}
            placeholder="28"
          />
          {errors.cicloEstandarSeg && <p className="text-xs text-red-500">{errors.cicloEstandarSeg.message}</p>}
        </div>
      </div>

      {/* Operadores */}
      <div className="flex flex-col gap-2">
        <Label>
          Operadores asignados
          {operadoresSeleccionados.length > 0 && (
            <span className="text-muted-foreground text-xs ml-2">
              ({operadoresSeleccionados.length} seleccionado{operadoresSeleccionados.length > 1 ? "s" : ""})
            </span>
          )}
        </Label>
        <div className="border rounded-md divide-y max-h-40 overflow-y-auto">
          {operadores.map(operador => {
            const seleccionado = operadoresSeleccionados.some(o => o.id === operador.id)
            return (
              <div
                key={operador.id}
                className="flex items-center gap-3 px-3 py-2 hover:bg-muted cursor-pointer"
                onClick={() => toggleOperador(operador)}
              >
                <input type="checkbox" checked={seleccionado} onChange={() => {}} className="h-4 w-4"/>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{operador.nombre}</span>
                  <span className="text-xs text-muted-foreground">{operador.numeroEmpleado}</span>
                </div>
              </div>
            )
          })}
        </div>
        {errors.operadores && (
          <p className="text-xs text-red-500">{errors.operadores.message}</p>
        )}
      </div>

      <div className="flex justify-between mt-2">
        <Button type="button" variant="outline" onClick={onBack}>← Atrás</Button>
        <Button type="submit">Siguiente →</Button>
      </div>
    </form>
  )
}