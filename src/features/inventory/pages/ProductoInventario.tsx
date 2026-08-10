import { useState } from "react";
import { useInventarioProducto } from "../hook/useInventario";
import TablaProductosInventario from "../components/productos/TablaProductosInventario";
import DialogAjusteManual from "../components/DialogAjusteManual";
import { Button } from "@/components/ui/button";

export default function ProductoInventario() {
  const [dialogAjusteAbierto, setDialogAjusteAbierto] = useState(false);
  const { data: productos, isLoading, error } = useInventarioProducto();

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Consulta el stock de productos terminados.
        </p>
        <Button variant="outline" onClick={() => setDialogAjusteAbierto(true)}>
          Ajuste manual
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground py-4">Cargando productos...</p>}
      {error && <p className="text-red-500">Error al cargar: {error.message}</p>}
      {!isLoading && !error && (
        <TablaProductosInventario productos={productos ?? []} />
      )}

      <DialogAjusteManual
        open={dialogAjusteAbierto}
        tipoInventario="PRODUCTO"
        onClose={() => setDialogAjusteAbierto(false)}
      />
    </div>
  );
}