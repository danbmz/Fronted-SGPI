import { RouterProvider } from "react-router-dom"
import { router } from "./router/router"
import { useEffect } from "react";
import { obtenerSesionActual } from "./features/auth/authService";
import { useAuthStore } from "./store/authStore";

function App() {
  const loginStore = useAuthStore((s) => s.login);
  const setCargando = useAuthStore((s) => s.setCargando);

  useEffect(() => {
    obtenerSesionActual().then((usuario) => {
      if (usuario) {
        loginStore(usuario);
      } else {
        setCargando(false); // no hay sesión, pero ya terminamos de verificar
      }
    });
  }, []);

  return (
      <RouterProvider router={router} />
  )
}

export default App
