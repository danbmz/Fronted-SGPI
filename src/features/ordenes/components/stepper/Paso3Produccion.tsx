import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paso3Schema, type Paso1Form, type Paso3Form } from "@/validations/ordenes/ordenProduccionValidations"
import { getMaquinas } from "@/features/catalogo/services/maquinasService"
import type { Maquina } from "@/types/maquinasCatalogo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"

interface Props {
  paso1: Paso1Form
  defaultValues: Paso3Form | null
  onNext: (data: Paso3Form) => void
  onBack: () => void
}

export default function Paso3Produccion({ paso1, defaultValues, onNext, onBack }: Props) {
  const [maquinas, setMaquinas] = useState<Maquina[]>([])

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors }
  } = useForm<Paso3Form>({
    resolver: zodResolver(paso3Schema),
    defaultValues: defaultValues ?? {
      cavidades: paso1.cavidades,       // ← prellenado
      cicloEstandarSeg: paso1.cicloEstandarSeg // ← prellenado
    }
  })

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const maquinasData = await getMaquinas()
        setMaquinas(maquinasData.filter(m => m.estado === "activa"))
      } catch {
        console.error("Error al cargar datos")
      }
    }
    fetchDatos()
  }, [])

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

      <div className="flex justify-between mt-2">
        <Button type="button" variant="outline" onClick={onBack}>← Atrás</Button>
        <Button type="submit">Siguiente →</Button>
      </div>
    </form>
  )
}