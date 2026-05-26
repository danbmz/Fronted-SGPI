import { useMemo } from "react"
import type { Paso1Form, Paso2Form, Paso3Form } from "@/validations/ordenes/ordenProduccionValidations"
import { calcularCampos as calcular } from "../../services/ordenesProduccionService"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle } from "lucide-react"

interface Props {
  paso1: Paso1Form
  paso2: Paso2Form
  paso3: Paso3Form
  guardando: boolean
  onGuardar: () => void
  onBack: () => void
}

// Dosis placeholder — cuando conectes el backend vendrá de la fórmula de pigmento
const DOSIS_PLACEHOLDER = 5

export default function Paso4Resumen({ paso1, paso2, paso3, guardando, onGuardar, onBack }: Props) {
  const calculos = useMemo(() => calcular(
    paso1.totalPiezas,
    paso1.pesoUnitarioGr,
    paso3.cicloEstandarSeg,
    DOSIS_PLACEHOLDER
  ), [paso1, paso3])

  return (
    <div className="flex flex-col gap-4 py-2">

      {/* Datos del producto */}
      <Seccion titulo="Producto">
        <Fila label="Producto" valor={paso1.producto} />
        <Fila label="Color" valor={paso1.color} />
        <Fila label="Código de barras" valor={paso1.codigoBarras} />
        <Fila label="Peso unitario" valor={`${paso1.pesoUnitarioGr} gr`} />
        <Fila label="Total de piezas" valor={paso1.totalPiezas.toLocaleString()} />
        <Fila label="Cliente / Destino" valor={paso1.clienteDestino} />
        {paso1.remision && <Fila label="Remisión" valor={paso1.remision} />}
        {paso1.observaciones && <Fila label="Observaciones" valor={paso1.observaciones} />}
      </Seccion>

      {/* Materiales */}
      <Seccion titulo="Materiales">
        <Fila label="Tipo de material" valor={paso2.tipoMaterial === "mezcla" ? "Mezcla" : "Virgen"} />
        <Fila label="Material principal" valor={paso2.materiaPrima} />
        {paso2.tipoMaterial === "mezcla" && (
          <>
            <Fila label="Porcentaje virgen" valor={`${paso2.porcentajeVirgen}%`} />
            <Fila label="Porcentaje molido" valor={`${paso2.porcentajeMolido}%`} />
            <Fila label="Molido a usar" valor={paso2.molidoNombre ?? "—"} />
          </>
        )}
        <Fila label="Pigmento" valor={`${paso2.pigmento} — ${paso2.categoriaPigmento}`} />
        <Fila label="Tipo de pigmento" valor={paso2.tipoPigmento} />
        {paso2.aditivo && <Fila label="Aditivo" valor={paso2.aditivo} />}
      </Seccion>

      {/* Producción */}
      <Seccion titulo="Producción">
        <Fila label="Máquina" valor={`${paso3.maquina} — #${paso3.numeroMaquina}`} />
        <Fila label="Proceso" valor={paso3.proceso} />
        <Fila label="Cavidades" valor={String(paso3.cavidades)} />
        <Fila label="Ciclo estándar" valor={`${paso3.cicloEstandarSeg} seg`} />
        <Fila
          label="Operadores"
          valor={paso3.operadores.map(o => `${o.nombre} (${o.numeroEmpleado})`).join(", ")}
        />
      </Seccion>

      {/* Cálculos automáticos */}
      <Seccion titulo="Cálculos estimados">
        <Fila label="Piezas por hora" valor={calculos.piezasPorHora.toLocaleString()} />
        <Fila label="Piezas por turno (8h)" valor={calculos.piezasPorTurno.toLocaleString()} />
        <Fila label="Piezas por día (24h)" valor={calculos.piezasPorDia.toLocaleString()} />
        <Fila label="Tiempo estimado" valor={`${calculos.tiempoEstimadoHrs} hrs`} />
        <Fila label="Materia prima total" valor={`${calculos.materiaPrimaTotalKg} kg`} />
        <Fila label="Pigmento requerido" valor={`${calculos.pigmentoRequeridoKg} kg`} />
      </Seccion>

      {/* Alerta de stock — placeholder, se conectará con el backend */}
      <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/20 border border-green-200 px-3 py-2 rounded-md text-sm text-green-700">
        <CheckCircle size={16} />
        <span>Stock suficiente para esta orden.</span>
      </div>

      <div className="flex justify-between mt-2">
        <Button type="button" variant="outline" onClick={onBack}>← Atrás</Button>
        <Button onClick={onGuardar} disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar como borrador"}
        </Button>
      </div>
    </div>
  )
}

// Componentes auxiliares
function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{titulo}</p>
      <div className="border rounded-md divide-y">
        {children}
      </div>
    </div>
  )
}

function Fila({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="flex justify-between px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right max-w-64">{valor}</span>
    </div>
  )
}