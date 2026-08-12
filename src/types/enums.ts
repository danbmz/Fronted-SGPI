// Enums espejo de los que existen en el backend (Prisma).
// Centralizados aquí para que cualquier schema de Zod los importe sin redefinirlos por su cuenta.

export const ROL_USUARIO = ["ADMIN", "SUPERVISOR", "MOLINO", "PIGMENTOS", "PROGRAMADOR"] as const;
export type Role = (typeof ROL_USUARIO)[number]

export const TIPO_MATERIAL = ["POLIPROPILENO", "POLIESTIRENO", "POLIETILENO"] as const;
export type TipoMaterial = (typeof TIPO_MATERIAL)[number];

export const UNIDAD_MEDIDA = ["KILOGRAMO", "GRAMO", "LITRO", "MILILITRO", "PIEZA"] as const;
export type UnidadMedida = (typeof UNIDAD_MEDIDA)[number];

export const CATEGORIA_COLOR = ["SOLIDO", "SOLIDO_PASTEL", "NEON_TRASLUCIDO", "JARRA_NEON_PASTEL", "NATURAL"] as const;
export type CategoriaColor = (typeof CATEGORIA_COLOR)[number];

export const TIPO_PIGMENTO = ["MASTER", "POLVO"] as const;
export type TipoPigmento = (typeof TIPO_PIGMENTO)[number];

export const TIPO_PROCESO = ["INYECCION"] as const;
export type TipoProceso = (typeof TIPO_PROCESO)[number];

export const ESTADO_MAQUINA = ["ACTIVA", "INACTIVA", "MANTENIMIENTO"] as const;
export type EstadoMaquina = (typeof ESTADO_MAQUINA)[number];

export const CATEGORIA_MOTIVO_PARO = ["INICIO", "MATERIAL", "MOLDE", "MAQUINA", "OTROS"];
export type CategoriaMotivoParo = (typeof CATEGORIA_MOTIVO_PARO)[number];

export const TIPO_INVENTARIO = ["MATERIA_PRIMA", "PIGMENTO", "PRODUCTO", "MOLIDO", "MATERIAL_PIGMENTADO"] as const;
export type TipoInventario = (typeof TIPO_INVENTARIO)[number];

export const ORIGEN_MOLIDO = ["INTERNO", "COMPRADO"] as const;
export type OrigenMolido = (typeof ORIGEN_MOLIDO)[number];

export const ESTADO_PEDIDO = ["PENDIENTE", "EN_PROCESO", "COMPLETADO","CANCELADO"] as const;
export type EstadoPedido = (typeof ESTADO_PEDIDO)[number];

export const TIPO_MATERIAL_ORDEN = ["VIRGEN", "MEZCLA_MOLIDO_INTERNO", "MEZCLA_RECICLADO"]as const;
export type TipoMaterialOrden = (typeof TIPO_MATERIAL_ORDEN)[number];

export const ESTADO_ORDEN = ["BORRADOR", "ACTIVA", "EN_PROGRESO", "PAUSADA", "COMPLETADA", "CANCELADA"]as const;
export type EstadoOrden = (typeof ESTADO_ORDEN)[number];

export const ESTADO_AVANCE_TURNO = ["ABIERTO", "CERRADO"] as const;
export type EstadoAvanceTurno = (typeof ESTADO_AVANCE_TURNO)[number];

export const TURNO_TRABAJO = ["MANANA", "TARDE", "NOCHE"]as const;
export type TurnoTrabajo = (typeof TURNO_TRABAJO)[number];

export const TIPO_MATERIAL_SOLICITUD = ["VIRGEN", "MOLIDO"]as const; 
export type TipoMaterialSolicitud = (typeof TIPO_MATERIAL_SOLICITUD)[number];

export const DESTINO_PIEZAS = ["STOCK", "MOLINO"]as const;
export type DestinoPiezas = (typeof DESTINO_PIEZAS)[number];