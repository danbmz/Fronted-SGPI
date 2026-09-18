import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Props {
  pedidos: {
    id: string;
    numeroPedido: string;
    cliente: string;
    fechaEntrega: string | null;
    ordenesCompletadas: number;
    totalOrdenes: number;
  }[];
}

function formatearFecha(fechaISO: string): string {
  const [año, mes, dia] = fechaISO.split("-").map(Number);
  return new Date(año, mes - 1, dia).toLocaleDateString("es-MX");
}

export default function ListaPedidosEnProgreso({ pedidos }: Props) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-3">Pedidos en progreso</h3>
      <div className="flex flex-col gap-2">
        {pedidos.map((p) => {
          const progreso = p.totalOrdenes > 0 ? (p.ordenesCompletadas / p.totalOrdenes) * 100 : 0;
          return (
            <div
              key={p.id}
              className="flex items-center justify-between border rounded-md p-3 cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`../pedidos/${p.id}`)}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-sm">{p.numeroPedido}</span>
                  <span className="text-xs text-muted-foreground">{p.cliente}</span>
                </div>
                <div className="w-40 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${progreso}%` }} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {p.ordenesCompletadas}/{p.totalOrdenes} órdenes
                </p>
                {p.fechaEntrega && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {formatearFecha(p.fechaEntrega)}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
        {pedidos.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No hay pedidos en progreso.</p>
        )}
      </div>
    </div>
  );
}