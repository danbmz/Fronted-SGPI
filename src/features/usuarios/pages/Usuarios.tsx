import TablaUsuarios from "../components/TablaUsuarios";
import DialogCrearUsuario from "../components/DialogCrearUsuario";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { getUsuarios } from "../usuariosServices";
import type { User } from "@/types/usuario";
import { UserPlus } from "lucide-react";

function Usuarios () {
    const [dialogCrearAbierto, setDialogCrearAbierto] = useState(false)
    const [usuarios, setUsuarios] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const data = await getUsuarios()
                setUsuarios(data)
            } catch (err) {
                setError("Error al cargar usuarios")
            } finally {
                setLoading(false)
            }
        }

        fetchUsuarios()
    }, [])

    // Agregar Nuevo Usuario sin recargar, cuando se crea
    const handleUsuarioCreado = (nuevoUsuario: User) => {
        setUsuarios(prev => [...prev, nuevoUsuario]) // agrega al estado sin recargar, aunque podemos vovler a llamar al backend para traer la lista completa sin errores
    }

    // Mostrar los cambios cuando se edita la informacion de un usuario existente
    const handleUsuarioEditado = (usuarioEditado: User) => {
        setUsuarios(prev =>
            prev.map(u => u.id === usuarioEditado.id ? usuarioEditado : u)
        )
    }

    const handleUsuarioDesactivado = (usuarioDesactivado: User) => {
        setUsuarios(prev =>
            prev.map(u => u.id === usuarioDesactivado.id ? { ...u, activo: false } : u)
        )
    }

    const handleUsuarioReactivado = (usuarioReactivado: User) => {
        setUsuarios(prev =>
            prev.map(u => u.id === usuarioReactivado.id ? { ...u, activo: true } : u)
        )
    }


    return (
        <div className="flex flex-col gap-4 h-screen p-6">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-muted-foreground">
                        Gestiona los usuarios del sistema.
                    </p>
                </div>
                <Button className="bg-gray-800 hover:bg-gray-700 cursor-pointer" onClick={() => setDialogCrearAbierto(true)}>
                    <UserPlus size={16} className="mr-2" />
                    Agregar Usuario
                </Button>
            </div>
            {loading && <p>Cambiar por skeleton...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && 
                <TablaUsuarios 
                    usuarios={usuarios} 
                    onUsuarioEditado={handleUsuarioEditado} 
                    onUsuarioDesactivado={handleUsuarioDesactivado} 
                    onUsuarioReactivado={handleUsuarioReactivado}
                />
            }

            <DialogCrearUsuario
                open={dialogCrearAbierto}
                onClose={() => setDialogCrearAbierto(false)}
                onSucces={handleUsuarioCreado} // ← pasas el callback
            />
        </div>
    )
}

export default Usuarios;