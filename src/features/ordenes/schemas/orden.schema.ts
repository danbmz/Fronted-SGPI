import { z } from "zod";
import { ESTADO_ORDEN, TIPO_MATERIAL_ORDEN } from "@/types/enums";

export const ordenSchema = z.object({
  id: z.string(),
  folio: z.string(),
  estado: z.enum(ESTADO_ORDEN),
  pedidoDetalleId: z.string(),
  pedidoId: z.string(),
  pedidoNumero: z.string(),
  cliente: z.string(),
  productoId: z.string(),
  productoNombre: z.string(),
  totalPiezas: z.int(),
  piezasProducidas: z.int(),
  observaciones: z.string().nullable(),
  tipoMaterial: z.enum(TIPO_MATERIAL_ORDEN),
  materiaPrimaId: z.string(),
  materiaPrimaNombre: z.string(),
  inventarioMolidoId: z.string().nullable(),
  porcentajeVirgen: z.number(),
  porcentajeMolido: z.number(),
  pigmentoId: z.string(),
  pigmentoColor: z.string(),
  aditivoDescripcion: z.string().nullable(),
  maquinaId: z.string(),
  maquinaNombre: z.string(),
  piezasPorHora: z.int(),
  piezasPorTurno: z.int(),
  piezasPorDia: z.int(),
  tiempoEstimadoHrs: z.number(),
  materiaPrimaTotalKg: z.number(),
  materiaPrimaVirgenKg: z.number(),
  materialMolidoKg: z.number(),
  pigmentoRequeridoKg: z.number(),
  materialSiguienteConfirmado: z.boolean(),
  materialConfirmadoEn: z.string().nullable(),
  usuarioCreadorNombre: z.string(),
  createdAt: z.string(),
});

export type Orden = z.infer<typeof ordenSchema>;

export const listaOrdenSchema = z.array(ordenSchema);