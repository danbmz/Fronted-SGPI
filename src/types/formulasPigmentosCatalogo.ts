export type TipoPigmento = "master" | "polvo"
export type CategoriaColor =
  | "Sólidos"
  | "Sólidos Pasteles"
  | "Neón Traslucidos"
  | "Jarra Neón Pastel"

export interface FormulaPigmento {
  id: string
  materiaPrimaId: string
  materialBase: string
  categoriaColor: CategoriaColor
  color: string
  tipoPigmento: TipoPigmento
  dosisGrPorKg: number
}

export interface CrearFormulaPigmentoDTO {
  materiaPrimaId: string
  materialBase: string
  categoriaColor: CategoriaColor
  color: string
  tipoPigmento: TipoPigmento
  dosisGrPorKg: number
}

export interface EditarFormulaPigmentoDTO {
  materiaPrimaId: string
  materialBase: string
  categoriaColor: CategoriaColor
  color: string
  tipoPigmento: TipoPigmento
  dosisGrPorKg: number
}