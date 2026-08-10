import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

const TIMEOUT_MINUTOS = 15;
const ADVERTENCIA_MINUTOS = 1;

export function useSessionTimeout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advertenciaRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (advertenciaRef.current) clearTimeout(advertenciaRef.current);

    advertenciaRef.current = setTimeout(() => {
      toast.info("Tu sesión expira en 1 minuto por inactividad");
    }, (TIMEOUT_MINUTOS - ADVERTENCIA_MINUTOS) * 60 * 1000);

    timerRef.current = setTimeout(async () => {
      await logout();
      navigate("/");
    }, TIMEOUT_MINUTOS * 60 * 1000);
  }, [logout, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const eventos = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    resetTimer();
    eventos.forEach((evento) => window.addEventListener(evento, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (advertenciaRef.current) clearTimeout(advertenciaRef.current);
      eventos.forEach((evento) => window.removeEventListener(evento, resetTimer));
    };
  }, [isAuthenticated, resetTimer]);
}