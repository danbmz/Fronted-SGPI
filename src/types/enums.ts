// Enums espejo de los que existen en el backend (Prisma).
// Centralizados aquí para que cualquier schema de Zod los importe sin redefinirlos por su cuenta.

export type Role = "ADMIN" | "SUPERVISOR" | "MOLINO" | "PIGMENTOS"

export const TIPO_MATERIAL = ["POLIPROPILENO", "POLIESTIRENO", "POLIETILENO"] as const;
export type TipoMaterial = (typeof TIPO_MATERIAL)[number];

export const UNIDAD_MEDIDA = ["KILOGRAMO", "GRAMO", "LITRO", "MILILITRO", "PIEZA"] as const;
export type UnidadMedida = (typeof UNIDAD_MEDIDA)[number];

export const CATEGORIA_COLOR = ["SOLIDO", "SOLIDO_PASTEL", "NEON_TRASLUCIDO", "JARRA_NEON_PASTEL", "NATURAL"] as const;
export type CategoriaColor = (typeof CATEGORIA_COLOR)[number];

export const TIPO_PIGMENTO = ["MASTER", "POLVO"] as const;
export type TipoPigmento = (typeof TIPO_PIGMENTO)[number];
