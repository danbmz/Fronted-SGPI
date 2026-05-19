import type { FormulaPigmento, CrearFormulaPigmento, EditarFormulaPigmento } from "@/validations/catalogo/formulasValidations"
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
  data: CrearFormulaPigmento,
  usuarioActivo: AuthUser
): Promise<FormulaPigmento> => {
  await new Promise(resolve => setTimeout(resolve, 800))

  const nuevaFormula: FormulaPigmento = {
    ...data,
    id: String(Date.now()),
    categoriaColor: "Sólidos", // El back devuelve la categoria correcta
    tipoPigmento: "master" // El back devuelve el tipo de pigmento correcto en base al pigmento elegido, pigmentoId
  }

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "FormulasPigmento",
    accion: "crear",
    entidadId: nuevaFormula.id,
    detalle: `Fórmula creada: ${data.materialBase} — ${data.color} — ${data.dosisGrPorKg} gr/kg`
  })

  return nuevaFormula
}

export const editarFormulaPigmento = async (
  id: string,
  data: EditarFormulaPigmento,
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
    detalle: `Fórmula editada: ${formulaOriginal.materialBase} — ${formulaOriginal.color} de ${formulaOriginal.categoriaColor} a ${data.dosisGrPorKg}gr/kg - motivo: ${data.motivo}`
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