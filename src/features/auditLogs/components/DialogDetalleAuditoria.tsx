import type { AuditLog } from "../schemas/auditoria.schema";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  log: AuditLog | null;
  onClose: () => void;
}

export default function DialogDetalleAuditoria({ open, log, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle del registro</DialogTitle>
        </DialogHeader>
        {log && (
          <div className="flex flex-col gap-2 text-sm">
            <p><span className="font-medium">Fecha:</span> {new Date(log.createdAt).toLocaleString()}</p>
            <p><span className="font-medium">Usuario:</span> {log.usuarioNombre} ({log.usuarioLogin})</p>
            <p><span className="font-medium">Módulo:</span> {log.modulo}</p>
            <p><span className="font-medium">Acción:</span> {log.accion}</p>
            {log.entidad && (
              <p><span className="font-medium">Entidad:</span> {log.entidad} #{log.entidadId}</p>
            )}
            <p className="whitespace-pre-wrap"><span className="font-medium">Detalle:</span> {log.detalle}</p>
            {log.ip && (
              <p><span className="font-medium">IP:</span> {log.ip}</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}