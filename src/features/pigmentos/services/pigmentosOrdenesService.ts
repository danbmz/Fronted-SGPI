import { getOrdenesProduccion } from "@/features/ordenes/services/ordenesProduccionService"
import { getMaquinas } from "@/features/catalogo/services/maquinasService"
import { getAvancesTurno } from "@/features/avancesTurno/services/avancesTurnoService"
import { getFormulasPigmento } from "@/features/catalogo/services/formulasPigmentosService"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
import type { Maquina } from "@/types/maquinasCatalogo"
import type { AvanceTurno } from "@/validations/avancesTurno/avanceTurnoValidations"
import type { AuthUser } from "@/types/usuario"
import { registrarLog } from "@/lib/auditService"

export interface OrdenConFormula extends OrdenProduccion {
  dosisGrPorKg: number
}

export interface InfoMaquina {
  maquina: Maquina
  ordenEnCurso: OrdenConFormula | null
  siguienteOrden: OrdenConFormula | null
  tiempoRestanteHrs: number | null
  colorSemaforo: "verde" | "amarillo" | "rojo" | "inactiva"
}

export const getInfoMaquinas = async (): Promise<InfoMaquina[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const [maquinas, ordenes, avances, formulas] = await Promise.all([
    getMaquinas(),
    getOrdenesProduccion(),
    getAvancesTurno(),
    getFormulasPigmento()
  ])

  const agregarDosis = (orden: OrdenProduccion): OrdenConFormula => {
    const formula = formulas.find(f =>
      f.materialBaseId === orden.materiaPrimaId &&
      f.pigmentoId === orden.pigmentoId
    )
    return { ...orden, dosisGrPorKg: formula?.dosisGrPorKg ?? 0 }
  }

  return maquinas.map(maquina => {
    // Orden actualmente en progreso en esta máquina
    const ordenEnCurso = ordenes.find(o =>
      o.maquinaId === maquina.id && o.estado === "en_progreso"
    )

    const primerAvanceOrden = avances
    .filter(a => a.ordenId === ordenEnCurso?.id)
    .sort((a, b) => new Date(a.horaInicio).getTime() - new Date(b.horaInicio).getTime())[0]

    const horaInicio = primerAvanceOrden?.horaInicio ?? null
    
    // Siguiente orden activa en cola para esta máquina (por fecha de creación)
    const siguienteOrden = ordenes
      .filter(o => o.maquinaId === maquina.id && o.estado === "activa")
      .sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime())[0] ?? null

    // Calcula tiempo restante
    let tiempoRestanteHrs: number | null = null
    let colorSemaforo: InfoMaquina["colorSemaforo"] = "inactiva"

    if (maquina.estado !== "activa") {
      colorSemaforo = "inactiva"
    } else if (ordenEnCurso && horaInicio) {
      const horasTranscurridas = (Date.now() - new Date(horaInicio).getTime()) / (1000 * 60 * 60)
      tiempoRestanteHrs = Math.max(0, ordenEnCurso.tiempoEstimadoHrs - horasTranscurridas)

      if (tiempoRestanteHrs <= 1)       colorSemaforo = "rojo"
      else if (tiempoRestanteHrs <= 4)  colorSemaforo = "amarillo"
      else                              colorSemaforo = "verde"
    } else if (ordenEnCurso) {
      colorSemaforo = "verde"
    }

    return {
      maquina,
      ordenEnCurso: ordenEnCurso ? agregarDosis(ordenEnCurso) : null,
      siguienteOrden: siguienteOrden ? agregarDosis(siguienteOrden) : null,
      tiempoRestanteHrs,
      colorSemaforo
    }
  })
}

export const confirmarSobrante = async (
  avance: AvanceTurno,
  usuarioActivo: AuthUser
): Promise<AvanceTurno> => {
  await new Promise(resolve => setTimeout(resolve, 500))

  const avanceActualizado: AvanceTurno = {
    ...avance,
    sobranteConfirmado: true
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "pigmentos",
    entidad: "AvanceTurno",
    accion: "confirmar_sobrante",
    entidadId: avance.id,
    detalle: `Sobrante de ${avance.kgSobrante}kg confirmado — ${avance.folio} turno ${avance.turno}`
  })

  return avanceActualizado
}

export const confirmarMaterialPreparado = async (
  avance: AvanceTurno,
  usuarioActivo: AuthUser
): Promise<AvanceTurno> => {
  await new Promise(resolve => setTimeout(resolve, 500))

  const avanceActualizado: AvanceTurno = {
    ...avance,
    solicitudesMaterial: avance.solicitudesMaterial.map(s =>
      s.confirmado ? s : { ...s, confirmado: true }
    )
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "pigmentos",
    entidad: "AvanceTurno",
    accion: "confirmar_material_preparado",
    entidadId: avance.id,
    detalle: `Material preparado confirmado para orden ${avance.folio}`
  })

  return avanceActualizado
}

// Confirma que el material esta listo para la siguiente orden
export const confirmarMaterialSiguiente = async (
  orden: OrdenProduccion,
  usuarioActivo: AuthUser
): Promise<OrdenProduccion> => {
  await new Promise(resolve => setTimeout(resolve, 500))

  const ordenActualizada: OrdenProduccion = {
    ...orden,
    materialSiguienteConfirmado: true
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "pigmentos",
    entidad: "OrdenProduccion",
    accion: "confirmar_material_siguiente",
    entidadId: orden.id,
    detalle: `Material preparado y confirmado para orden ${orden.folio} — ${orden.producto} ${orden.color}`
  })

  return ordenActualizada
}