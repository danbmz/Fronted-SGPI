import { useQuery } from "@tanstack/react-query";
import { obtenerDashboard } from "../services/dashboardService";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: obtenerDashboard,
    refetchInterval: 5 * 60 * 1000, // refresca cada 5 minutos, ya que es información "en tiempo real"
  });
}