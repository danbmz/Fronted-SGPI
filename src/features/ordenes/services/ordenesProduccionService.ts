import type { OrdenProduccion, Paso1Form, Paso2Form, Paso3Form } from "@/validations/ordenes/ordenProduccionValidations"
import type { AuthUser } from "@/types/usuario"
import { registrarLog } from "@/lib/auditService"

export const getOrdenesProduccion = async (): Promise<OrdenProduccion[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const response = await fetch("/mocks/ordenes/ordenesProduccion.json")
  return response.json()
}

// Función de cálculos automáticos
export const calcularCampos = (
  totalPiezas: number,
  pesoUnitarioGr: number,
  cicloEstandarSeg: number,
  dosisGrPorKg: number
) => {
  const piezasPorHora = Math.floor(3600 / cicloEstandarSeg)
  const piezasPorTurno = Math.floor(piezasPorHora * 8)
  const piezasPorDia = Math.floor(piezasPorHora * 24)
  const tiempoEstimadoHrs = parseFloat(((totalPiezas * cicloEstandarSeg) / 3600).toFixed(1))
  const materiaPrimaTotalKg = parseFloat(((totalPiezas * pesoUnitarioGr) / 1000).toFixed(2))
  const pigmentoRequeridoKg = parseFloat(((materiaPrimaTotalKg * dosisGrPorKg) / 1000).toFixed(3))

  return {
    piezasPorHora,
    piezasPorTurno,
    piezasPorDia,
    tiempoEstimadoHrs,
    materiaPrimaTotalKg,
    pigmentoRequeridoKg
  }
}

export const crearOrden = async (
  paso1: Paso1Form,
  paso2: Paso2Form,
  paso3: Paso3Form,
  calculos: ReturnType<typeof calcularCampos>,
  usuarioActivo: AuthUser
): Promise<OrdenProduccion> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const folio = `OP-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`

  const nuevaOrden: OrdenProduccion = {
    id: String(Date.now()),
    folio,
    estado: "borrador",
    fechaCreacion: new Date().toISOString(),
    ...paso1,
    ...paso2,
    ...paso3,
    ...calculos
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "ordenes",
    accion: "crear",
    entidad: "OrdenProduccion",
    entidadId: nuevaOrden.id,
    detalle: `Orden ${folio} creada — ${paso1.producto} ${paso1.color} × ${paso1.totalPiezas} pzas`
  })

  return nuevaOrden
}

export const activarOrden = async (
  orden: OrdenProduccion,
  usuarioActivo: AuthUser
): Promise<OrdenProduccion> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "ordenes",
    accion: "activar",
    entidad: "OrdenProduccion",
    entidadId: orden.id,
    detalle: `Orden ${orden.folio} activada`
  })

  return { ...orden, estado: "activa" }
}

export const cancelarOrden = async (
  orden: OrdenProduccion,
  motivo: string,
  usuarioActivo: AuthUser
): Promise<OrdenProduccion> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "ordenes",
    accion: "cancelar",
    entidad: "OrdenProduccion",
    entidadId: orden.id,
    detalle: `Orden ${orden.folio} cancelada. Motivo: ${motivo}`
  })

  return { ...orden, estado: "cancelada" }
}