import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { paso2Schema, type Paso2Form, type Paso1Form, MEZCLA_CONFIG, type TipoMaterial } from "@/validations/ordenes/ordenProduccionValidations"
import { getMateriasPrimas } from "@/features/catalogo/services/materiasPrimasService"
import { getPigmentos } from "@/features/catalogo/services/pigmentoService"
import { getInventarioMolido } from "@/features/inventory/services/materiaPrima/inventarioMolidoService"
import type { MateriaPrima } from "@/types/materiaPrima"
import type { Pigmento } from "@/validations/catalogo/pigmentosValidations"
import type { InventarioMolido } from "@/validations/inventario/inventarioValidations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select"

interface Props {
  paso1: Paso1Form
  defaultValues: Paso2Form | null
  onNext: (data: Paso2Form) => void
  onBack: () => void
}

export default function Paso2Materiales({ paso1, defaultValues, onNext, onBack }: Props) {
  const [materiasPrimas, setMateriasPrimas] = useState<MateriaPrima[]>([])
  const [pigmentos, setPigmentos] = useState<Pigmento[]>([])
  const [inventarioMolido, setInventarioMolido] = useState<InventarioMolido[]>([])

  // Detecta si el producto usa mezcla
  const productoTipo = paso1.producto.split(" ")[0] // "Cubeta", "Colador", etc.
  const configMezcla = MEZCLA_CONFIG[productoTipo]
  const usaMezcla = !!configMezcla

  const {
    handleSubmit, setValue, watch,
    formState: { errors }
  } = useForm<Paso2Form>({
    resolver: zodResolver(paso2Schema),
    defaultValues: defaultValues ?? {
      tipoMaterial: usaMezcla ? "mezcla" : "virgen",
      porcentajeVirgen: usaMezcla ? configMezcla.virgen : 100,
      porcentajeMolido: usaMezcla ? configMezcla.molido : 0,
      molidoId: null,
      molidoNombre: null,
      aditivoId: null,
      aditivo: null
    }
  })

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const materiales = await getMateriasPrimas()
        setMateriasPrimas(materiales.filter(m => m.activo))
      } catch {
        console.error("Error al cargar materiales")
      }
    }
    fetchDatos()
  }, [])

  // Filtra pigmentos y molido por material seleccionado y color del paso 1
  useEffect(() => {
    const materiaPrimaId = watch("materiaPrimaId")
    if (!materiaPrimaId) return

    const fetchPigmentos = async () => {
      try {
        const [pig, mol] = await Promise.all([          
          getPigmentos(),
          getInventarioMolido()
        ])
        const pigmentoFiltrado = pig.filter(p =>
          p.activo &&
          p.materiaPrimaId === materiaPrimaId &&
          p.color.toLowerCase() === paso1.color.toLowerCase()
        )
        const molidoFiltrado = mol.filter(m =>
            m.materiaPrimaId === watch("materiaPrimaId") &&
            m.colorAproximado.toLowerCase() === paso1.color.toLowerCase() &&
            m.stockActual > 0
        )
        setPigmentos(pigmentoFiltrado)
        setInventarioMolido(molidoFiltrado)
      } catch {
        console.error("Error al cargar pigmentos")
      }
    }
    fetchPigmentos()
  }, [watch("materiaPrimaId"), paso1.color])

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4 py-2">
      {/* Referencia del producto del paso 1 */}
      <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md text-sm">
        <span className="text-muted-foreground">Produciendo:</span>
        <span className="font-medium">{paso1.producto}</span>
        <span className="text-muted-foreground">—</span>
        <span className="font-medium">{paso1.color}</span>
      </div>

      {/* Tipo de material — select con valor por defecto según el producto */}
      <div className="flex flex-col gap-1">
        <Label>Tipo de material</Label>
        <Select
          value={watch("tipoMaterial")}
          onValueChange={val => {
            setValue("tipoMaterial", val as TipoMaterial, { shouldValidate: true })

            if (val === "mezcla" && configMezcla) {
              setValue("porcentajeVirgen", configMezcla.virgen)
              setValue("porcentajeMolido", configMezcla.molido)
            } else {
              setValue("porcentajeVirgen", 100)
              setValue("porcentajeMolido", 0)
              setValue("molidoId", null)
              setValue("molidoNombre", null)
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tipo de material" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="virgen">Virgen</SelectItem>
            {usaMezcla && (
              <SelectItem value="mezcla">
                Mezcla — {configMezcla.virgen}% virgen / {configMezcla.molido}% molido
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {errors.tipoMaterial && <p className="text-xs text-red-500">{errors.tipoMaterial.message}</p>}
      </div>

      {/* Material principal */}
      <div className="flex flex-col gap-1">
        <Label>Material a utilizar</Label>
        <Select
          value={watch("materiaPrimaId") ?? ""}
          onValueChange={val => {
            const material = materiasPrimas.find(m => m.id === val)
            if (!material) return
            setValue("materiaPrimaId", val, { shouldValidate: true })
            setValue("materiaPrima", material.nombre)
            // Limpia el pigmento al cambiar material
            setValue("pigmentoId", "")
            setValue("pigmento", "")
            setPigmentos([])
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un material" />
          </SelectTrigger>
          <SelectContent>
            {materiasPrimas.map(m => (
              <SelectItem key={m.id} value={m.id}>{m.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.materiaPrimaId && <p className="text-xs text-red-500">{errors.materiaPrimaId.message}</p>}
      </div>

      {/* Si es mezcla — select de molido */}
      {watch("tipoMaterial") === "mezcla" && (
        <div className="flex flex-col gap-1">
          <Label>Molido a utilizar</Label>
          {!watch("materiaPrimaId") ? (
              <p className="text-xs text-muted-foreground px-1">
                Selecciona primero el material para ver el molido disponibles.
              </p>
          ) : inventarioMolido.length === 0 ? (
              <p className="text-xs text-orange-500 px-1">
                No hay molido disponibles en inventario para este material y color.
              </p>
          ) : (
            <Select
              value={watch("molidoId") ?? ""}
              onValueChange={val => {
                const molido = inventarioMolido.find(m => m.id === val)
                if (!molido) return
                setValue("molidoId", val, { shouldValidate: true })
                setValue("molidoNombre", `${molido.materialBase} — ${molido.colorAproximado}`)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el molido" />
              </SelectTrigger>
              <SelectContent>
                {inventarioMolido.map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.materialBase} — {m.colorAproximado} ({m.stockActual} kg disponibles)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )

          }
        </div>
      )}

      {/* Pigmento */}
      <div className="flex flex-col gap-1">
        <Label>Pigmento</Label>
        {!watch("materiaPrimaId") ? (
          <p className="text-xs text-muted-foreground px-1">
            Selecciona primero el material para ver los pigmentos disponibles.
          </p>
        ) : pigmentos.length === 0 ? (
          <p className="text-xs text-orange-500 px-1">
            No hay pigmentos disponibles para este material y color.
          </p>
        ) : (
          <Select
            value={watch("pigmentoId") ?? ""}
            onValueChange={val => {
              const pigmento = pigmentos.find(p => p.id === val)
              if (!pigmento) return
              setValue("pigmentoId", val, { shouldValidate: true })
              setValue("pigmento", pigmento.color)
              setValue("categoriaPigmento", pigmento.categoriaColor)
              setValue("tipoPigmento", pigmento.tipo)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un pigmento" />
            </SelectTrigger>
            <SelectContent>
              {pigmentos.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {p.color} — {p.categoriaColor} ({p.tipo})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.pigmentoId && <p className="text-xs text-red-500">{errors.pigmentoId.message}</p>}
      </div>

      {/* Tipo de pigmento — solo lectura */}
      {watch("tipoPigmento") && (
        <div className="flex flex-col gap-1">
          <Label>Tipo de pigmento</Label>
          <Input
            value={watch("tipoPigmento")}
            readOnly
            className="bg-muted cursor-not-allowed"
          />
        </div>
      )}

      {/* Aditivo */}
      <div className="flex flex-col gap-1">
        <Label>Aditivo <span className="text-muted-foreground text-xs">(opcional)</span></Label>
        <Input
          placeholder="N/A"
          onChange={e => {
            const val = e.target.value
            setValue("aditivoId", val || null)
            setValue("aditivo", val || null)
          }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <Button type="button" variant="outline" onClick={onBack}>← Atrás</Button>
        <Button type="submit">Siguiente →</Button>
      </div>
    </form>
  )
}