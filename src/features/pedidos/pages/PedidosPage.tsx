import { useState } from "react";
import { usePedidos } from "../hooks/usePedidos";
import TablaPedidos from "../components/TablaPedidos";
import DialogCrearPedido from "../components/DialogCrearPedido";
import DialogSalidaProducto from "../components/DialogSalidaProducto";
import { Button } from "@/components/ui/button";
import { Plus, PackageCheck } from "lucide-react";

export default function PedidosPage() {
  const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false);
  const [dialogSalidaAbierto, setDialogSalidaAbierto] = useState(false);
  const { data: pedidos, isLoading, error } = usePedidos();

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Gestiona los pedidos de clientes y su seguimiento de producción.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setDialogSalidaAbierto(true)}>
            <PackageCheck size={16} className="mr-2" />
            Registrar salida
          </Button>
          <Button className="bg-gray-800 hover:bg-gray-700" onClick={() => setDialogCrearAbierto(true)}>
            <Plus size={16} className="mr-2" />
            Nuevo pedido
          </Button>
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground py-4">Cargando pedidos...</p>}
      {error && <p className="text-red-500">Error al cargar pedidos: {error.message}</p>}
      {!isLoading && !error && (
        <TablaPedidos pedidos={pedidos ?? []} />
      )}

      <DialogCrearPedido
        open={dialogCrearAbierto}
        onClose={() => setDialogCrearAbierto(false)}
      />

      <DialogSalidaProducto
        open={dialogSalidaAbierto}
        onClose={() => setDialogSalidaAbierto(false)}
      />
    </div>
  );
}