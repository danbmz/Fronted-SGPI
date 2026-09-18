import { httpClient } from "@/lib/httpClient";
import { parseOrThrow } from "@/lib/parseOrThrow";
import { dashboardSchema, type Dashboard } from "../schemas/dashboard.schema";

export async function obtenerDashboard(): Promise<Dashboard> {
  const response = await httpClient("/dashboard");
  return parseOrThrow(response, dashboardSchema);
}