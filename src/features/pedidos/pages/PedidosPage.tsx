import { useState } from "react";
import { usePedidos } from "../hooks/usePedidos";
import TablaPedidos from "../components/TablaPedidos";
import DialogCrearPedido from "../components/DialogCrearPedido";
import DialogSalidaProducto from "../components/DialogSalidaProducto";
import { Button } from "@/components/ui/button";
import { Plus, PackageCheck } from "lucide-react";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationNext, PaginationPrevious
} from "@/components/ui/pagination";

export default function PedidosPage() {
  const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false);
  const [dialogSalidaAbierto, setDialogSalidaAbierto] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<string>("PENDIENTE");
  const [pagina, setPagina] = useState(1);

  const { data, isLoading, error } = usePedidos({
    estado: filtroEstado === "TODOS" ? undefined : filtroEstado,
    pagina,
    limite: 20,
  });

  const handleCambiarFiltro = (val: string) => {
    setFiltroEstado(val);
    setPagina(1); // siempre regresa a la página 1 al cambiar el filtro
  };

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

      <div className="flex flex-col gap-1 max-w-xs">
        <Select value={filtroEstado} onValueChange={handleCambiarFiltro}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDIENTE">Pendientes</SelectItem>
            <SelectItem value="COMPLETADO">Completados</SelectItem>
            <SelectItem value="CANCELADO">Cancelados</SelectItem>
            <SelectItem value="TODOS">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="text-muted-foreground py-4">Cargando pedidos...</p>}
      {error && <p className="text-red-500">Error al cargar pedidos: {error.message}</p>}

      {!isLoading && !error && data && (
        <>
          <TablaPedidos pedidos={data.data} />

          {data.paginacion.totalPaginas > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    className={pagina === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm text-muted-foreground px-2">
                    Página {data.paginacion.pagina} de {data.paginacion.totalPaginas}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPagina((p) => Math.min(data.paginacion.totalPaginas, p + 1))}
                    className={pagina === data.paginacion.totalPaginas ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      <DialogCrearPedido open={dialogCrearAbierto} onClose={() => setDialogCrearAbierto(false)} />
      <DialogSalidaProducto open={dialogSalidaAbierto} onClose={() => setDialogSalidaAbierto(false)} />
    </div>
  );
}