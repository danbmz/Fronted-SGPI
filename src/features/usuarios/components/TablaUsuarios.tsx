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

import type { User } from "@/types/usuario"
import { useState } from "react"
import { useAuth } from "@/features/auth/hooks/useAuth"

interface Props {
  usuarios: User[]
}


function TablaUsuarios({usuarios }: Props) {
    const { user } = useAuth()

    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<User | null>(null)
    const [dialogAbierto, setDialogAbierto] = useState<"editar" | "desactivar" | null>(null)
    
    const abrirDialog = (tipo: "editar" | "desactivar", usuario: User) => {
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
                        <TableCell>{usuario.role}</TableCell>
                        <TableCell>{usuario.activo ? 'Activo' : 'Inactivo'}</TableCell>
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
                                    <DropdownMenuItem variant="destructive" onClick={() => abrirDialog("desactivar", usuario)}>
                                        Desactivar
                                    </DropdownMenuItem>
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
        />

        <DialogDesactivarUsuario
            open={dialogAbierto === "desactivar"}
            usuario={usuarioSeleccionado}
            onClose={cerrarDialog}
        />

    </div>
  )
}

export default TablaUsuarios