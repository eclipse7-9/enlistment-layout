import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ProveedorProfile() {
  const { user, logout } = useAuth();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nombre_compania: '', telefono_proveedor: '', correo_proveedor: '', direccion_contacto: '' });
  const [productCount, setProductCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [providerProducts, setProviderProducts] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' });

  // Auto-scroll to profile section when navigated with hash #perfil
  useEffect(() => {
    // Wait until data has loaded (no blank area) then scroll
    if (loading) return;
    try {
      if (window.location.hash === '#perfil') {
        setTimeout(() => {
          const el = document.getElementById('perfil');
          if (el) {
            const headerOffset = 80; // adjust if your header has different height
            const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }, 120);
      }
    } catch (e) {
      // ignore
    }
  }, [loading]);

  useEffect(() => {
    if (!user?.id_proveedor) return;
    const fetch = async () => {
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const [provRes, statsRes, prodRes] = await Promise.all([
          axios.get(`http://localhost:8000/proveedores/${user.id_proveedor}`, { headers }),
          axios.get(`http://localhost:8000/proveedores/${user.id_proveedor}/stats`, { headers }),
          axios.get('http://localhost:8000/productos/', { headers })
        ]);
        setProvider(provRes.data);
        setForm({
          nombre_compania: provRes.data.nombre_compania || '',
          telefono_proveedor: provRes.data.telefono_proveedor || '',
          correo_proveedor: provRes.data.correo_proveedor || '',
          direccion_contacto: provRes.data.direccion_contacto || ''
        });
  const all = Array.isArray(prodRes.data) ? prodRes.data : [];
  const mine = all.filter(p => p.id_proveedor === user.id_proveedor);
  setProviderProducts(mine);
  setProductCount(statsRes.data.total_products || mine.length);
  setActiveCount(statsRes.data.active_products || mine.filter(p => p.estado_producto !== 'retirado').length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const handleSave = async () => {
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const payload = {
        nombre_compania: form.nombre_compania,
        telefono_proveedor: form.telefono_proveedor,
        correo_proveedor: form.correo_proveedor,
        direccion_contacto: form.direccion_contacto,
      };
      await axios.put(`http://localhost:8000/proveedores/${user.id_proveedor}`, payload, { headers });
      setEditing(false);
      // refresh
      setProvider(prev => ({ ...prev, ...payload }));
      alert('Perfil actualizado');
    } catch (err) {
      console.error(err);
      alert('Error actualizando perfil');
    }
  };

  if (!user?.is_proveedor) return <p className="p-6">Acceso no autorizado.</p>;
  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <section className="min-h-screen bg-[#f5f3ee] py-12 px-6 md:px-16">
      <div id="perfil" className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-[#7a8358] mb-4">Perfil de proveedor</h1>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Nombre compañía</label>
            <input className="w-full p-2 border rounded" value={form.nombre_compania} onChange={e=>setForm({...form,nombre_compania:e.target.value})} disabled={!editing} />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Teléfono</label>
            <input className="w-full p-2 border rounded" value={form.telefono_proveedor} onChange={e=>setForm({...form,telefono_proveedor:e.target.value})} disabled={!editing} />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Correo</label>
            <input className="w-full p-2 border rounded" value={form.correo_proveedor} onChange={e=>setForm({...form,correo_proveedor:e.target.value})} disabled={!editing} />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Dirección</label>
            <input className="w-full p-2 border rounded" value={form.direccion_contacto} onChange={e=>setForm({...form,direccion_contacto:e.target.value})} disabled={!editing} />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          {editing ? (
            <>
              <button className="px-4 py-2 bg-[#7a8358] text-white rounded" onClick={handleSave}>Guardar</button>
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={()=>setEditing(false)}>Cancelar</button>
            </>
          ) : (
            <button className="px-4 py-2 bg-[#7a8358] text-white rounded" onClick={()=>setEditing(true)}>Editar información</button>
          )}
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-2">Estadísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Productos publicados</div>
              <div className="text-2xl font-bold text-[#7a8358]">{productCount}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Productos activos</div>
              <div className="text-2xl font-bold text-[#7a8358]">{activeCount}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Visitas (proximamente)</div>
              <div className="text-2xl font-bold text-[#7a8358]">—</div>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Cambiar contraseña</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input type="password" placeholder="Contraseña actual" className="p-2 border rounded" value={pwForm.current_password} onChange={e=>setPwForm({...pwForm,current_password:e.target.value})} />
            <input type="password" placeholder="Nueva contraseña" className="p-2 border rounded" value={pwForm.new_password} onChange={e=>setPwForm({...pwForm,new_password:e.target.value})} />
            <input type="password" placeholder="Confirmar nueva" className="p-2 border rounded" value={pwForm.confirm_password} onChange={e=>setPwForm({...pwForm,confirm_password:e.target.value})} />
          </div>
          <div>
            <button className="px-4 py-2 bg-[#7a8358] text-white rounded" onClick={async ()=>{
              if (pwForm.new_password !== pwForm.confirm_password) return alert('Las contraseñas no coinciden');
              try{
                const headers = { Authorization: `Bearer ${user.token}` };
                await axios.post(`http://localhost:8000/proveedores/${user.id_proveedor}/change-password`, { current_password: pwForm.current_password, new_password: pwForm.new_password }, { headers });
                alert('Contraseña actualizada');
                setPwForm({ current_password: '', new_password: '', confirm_password: '' });
              }catch(err){ console.error(err); alert('Error cambiando contraseña'); }
            }}>Cambiar contraseña</button>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Productos (página {page})</h2>
          <div className="space-y-3">
            {providerProducts.slice((page-1)*pageSize, page*pageSize).map(p=> (
              <div key={p.id_producto} className="p-3 bg-gray-50 rounded flex items-center gap-4">
                <img src={p.imagen_producto || 'https://via.placeholder.com/80'} alt={p.nombre_producto} className="w-20 h-16 object-cover rounded" />
                <div>
                  <div className="font-semibold">{p.nombre_producto}</div>
                  <div className="text-sm text-gray-600">{p.categoria_producto} — ${Number(p.precio_producto).toFixed(2)}</div>
                </div>
                <div className="ml-auto text-sm text-gray-500">{p.estado_producto}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button disabled={page<=1} onClick={()=>setPage(s=>Math.max(1,s-1))} className="px-3 py-1 bg-gray-200 rounded">Anterior</button>
            <button disabled={page*pageSize >= providerProducts.length} onClick={()=>setPage(s=>s+1)} className="px-3 py-1 bg-gray-200 rounded">Siguiente</button>
          </div>
        </div>
      </div>
    </section>
  );
}
