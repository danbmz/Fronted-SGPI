import { useDashboard } from "../../hooks/useDashboard";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Clock, Package, Zap, Cog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import GraficaProduccionPorDia from "../../components/admin/GraficaProduccionPorDia";
import GraficaOrdenesPorEstado from "../../components/admin/GraficaOrdenesPorEstado";
import GraficaDefectosFrecuentes from "../../components/admin/GraficaDefectosFrecuentes";
import GraficaTiemposParo from "../../components/admin/GraficaTiemposParo";
import TablaDesempenoOperadores from "../../components/admin/TablaDesempenoOperadores";
import ListaPedidosEnProgreso from "../../components/admin/ListaPedidosEnProgreso";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();
  const navigate = useNavigate();

  if (isLoading) return <div className="p-6">Cargando dashboard...</div>;
  if (error) return <div className="p-6 text-red-500">Error al cargar: {error.message}</div>;
  if (!data) return null;

  const { alertas, kpis } = data;
  const hayAlertas =
    alertas.pedidosAtrasados.length > 0 ||
    alertas.pedidosUrgentes.length > 0 ||
    alertas.stockBajo.length > 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <p className="text-sm text-muted-foreground">
        Panorama general de la operación — actualizado en tiempo real.
      </p>

      {/* ---------- KPIs ---------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="border rounded-lg p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap size={14} />
            <span className="text-xs">Piezas hoy</span>
          </div>
          <span className="text-2xl font-bold">{kpis.piezasProducidasHoy}</span>
          <span className="text-xs text-red-600">{kpis.piezasDefectuosasHoy} defectuosas</span>
        </div>

        <div className="border rounded-lg p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock size={14} />
            <span className="text-xs">Merma / Plasta hoy</span>
          </div>
          <span className="text-2xl font-bold">{kpis.kgMermaHoy.toFixed(1)} kg</span>
          <span className="text-xs text-muted-foreground">{kpis.kgPlastaHoy.toFixed(1)} kg plasta</span>
        </div>

        <div className="border rounded-lg p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package size={14} />
            <span className="text-xs">Órdenes en progreso</span>
          </div>
          <span className="text-2xl font-bold">{kpis.ordenesEnProgreso}</span>
        </div>

        <div className="border rounded-lg p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Cog size={14} />
            <span className="text-xs">Máquinas en uso</span>
          </div>
          <span className="text-2xl font-bold">
            {kpis.maquinasEnUso} <span className="text-base text-muted-foreground">/ {kpis.maquinasTotales}</span>
          </span>
        </div>
      </div>

      {/* ---------- ALERTAS ---------- */}
      {hayAlertas && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-600" />
            Requiere atención
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {alertas.pedidosAtrasados.map((p) => (
              <div
                key={`atrasado-${p.id}`}
                className="border border-red-200 bg-red-50 rounded-lg p-3 cursor-pointer hover:bg-red-100"
                onClick={() => navigate(`../pedidos/${p.id}`)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-medium text-sm">{p.numeroPedido}</span>
                  <Badge variant="destructive" className="text-xs">
                    {Math.abs(p.diasRestantes)} días de retraso
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{p.cliente}</p>
              </div>
            ))}

            {alertas.pedidosUrgentes.map((p) => (
              <div
                key={`urgente-${p.id}`}
                className="border border-amber-200 bg-amber-50 rounded-lg p-3 cursor-pointer hover:bg-amber-100"
                onClick={() => navigate(`../pedidos/${p.id}`)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-medium text-sm">{p.numeroPedido}</span>
                  <Badge className="text-xs bg-amber-100 text-amber-700">
                    Sin iniciar — {p.diasRestantes}d
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{p.cliente}</p>
              </div>
            ))}

            {alertas.stockBajo.map((item) => (
              <div key={`stock-${item.tipo}-${item.id}`} className="border border-orange-200 bg-orange-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{item.nombre}</span>
                  <Badge className="text-xs bg-orange-100 text-orange-700">{item.tipo}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.cantidadActual} / {item.stockMinimo} mín.
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <GraficaProduccionPorDia datos={data.graficas.produccionPorDia} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ListaPedidosEnProgreso pedidos={data.pedidosEnProgreso} />
        <GraficaOrdenesPorEstado datos={data.graficas.ordenesPorEstado} />
        <GraficaTiemposParo
            totalMinutos={data.tiemposParo.totalMinutos}
            porMotivo={data.tiemposParo.porMotivo}
        />
        <GraficaDefectosFrecuentes datos={data.graficas.defectosFrecuentes} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TablaDesempenoOperadores datos={data.desempenoOperadores} />
      </div>
    </div>
  );
}