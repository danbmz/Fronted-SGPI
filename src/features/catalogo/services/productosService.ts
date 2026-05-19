import type { Producto, CrearProducto, EditarProducto } from "@/validations/catalogo/productosValidations";
import type { AuthUser } from "@/types/usuario";
import { registrarLog } from "@/lib/auditService";

export const getProductos = async (): Promise<Producto[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const response = await fetch("/mocks/catalogo/productos.json")
    const data = await response.json()
    return data
}

export const crearProducto = async (
    data: CrearProducto,
    usuarioActivo: AuthUser
): Promise<Producto> => {
    await new Promise(resolve => setTimeout(resolve, 500))

    const nuevoProducto: Producto = {
        ...data,
        id: String(Date.now()),
        activo:true
    }

    await registrarLog({
        usuario: usuarioActivo.usuario,
        nombre: usuarioActivo.nombre,
        modulo: "catalogos",
        entidad: "Productos",
        accion: "crear",
        entidadId: nuevoProducto.id,
        detalle: `Producto: ${nuevoProducto.nombre}`
    })

    return nuevoProducto
}

export const editarProducto = async(
    id: string,
    data: EditarProducto,
    productoOriginal: Producto,
    usuarioActivo: AuthUser
): Promise<Producto> => {
    await new Promise(resolve => setTimeout(resolve, 500))

    await registrarLog({
        usuario: usuarioActivo.usuario,
        nombre: usuarioActivo.nombre,
        modulo: "catalogos",
        entidad: "Productos",
        accion: "editar",
        entidadId: id,
        detalle: `Producto: ${productoOriginal.nombre} - ${productoOriginal.codigo} modificado`
    })

    return {...productoOriginal, ...data, id}
}

export const desactivarProducto = async (
  producto: Producto,
  usuarioActivo: AuthUser
): Promise<Producto> => {
  await new Promise(resolve => setTimeout(resolve, 500))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "Productos",
    accion: "desactivar",
    entidadId: producto.id,
    detalle: `Producto: '${producto.nombre}' - ${producto.codigo} desactivada`
  })

  return { ...producto, activo: false }
}

export const reactivarProducto = async (
  producto: Producto,
  usuarioActivo: AuthUser
): Promise<Producto> => {
  await new Promise(resolve => setTimeout(resolve, 500))

  await registrarLog({
    usuario: usuarioActivo.usuario,
    nombre: usuarioActivo.nombre,
    modulo: "catalogos",
    entidad: "Productos",
    accion: "reactivar",
    entidadId: producto.id,
    detalle: `Materia prima '${producto.nombre}' - ${producto.codigo} reactivada`
  })

  return { ...producto, activo: true }
}