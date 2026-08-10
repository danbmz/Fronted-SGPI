import { useState } from "react";
import type { Usuario } from "../../usuarios/schemas/usuario.schema";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import DialogEditarUsuario from "./DialogEditarUsuario";
import DialogCambiarPassword from "./DialogCambiarPassword";
import DialogToggleEstadoUsuario from "./DialogToggleEstadoUsuario";

interface Props {
  usuarios: Usuario[];
}

export const roleColor: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  SUPERVISOR: "bg-blue-100 text-blue-700",
  MOLINO: "bg-orange-100 text-orange-700",
  PIGMENTOS: "bg-pink-100 text-pink-700",
};

type TipoDialog = "editar" | "password" | "toggle" | null;

export default function TablaUsuarios({ usuarios }: Props) {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [dialogAbierto, setDialogAbierto] = useState<TipoDialog>(null);

  const abrirDialog = (tipo: TipoDialog, usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setDialogAbierto(tipo);
  };

  const cerrarDialog = () => {
    setUsuarioSeleccionado(null);
    setDialogAbierto(null);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.map((usuario) => (
            <TableRow key={usuario.id}>
              <TableCell className="font-medium">{usuario.nombre}</TableCell>
              <TableCell className="font-mono text-sm">{usuario.usuario}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${roleColor[usuario.role]}`}>
                  {usuario.role}
                </span>
              </TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  usuario.activo
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {usuario.activo ? "Activo" : "Inactivo"}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => abrirDialog("editar", usuario)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => abrirDialog("password", usuario)}>
                      Cambiar contraseña
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {usuario.activo ? (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => abrirDialog("toggle", usuario)}
                      >
                        Desactivar
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        className="text-green-600 hover:text-green-600! hover:bg-green-100!"
                        onClick={() => abrirDialog("toggle", usuario)}
                      >
                        Reactivar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {usuarios.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No hay usuarios registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <DialogEditarUsuario
        open={dialogAbierto === "editar"}
        usuario={usuarioSeleccionado}
        onClose={cerrarDialog}
      />

      <DialogCambiarPassword
        open={dialogAbierto === "password"}
        usuario={usuarioSeleccionado}
        onClose={cerrarDialog}
      />

      <DialogToggleEstadoUsuario
        open={dialogAbierto === "toggle"}
        usuario={usuarioSeleccionado}
        onClose={cerrarDialog}
      />
    </>
  );
}