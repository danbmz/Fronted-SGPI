import type { FormulaPigmento, CrearFormulaPigmentoDTO, EditarFormulaPigmentoDTO } from "@/types/formulasPigmentosCatalogo"
import type { AuthUser } from "@/types/usuario"
import { registrarLog } from "@/lib/auditService"

export const getFormulasPigmento = async (): Promise<FormulaPigmento[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const response = await fetch("/mocks/catalogo/formulasPigmentos.json")
  const data = await response.json()
  return data.map((f: any) => ({
    ...f,
    id: String(f.id),
    materiaPrimaId: String(f.materiaPrimaId)
  }))
}

export const crearFormulaPigmento = async (
  data: CrearFormulaPigmentoDTO,
  usuarioActivo: AuthUser
): Promise<FormulaPigmento> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const nuevaFormula: FormulaPigmento = {
    ...data,
    id: String(Date.now())
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "FormulasPigmento",
    accion: "crear",
    entidadId: nuevaFormula.id,
    detalle: `Fórmula creada: ${data.materialBase} — ${data.color} (${data.categoriaColor}) — ${data.dosisGrPorKg} gr/kg`
  })

  return nuevaFormula
}

export const editarFormulaPigmento = async (
  id: string,
  data: EditarFormulaPigmentoDTO,
  formulaOriginal: FormulaPigmento,
  usuarioActivo: AuthUser
): Promise<FormulaPigmento> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "FormulasPigmento",
    accion: "editar",
    entidadId: id,
    detalle: `Fórmula editada: ${data.materialBase} — ${data.color} de ${formulaOriginal.categoriaColor}`
  })

  return { ...formulaOriginal, ...data, id }
}

export const eliminarFormulaPigmento = async (
  formula: FormulaPigmento,
  usuarioActivo: AuthUser
): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "FormulasPigmento",
    accion: "eliminar",
    entidadId: formula.id,
    detalle: `Fórmula eliminada: ${formula.materialBase} — ${formula.color} (${formula.categoriaColor})`
  })

  return formula.id
}