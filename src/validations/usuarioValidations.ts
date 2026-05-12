import { z } from "zod"

export const crearUsuarioSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  usuario: z
    .string()
    .min(1, "El usuario es requerido")
    .min(4, "El usuario debe tener al menos 4 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guión bajo"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["admin", "supervisor"], {
    message: "Selecciona un rol válido" 
  })
})

export const editarUsuarioSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  usuario: z
    .string()
    .min(1, "El usuario es requerido")
    .min(4, "El usuario debe tener al menos 4 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guión bajo"),
  password: z
    .string()
    .optional()
    .refine(val => !val || val.length >= 6, {
      message: "La contraseña debe tener al menos 6 caracteres"
    }),
  role: z.enum(["admin", "supervisor"], {
    message: "Selecciona un rol válido" 
  })
})


// Inferimos los tipos desde el schema — ya no necesitas declarar FormValues manualmente
export type CrearUsuarioForm = z.infer<typeof crearUsuarioSchema>
export type EditarUsuarioForm = z.infer<typeof editarUsuarioSchema>