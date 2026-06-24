import type {
  AvanceTurno, CerrarAvanceForm, RegistrarParo, SolicitarMaterialForm, SolicitudMaterial, TiempoParo
} from "@/validations/avancesTurno/avanceTurnoValidations"
import type { OrdenProduccion } from "@/validations/ordenes/ordenProduccionValidations"
import type { AuthUser } from "@/types/usuario"
import { registrarLog } from "@/lib/auditService"

export const getFechaTurnoActual = (): string => {
  const ahora = new Date()
  const hora = ahora.getHours()

  // Si estamos entre 00:00 y 06:00 pertenecemos al turno noche de AYER
  if (hora >= 0 && hora < 6) {
    const ayer = new Date(ahora)
    ayer.setDate(ahora.getDate() - 1)
    return ayer.toLocaleDateString("sv-SE")
  }

  // Resto del día → fecha de hoy
  return ahora.toLocaleDateString("sv-SE")
}

// Detecta el turno actual por hora
export const detectarTurnoActual = (): "Mañana" | "Tarde" | "Noche" => {
  const hora = new Date().getHours()
  if (hora >= 6 && hora < 14)  return "Mañana"
  if (hora >= 14 && hora < 22) return "Tarde"
  return "Noche"
}

export const getAvancesTurno = async (): Promise<AvanceTurno[]> => {
  await new Promise(resolve => setTimeout(resolve, 100))
  const response = await fetch("/mocks/avancesTurno/avancesTurno.json")
  const data = await response.json()
  return data.map((a: any) => ({
    ...a,
    // Todos estos datos los devuelve el BACK
    id: String(a.id),
    borradorGuardado: a.borradorGuardado ?? false,
    solicitudesMaterial: a.solicitudesMaterial ?? [],
    tiemposParo: a.tiemposParo.map((t: any) => ({ ...t, id: String(t.id) }))
  }))
}

export const getAvancesPorOrden = async (ordenId: string): Promise<AvanceTurno[]> => {
  const todos = await getAvancesTurno()
  return todos.filter(a => a.ordenId === ordenId)
}

export const abrirAvance = async (
  orden: OrdenProduccion,
  usuarioActivo: AuthUser
): Promise<AvanceTurno> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const turnoActual = detectarTurnoActual()
  const ahora = new Date().toISOString()

  const nuevoAvance: AvanceTurno = {
    id: String(Date.now()),
    ordenId: orden.id,
    folio: orden.folio,
    producto: orden.producto,
    color: orden.color,
    maquina: orden.maquina,
    supervisorId: usuarioActivo.id,
    supervisorNombre: usuarioActivo.nombre,
    turno: turnoActual,
    fecha: getFechaTurnoActual(),
    horaInicio: ahora,
    horaFin: null,
    estado: "abierto",
    borradorGuardado: false,
    piezasBuenas: 0,
    piezasDefectuosas: 0,
    kgMerma: 0,
    kgPlasta: 0,
    kgSobrante: 0,
    piezasCambioColor: 0,
    confirmacionMolino: null,
    observaciones: null,
    tiemposParo: [],
    solicitudesMaterial: []
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "ordenes",
    entidad: "AvanceTurno",
    accion: "abrir_avance",
    entidadId: nuevoAvance.id,
    detalle: `Avance de turno ${turnoActual} abierto para orden ${orden.folio}`
  })

  return nuevoAvance
}

export const guardarBorradorAvance = async (
  avance: AvanceTurno,
  data: CerrarAvanceForm,
  usuarioActivo: AuthUser
): Promise<AvanceTurno> => {
  await new Promise(resolve => setTimeout(resolve, 600))

  const avanceActualizado: AvanceTurno = {
    ...avance,
    ...data,
    borradorGuardado: true,
    estado: "abierto" // sigue abierto
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "ordenes",
    entidad: "AvanceTurno",
    accion: "guardar_borrador",
    entidadId: avance.id,
    detalle: `Borrador guardado — ${avance.folio} turno ${avance.turno}`
  })

  return avanceActualizado
}

export const cerrarAvance = async (
  avance: AvanceTurno,
  data: CerrarAvanceForm,
  orden: OrdenProduccion,
  avancesAnteriores: AvanceTurno[],
  usuarioActivo: AuthUser
): Promise<AvanceTurno> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const ahora = new Date().toISOString()

  // Suma piezas buenas de avances anteriores cerrados
  const piezasProducidasPrevias = avancesAnteriores
    .filter(a => a.estado === "cerrado")
    .reduce((acc, a) => acc + a.piezasBuenas, 0)

  const piezasProducidasTotal = piezasProducidasPrevias + data.piezasBuenas

  // Calcula si hubo producción extra
  const piezasExtra = Math.max(0, piezasProducidasTotal - orden.totalPiezas)

  // Determina si la orden se completó
  const ordenCompletada = piezasProducidasTotal >= orden.totalPiezas

  const avanceCerrado: AvanceTurno = {
    ...avance,
    ...data,
    piezasCambioColor: data.piezasCambioColor ?? 0,
    kgSobrante: data.kgSobrante ?? 0,
    horaFin: ahora,
    estado: "cerrado",
    borradorGuardado: false,
    confirmacionMolino: null
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "ordenes",
    entidad: "AvanceTurno",
    accion: "cerrar_avance",
    entidadId: avance.id,
    detalle: `Avance ${avance.turno} cerrado — ${data.piezasBuenas} pzas buenas, ${data.piezasDefectuosas} defectuosas, ${data.kgMerma}kg merma${data.piezasCambioColor ? `, ${data.piezasCambioColor} pzas cambio color` : ""}`
  })

  // Log de piezas extra si las hay
  if (piezasExtra > 0) {
    await registrarLog({
      usuario: usuarioActivo.usuario,
      nombre: usuarioActivo.nombre,
      modulo: "inventario",
      entidad: "ProductoTerminado",
      accion: "entrada_automatica",
      entidadId: orden.id,
      detalle: `${piezasExtra} piezas extra de ${orden.producto} ${orden.color} agregadas a STOCK automáticamente al completar orden ${orden.folio}`
    })
  }

  // Log de orden completada si aplica
  if (ordenCompletada) {
    await registrarLog({
      usuario: usuarioActivo.usuario,
      nombre: usuarioActivo.nombre,
      modulo: "ordenes",
      entidad: "OrdenProduccion",
      accion: "completar",
      entidadId: orden.id,
      detalle: `Orden ${orden.folio} completada — ${piezasProducidasTotal} piezas producidas de ${orden.totalPiezas} objetivo${piezasExtra > 0 ? `, ${piezasExtra} piezas extra a STOCK` : ""}`
    })
  }

  return avanceCerrado
}

export const agregarTiempoParo = async (
  avanceId: string,
  tiempoParo: RegistrarParo,
  usuarioActivo: AuthUser
): Promise<TiempoParo> => {
  await new Promise(resolve => setTimeout(resolve, 500))

  const nuevoTiempoParo: TiempoParo = {
    ...tiempoParo,
    id: String(Date.now())
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "ordenes",
    entidad: "TiempoParo",
    accion: "registrar_paro",
    entidadId: avanceId,
    detalle: `Paro registrado: ${tiempoParo.motivo} — ${tiempoParo.minutos} minutos`
  })

  return nuevoTiempoParo
}

export const solicitarMaterial = async (
  avance: AvanceTurno,
  data: SolicitarMaterialForm,
  usuarioActivo: AuthUser
): Promise<SolicitudMaterial> => {
  await new Promise(resolve => setTimeout(resolve, 500))

  const nuevaSolicitud: SolicitudMaterial = {
    id: String(Date.now()),
    kgSolicitados: data.kgSolicitados,
    motivo: data.motivo,
    fecha: new Date().toISOString(),
    confirmado: false
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "ordenes",
    entidad: "SolicitudMaterial",
    accion: "solicitar_material",
    entidadId: avance.id,
    detalle: `${data.kgSolicitados}kg solicitados para orden ${avance.folio}${data.motivo ? `. Motivo: ${data.motivo}` : ""}`
  })

  return nuevaSolicitud
}