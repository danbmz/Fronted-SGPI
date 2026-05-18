import type { MateriaPrima, CrearMateriaPrimaDTO, EditarMateriaPrimaDTO } from "@/types/materiaPrima"
import type { AuthUser } from "@/types/usuario"
import { registrarLog } from "@/lib/auditService"

export const getMateriasPrimas = async (): Promise<MateriaPrima[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const response = await fetch("/mocks/catalogo/materiaPrima.json")
  const data = await response.json()
  return data.map((m: any) => ({
    ...m,
    id: String(m.id),
    activo: m.activo ?? true
  }))
}

export const crearMateriaPrima = async (
  data: CrearMateriaPrimaDTO,
  usuarioActivo: AuthUser
): Promise<MateriaPrima> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const nuevaMateriaPrima: MateriaPrima = {
    ...data,
    id: String(Date.now()),
    activo: true
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "MateriasPrimas",
    accion: "crear",
    entidadId: nuevaMateriaPrima.id,
    detalle: `Materia prima '${nuevaMateriaPrima.nombre}' (${nuevaMateriaPrima.codigoInterno}) creada`
  })

  return nuevaMateriaPrima
}

export const editarMateriaPrima = async (
  id: string,
  data: EditarMateriaPrimaDTO,
  materiaPrimaOriginal: MateriaPrima,
  usuarioActivo: AuthUser
): Promise<MateriaPrima> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "MateriasPrimas",
    accion: "editar",
    entidadId: id,
    detalle: `Materia prima '${data.nombre}' (${data.codigoInterno}) editada`
  })

  return { ...materiaPrimaOriginal, ...data, id }
}

export const desactivarMateriaPrima = async (
  materiaPrima: MateriaPrima,
  usuarioActivo: AuthUser
): Promise<MateriaPrima> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "MateriasPrimas",
    accion: "desactivar",
    entidadId: materiaPrima.id,
    detalle: `Materia prima '${materiaPrima.nombre}' desactivada`
  })

  return { ...materiaPrima, activo: false }
}

export const reactivarMateriaPrima = async (
  materiaPrima: MateriaPrima,
  usuarioActivo: AuthUser
): Promise<MateriaPrima> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "MateriasPrimas",
    accion: "reactivar",
    entidadId: materiaPrima.id,
    detalle: `Materia prima '${materiaPrima.nombre}' reactivada`
  })

  return { ...materiaPrima, activo: true }
}