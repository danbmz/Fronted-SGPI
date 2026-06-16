import type { Molienda } from "@/validations/molino/moliendaValidations"

export const getMoliendas = async (): Promise<Molienda[]> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const response = await fetch("/mocks/molino/moliendas.json")
  const data = await response.json()
  return data.map((m: any) => ({ ...m, id: String(m.id) }))
}

export const getMoliendaPorOrden = async (ordenId: string): Promise<Molienda[]> => {
  const todas = await getMoliendas()
  return todas.filter(m => m.ordenId === ordenId)
}