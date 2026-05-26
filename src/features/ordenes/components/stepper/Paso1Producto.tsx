import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paso1Schema, type Paso1Form } from "@/validations/ordenes/ordenProduccionValidations"
import { getProductos } from "@/features/catalogo/services/productosService"
import type { Producto } from "@/validations/catalogo/productosValidations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"

interface Props {
  defaultValues: Paso1Form | null
  onNext: (data: Paso1Form) => void
  onCancel: () => void
}

export default function Paso1Producto({ defaultValues, onNext, onCancel }: Props) {
  const [productos, setProductos] = useState<Producto[]>([])

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors }
  } = useForm<Paso1Form>({
    resolver: zodResolver(paso1Schema),
    defaultValues: defaultValues ?? {}
  })

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos()
        setProductos(data.filter(p => p.activo))
      } catch {
        console.error("Error al cargar productos")
      }
    }
    fetchProductos()
  }, [])

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4 py-2">

      {/* Producto */}
      <div className="flex flex-col gap-1">
        <Label>Producto</Label>
        <Select
          value={watch("productoId") ?? ""}
          onValueChange={val => {
            const producto = productos.find(p => String(p.id) === val)
            if (!producto) return
            setValue("productoId", val, { shouldValidate: true })
            setValue("producto", producto.nombre)
            setValue("codigoBarras", producto.codigo)
            setValue("pesoUnitarioGr", producto.peso)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un producto" />
          </SelectTrigger>
          <SelectContent>
            {productos.map(p => (
              <SelectItem key={p.id} value={String(p.id)}>{p.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.productoId && <p className="text-xs text-red-500">{errors.productoId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Color */}
        <div className="flex flex-col gap-1">
          <Label>Color</Label>
          <Input {...register("color")} placeholder="Ej. Rojo" />
          {errors.color && <p className="text-xs text-red-500">{errors.color.message}</p>}
        </div>

        {/* Código de barras — solo lectura */}
        <div className="flex flex-col gap-1">
          <Label>Código de barras</Label>
          <Input
            {...register("codigoBarras")}
            readOnly
            className="bg-muted cursor-not-allowed"
            placeholder="Autocompletado"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Peso unitario */}
        <div className="flex flex-col gap-1">
          <Label>Peso unitario (gr)</Label>
          <Input
            type="number"
            step="0.1"
            {...register("pesoUnitarioGr", { valueAsNumber: true })}
            placeholder="185"
          />
          {errors.pesoUnitarioGr && <p className="text-xs text-red-500">{errors.pesoUnitarioGr.message}</p>}
        </div>

        {/* Total de piezas */}
        <div className="flex flex-col gap-1">
          <Label>Total de piezas</Label>
          <Input
            type="number"
            {...register("totalPiezas", { valueAsNumber: true })}
            placeholder="5000"
          />
          {errors.totalPiezas && <p className="text-xs text-red-500">{errors.totalPiezas.message}</p>}
        </div>
      </div>

      {/* Cliente / Destino */}
      <div className="flex flex-col gap-1">
        <Label>Cliente / Destino</Label>
        <Input {...register("clienteDestino")} placeholder="STOCK o nombre del cliente" />
        {errors.clienteDestino && <p className="text-xs text-red-500">{errors.clienteDestino.message}</p>}
      </div>

      {/* Remisión */}
      <div className="flex flex-col gap-1">
        <Label>Remisión <span className="text-muted-foreground text-xs">(opcional)</span></Label>
        <Input {...register("remision")} placeholder="REM-001" />
      </div>

      {/* Observaciones */}
      <div className="flex flex-col gap-1">
        <Label>Observaciones <span className="text-muted-foreground text-xs">(opcional)</span></Label>
        <Textarea {...register("observaciones")} placeholder="Notas adicionales..." rows={2} />
      </div>

      <div className="flex justify-between mt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Siguiente →</Button>
      </div>
    </form>
  )
}