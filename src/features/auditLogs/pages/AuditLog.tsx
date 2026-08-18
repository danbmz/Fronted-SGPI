// import { useState, useEffect } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { formatFecha } from "@/utils/formatFecha"

// const colorModulo: Record<string, string> = {
//   auth:       "bg-blue-100 text-blue-700",
//   usuarios:   "bg-purple-100 text-purple-700",
//   inventario: "bg-yellow-100 text-yellow-700",
//   ordenes:    "bg-green-100 text-green-700",
//   molino:     "bg-orange-100 text-orange-700",
//   catalogos:  "bg-gray-100 text-gray-700",
// }

// const colorAccion: Record<string, string> = {
//   login:           "bg-green-100 text-green-700",
//   logout:          "bg-gray-100 text-gray-700",
//   session_expired: "bg-red-100 text-red-700",
//   crear:           "bg-blue-100 text-blue-700",
//   editar:          "bg-yellow-100 text-yellow-700",
//   desactivar:      "bg-red-100 text-red-700",
//   ajuste_manual:   "bg-orange-100 text-orange-700",
// }

// export default function AuditLogs() {
//   const [logs, setLogs] = useState<AuditLog[]>([])
//   const [loading, setLoading] = useState(true)
//   const [busqueda, setBusqueda] = useState("")
//   const [filtroModulo, setFiltroModulo] = useState("todos")
//   const [filtroEntidad, setFiltroEntidad] = useState("todos")

//   useEffect(() => {
//     const fetchLogs = async () => {
//       try {
//         const data = await getLogs()
//         setLogs(data)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchLogs()
//   }, [])

//   // Para limpiar el filtro de entidades cuando cambia el filtro de modulo
//   useEffect(() => {
//     setFiltroEntidad("todos")
//   }, [filtroModulo])

//   const logsFiltrados = logs.filter(log => {
//     const coincideBusqueda =
//       log.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
//       log.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
//       log.detalle?.toLowerCase().includes(busqueda.toLowerCase())

//     const coincideModulo = filtroModulo === "todos" || log.modulo === filtroModulo

//     const coincideEntidad =
//       filtroEntidad === "todos" ||
//       !filtroEntidad ||
//       log.entidad === filtroEntidad

//     return coincideBusqueda && coincideModulo && coincideEntidad
//   })

//   return (
//     <div className="p-6 flex flex-col gap-4">
//       <h2 className="text-xl font-semibold">Registro de accesos y acciones</h2>

//       {/* Filtros */}
//       <div className="flex gap-3">
//         <Input
//           placeholder="Buscar por usuario o detalle..."
//           value={busqueda}
//           name="search"
//           onChange={(e) => setBusqueda(e.target.value)}
//           className="max-w-sm"
//         />
//         <Select value={filtroModulo} onValueChange={setFiltroModulo}>
//           <SelectTrigger className="w-44">
//             <SelectValue placeholder="Módulo" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="todos">Todos</SelectItem>
//             <SelectItem value="auth">Auth</SelectItem>
//             <SelectItem value="usuarios">Usuarios</SelectItem>
//             <SelectItem value="inventario">Inventario</SelectItem>
//             <SelectItem value="ordenes">Órdenes</SelectItem>
//             <SelectItem value="molino">Molino</SelectItem>
//             <SelectItem value="catalogos">Catálogos</SelectItem>
//           </SelectContent>
//         </Select>

//         {filtroModulo === "catalogos" && (
//           <Select value={filtroEntidad} onValueChange={setFiltroEntidad}>
//             <SelectTrigger className="w-44">
//               <SelectValue placeholder="Catálogo" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="todos">Todos</SelectItem>
//               <SelectItem value="Operador">Operadores</SelectItem>
//               <SelectItem value="Maquina">Máquinas</SelectItem>
//               <SelectItem value="MotivosParo">Motivos de paro</SelectItem>
//               <SelectItem value="FormulasPigmento">Formula de pigmentos</SelectItem>
//               <SelectItem value="MateriasPrimas">Materias primas</SelectItem>
//               <SelectItem value="Pigmentos">Pigmentos</SelectItem>
//               <SelectItem value="Productos">Productos</SelectItem>
//             </SelectContent>
//           </Select>
//         )}

//         {filtroModulo === "inventario" && (
//           <Select value={filtroEntidad} onValueChange={setFiltroEntidad}>
//             <SelectTrigger className="w-44">
//               <SelectValue placeholder="Inventario" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="todos">Todos</SelectItem>
//               <SelectItem value="MateriasPrimas">Materia Prima</SelectItem>
//               <SelectItem value="Molido">Molido</SelectItem>
//               <SelectItem value="Pigmentos">Pigmentos</SelectItem>
//               <SelectItem value="ProductoTerminado">Productos</SelectItem>
//             </SelectContent>
//           </Select>
//         )}
//       </div>

//       {/* Tabla */}
//       {loading ? (
//         <p>Cargando logs...</p>
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Fecha</TableHead>
//               <TableHead>Usuario</TableHead>
//               <TableHead>Módulo</TableHead>
//               <TableHead>Acción</TableHead>
//               <TableHead>Detalle</TableHead>
//               <TableHead>IP</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {logsFiltrados.map((log) => (
//               <TableRow key={log.id}>
//                 <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
//                   {formatFecha(log.fecha)}
//                 </TableCell>
//                 <TableCell>
//                   <p className="font-medium">{log.nombre}</p>
//                   <p className="text-xs text-muted-foreground">{log.usuario}</p>
//                 </TableCell>
//                 <TableCell>
//                   <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${colorModulo[log.modulo] ?? ""}`}>
//                     {log.modulo}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                   <Badge className={`text-xs px-2 py-1 rounded-full font-medium ${colorAccion[log.accion] ?? ""}`}>
//                     {log.accion}
//                   </Badge>
//                 </TableCell>
//                 <TableCell className="text-sm">{log.detalle ?? "—"}</TableCell>
//                 <TableCell className="text-sm text-muted-foreground">{log.ip}</TableCell>
//               </TableRow>
//             ))}
//             {logsFiltrados.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
//                   No se encontraron registros.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   )
// }