import { useMemo } from "react";
import { useOrdenes } from "@/features/ordenes/hooks/useOrdenes";
import { useMaquina } from "@/features/catalogo/hooks/useMaquina";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { Orden } from "@/features/ordenes/schemas/orden.schema";
import { useNavigate } from "react-router-dom";

const estadoColor: Record<string, string> = {
  ACTIVA: "bg-blue-100 text-blue-700",
  EN_PROGRESO: "bg-amber-100 text-amber-700",
};

export default function OrdenesPigmentosPage() {
  const navigate = useNavigate();
  const { data: ordenes, isLoading, error } = useOrdenes({ excluirFinalizadas: true });
  const { data: maquinas } = useMaquina();

  // Agrupamos las órdenes ACTIVA/EN_PROGRESO por máquina, ordenadas por antigüedad
  const ordenesPorMaquina = useMemo(() => {
    if (!ordenes) return new Map<string, Orden[]>();

    const mapa = new Map<string, Orden[]>();
    const relevantes = ordenes
      .filter((o) => o.estado === "ACTIVA" || o.estado === "EN_PROGRESO")
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    for (const orden of relevantes) {
      const lista = mapa.get(orden.maquinaId) ?? [];
      lista.push(orden);
      mapa.set(orden.maquinaId, lista);
    }
    return mapa;
  }, [ordenes]);

  if (isLoading) return <div className="p-6">Cargando órdenes...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm text-muted-foreground">
        Órdenes por máquina, pendientes de confirmación de material.
      </p>

      <Accordion type="multiple">
        {(maquinas ?? []).map((maquina) => {
          const ordenesDeMaquina = ordenesPorMaquina.get(maquina.id) ?? [];
          const pendientesConfirmar = ordenesDeMaquina.filter((o) => !o.materialSiguienteConfirmado);

          return (
            <AccordionItem key={maquina.id} value={maquina.id}>
              <AccordionTrigger>
                {maquina.nombre}
                {pendientesConfirmar.length > 0 && (
                  <Badge className="ml-2 bg-red-100 text-red-700">{pendientesConfirmar.length}</Badge>
                )}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                {ordenesDeMaquina.map((orden, index) => (
                  <div
                    key={orden.id}
                    className="flex items-center justify-between border rounded-md p-3"
                    onClick={() => navigate(`${orden.id}`)}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{orden.folio}</span>
                        <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor[orden.estado]}`}>
                          {orden.estado}
                        </Badge>
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs">En curso</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {orden.productoNombre} — {orden.pigmentoColor}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Virgen: {orden.materiaPrimaVirgenKg.toFixed(2)} kg
                        {orden.tipoMaterial !== "VIRGEN" && ` — Molido: ${orden.materialMolidoKg.toFixed(2)} kg`}
                        {" — "}Pigmento: {orden.pigmentoRequeridoKg.toFixed(3)} kg
                      </p>
                    </div>

                    <Badge variant={orden.materialSiguienteConfirmado ? "default" : "secondary"}>
                      {orden.materialSiguienteConfirmado ? "Confirmado" : "Pendiente"}
                    </Badge>
                  </div>
                ))}
                {ordenesDeMaquina.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2">Sin órdenes activas en esta máquina.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}