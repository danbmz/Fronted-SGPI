// Estos datos normalmente vendrían calculados por el backend
// Los simulamos aquí para el frontend

export const produccionSemana = [
  { turno: "Jue Mañana", piezasBuenas: 3180, piezasDefectuosas: 42 },
  { turno: "Jue Tarde",  piezasBuenas: 3050, piezasDefectuosas: 38 },
  { turno: "Vie Mañana", piezasBuenas: 3620, piezasDefectuosas: 55 },
  { turno: "Vie Tarde",  piezasBuenas: 2780, piezasDefectuosas: 61 },
  { turno: "Sáb Noche",  piezasBuenas: 2430, piezasDefectuosas: 29 },
  { turno: "Dom Mañana", piezasBuenas: 3100, piezasDefectuosas: 44 },
  { turno: "Lun Tarde",  piezasBuenas: 2900, piezasDefectuosas: 33 }
]

export const parosPorMotivo = [
  { motivo: "Falla de máquina",  minutos: 145, fill: "#378ADD" },
  { motivo: "Cambio de color",   minutos: 210, fill: "#EF9F27" },
  { motivo: "Ajuste de proceso", minutos: 95,  fill: "#E24B4A" },
  { motivo: "Falta de material", minutos: 60,  fill: "#1D9E75" },
  { motivo: "Otro",              minutos: 30,  fill: "#888780" }
]