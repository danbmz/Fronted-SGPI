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


    return (
        <div className="p-6 h-screen">
            <div className="flex justify-end mb-4">
                <Button className="bg-gray-800 rounded-xl hover:bg-gray-700 cursor-pointer" onClick={() => setDialogCrearAbierto(true)}>Agregar Usuario</Button>
            </div>
            {loading && <p>Cambiar por skeleton...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && <TablaUsuarios usuarios={usuarios} />}

            <DialogCrearUsuario
                open={dialogCrearAbierto}
                onClose={() => setDialogCrearAbierto(false)}
            />
        </div>
    )
}

export default Usuarios;