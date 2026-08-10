import { useState } from "react";
import { useInventarioPigmento } from "../hook/useInventario";
import TablaInventarioPigmentos from "../components/pigmentos/TablaInventarioPigmentos";
import DialogEntradaProveedor from "../components/DialogEntradaProveedor";
import DialogAjusteManual from "../components/DialogAjusteManual";
import { Button } from "@/components/ui/button";

export default function PigmentosInventario() {
  const [dialogEntradaAbierto, setDialogEntradaAbierto] = useState(false);
  const [dialogAjusteAbierto, setDialogAjusteAbierto] = useState(false);
  const { data: pigmentos, isLoading, error } = useInventarioPigmento();

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Consulta y gestiona el stock de pigmentos.
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

      {isLoading && <p className="text-muted-foreground py-4">Cargando pigmentos...</p>}
      {error && <p className="text-red-500">Error al cargar: {error.message}</p>}
      {!isLoading && !error && (
        <TablaInventarioPigmentos pigmentos={pigmentos ?? []} />
      )}

      <DialogEntradaProveedor
        open={dialogEntradaAbierto}
        tipoInventario="PIGMENTO"
        onClose={() => setDialogEntradaAbierto(false)}
      />

      <DialogAjusteManual
        open={dialogAjusteAbierto}
        tipoInventario="PIGMENTO"
        onClose={() => setDialogAjusteAbierto(false)}
      />
    </div>
  );
}