import { paginacionSchema } from "@/features/pedidos/schemas";
import { z } from "zod";

export const auditLogSchema = z.object({
  id: z.string(),
  usuarioId: z.string(),
  usuarioLogin: z.string(),
  usuarioNombre: z.string(),
  modulo: z.string(),
  accion: z.string(),
  entidad: z.string().nullable(),      
  entidadId: z.string().nullable(),    
  detalle: z.string().nullable(),
  ip: z.string().nullable(),
  createdAt: z.string(),
});

export type AuditLog = z.infer<typeof auditLogSchema>;

export const listaAuditLogSchema = z.object({
  data: z.array(auditLogSchema),
  paginacion: paginacionSchema,
});

export type ListaAuditLog = z.infer<typeof listaAuditLogSchema>;