import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventarioMateriaPrima, useInventarioMaterialPigmentado } from "../hook/useInventario";
import TablaInventarioMaterialPigmentado from "../components/materialPigmentado/TablaInventarioMaterialPigmentado";
import TablaInventarioMateriasPrimas from "../components/materiasPrimas/TablaInventarioMateriasPrimas";
import DialogEntradaProveedor from "../components/DialogEntradaProveedor";
import DialogAjusteManual from "../components/DialogAjusteManual";
import { Button } from "@/components/ui/button";

export default function MateriasPrimasInventario() {
  const [tabActiva, setTabActiva] = useState<"materias-primas" | "material-pigmentado">("materias-primas");
  const [dialogEntradaAbierto, setDialogEntradaAbierto] = useState(false);
  const [dialogAjusteAbierto, setDialogAjusteAbierto] = useState(false);

  const { data: materiasPrimas, isLoading: cargandoMateriales, error: errorMateriales } = useInventarioMateriaPrima();
  const { data: materialPigmentado, isLoading: cargandoPigmentado, error: errorPigmentado } = useInventarioMaterialPigmentado();

  // El tipo de inventario que corresponde a los diálogos depende de qué tab está activa.
  // Material pigmentado no tiene "entrada de proveedor" (nunca se compra, solo sale de sobrantes),
  // así que ese botón solo debería mostrarse en la tab de materias primas.
  const tipoInventarioActivo = tabActiva === "materias-primas" ? "MATERIA_PRIMA" : "MATERIAL_PIGMENTADO";

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Consulta y gestiona el stock de materias primas y material pigmentado.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setDialogAjusteAbierto(true)}>
            Ajuste manual
          </Button>
          {tabActiva === "materias-primas" && (
            <Button className="bg-gray-800 hover:bg-gray-700" onClick={() => setDialogEntradaAbierto(true)}>
              Entrada de proveedor
            </Button>
          )}
        </div>
      </div>

      <Tabs value={tabActiva} onValueChange={(val) => setTabActiva(val as typeof tabActiva)}>
        <TabsList>
          <TabsTrigger value="materias-primas">Materias Primas</TabsTrigger>
          <TabsTrigger value="material-pigmentado">Material Pigmentado</TabsTrigger>
        </TabsList>

        <TabsContent value="materias-primas">
          {cargandoMateriales && <p className="text-muted-foreground py-4">Cargando materias primas...</p>}
          {errorMateriales && <p className="text-red-500">Error al cargar: {errorMateriales.message}</p>}
          {!cargandoMateriales && !errorMateriales && (
            <TablaInventarioMateriasPrimas materiasPrimas={materiasPrimas ?? []} />
          )}
        </TabsContent>

        <TabsContent value="material-pigmentado">
          {cargandoPigmentado && <p className="text-muted-foreground py-4">Cargando material pigmentado...</p>}
          {errorPigmentado && <p className="text-red-500">Error al cargar: {errorPigmentado.message}</p>}
          {!cargandoPigmentado && !errorPigmentado && (
            <TablaInventarioMaterialPigmentado materialPigmentado={materialPigmentado ?? []} />
          )}
        </TabsContent>
      </Tabs>

      <DialogEntradaProveedor
        open={dialogEntradaAbierto}
        tipoInventario="MATERIA_PRIMA"
        onClose={() => setDialogEntradaAbierto(false)}
      />

      <DialogAjusteManual
        open={dialogAjusteAbierto}
        tipoInventario={tipoInventarioActivo}
        onClose={() => setDialogAjusteAbierto(false)}
      />
    </div>
  );
}