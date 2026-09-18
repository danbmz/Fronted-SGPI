import { useState } from "react";
import { useReportes } from "../hooks/useReportes";
import SelectorRangoFechas from "../components/SelectorRangoFechas";
import GraficaProduccionReporte from "../components/GraficaProduccionReporte";
import TarjetaCumplimientoPedidos from "../components/TarjetaCumplimientoPedidos";
import TarjetaCostoMermaPlasta from "../components/TarjetaCostoMermaPlasta";
import TarjetaConsumoMateriales from "../components/TarjetaConsumoMateriales";
import TarjetaDesempenoOperadoresReporte from "../components/TarjetadesempenoOperadoresReporte";
import TarjetaTiemposParoReporte from "../components/TarjetaTiemposParoReporte";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportarTodoAExcel } from "@/lib/exportarReportesExcel";

const MAX_DIAS_EXPORTACION = 90;

function calcularDiasEnRango(desde: string, hasta: string): number {
  const inicio = new Date(desde);
  const fin = new Date(hasta);
  return Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

function calcularRangoInicial() {
  const hoy = new Date();
  const hasta = hoy.toISOString().substring(0, 10);
  const desdeDate = new Date(hoy);
  desdeDate.setDate(desdeDate.getDate() - 6);
  const desde = desdeDate.toISOString().substring(0, 10);
  return { desde, hasta };
}

export default function ReportesPage() {
  const rangoInicial = calcularRangoInicial();
  const [fechaDesde, setFechaDesde] = useState(rangoInicial.desde);
  const [fechaHasta, setFechaHasta] = useState(rangoInicial.hasta);

  const { data, isLoading, error } = useReportes({ fechaDesde, fechaHasta });

  const handleCambiarRango = (desde: string, hasta: string) => {
    setFechaDesde(desde);
    setFechaHasta(hasta);
  };

  const handleExportarTodo = () => {
    const dias = calcularDiasEnRango(fechaDesde, fechaHasta);
    if (dias > MAX_DIAS_EXPORTACION) {
        toast.error(`El rango para exportar no puede ser mayor a ${MAX_DIAS_EXPORTACION} días. Ajusta las fechas o exporta cada sección por separado.`);
        return;
    }
    if (data) {
        exportarTodoAExcel(data, fechaDesde, fechaHasta);
        toast.success("Reporte exportado correctamente.");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          Reportes históricos de producción, cumplimiento y desempeño.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <SelectorRangoFechas onCambiar={handleCambiarRango} />
        {data && (
            <Button onClick={handleExportarTodo}>
            <Download size={16} className="mr-2" />
            Exportar todo
            </Button>
        )}
      </div>

      {isLoading && <p className="text-muted-foreground py-8 text-center">Cargando reportes...</p>}
      {error && <p className="text-red-500 py-8 text-center">Error al cargar: {error.message}</p>}

      {!isLoading && !error && data && (
        <div className="flex flex-col gap-4">
          <GraficaProduccionReporte
            granularidad={data.produccion.granularidad}
            porPeriodo={data.produccion.porPeriodo}
            totalPiezasBuenas={data.produccion.totalPiezasBuenas}
            totalPiezasDefectuosas={data.produccion.totalPiezasDefectuosas}
            totalKgMerma={data.produccion.totalKgMerma}
            totalKgPlasta={data.produccion.totalKgPlasta}
          />
          <TarjetaCumplimientoPedidos
            totalCompletados={data.cumplimientoPedidos.totalCompletados}
            aTiempo={data.cumplimientoPedidos.aTiempo}
            conRetraso={data.cumplimientoPedidos.conRetraso}
            sinFechaDefinida={data.cumplimientoPedidos.sinFechaDefinida}
            porcentajeCumplimiento={data.cumplimientoPedidos.porcentajeCumplimiento}
            detalle={data.cumplimientoPedidos.detalle}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TarjetaCostoMermaPlasta
                costoTotalGeneral={data.costoMermaPlasta.costoTotalGeneral}
                porMaterial={data.costoMermaPlasta.porMaterial}
            />
            <TarjetaConsumoMateriales
                costoTotalGeneral={data.consumoMateriales.costoTotalGeneral}
                materiaPrima={data.consumoMateriales.materiaPrima}
                pigmento={data.consumoMateriales.pigmento}
            />
            </div>

            <TarjetaDesempenoOperadoresReporte datos={data.desempenoOperadores} />

            <TarjetaTiemposParoReporte
            totalMinutos={data.tiemposParo.totalMinutos}
            porMotivo={data.tiemposParo.porMotivo}
            />
        </div>
        
      )}
    </div>
  );
}