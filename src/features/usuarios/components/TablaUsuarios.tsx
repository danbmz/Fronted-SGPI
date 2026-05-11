import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontalIcon } from "lucide-react"
import DialogEditarUsuario from "./DialogEditarUsuario"
import DialogDesactivarUsuario from "./DialogDesactivarUsuario"
import DialogReactivarUsuario from "./DialogReactivarUsuario"
import { Badge } from "@/components/ui/badge"

import type { User } from "@/types/usuario"
import { useState } from "react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { formatFecha } from "@/utils/formatFecha"

interface Props {
  usuarios: User[]
  onUsuarioEditado: (usuario: User) => void
  onUsuarioDesactivado: (usuario: User) => void
  onUsuarioReactivado: (usuario: User) => void
}

const colorRol: Record<string, string> = {
  supervisor: "bg-red-100 text-red-700",
  admin: "bg-blue-100 text-blue-700",
}

const colorEstado: Record<string, string> = {
  Activo: "bg-green-100 text-green-700",
  Inactivo: "bg-red-100 text-red-700",
}


function TablaUsuarios({ usuarios, onUsuarioEditado, onUsuarioDesactivado, onUsuarioReactivado }: Props) {
    const { user } = useAuth()

    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<User | null>(null)
    const [dialogAbierto, setDialogAbierto] = useState<"editar" | "desactivar" | "reactivar" | null>(null)
    
    const abrirDialog = (tipo: "editar" | "desactivar" | "reactivar", usuario: User) => {
        setUsuarioSeleccionado(usuario)
        setDialogAbierto(tipo)
    }

    const cerrarDialog = () => {
        setUsuarioSeleccionado(null)
        setDialogAbierto(null)
    }


  return (
    <div>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="font-bold">Nombre</TableHead>
                <TableHead className="font-bold">Usuario</TableHead>
                <TableHead className="font-bold">Rol</TableHead>
                <TableHead className="font-bold">Estado</TableHead>
                <TableHead className="font-bold">Registro</TableHead>
                <TableHead className="font-bold">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {/* Aquí se mapearán los usuarios */}
                {usuarios.map((usuario) => {
                    const esMiPerfil = usuario.id === user?.id

                return (
                    <TableRow key={usuario.id}>
                        <TableCell>
                            {usuario.nombre}
                            {esMiPerfil && (
                                <span className="ml-2 text-xs text-muted-foreground">(tú)</span>
                            )}
                        </TableCell>
                        <TableCell>{usuario.usuario}</TableCell>
                        <TableCell>
                            <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${colorRol[usuario.role] ?? ""}`}>
                                {usuario.role}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${colorEstado[usuario.activo ? 'Activo' : 'Inactivo'] ?? ""}`}>
                                {usuario.activo ? 'Activo' : 'Inactivo'}
                            </Badge>
                        </TableCell>
                        <TableCell>{usuario.createdAt !== undefined ? formatFecha(usuario.createdAt) : "Fecha no obtenida"}</TableCell>
                        <TableCell>{usuario.activo}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="size-8">
                                        <MoreHorizontalIcon />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => abrirDialog("editar", usuario)}>
                                        Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                        {usuario.activo ? (
                                            <DropdownMenuItem
                                                variant="destructive"
                                                onClick={() => abrirDialog("desactivar", usuario)}
                                            >
                                            Desactivar
                                            </DropdownMenuItem>
                                        ) : (
                                            <DropdownMenuItem
                                            className="text-green-600 hover:bg-green-200 hover:text-green-600"
                                            onClick={() => abrirDialog("reactivar", usuario)}
                                            >
                                            Reactivar
                                            </DropdownMenuItem>
                                        )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                )
            })}
            </TableBody>
        </Table>

        {/* Dialogs fuera de la tabla */}
        <DialogEditarUsuario
            open={dialogAbierto === "editar"}
            usuario={usuarioSeleccionado}
            onClose={cerrarDialog}
            onSuccess={onUsuarioEditado} // La funcion viene desde el padre Usuarios.tsx
        />

        <DialogDesactivarUsuario
            open={dialogAbierto === "desactivar"}
            usuario={usuarioSeleccionado}
            onClose={cerrarDialog}
            onSuccess={onUsuarioDesactivado}
        />

        <DialogReactivarUsuario
            open={dialogAbierto === "reactivar"}
            usuario={usuarioSeleccionado}
            onClose={cerrarDialog}
            onSuccess={onUsuarioReactivado}
        />

    </div>
  )
}

export default TablaUsuarios