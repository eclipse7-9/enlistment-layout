import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function AdminProducts() {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [editProd, setEditProd] = useState(null);
  const [form, setForm] = useState({
    nombre_producto: "",
    imagen_producto: "",
    categoria_producto: "",
    descripcion_producto: "",
    estado_producto: "en-stock",
    precio_producto: "",
    id_proveedor: "",
  });

  useEffect(() => {
    fetchProductos();
    fetchProveedores();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/productos/");
      setProductos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProveedores = async () => {
    try {
      const res = await axios.get("http://localhost:8000/proveedores/");
      setProveedores(Array.isArray(res.data) ? res.data : []);
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
        id_proveedor: Number(form.id_proveedor) || 1,
      };
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.post("http://localhost:8000/productos/", payload, { headers });
      setForm({ nombre_producto: "", imagen_producto: "", categoria_producto: "", descripcion_producto: "", estado_producto: "en-stock", precio_producto: "", id_proveedor: "" });
      fetchProductos();
      alert('Producto creado');
    } catch (err) {
      console.error(err);
      alert('Error creando producto');
    }
  };

  const handleEdit = (p) => {
    setEditProd(p);
    setForm({
      nombre_producto: p.nombre_producto || "",
      imagen_producto: p.imagen_producto || "",
      categoria_producto: p.categoria_producto || "",
      descripcion_producto: p.descripcion_producto || "",
      estado_producto: p.estado_producto || "en-stock",
      precio_producto: p.precio_producto || "",
      id_proveedor: p.id_proveedor || "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      const payload = {
        nombre_producto: form.nombre_producto,
        imagen_producto: form.imagen_producto || null,
        categoria_producto: form.categoria_producto,
        descripcion_producto: form.descripcion_producto,
        estado_producto: form.estado_producto,
        precio_producto: Number(form.precio_producto) || 0,
        id_proveedor: Number(form.id_proveedor) || 1,
      };
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.put(`http://localhost:8000/productos/${editProd.id_producto}`, payload, { headers });
      setEditProd(null);
      fetchProductos();
      alert('Producto actualizado');
    } catch (err) {
      console.error(err);
      alert('Error actualizando producto');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminar producto?')) return;
    try {
      const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
      await axios.delete(`http://localhost:8000/productos/${id}`, { headers });
      fetchProductos();
      alert('Producto eliminado');
    } catch (err) {
      console.error(err);
      alert('Error eliminando producto');
    }
  };

  return (
    <section className="min-h-screen bg-[#f5f3ee] py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm border border-[#d8c6aa] shadow-lg rounded-2xl p-8">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-3xl font-bold text-[#7a8358] mb-6 text-center">
          Gestión de Productos
        </motion.h1>

        <div className="mb-6 border p-4 rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-2">Crear / Editar producto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="p-2 border" placeholder="Nombre" value={form.nombre_producto} onChange={(e)=>setForm({...form,nombre_producto:e.target.value})} />
            <input className="p-2 border" placeholder="Categoría" value={form.categoria_producto} onChange={(e)=>setForm({...form,categoria_producto:e.target.value})} />
            <input className="p-2 border" placeholder="Precio" value={form.precio_producto} onChange={(e)=>setForm({...form,precio_producto:e.target.value})} />
            <select className="p-2 border" value={form.id_proveedor} onChange={(e)=>setForm({...form,id_proveedor:e.target.value})}>
              <option value="">Selecciona proveedor</option>
              {proveedores.map(pr => (<option key={pr.id_proveedor} value={pr.id_proveedor}>{pr.nombre_compania}</option>))}
            </select>
            <input className="p-2 border col-span-2" placeholder="Descripción" value={form.descripcion_producto} onChange={(e)=>setForm({...form,descripcion_producto:e.target.value})} />
            <select className="p-2 border" value={form.estado_producto} onChange={(e)=>setForm({...form,estado_producto:e.target.value})}>
              <option value="en-stock">en-stock</option>
              <option value="agotado">agotado</option>
              <option value="retirado">retirado</option>
            </select>
            <input className="p-2 border" placeholder="Imagen URL" value={form.imagen_producto} onChange={(e)=>setForm({...form,imagen_producto:e.target.value})} />
          </div>
          <div className="mt-3 flex gap-3">
            {editProd ? (
              <>
                <button className="px-4 py-2 bg-[#7a8358] text-white rounded" onClick={handleSaveEdit}>Guardar cambios</button>
                <button className="px-4 py-2 bg-gray-400 text-white rounded" onClick={()=>{setEditProd(null); setForm({nombre_producto:'',imagen_producto:'',categoria_producto:'',descripcion_producto:'',estado_producto:'en-stock',precio_producto:'',id_proveedor:''})}}>Cancelar</button>
              </>
            ) : (
              <button className="px-4 py-2 bg-[#7a8358] text-white rounded" onClick={handleSaveNew}>Crear producto</button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-[#d8c6aa] rounded-lg overflow-hidden">
            <thead className="bg-[#7a8358] text-white text-left">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Proveedor</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white text-[#4e5932]">
              {productos.map((p) => (
                <tr key={p.id_producto} className="border-t border-[#e0d8c6] hover:bg-[#f7f4ef]">
                  <td className="px-4 py-3">{p.nombre_producto}</td>
                  <td className="px-4 py-3">{p.categoria_producto}</td>
                  <td className="px-4 py-3">${Number(p.precio_producto).toFixed(2)} COP</td>
                  <td className="px-4 py-3">{p.estado_producto}</td>
                  <td className="px-4 py-3">{(proveedores.find(pr => pr.id_proveedor === p.id_proveedor) || {}).nombre_compania || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={()=>handleEdit(p)} className="px-3 py-1 bg-yellow-400 rounded">Editar</button>
                      <button onClick={()=>handleDelete(p.id_producto)} className="px-3 py-1 bg-red-500 text-white rounded">Eliminar</button>
                    </div>
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
