export type TipoMateriaPrima =
  | "Polipropileno"
  | "Poliestireno-Cristal"
  | "Aditivo"

export type SubtipoMateriaPrima = "virgen" | "reciclado"

export type coloresMateriaPrima = "natural" | "amarillo" | "verde" | "naranja" | "azul" | "rojo" | "morado" | "blanco" | "rosa" | "beige" | "crema"

export type unidadesMedida = "kg" | "lt" | "pza"

export interface MateriaPrima {
  id: string
  nombre: string
  codigoInterno: string
  tipo: TipoMateriaPrima
  subtipo: SubtipoMateriaPrima
  color: coloresMateriaPrima
  proveedor: string
  unidadMedida: unidadesMedida
  costoUnitario: number
  activo: boolean
}

export interface CrearMateriaPrimaDTO {
  nombre: string
  codigoInterno: string
  tipo: TipoMateriaPrima
  subtipo: SubtipoMateriaPrima
  color: coloresMateriaPrima
  proveedor: string
  unidadMedida: unidadesMedida
  costoUnitario: number
}

export interface EditarMateriaPrimaDTO {
  nombre: string
  codigoInterno: string
  tipo: TipoMateriaPrima
  subtipo: SubtipoMateriaPrima
  color: coloresMateriaPrima
  proveedor: string
  unidadMedida: unidadesMedida
  costoUnitario: number
}