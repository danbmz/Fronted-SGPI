import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listarSolicitudesMaterial,
  crearSolicitudMaterial,
  confirmarSolicitudMaterial,
  listarTodasSolicitudesMaterial,
} from "../services/solicitudService";
import type { CrearSolicitudMaterialInput } from "../schemas/solicitudMaterial";

const queryKeyLista = (avanceTurnoId: string) => ["solicitudes-material", avanceTurnoId];

export function useSolicitudesMaterial(avanceTurnoId: string | undefined) {
  return useQuery({
    queryKey: queryKeyLista(avanceTurnoId ?? ""),
    queryFn: () => listarSolicitudesMaterial(avanceTurnoId!),
    enabled: avanceTurnoId !== undefined,
  });
}

// --- Lista todas las solicitudes, para PIGMENTOS
export function useTodasSolicitudesMaterial(filtro?: { confirmado?: boolean }) {
  return useQuery({
    queryKey: ["solicitudes-material", "todas", filtro],
    queryFn: () => listarTodasSolicitudesMaterial(filtro),
  });
}

export function useCrearSolicitudMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ avanceTurnoId, data }: { avanceTurnoId: string; data: CrearSolicitudMaterialInput }) =>
      crearSolicitudMaterial(avanceTurnoId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeyLista(variables.avanceTurnoId) });
    },
  });
}

// Agregamos avanceTurnoId para poder invalidar la query key correcta en onSuccess
export function useConfirmarSolicitudMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; avanceTurnoId: string }) => confirmarSolicitudMaterial(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeyLista(variables.avanceTurnoId) });
      queryClient.invalidateQueries({ queryKey: ["solicitudes-material", "todas"] }); // Para refrescar la pantalla donde se listan solicitudes de diferentes avances. 
      queryClient.invalidateQueries({ queryKey: ["inventario"] });
    },
  });
}