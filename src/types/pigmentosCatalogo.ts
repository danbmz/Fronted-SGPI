import type { CategoriaColor, TipoPigmento } from "./formulasPigmentosCatalogo"

export interface Pigmento {
    id: string
    color: string
    categoriaColor: CategoriaColor
    tipo: TipoPigmento
    materiaPrimaId: string
}

export interface CrearPigmentoDTO {
    color: string
    categoriaColor: CategoriaColor
    tipo: TipoPigmento
    materiaPrimaId: string
}

export interface EditarPigmentoDTO {
    color: string
    categoriaColor: CategoriaColor
    tipo: TipoPigmento
    materiaPrimaId: string
}