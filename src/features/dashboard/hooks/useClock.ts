import { useState, useEffect } from "react"

export function useClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formattedTime = time.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  })

  const formattedDate = time.toLocaleDateString("es-MX", {
    weekday: "long",
    month: "long",
    day: "numeric"
  })

  return { formattedTime, formattedDate }
}