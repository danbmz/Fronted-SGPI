import { useState, useEffect } from "react"
import { getAvancesTurno } from "@/features/avancesTurno/services/avancesTurnoService"
import { getOrdenesProduccion } from "@/features/ordenes/services/ordenService"
import { getInfoMaquinas } from "../services/pigmentosOrdenesService"

export const useAlertasPigmentos = () => {
  const [totalAlertas, setTotalAlertas] = useState(0)

  useEffect(() => {
    const calcularAlertas = async () => {
      try {
        const [avances, ordenes, maquinas] = await Promise.all([
          getAvancesTurno(),
          getOrdenesProduccion(),
          getInfoMaquinas()
        ])

        const faltantes = avances.flatMap(a =>
          a.solicitudesMaterial.filter(s => !s.confirmado)
        ).length

        const sobrantes = avances.filter(a =>
          a.estado === "cerrado" &&
          a.kgSobrante > 0 &&
          !a.sobranteConfirmado
        ).length

        const porTerminar = maquinas.filter(m =>
          m.colorSemaforo === "rojo" &&
          m.siguienteOrden !== null &&
          !ordenes.find(o => o.id === m.siguienteOrden?.id)?.materialSiguienteConfirmado
        ).length

        setTotalAlertas(faltantes + sobrantes + porTerminar)
      } catch {
        setTotalAlertas(0)
      }
    }

    calcularAlertas()
    const intervalo = setInterval(calcularAlertas, 5 * 60 * 1000)
    return () => clearInterval(intervalo)
  }, [])

  return totalAlertas
}