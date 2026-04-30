import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// TODO: Agregar validación de formulario, manejo de errores y feedback al usuario
import { useState } from "react";
import { AuthError } from "../api";
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'



function LoginPage() {
    const { login, role } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = e.currentTarget
    const credentials = {
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      password: (form.elements.namedItem('password') as HTMLInputElement).value,
    }

    try {
      await login(credentials)               // useAuth llama al servicio

      if (role === 'admin') navigate('/dashboard/admin')
      if (role === 'supervisor') navigate('/dashboard/supervisor')

    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message)                // error controlado de la API
      } else {
        setError('Error de conexión')        // error de red u otro
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
        <div className="flex items-center justify-center h-screen bg-linear-to-br from-blue-950 via-slate-950 to-slate-800">
            <Card className="w-sm p-10 rounded-2xl ">
                <CardHeader className="text-center p-0">
                    <div className="w-15 h-15 rounded-lg text-3xl mx-auto mb-4 flex items-center justify-center bg-slate-800">
                        🏭
                    </div>
                    <CardTitle className=" text-xl font-extrabold text-slate-700">Plásticos Juquila</CardTitle>
                    <CardDescription className="text-xs font-medium">
                        Sistema de Gestión de Producción e Inventario
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">USUARIO</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    className="rounded-lg bg-slate-200"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">CONTRASEÑA</Label>
                                <Input id="password" type="password" required className="rounded-lg bg-slate-200"/>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-col gap-2 p-0">
                    <Button type="submit" disabled={loading} className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer">
                    {loading ? 'Entrando...' : 'Iniciar sesión'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </>
  )
}

export default LoginPage