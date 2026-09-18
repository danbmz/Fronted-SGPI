import { useState } from "react";
import { useAuditoria } from "../hooks/useAuditoria";
import { useUsuarios } from "@/features/usuarios/hook/useUsuario";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectNativo from "@/components/ui/selectNativo";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationNext, PaginationPrevious
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { AuditLog } from "../schemas/auditoria.schema";
import DialogDetalleAuditoria from "../components/DialogDetalleAuditoria";

const MODULOS = ["AUTH", "USUARIOS", "INVENTARIO", "ORDENES", "MOLINO", "CATALOGOS", "PIGMENTOS"] as const;

const moduloColor: Record<string, string> = {
  AUTH: "bg-gray-100 text-gray-700",
  USUARIOS: "bg-blue-100 text-blue-700",
  INVENTARIO: "bg-amber-100 text-amber-700",
  ORDENES: "bg-purple-100 text-purple-700",
  MOLINO: "bg-orange-100 text-orange-700",
  CATALOGOS: "bg-teal-100 text-teal-700",
  PIGMENTOS: "bg-pink-100 text-pink-700",
};

export default function AuditoriaPage() {
  const [filtroModulo, setFiltroModulo] = useState<string>("TODOS");
  const [filtroUsuario, setFiltroUsuario] = useState<string>("TODOS");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [pagina, setPagina] = useState(1);
  const [logSeleccionado, setLogSeleccionado] = useState<AuditLog | null>(null);

  const { data: usuarios } = useUsuarios();

  const { data, isLoading, error } = useAuditoria({
    modulo: filtroModulo === "TODOS" ? undefined : filtroModulo,
    usuarioId: filtroUsuario === "TODOS" ? undefined : filtroUsuario,
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
    pagina,
    limite: 50,
  });

  const handleCambiarFiltro = (setter: (v: string) => void) => (val: string) => {
    setter(val);
    setPagina(1);
  };

  return (
    <>
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm text-muted-foreground">
        Historial de acciones realizadas por los usuarios del sistema.
      </p>

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col gap-1 w-48">
          <Label className="text-xs">Módulo</Label>
          <SelectNativo
            value={filtroModulo}
            onValueChange={handleCambiarFiltro(setFiltroModulo)}
            opciones={[
              { value: "TODOS", label: "Todos los módulos" },
              ...MODULOS.map((m) => ({ value: m, label: m })),
            ]}
          />
        </div>

        <div className="flex flex-col gap-1 w-48">
          <Label className="text-xs">Usuario</Label>
          <SelectNativo
            value={filtroUsuario}
            onValueChange={handleCambiarFiltro(setFiltroUsuario)}
            opciones={[
              { value: "TODOS", label: "Todos los usuarios" },
              ...(usuarios ?? []).map((u) => ({ value: u.id, label: u.nombre })),
            ]}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-xs">Desde</Label>
          <Input
            type="date"
            value={fechaDesde}
            onChange={(e) => {
              setFechaDesde(e.target.value);
              setPagina(1);
            }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label className="text-xs">Hasta</Label>
          <Input
            type="date"
            value={fechaHasta}
            onChange={(e) => {
              setFechaHasta(e.target.value);
              setPagina(1);
            }}
          />
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground py-4">Cargando historial...</p>}
      {error && <p className="text-red-500">Error al cargar: {error.message}</p>}

      {!isLoading && !error && data && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Módulo</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead>Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.usuarioNombre}
                    <span className="text-xs text-muted-foreground ml-1">({log.usuarioLogin})</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${moduloColor[log.modulo]}`}>
                      {log.modulo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{log.accion}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.entidad ? `${log.entidad} #${log.entidadId}` : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs">
                    <div className="flex items-center gap-2">
                        <span className="truncate">{log.detalle ?? "—"}</span>
                        {log.detalle && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setLogSeleccionado(log)}>
                            <Eye size={14} />
                        </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {data.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No hay registros que coincidan con los filtros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {data.paginacion.totalPaginas > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    className={pagina === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm text-muted-foreground px-2">
                    Página {data.paginacion.pagina} de {data.paginacion.totalPaginas} — {data.paginacion.total} registros
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPagina((p) => Math.min(data.paginacion.totalPaginas, p + 1))}
                    className={pagina === data.paginacion.totalPaginas ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>

    <DialogDetalleAuditoria
        open={logSeleccionado !== null}
        log={logSeleccionado}
        onClose={() => setLogSeleccionado(null)}
    />
    </>
  );
}