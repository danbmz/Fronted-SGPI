import z from "zod"

const tipos = ["Jarra", "Plato", "Vaso", "Colador", "Cubeta" ] as const

export const crearProductoSchema = z.object({
    nombre:z
        .string()
        .min(1,"El nombre del producto es requerido"),
    codigo:z
        .string()
        .min(1, "El código de producto es requerido")
        .regex(/^[A-Z]{2}-[A-Z0-9]{4}$/, "Modificar este REGEX"),
    tipo:z.enum(tipos, {
        message: "Seleecione un tipo válido"
    }),
    cavidades:z
        .number({message: "Ingresa un valor numérico válido"})
        .positive("Cavidad mínima 1"),
    ciclo:z
        .number({message: "Ingresa un valor numérico válido"})
        .positive("Ingresa un valor numérico válido"),
    peso:z
        .number({message: "Ingresa un valor numérico válido"})
        .positive("El peso no puede ser menor o igual a 0")
})

export const editarProductoSchema = crearProductoSchema

export type CrearProducto = z.infer<typeof crearProductoSchema>
export type EditarProducto = z.infer<typeof crearProductoSchema>
export type TipoProducto = z.infer<typeof crearProductoSchema>["tipo"]

export interface Producto extends CrearProducto {
    id: string
    activo: boolean
}