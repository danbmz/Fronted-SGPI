import { z } from "zod";
import { ROL_USUARIO } from "@/types/enums";

export const crearUsuarioSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(150, "El nombre no puede exceder 150 caracteres"),
  usuario: z
    .string()
    .min(3, "El usuario debe tener al menos 3 caracteres")
    .max(50, "El usuario no puede exceder 50 caracteres"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(200, "La contraseña no puede exceder 200 caracteres"),
  role: z.enum(ROL_USUARIO, { message: "Selecciona un rol válido" }),
});

export type CrearUsuarioInput = z.infer<typeof crearUsuarioSchema>;

export const editarUsuarioSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(150, "El nombre no puede exceder 150 caracteres")
    .optional(),
  role: z.enum(ROL_USUARIO, { message: "Selecciona un rol válido" }).optional(),
});

export type EditarUsuarioInput = z.infer<typeof editarUsuarioSchema>;

// Este es el schema que valida lo que el backend REALMENTE espera recibir
export const cambiarPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(200, "La contraseña no puede exceder 200 caracteres"),
});

export type CambiarPasswordInput = z.infer<typeof cambiarPasswordSchema>;

// Este es el schema del FORMULARIO, con el campo extra de confirmación
export const cambiarPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(200, "La contraseña no puede exceder 200 caracteres"),
    confirmarPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmarPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarPassword"],
  });

export type CambiarPasswordFormInput = z.infer<typeof cambiarPasswordFormSchema>;