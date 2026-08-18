import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useAvanceTurno } from "../../hooks/useAvanceTurno";
import { useTiemposParo } from "../../hooks/useTiempoParo";
import { useSolicitudesMaterial } from "../../hooks/useSolicitudMaterial";
import { useIncidencias } from "../../hooks/useIncidencia";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";
import FormularioAvanceTurno from "../../components/supervisor/FormularioAvanceTurno";
import DialogCrearTiempoParo from "../../components/supervisor/DialogCrearParo";
import DialogCrearSolicitudMaterial from "../../components/supervisor/DialogCrearSolicitudMaterial";
import DialogCrearIncidencia from "../../components/supervisor/DialogCrearIncidencia";
import { useAuth } from "@/features/auth/hooks/useAuth";


export default function AvanceTurnoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const { data: avance, isLoading, error } = useAvanceTurno(id);
  const { data: tiemposParo } = useTiemposParo(id);
  const { data: solicitudes } = useSolicitudesMaterial(id);
  const { data: incidencias } = useIncidencias({avanceTurnoId: id});

  const { role } = useAuth();
  const esSoloLectura = role === "ADMIN"; // el supervisor conserva control total

  const navigate = useNavigate();
  const [dialogTiempoParoAbierto, setDialogTiempoParoAbierto] = useState(false);
  const [dialogSolicitudAbierto, setDialogSolicitudAbierto] = useState(false);
  const [dialogIncidenciaAbierto, setDialogIncidenciaAbierto] = useState(false);

  if (isLoading) return <div className="p-6">Cargando avance...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error.message}</div>;
  if (!avance) return <div className="p-6">Avance no encontrado.</div>;

  return (
    <div className="flex flex-col gap-4 p-6">
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} className="mr-2" />
        Volver
      </Button>

      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">{avance.ordenFolio}</h1>
        <p className="text-sm text-muted-foreground">
          Turno: {avance.turno} — Fecha: {avance.fecha}
        </p>

      </div>
        {avance && (
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground border-b pb-3">
            <span>Producto: <strong className="text-foreground">{avance.ordenProductoNombre}</strong></span>
            <span>Material: <strong className="text-foreground">{avance.ordenTipoMaterial}</strong></span>
            <span>Color: <strong className="text-foreground">{avance.ordenPigmentoColor}</strong></span>
            <span>Máquina: <strong className="text-foreground">{avance.ordenMaquinaNombre}</strong></span>
            <span>Meta: <strong className="text-foreground">{avance.ordenPiezasProducidas} / {avance.ordenTotalPiezas} piezas</strong></span>
          </div>
        )}

      <FormularioAvanceTurno key={avance.id} avance={avance} />

      <Accordion type="multiple" className="mt-4">
        <AccordionItem value="tiempos-paro">
          <AccordionTrigger>
            Tiempos de paro
            {tiemposParo && tiemposParo.length > 0 && (
              <Badge className="ml-2">{tiemposParo.length}</Badge>
            )}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            {(tiemposParo ?? []).map((tp) => (
              <div key={tp.id} className="flex justify-between text-sm border-b py-2">
                <span>{tp.motivoParoNombre}</span>
                <span className="text-muted-foreground">{tp.minutos} min</span>
              </div>
            ))}
            {(!tiemposParo || tiemposParo.length === 0) && (
              <p className="text-sm text-muted-foreground py-2">Sin tiempos de paro registrados.</p>
            )}
            <Button size="sm" variant="outline" className="w-fit" disabled={esSoloLectura} onClick={() => setDialogTiempoParoAbierto(true)}>
              <Plus size={14} className="mr-1" />
              Agregar tiempo de paro
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="solicitudes-material">
          <AccordionTrigger>
            Solicitudes de material
            {solicitudes && solicitudes.length > 0 && (
              <Badge className="ml-2">{solicitudes.length}</Badge>
            )}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            {(solicitudes ?? []).map((s) => (
              <div key={s.id} className="flex justify-between text-sm border-b py-2">
                <span>{s.tipoMaterial} — {s.kgSolicitados} kg</span>
                <Badge variant={s.confirmado ? "default" : "secondary"}>
                  {s.confirmado ? "Confirmado" : "Pendiente"}
                </Badge>
              </div>
            ))}
            {(!solicitudes || solicitudes.length === 0) && (
              <p className="text-sm text-muted-foreground py-2">Sin solicitudes registradas.</p>
            )}
            <Button size="sm" variant="outline" className="w-fit"  disabled={esSoloLectura}  onClick={() => setDialogSolicitudAbierto(true)}>
              <Plus size={14} className="mr-1" />
              Solicitar material
            </Button>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="incidencias">
          <AccordionTrigger>
            Material mal pigmentado
            {incidencias && incidencias.length > 0 && (
              <Badge className="ml-2">{incidencias.length}</Badge>
            )}
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-2">
            {(incidencias ?? []).map((inc) => (
              <div key={inc.id} className="flex justify-between items-center text-sm border-b py-2">
                <span>{inc.piezasAfectadas} piezas — Destino: {inc.destino}</span>
                <div className="flex gap-2">
                  {inc.destino === "MOLINO" && (
                    <Badge variant={inc.confirmadoMolino ? "default" : "secondary"}>
                      {inc.confirmadoMolino === null ? "Sin confirmar" : inc.confirmadoMolino ? "Confirmado" : "Con diferencia"}
                    </Badge>
                  )}
                  <Badge variant={inc.resuelto ? "default" : "secondary"}>
                    {inc.resuelto ? "Resuelto" : "Pendiente"}
                  </Badge>
                </div>
              </div>
            ))}
            {(!incidencias || incidencias.length === 0) && (
              <p className="text-sm text-muted-foreground py-2">Sin incidencias reportadas.</p>
            )}
            <Button size="sm" variant="outline" className="w-fit"  disabled={esSoloLectura}  onClick={() => setDialogIncidenciaAbierto(true)}>
              <Plus size={14} className="mr-1" />
              Reportar incidencia
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <DialogCrearTiempoParo
        open={dialogTiempoParoAbierto}
        avanceTurnoId={avance.id}
        onClose={() => setDialogTiempoParoAbierto(false)}
      />

      <DialogCrearSolicitudMaterial
        open={dialogSolicitudAbierto}
        avanceTurnoId={avance.id}
        onClose={() => setDialogSolicitudAbierto(false)}
      />

      <DialogCrearIncidencia
        open={dialogIncidenciaAbierto}
        avanceTurnoId={avance.id}
        onClose={() => setDialogIncidenciaAbierto(false)}
      />
    </div>
  );
}