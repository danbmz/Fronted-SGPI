import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { PedidoDetalle } from "../schemas/pedido.schema";
import { useOrdenes } from "@/features/ordenes/hooks/useOrdenes";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DialogCrearOrden from "@/features/ordenes/components/DialogCrearOrden";

interface Props {
  detalle: PedidoDetalle[];
  estadoPedido: string;
}

const estadoColor: Record<string, string> = {
  BORRADOR: "bg-gray-100 text-gray-700",
  ACTIVA: "bg-blue-100 text-blue-700",
  EN_PROGRESO: "bg-amber-100 text-amber-700",
  PAUSADA: "bg-orange-100 text-orange-700",
  COMPLETADA: "bg-green-100 text-green-700",
  CANCELADA: "bg-red-100 text-red-700",
};

export default function TablaDetallePedido({ detalle, estadoPedido }: Props) {
  const [lineaSeleccionada, setLineaSeleccionada] = useState<PedidoDetalle | null>(null);
  const pedidoBloqueado = estadoPedido === "COMPLETADO" || estadoPedido === "CANCELADO";
  const navigate = useNavigate();

  const { data: todasLasOrdenes } = useOrdenes();

  const ordenesPorLinea = useMemo(() => {
    const mapa = new Map<string, typeof todasLasOrdenes>();
    if (!todasLasOrdenes) return mapa;
    for (const orden of todasLasOrdenes) {
      const lista = mapa.get(orden.pedidoDetalleId) ?? [];
      lista.push(orden);
      mapa.set(orden.pedidoDetalleId, lista);
    }
    return mapa;
  }, [todasLasOrdenes]);

  return (
    <>
      <Accordion type="multiple">
        {detalle.map((linea) => {
          const ordenesDeLinea = ordenesPorLinea.get(linea.id) ?? [];

          return (
            <AccordionItem key={linea.id} value={linea.id}>
              <AccordionTrigger>
                <div className="flex items-center gap-4 text-left">
                  <span className="font-medium">{linea.productoNombre}</span>
                  <span className="text-sm text-muted-foreground">
                    {linea.pigmentoColor ?? "Sin especificar"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {linea.cantidadProducida} / {linea.cantidadSolicitada} producido
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {linea.cantidadEntregada} entregado
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                {ordenesDeLinea.map((orden) => (
                  <div
                    key={orden.id}
                    className="flex items-center justify-between border rounded-md p-2 cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`../ordenes/${orden.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">{orden.folio}</span>
                      <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor[orden.estado]}`}>
                        {orden.estado}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{orden.totalPiezas} piezas</span>
                  </div>
                ))}
                {ordenesDeLinea.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2">
                    Todavía no hay órdenes creadas para esta línea.
                  </p>
                )}
                {!pedidoBloqueado && linea.cantidadProducida < linea.cantidadSolicitada && (
                  <Button size="sm" variant="outline" className="w-fit" onClick={() => setLineaSeleccionada(linea)}>
                    Crear orden
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
        {detalle.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Este pedido no tiene líneas de detalle todavía.
          </p>
        )}
      </Accordion>

      <DialogCrearOrden
        open={lineaSeleccionada !== null}
        onClose={() => setLineaSeleccionada(null)}
        pedidoDetalle={lineaSeleccionada}
      />
    </>
  );
}