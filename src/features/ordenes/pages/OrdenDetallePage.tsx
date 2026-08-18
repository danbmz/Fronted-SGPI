import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useOrden, useCambiarEstadoOrden } from "../hooks/useOrdenes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, RotateCcw, Ban, CheckCircle2, Repeat } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";
import DialogCancelarOrden from "../components/DialogCancelarOrden";
import DialogConfirmarMaterialOrden from "@/features/pigmentos/components/pigmentos/DialogConfirmarMaterialOrden";
import DialogSustituirMaterialPigmentado from "@/features/pigmentos/components/pigmentos/DialogSustituirMaterialPigmentado";

const estadoColor: Record<string, string> = {
  BORRADOR: "bg-gray-100 text-gray-700",
  ACTIVA: "bg-blue-100 text-blue-700",
  EN_PROGRESO: "bg-amber-100 text-amber-700",
  PAUSADA: "bg-orange-100 text-orange-700",
  COMPLETADA: "bg-green-100 text-green-700",
  CANCELADA: "bg-red-100 text-red-700",
};

export default function OrdenDetallePage() {
  const { role } = useAuth();
  const esAdminOProgramador = role === "ADMIN" || role === "PROGRAMADOR";
  const esPigmentos = role === "PIGMENTOS";

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: orden, isLoading, error } = useOrden(id);

  const [dialogCancelarAbierto, setDialogCancelarAbierto] = useState(false);
  const [dialogConfirmarMaterialAbierto, setDialogConfirmarMaterialAbierto] = useState(false);
  const [dialogSustituirAbierto, setDialogSustituirAbierto] = useState(false);

  const cambiarEstadoMutation = useCambiarEstadoOrden();

  if (isLoading) return <div className="p-6">Cargando orden...</div>;
  if (error) return <div className="p-6 text-red-500">Error al cargar la orden: {error.message}</div>;
  if (!orden) return <div className="p-6">Orden no encontrada.</div>;

  const handleCambiarEstado = async (accion: "activar" | "pausar" | "reanudar") => {
    try {
      await cambiarEstadoMutation.mutateAsync({ id: orden.id, accion, data: {} });
      toast.success("Estado actualizado correctamente.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cambiar el estado.");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} className="mr-2" />
        Volver
      </Button>

      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{orden.folio}</h1>
            <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${estadoColor[orden.estado]}`}>
              {orden.estado}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Pedido: {orden.pedidoNumero} — Cliente: {orden.cliente}
          </p>
          <p className="text-sm text-muted-foreground">
            Producto: {orden.productoNombre} — Color: {orden.pigmentoColor}
          </p>
          <p className="text-sm text-muted-foreground">Máquina: {orden.maquinaNombre}</p>
        </div>

        {esAdminOProgramador && (
          <div className="flex gap-2">
            {orden.estado === "BORRADOR" && (
              <Button onClick={() => handleCambiarEstado("activar")} disabled={cambiarEstadoMutation.isPending}>
                <Play size={16} className="mr-2" />
                Activar
              </Button>
            )}
            {(orden.estado === "ACTIVA" || orden.estado === "EN_PROGRESO") && (
              <Button variant="outline" onClick={() => handleCambiarEstado("pausar")} disabled={cambiarEstadoMutation.isPending}>
                <Pause size={16} className="mr-2" />
                Pausar
              </Button>
            )}
            {orden.estado === "PAUSADA" && (
              <Button onClick={() => handleCambiarEstado("reanudar")} disabled={cambiarEstadoMutation.isPending}>
                <RotateCcw size={16} className="mr-2" />
                Reanudar
              </Button>
            )}
            {(orden.estado === "BORRADOR" || orden.estado === "ACTIVA") && (
              <Button variant="destructive" onClick={() => setDialogCancelarAbierto(true)}>
                <Ban size={16} className="mr-2" />
                Cancelar
              </Button>
            )}
          </div>
        )}
      </div>

      {orden.estado === "ACTIVA" && (
        <div className="flex items-center justify-between border rounded-md p-4 bg-muted/30">
          <div>
            <p className="text-sm font-medium">Material de la orden</p>
            <p className="text-xs text-muted-foreground">
              {orden.materialSiguienteConfirmado
                ? `Confirmado el ${new Date(orden.materialConfirmadoEn!).toLocaleString()}`
                : "Pendiente de confirmación por Pigmentos"}
            </p>
          </div>

          {/* Exclusivo de Pigmentos — ni Admin ni Programador lo accionan aquí */}
          {esPigmentos && !orden.materialSiguienteConfirmado && (
            <Button size="sm" variant="outline" onClick={() => setDialogConfirmarMaterialAbierto(true)}>
              <CheckCircle2 size={16} className="mr-2" />
              Confirmar material
            </Button>
          )}
        </div>
      )}

      {esPigmentos && orden.estado === "ACTIVA" && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setDialogSustituirAbierto(true)}>
            <Repeat size={16} className="mr-2" />
            Sustituir material pigmentado
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 border rounded-md p-4">
        <div>
          <p className="text-xs text-muted-foreground">Total piezas</p>
          <p className="font-medium">{orden.totalPiezas}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Tipo de material</p>
          <p className="font-medium">{orden.tipoMaterial}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Piezas por hora</p>
          <p className="font-medium">{orden.piezasPorHora}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Tiempo estimado</p>
          <p className="font-medium">{orden.tiempoEstimadoHrs.toFixed(1)} hrs</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Materia prima total</p>
          <p className="font-medium">{orden.materiaPrimaTotalKg.toFixed(2)} kg</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Pigmento requerido</p>
          <p className="font-medium">{orden.pigmentoRequeridoKg.toFixed(3)} kg</p>
        </div>
        {orden.tipoMaterial !== "VIRGEN" && (
          <>
            <div>
              <p className="text-xs text-muted-foreground">Virgen ({orden.porcentajeVirgen}%)</p>
              <p className="font-medium">{orden.materiaPrimaVirgenKg.toFixed(2)} kg</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Molido ({orden.porcentajeMolido}%)</p>
              <p className="font-medium">{orden.materialMolidoKg.toFixed(2)} kg</p>
            </div>
          </>
        )}
      </div>

      {orden.observaciones && (
        <div className="border rounded-md p-4">
          <p className="text-xs text-muted-foreground mb-1">Observaciones</p>
          <p className="text-sm">{orden.observaciones}</p>
        </div>
      )}

      {esAdminOProgramador && (
        <DialogCancelarOrden
          open={dialogCancelarAbierto}
          orden={orden}
          onClose={() => setDialogCancelarAbierto(false)}
        />
      )}

      {esPigmentos && (
        <>
          <DialogConfirmarMaterialOrden
            open={dialogConfirmarMaterialAbierto}
            orden={orden}
            onClose={() => setDialogConfirmarMaterialAbierto(false)}
          />
          <DialogSustituirMaterialPigmentado
            open={dialogSustituirAbierto}
            orden={orden}
            onClose={() => setDialogSustituirAbierto(false)}
          />
        </>
      )}
    </div>
  );
}