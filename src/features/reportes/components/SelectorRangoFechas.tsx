import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  onCambiar: (fechaDesde: string, fechaHasta: string) => void;
}

type Atajo = "24h" | "7d" | "30d" | "personalizado";

function calcularRango(atajo: Atajo): { desde: string; hasta: string } {
  const hoy = new Date();
  const hasta = hoy.toISOString().substring(0, 10);

  const dias = atajo === "24h" ? 1 : atajo === "7d" ? 7 : atajo === "30d" ? 30 : 1;
  const desdeDate = new Date(hoy);
  desdeDate.setDate(desdeDate.getDate() - (dias - 1));
  const desde = desdeDate.toISOString().substring(0, 10);

  return { desde, hasta };
}

export default function SelectorRangoFechas({ onCambiar }: Props) {
  const [atajoActivo, setAtajoActivo] = useState<Atajo>("7d");
  const [fechaDesdePersonalizada, setFechaDesdePersonalizada] = useState("");
  const [fechaHastaPersonalizada, setFechaHastaPersonalizada] = useState("");

  const handleAtajo = (atajo: Atajo) => {
    setAtajoActivo(atajo);
    if (atajo !== "personalizado") {
      const { desde, hasta } = calcularRango(atajo);
      onCambiar(desde, hasta);
    }
  };

  const handleAplicarPersonalizado = () => {
    if (fechaDesdePersonalizada && fechaHastaPersonalizada) {
      onCambiar(fechaDesdePersonalizada, fechaHastaPersonalizada);
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex gap-1">
        {(["24h", "7d", "30d"] as const).map((atajo) => (
          <Button
            key={atajo}
            type="button"
            size="sm"
            variant={atajoActivo === atajo ? "default" : "outline"}
            onClick={() => handleAtajo(atajo)}
          >
            {atajo === "24h" ? "Últimas 24h" : atajo === "7d" ? "7 días" : "30 días"}
          </Button>
        ))}
        <Button
          type="button"
          size="sm"
          variant={atajoActivo === "personalizado" ? "default" : "outline"}
          onClick={() => setAtajoActivo("personalizado")}
        >
          Personalizado
        </Button>
      </div>

      {atajoActivo === "personalizado" && (
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-1">
            <Label className="text-xs">Desde</Label>
            <Input
              type="date"
              value={fechaDesdePersonalizada}
              onChange={(e) => setFechaDesdePersonalizada(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs">Hasta</Label>
            <Input
              type="date"
              value={fechaHastaPersonalizada}
              onChange={(e) => setFechaHastaPersonalizada(e.target.value)}
            />
          </div>
          <Button type="button" size="sm" onClick={handleAplicarPersonalizado}>
            Aplicar
          </Button>
        </div>
      )}
    </div>
  );
}