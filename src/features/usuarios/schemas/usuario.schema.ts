import { z } from "zod";
import { ROL_USUARIO, type Role } from "@/types/enums";

export const usuarioSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  usuario: z.string(),
  role: z.enum(ROL_USUARIO),
  activo: z.boolean(),
  createdAt: z.string(),
});

export type Usuario = z.infer<typeof usuarioSchema>;

export const listaUsuarioSchema = z.array(usuarioSchema);

// Tipo reducido — para sesión activa
export interface AuthUser {
  id: string
  nombre: string
  role: Role
}