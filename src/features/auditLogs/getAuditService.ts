import type { AuditLog } from "@/types/auditLog"
import mockLogs from "@/mocks/auditlogs/auditLogs.json"

export const getLogs = async (): Promise<AuditLog[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const logsGuardados: AuditLog[] = JSON.parse(localStorage.getItem("audit_logs") || "[]")
  const todos = [...mockLogs, ...logsGuardados] as AuditLog[]
  return todos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
}