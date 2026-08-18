import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useForm }from "react-hook-form";
import { useNavigate } from 'react-router-dom'
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface LoginFormValues {
  usuario: string
  password: string
}

function LoginPage() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm<LoginFormValues>();
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(data: LoginFormValues) {
    setError(null);
    setLoading(true)
    try {
      const usuario = await login(data);

      // Redirección según rol
      switch (usuario?.role) {
        case "ADMIN": navigate("/admin/pedidos"); break;
        case "SUPERVISOR": navigate("/supervisor/ordenes"); break;
        case "MOLINO": navigate("/molino/pendientes"); break;
        case "PIGMENTOS": navigate("/pigmentos/ordenes"); break;
        case "PROGRAMADOR": navigate("/programador/pedidos"); break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
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
                                {/* {error && <p className="text-xs text-red-500">{error}</p>} */}
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
                                {error && <p className="text-xs text-red-500">{error}</p>}
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