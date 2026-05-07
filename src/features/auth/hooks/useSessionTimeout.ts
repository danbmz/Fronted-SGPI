// src/hooks/useSessionTimeout.ts
import { useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { registrarLog } from "@/lib/auditService"
import { useAuth } from "./useAuth"

const TIMEOUT_MINUTOS = 15
const ADVERTENCIA_MINUTOS = 1 // avisa 1 minuto antes

export function useSessionTimeout() {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const advertenciaRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (advertenciaRef.current) clearTimeout(advertenciaRef.current)

    // Advertencia 1 minuto antes
    advertenciaRef.current = setTimeout(() => {
      alert("Tu sesión expirará en 1 minuto por inactividad.")
    }, (TIMEOUT_MINUTOS - ADVERTENCIA_MINUTOS) * 60 * 1000)

    // Cierre de sesión
    timerRef.current = setTimeout( async () => {
      // Registramos el log
      if (user) {
        await registrarLog({
          usuario: user.usuario,
          nombre: user.nombre,
          modulo: "auth",
          accion: "session_expired",
          detalle: "Sesión expirada por inactividad"
        })
      }
      logout()
      navigate("/")
    }, TIMEOUT_MINUTOS * 60 * 1000)
  }, [logout, navigate])

  useEffect(() => {
    if (!isAuthenticated) return

    const eventos = ["mousemove", "keydown", "click", "scroll", "touchstart"]

    resetTimer()
    eventos.forEach(evento => window.addEventListener(evento, resetTimer))

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (advertenciaRef.current) clearTimeout(advertenciaRef.current)
      eventos.forEach(evento => window.removeEventListener(evento, resetTimer))
    }
  }, [isAuthenticated, resetTimer])
}