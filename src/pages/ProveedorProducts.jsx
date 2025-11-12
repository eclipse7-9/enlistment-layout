import { useEffect, useState, useRef } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProveedorProducts() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nombreInputRef = useRef(null);
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre_producto: "", imagen_producto: "", categoria_producto: "", descripcion_producto: "", estado_producto: "en-stock", precio_producto: "", });

  useEffect(() => { fetchProductos(); }, []);

  useEffect(() => {
    // Si la URL tiene ?focus=create enfocamos el input Nombre y limpiamos el query
    const params = new URLSearchParams(location.search);
    if (params.get('focus') === 'create') {
      setTimeout(() => { if (nombreInputRef.current) nombreInputRef.current.focus(); }, 150);
      // limpiar query sin recargar
      params.delete('focus');
      const newSearch = params.toString();
      window.history.replaceState({}, '', `${location.pathname}${newSearch ? '?' + newSearch : ''}`);
    }
  }, [location.search]);

  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/productos/");
      const all = Array.isArray(res.data) ? res.data : [];
      const mine = all.filter(p => p.id_proveedor === user?.id_proveedor);
      setProductos(mine);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNew = async () => {
    try {
      const payload = {
        nombre_producto: form.nombre_producto,
        imagen_producto: form.imagen_producto || null,
        categoria_producto: form.categoria_producto,
        descripcion_producto: form.descripcion_producto,
        estado_producto: form.estado_producto,
        precio_producto: Number(form.precio_producto) || 0,
        // id_proveedor will be set server-side from token
      };
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.post("http://localhost:8000/productos/", payload, { headers });
      setForm({ nombre_producto: "", imagen_producto: "", categoria_producto: "", descripcion_producto: "", estado_producto: "en-stock", precio_producto: "" });
      fetchProductos();
      alert('Producto creado');
    } catch (err) { console.error(err); alert('Error creando producto'); }
  };

  // Nota: Los proveedores sólo pueden crear (no editar). Por tanto no exponemos
  // la lógica de edición en la UI; el servidor aún valida propiedad/permiso.

  const handleDelete = async (id) => {
    if (!confirm('Eliminar producto?')) return;
    try {
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.delete(`http://localhost:8000/productos/${id}`, { headers });
      fetchProductos();
      alert('Producto eliminado');
    } catch (err) { console.error(err); alert('Error eliminando producto'); }
  };

  if (!user || !user.is_proveedor) return <p className="p-6">Acceso no autorizado.</p>;

  return (
    <section className="min-h-screen bg-[#f5f3ee] py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header dentro de la vista de proveedor */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#7a8358]">Mis productos — {user.nombre_compania}</h1>
          {/* Provider menu is shown in the app header (ProviderMiniHeader) */}
        </div>

        <div className="bg-white/90 backdrop-blur-sm border border-[#d8c6aa] shadow-lg rounded-2xl p-8">
          <h2 className="sr-only">Panel interno</h2>

        <div className="mb-6 border p-4 rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-2">Crear producto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input ref={nombreInputRef} className="p-2 border" placeholder="Nombre" value={form.nombre_producto} onChange={(e)=>setForm({...form,nombre_producto:e.target.value})} />
            <input className="p-2 border" placeholder="Categoría" value={form.categoria_producto} onChange={(e)=>setForm({...form,categoria_producto:e.target.value})} />
            <input className="p-2 border" placeholder="Precio" value={form.precio_producto} onChange={(e)=>setForm({...form,precio_producto:e.target.value})} />
            <select className="p-2 border" value={form.estado_producto} onChange={(e)=>setForm({...form,estado_producto:e.target.value})}>
              <option value="en-stock">en-stock</option>
              <option value="agotado">agotado</option>
              <option value="retirado">retirado</option>
            </select>
            <input className="p-2 border col-span-2" placeholder="Descripción" value={form.descripcion_producto} onChange={(e)=>setForm({...form,descripcion_producto:e.target.value})} />
            <input className="p-2 border" placeholder="Imagen URL" value={form.imagen_producto} onChange={(e)=>setForm({...form,imagen_producto:e.target.value})} />
          </div>
          <div className="mt-3 flex gap-3">
            <button className="px-4 py-2 bg-[#7a8358] text-white rounded" onClick={handleSaveNew}>Crear producto</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-[#d8c6aa] rounded-lg overflow-hidden">
            <thead className="bg-[#7a8358] text-white text-left">
              <tr>
                <th className="px-4 py-3">Imagen</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white text-[#4e5932]">
              {productos.map((p) => (
                <tr key={p.id_producto} className="border-t border-[#e0d8c6] hover:bg-[#f7f4ef]">
                  <td className="px-4 py-3">
                    <img src={p.imagen_producto || 'https://via.placeholder.com/120x90?text=Sin+imagen'} alt={p.nombre_producto} className="w-28 h-20 object-cover rounded" />
                  </td>
                  <td className="px-4 py-3">{p.nombre_producto}</td>
                  <td className="px-4 py-3">{p.categoria_producto}</td>
                  <td className="px-4 py-3">${Number(p.precio_producto).toFixed(2)} COP</td>
                  <td className="px-4 py-3">{p.estado_producto}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      {/* Edición deshabilitada para proveedores: sólo creación y eliminación */}
                      <button onClick={()=>handleDelete(p.id_producto)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </section>
  );
}
