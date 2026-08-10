import { useState } from "react";
import { useInventarioMolido } from "../hook/useInventario";
import TablaInventarioMolido from "../components/molido/TablaInventarioMolido";
import DialogEntradaProveedor from "../components/DialogEntradaProveedor";
import DialogAjusteManual from "../components/DialogAjusteManual";
import { Button } from "@/components/ui/button";

export default function MolidoInventario() {
  const [dialogEntradaAbierto, setDialogEntradaAbierto] = useState(false);
  const [dialogAjusteAbierto, setDialogAjusteAbierto] = useState(false);
  const { data: molido, isLoading, error } = useInventarioMolido();

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Consulta y gestiona el stock de material molido.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setDialogAjusteAbierto(true)}>
            Ajuste manual
          </Button>
          <Button className="bg-gray-800 hover:bg-gray-700" onClick={() => setDialogEntradaAbierto(true)}>
            Entrada de proveedor
          </Button>
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground py-4">Cargando molido...</p>}
      {error && <p className="text-red-500">Error al cargar: {error.message}</p>}
      {!isLoading && !error && (
        <TablaInventarioMolido molido={molido ?? []} />
      )}

      <DialogEntradaProveedor
        open={dialogEntradaAbierto}
        tipoInventario="MOLIDO"
        onClose={() => setDialogEntradaAbierto(false)}
      />

      <DialogAjusteManual
        open={dialogAjusteAbierto}
        tipoInventario="MOLIDO"
        onClose={() => setDialogAjusteAbierto(false)}
      />
    </div>
  );
}