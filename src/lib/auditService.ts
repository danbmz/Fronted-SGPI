import mockLogs from "@/mocks/auditlogs/auditLogs.json"
import type { AuditLog } from "@/types/auditLog"

export const registrarLog = async (log: Omit<AuditLog, "id" | "fecha" | "ip">) => {
  await new Promise(resolve => setTimeout(resolve, 200))

  const logsGuardados: AuditLog[] = JSON.parse(localStorage.getItem("audit_logs") || "[]")
  const todosLosLogs = [...mockLogs, ...logsGuardados] as AuditLog[]

  const nuevoLog: AuditLog = {
    ...log,
    id: todosLosLogs.length + 1,
    fecha: new Date().toISOString(),
    ip: "Pendiente (requiere backend)"
  }

  logsGuardados.push(nuevoLog)
  localStorage.setItem("audit_logs", JSON.stringify(logsGuardados))

  return nuevoLog
}