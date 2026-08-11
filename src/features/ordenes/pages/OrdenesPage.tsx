import { useState, useMemo } from "react";
import { useOrdenes } from "../hooks/useOrdenes";
import { ESTADO_ORDEN } from "@/types/enums";
import TablaOrdenes from "../components/TablaOrdenes";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";

export default function OrdenesPage() {
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");
  const { data: ordenes, isLoading, error } = useOrdenes();

  const ordenesFiltradas = useMemo(() => {
    if (filtroEstado === "TODOS") return ordenes ?? [];
    return (ordenes ?? []).filter((o) => o.estado === filtroEstado);
  }, [ordenes, filtroEstado]);

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm text-muted-foreground">
        Consulta y gestiona las órdenes de producción.
      </p>

      <div className="flex flex-col gap-1 max-w-xs">
        <Select value={filtroEstado} onValueChange={setFiltroEstado}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos los estados</SelectItem>
            {ESTADO_ORDEN.map((e) => (
              <SelectItem key={e} value={e}>{e}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="text-muted-foreground py-4">Cargando órdenes...</p>}
      {error && <p className="text-red-500">Error al cargar órdenes: {error.message}</p>}
      {!isLoading && !error && (
        <TablaOrdenes ordenes={ordenesFiltradas} />
      )}
    </div>
  );
}