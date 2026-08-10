import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listarInventarioMateriaPrima,
  listarInventarioPigmento,
  listarInventarioProducto,
  listarInventarioMolido,
  listarInventarioMaterialPigmentado,
  consultarHistorial,
  registrarEntradaProveedor,
  registrarAjusteManual,
  registrarSalidaProducto,
} from "../services/inventarioService";
import type {
  EntradaProveedorInput,
  AjusteManualInput,
  SalidaProductoInput,
  HistorialQueryInput,
} from "../schemas";

// Una query key por cada tipo de inventario, para poder invalidar con precisión
export const QUERY_KEYS = {
  materiaPrima: ["inventario", "materias-primas"],
  pigmento: ["inventario", "pigmentos"],
  producto: ["inventario", "productos"],
  molido: ["inventario", "molido"],
  materialPigmentado: ["inventario", "material-pigmentado"],
} as const;

// ---------- LISTADOS ----------

export function useInventarioMateriaPrima() {
  return useQuery({
    queryKey: QUERY_KEYS.materiaPrima,
    queryFn: listarInventarioMateriaPrima,
  });
}

export function useInventarioPigmento() {
  return useQuery({
    queryKey: QUERY_KEYS.pigmento,
    queryFn: listarInventarioPigmento,
  });
}

export function useInventarioProducto() {
  return useQuery({
    queryKey: QUERY_KEYS.producto,
    queryFn: listarInventarioProducto,
  });
}

export function useInventarioMolido() {
  return useQuery({
    queryKey: QUERY_KEYS.molido,
    queryFn: listarInventarioMolido,
  });
}

export function useInventarioMaterialPigmentado() {
  return useQuery({
    queryKey: QUERY_KEYS.materialPigmentado,
    queryFn: listarInventarioMaterialPigmentado,
  });
}

// ---------- HISTORIAL ----------

export function useHistorialInventario(query: HistorialQueryInput) {
  return useQuery({
    queryKey: ["inventario", "movimientos", query],
    queryFn: () => consultarHistorial(query),
  });
}

// ---------- Helper: mapea tipoInventario -> queryKey correspondiente ----------

function queryKeyPorTipo(tipoInventario: string) {
  switch (tipoInventario) {
    case "MATERIA_PRIMA":
      return QUERY_KEYS.materiaPrima;
    case "PIGMENTO":
      return QUERY_KEYS.pigmento;
    case "PRODUCTO":
      return QUERY_KEYS.producto;
    case "MOLIDO":
      return QUERY_KEYS.molido;
    case "MATERIAL_PIGMENTADO":
      return QUERY_KEYS.materialPigmentado;
    default:
      return null;
  }
}

// ---------- ACCIONES ----------

export function useEntradaProveedor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EntradaProveedorInput) => registrarEntradaProveedor(data),
    onSuccess: (_, variables) => {
      const key = queryKeyPorTipo(variables.tipoInventario);
      if (key) queryClient.invalidateQueries({ queryKey: key });
    },
  });
}

export function useAjusteManual() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AjusteManualInput) => registrarAjusteManual(data),
    onSuccess: (_, variables) => {
      const key = queryKeyPorTipo(variables.tipoInventario);
      if (key) queryClient.invalidateQueries({ queryKey: key });
    },
  });
}

export function useSalidaProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SalidaProductoInput) => registrarSalidaProducto(data),
    onSuccess: () => {
      // salida-producto siempre es tipo PRODUCTO, sin ambigüedad
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.producto });
    },
  });
}