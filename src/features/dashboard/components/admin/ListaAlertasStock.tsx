// // import type { AlertaStock } from "../../services/dashboardService"
// import { AlertTriangle } from "lucide-react"

// interface Props {
//   alertas: AlertaStock[]
// }

// export default function ListaAlertasStock({ alertas }: Props) {
//   return (
//     <div className="border rounded-lg overflow-hidden flex flex-col">
//       <div className="px-4 py-3 border-b">
//         <p className="font-medium text-sm">Alertas de inventario</p>
//         <p className="text-xs text-muted-foreground">
//           {alertas.length} {alertas.length === 1 ? "alerta" : "alertas"} de stock bajo
//         </p>
//       </div>

//       {alertas.length === 0 ? (
//         <div className="px-4 py-8 text-center">
//           <p className="text-sm text-muted-foreground">
//             Todo el inventario está dentro de los niveles mínimos.
//           </p>
//         </div>
//       ) : (
//         <div className="divide-y">
//           {alertas.map(alerta => (
//             <div key={`${alerta.id}-${alerta.tipo}`} className="flex items-center justify-between px-4 py-3">
//               <div className="flex flex-col gap-0.5">
//                 <p className="text-sm font-medium">{alerta.nombre}</p>
//                 <p className="text-xs text-muted-foreground">
//                   {alerta.tipo} · Stock:{" "}
//                   <span className="text-red-600 font-medium">
//                     {alerta.stockActual} {alerta.unidad}
//                   </span>
//                   {" "}· Mín: {alerta.stockMinimo} {alerta.unidad}
//                 </p>
//               </div>
//               <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 dark:bg-orange-950/20 px-2 py-1 rounded-full font-medium whitespace-nowrap">
//                 <AlertTriangle size={12} />
//                 Bajo
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }