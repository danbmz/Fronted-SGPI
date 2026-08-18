import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { usePedido } from "../hooks/usePedidos";
import DialogSalidaProducto from "../components/DialogSalidaProducto";
import { PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Pencil, Ban } from "lucide-react";
import TablaDetallePedido from "../components/TablaDetallePedido";
import DialogEditarPedido from "../components/DialogEditarPedido";
import DialogCancelarPedido from "../components/DialogCancelarPedido";
import DialogAgregarDetalle from "../components/DialogAgregarDetalle";

const estadoColor: Record<string, string> = {
  PENDIENTE: "bg-gray-100 text-gray-700",
  EN_PROCESO: "bg-blue-100 text-blue-700",
  COMPLETADO: "bg-green-100 text-green-700",
  CANCELADO: "bg-red-100 text-red-700",
};

export default function PedidoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pedido, isLoading, error } = usePedido(id);

  const [dialogEditarAbierto, setDialogEditarAbierto] = useState(false);
  const [dialogCancelarAbierto, setDialogCancelarAbierto] = useState(false);
  const [dialogDetalleAbierto, setDialogDetalleAbierto] = useState(false);
  const [dialogSalidaAbierto, setDialogSalidaAbierto] = useState(false);

  if (isLoading) return <div className="p-6">Cargando pedido...</div>;
  if (error) return <div className="p-6 text-red-500">Error al cargar el pedido: {error.message}</div>;
  if (!pedido) return <div className="p-6">Pedido no encontrado.</div>;

  const puedeModificar = pedido.estado !== "CANCELADO" && pedido.estado !== "COMPLETADO";

  return (
    <div className="flex flex-col gap-4 p-6">
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} className="mr-2" />
        Volver
      </Button>

      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{pedido.numeroPedido}</h1>
            <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor[pedido.estado]}`}>
              {pedido.estado}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Cliente: {pedido.cliente}</p>
          {pedido.remision && (
            <p className="text-sm text-muted-foreground">Remisión: {pedido.remision}</p>
          )}
          {pedido.descripcion && (
            <p className="text-sm text-muted-foreground">{pedido.descripcion}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {pedido.ordenesCompletadas} / {pedido.totalOrdenes} órdenes completadas
          </p>
        </div>

        {puedeModificar && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setDialogSalidaAbierto(true)}>
              <PackageCheck size={16} className="mr-2" />
              Registrar entrega
            </Button>
            <Button variant="outline" onClick={() => setDialogEditarAbierto(true)}>
              <Pencil size={16} className="mr-2" />
              Editar
            </Button>
            <Button variant="destructive" onClick={() => setDialogCancelarAbierto(true)}>
              <Ban size={16} className="mr-2" />
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <h2 className="text-sm font-semibold">Líneas del pedido</h2>
        {puedeModificar && (
          <Button size="sm" onClick={() => setDialogDetalleAbierto(true)}>
            <Plus size={16} className="mr-2" />
            Agregar línea
          </Button>
        )}
      </div>

      <TablaDetallePedido detalle={pedido.detalle} />

      <DialogEditarPedido
        open={dialogEditarAbierto}
        pedido={pedido}
        onClose={() => setDialogEditarAbierto(false)}
      />

      <DialogCancelarPedido
        open={dialogCancelarAbierto}
        pedido={pedido}
        onClose={() => setDialogCancelarAbierto(false)}
      />

      <DialogAgregarDetalle
        open={dialogDetalleAbierto}
        pedidoId={pedido.id}
        onClose={() => setDialogDetalleAbierto(false)}
      />

      <DialogSalidaProducto
        open={dialogSalidaAbierto}
        onClose={() => setDialogSalidaAbierto(false)}
        pedidoIdInicial={pedido.id}
      />
    </div>
  );
}