import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

const TIMEOUT_MINUTOS = 60;
const ADVERTENCIA_MINUTOS = 5;

export function useSessionTimeout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  // cada ref guardara los ID que cada funcion retorna, para poder identificarlos cuando queramos invalidarlos
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advertenciaRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastIdRef = useRef<string | number | null>(null); // ← guarda el ID del toast activo

  // Usamos useCallback porque useAuth (store global de Zustand) podria cambiar en otra parte de la app y ocasionar un re-renderizado del componente que usa useSessionTimeOut() y reiniciar resetTimer sin que el usuario real haya hecho nada;
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (advertenciaRef.current) clearTimeout(advertenciaRef.current);

    // Si hay un toast de advertencia visible, lo descartamos al reiniciar por actividad real
    if (toastIdRef.current !== null) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }

    advertenciaRef.current = setTimeout(() => {
      toastIdRef.current = toast.info("Tu sesión expira en 1 minuto por inactividad", {
        duration: ADVERTENCIA_MINUTOS * 60 * 1000, // dura exactamente hasta el momento del cierre
      });
    }, (TIMEOUT_MINUTOS - ADVERTENCIA_MINUTOS) * 60 * 1000);

    timerRef.current = setTimeout(async () => {
      await logout("INACTIVIDAD");
      navigate("/");
    }, TIMEOUT_MINUTOS * 60 * 1000);

  }, [logout, navigate]);

  useEffect(() => {
    // CUERPO PRINCIPAL — se ejecuta cuando el efecto "arranca"
    if (!isAuthenticated) return;

    const eventos = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    resetTimer();
    eventos.forEach((evento) => window.addEventListener(evento, resetTimer));

    return () => {
      // FUNCIÓN DE LIMPIEZA — se ejecuta cuando el efecto "termina" (antes de volver a arrancar, o al desmontar)
      if (timerRef.current) clearTimeout(timerRef.current);
      if (advertenciaRef.current) clearTimeout(advertenciaRef.current);
      eventos.forEach((evento) => window.removeEventListener(evento, resetTimer));
    };
  }, [isAuthenticated, resetTimer]);
}

// ------------- Cuando se dispara este efecto:
// La primera vez que el componente se monta (siempre se ejecuta al menos una vez).
// Cada vez que isAuthenticated cambia de valor (por ejemplo, de false a true al hacer login).
// Cada vez que resetTimer cambia de identidad (que, gracias a useCallback, ahora solo pasa si logout/navigate cambian de verdad — casi nunca).

// ------------- Por que limpiamos dentro del useEffect si resetTimer ya limpia al ejecutarse:
// Aquí está la pieza clave que conecta todo: cada vez que este efecto va a volver a ejecutarse (porque alguna dependencia cambió), 
// React primero ejecuta la función de limpieza del efecto anterior, y después ejecuta el cuerpo principal del efecto nuevo. 
// Es un patrón de "primero deshaz lo viejo, luego haz lo nuevo" — así evitas tener, por ejemplo, dos conjuntos de addEventListener acumulados 
// (uno viejo sin quitar, uno nuevo agregado encima), lo cual causaría que resetTimer se ejecutara doble por cada movimiento de mouse.

// La función de limpieza también se ejecuta una última vez, sin que nada nuevo la reemplace, cuando el componente se desmonta por completo 
// (el usuario cierra sesión y ese componente deja de existir en el árbol) — ahí es donde cancela cualquier temporizador pendiente 
// y quita los listeners definitivamente, para no dejar "fugas" de memoria o comportamiento fantasma después de que el componente ya no 
// existe.