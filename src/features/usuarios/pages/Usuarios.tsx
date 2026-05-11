import TablaUsuarios from "../components/TablaUsuarios";
import DialogCrearUsuario from "../components/DialogCrearUsuario";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { getUsuarios } from "../usuariosServices";
import type { User } from "@/types/usuario";

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
        <div className="p-6 h-screen">
            <div className="flex justify-end mb-4">
                <Button className="bg-gray-800 rounded-xl hover:bg-gray-700 cursor-pointer" onClick={() => setDialogCrearAbierto(true)}>Agregar Usuario</Button>
            </div>
            {loading && <p>Cambiar por skeleton...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && <TablaUsuarios usuarios={usuarios} onUsuarioEditado={handleUsuarioEditado} onUsuarioDesactivado={handleUsuarioDesactivado} onUsuarioReactivado={handleUsuarioReactivado}/>}

            <DialogCrearUsuario
                open={dialogCrearAbierto}
                onClose={() => setDialogCrearAbierto(false)}
                onSucces={handleUsuarioCreado} // ← pasas el callback
            />
        </div>
    )
}

export default Usuarios;