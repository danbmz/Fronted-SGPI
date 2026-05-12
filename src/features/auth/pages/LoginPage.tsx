import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { useForm }from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface FormValues {
  usuario: string
  password: string
}


function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();


  const onSubmit = async (data: FormValues) => {
    // react-hook-form ya limpió y validó los datos aquí solo falta llamar a login() y manejar la navegación, errores, etc.
    setError(null);
    setLoading(true);

    try {
      await login(data)

      // Leemos el rol directo del localstorage que ya guardo el store con login()
      const user = JSON.parse(localStorage.getItem("auth-storage") || "{}")

      // Redirige según rol
      if (user.state.user.role === "admin") navigate("/admin/dashboard")
      if (user.state.user.role === "supervisor") navigate("/supervisor/dashboard")

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Error de conexión")
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="usuario">USUARIO</Label>
                                <Input
                                    id="usuario"
                                    type="text"
                                    {...register('usuario', {
                                      required: 'El usuario es requerido',
                                      pattern: {
                                        value: /^[a-zA-Z0-9_]{3,20}$/,
                                        message: 'El usuario no es válido',
                                      },
                                      setValueAs: (v: string) => v.trim(), // ← limpia espacios
                                    })}
                                    className="rounded-lg bg-slate-200"
                                />
                                {errors.usuario && <p className="text-xs text-red-500">{errors.usuario.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">CONTRASEÑA</Label>
                                <Input 
                                  id="password" 
                                  type="password" 
                                  {...register('password', {
                                    required: 'La contraseña es requerida',
                                    minLength: {
                                      value: 6,
                                      message: 'La contraseña debe tener al menos 6 caracteres',
                                    },
                                  })}
                                  className="rounded-lg bg-slate-200"
                                />
                                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                            </div>
                            <Button type="submit" disabled={loading} className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer">
                            {loading ? 'Entrando...' : 'Iniciar sesión'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </>
  )
}

export default LoginPage