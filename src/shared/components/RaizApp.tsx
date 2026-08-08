import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { registrarNavegador } from "@/lib/navigation";

export function RaizApp() {
  const navigate = useNavigate();

  useEffect(() => {
    registrarNavegador(navigate);
  }, [navigate]);

  return <Outlet />; // renderiza la ruta hija que corresponda
}