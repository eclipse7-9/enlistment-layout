import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function AdminReport() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, sRes, uRes, provRes] = await Promise.all([
        axios.get("http://localhost:8000/productos/"),
        axios.get("http://localhost:8000/servicios/"),
        axios.get("http://localhost:8000/usuarios/"),
        axios.get("http://localhost:8000/proveedores/"),
      ]);

      setProductos(Array.isArray(pRes.data) ? pRes.data : []);
      setServicios(Array.isArray(sRes.data) ? sRes.data : []);
      setUsuarios(Array.isArray(uRes.data) ? uRes.data : []);
      setProveedores(Array.isArray(provRes.data) ? provRes.data : []);
    } catch (err) {
      console.error("Error fetching report data", err);
    } finally {
      setLoading(false);
    }
  };

  // Aggregates
  const totalProductosActivos = productos.filter(p => p.estado_producto === "en-stock").length;
  const totalServiciosActivos = servicios.filter(s => (s.estado_servicio || "").toLowerCase() === "activo").length;
  const totalEmprendedores = usuarios.filter(u => u.id_rol === 2).length;
  const totalClientes = usuarios.filter(u => u.id_rol === 4).length;

  // Helper maps
  const proveedorMap = Object.fromEntries(proveedores.map(pr => [pr.id_proveedor, pr.nombre_compania]));
  const usuarioMap = Object.fromEntries(usuarios.map(u => [u.id_usuario, u]));

  return (
    <section className="min-h-screen bg-[#f5f3ee] py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-sm border border-[#d8c6aa] shadow-lg rounded-2xl p-8">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl font-bold text-[#7a8358] mb-4 text-center">Reporte administrativo</motion.h1>

        <div className="mb-6">
          <p className="text-sm text-gray-600">Fecha del reporte: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-green-50 rounded shadow-sm">
            <h4 className="text-sm text-gray-600">Total productos activos</h4>
            <p className="text-2xl font-bold text-[#7a8358]">{totalProductosActivos}</p>
          </div>
          <div className="p-4 bg-green-50 rounded shadow-sm">
            <h4 className="text-sm text-gray-600">Total servicios activos</h4>
            <p className="text-2xl font-bold text-[#7a8358]">{totalServiciosActivos}</p>
          </div>
          <div className="p-4 bg-green-50 rounded shadow-sm">
            <h4 className="text-sm text-gray-600">Total emprendedores</h4>
            <p className="text-2xl font-bold text-[#7a8358]">{totalEmprendedores}</p>
          </div>
          <div className="p-4 bg-green-50 rounded shadow-sm">
            <h4 className="text-sm text-gray-600">Total clientes</h4>
            <p className="text-2xl font-bold text-[#7a8358]">{totalClientes}</p>
          </div>
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-semibold text-[#7a8358] mb-3">2️⃣ Detalle de productos</h2>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border border-[#e6e0d0] rounded-lg">
            <thead className="bg-[#f7f4ef] text-left">
              <tr>
                <th className="px-3 py-2">Nombre</th>
                <th className="px-3 py-2">Categoría</th>
                <th className="px-3 py-2">Precio</th>
                <th className="px-3 py-2">Estado</th>
                <th className="px-3 py-2">Proveedor</th>
                <th className="px-3 py-2">Creación / Actualización</th>
              </tr>
            </thead>
            <tbody className="bg-white text-[#4e5932]">
              {productos.map(p => (
                <tr key={p.id_producto} className="border-t">
                  <td className="px-3 py-2">{p.nombre_producto}</td>
                  <td className="px-3 py-2">{p.categoria_producto}</td>
                  <td className="px-3 py-2">${Number(p.precio_producto).toFixed(2)}</td>
                  <td className="px-3 py-2">{p.estado_producto}</td>
                  <td className="px-3 py-2">{proveedorMap[p.id_proveedor] || '-'}</td>
                  <td className="px-3 py-2">{p.fecha_creacion || p.fecha_actualizacion || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-semibold text-[#7a8358] mb-3">3️⃣ Detalle de servicios de emprendedores</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-[#e6e0d0] rounded-lg">
            <thead className="bg-[#f7f4ef] text-left">
              <tr>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Descripción</th>
                <th className="px-3 py-2">Precio</th>
                <th className="px-3 py-2">Estado</th>
                <th className="px-3 py-2">Emprendedor</th>
                <th className="px-3 py-2">Creación / Actualización</th>
                <th className="px-3 py-2">Imagen</th>
              </tr>
            </thead>
            <tbody className="bg-white text-[#4e5932]">
              {servicios.map(s => (
                <tr key={s.id_servicio} className="border-t align-top">
                  <td className="px-3 py-2">{s.tipo_servicio}</td>
                  <td className="px-3 py-2">{s.descripcion_servicio}</td>
                  <td className="px-3 py-2">${Number(s.precio_servicio || 0).toFixed(2)}</td>
                  <td className="px-3 py-2">{s.estado_servicio}</td>
                  <td className="px-3 py-2">
                    {usuarioMap[s.id_usuario] ? (
                      <div>
                        <div className="font-semibold">{usuarioMap[s.id_usuario].nombre_usuario} {usuarioMap[s.id_usuario].apellido_usuario}</div>
                        <div className="text-sm text-gray-600">{usuarioMap[s.id_usuario].correo_usuario} • {usuarioMap[s.id_usuario].telefono_usuario}</div>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-3 py-2">{s.fecha_creacion || s.fecha_actualizacion || '-'}</td>
                  <td className="px-3 py-2">
                    {s.imagen_servicio ? (
                      <a href={s.imagen_servicio} target="_blank" rel="noreferrer" className="text-blue-600 underline">Ver</a>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
}
