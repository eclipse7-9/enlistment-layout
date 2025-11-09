import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

export default function MiPerfilDomiciliario() {
  const { user, setUser, logout } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    correo_usuario: user?.correo || "",
    nombre_usuario: user?.nombre_usuario || "",
    apellido_usuario: user?.apellido_usuario || "",
    telefono_usuario: user?.telefono_usuario || "",
    direccion_usuario: user?.direccion_usuario || "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const res = await axios.get(`http://localhost:8000/usuarios/${user.id_usuario}`, { headers });
        const data = res.data || {};
        setProfile({
          correo_usuario: data.correo_usuario || data.correo || user.correo || "",
          nombre_usuario: data.nombre_usuario || "",
          apellido_usuario: data.apellido_usuario || "",
          telefono_usuario: data.telefono_usuario || "",
          direccion_usuario: data.direccion_usuario || "",
        });
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg">Debes iniciar sesión.</div>
      </div>
    );
  }

  const openEditModal = (field, current) => {
    setEditingField(field);
    setTempValue(current ?? "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingField(null);
    setTempValue("");
  };

  const saveField = async () => {
    if (!editingField) return;
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${user.token}` };
      const payload = { [editingField]: tempValue };
      const res = await axios.put(`http://localhost:8000/usuarios/${user.id_usuario}`, payload, { headers });

      // actualizar perfil local
      setProfile((p) => ({ ...p, [editingField]: tempValue }));

      // actualizar auth context si corresponde
      setUser((prev) => ({
        ...prev,
        correo: res.data.correo_usuario || (editingField === 'correo_usuario' ? tempValue : prev.correo),
        nombre_usuario: res.data.nombre_usuario || (editingField === 'nombre_usuario' ? tempValue : prev.nombre_usuario),
        apellido_usuario: res.data.apellido_usuario || (editingField === 'apellido_usuario' ? tempValue : prev.apellido_usuario),
        telefono_usuario: res.data.telefono_usuario || (editingField === 'telefono_usuario' ? tempValue : prev.telefono_usuario),
      }));

      showAlert ? showAlert({ type: 'success', message: 'Campo actualizado correctamente' }) : alert('Campo actualizado correctamente');
      closeModal();
    } catch (err) {
      console.error('Error actualizando campo:', err);
      showAlert ? showAlert({ type: 'error', message: err.response?.data?.detail || 'Error al actualizar campo' }) : alert('Error al actualizar campo');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'nombre_usuario', label: 'Nombre' },
    { key: 'apellido_usuario', label: 'Apellido' },
    { key: 'correo_usuario', label: 'Correo' },
    { key: 'telefono_usuario', label: 'Teléfono' },
    { key: 'direccion_usuario', label: 'Dirección' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F3EE] to-[#E6E3D3] py-16 px-6 font-[Poppins]">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-[#556140] mb-4">Mi perfil</h1>

        <div className="grid grid-cols-1 gap-4">
          {fields.map((f) => (
            <div key={f.key} className="flex items-center justify-between border p-4 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">{f.label}</div>
                <div className="text-lg font-medium text-[#334e1a]">{profile[f.key] || '—'}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(f.key, profile[f.key])}
                  className="px-3 py-1 bg-[#7A8358] text-white rounded-md hover:bg-[#68764a]"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => navigate('/domiciliario')}
              className="px-4 py-2 bg-gray-200 rounded-full"
            >
              Volver
            </button>

            <button
              onClick={() => { logout(); navigate('/'); }}
              className="px-4 py-2 bg-red-500 text-white rounded-full"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Modal edición por campo con efecto blur */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-[#556140] mb-3">Editar {fields.find(x => x.key === editingField)?.label}</h3>
            <input
              type={editingField === 'correo_usuario' ? 'email' : 'text'}
              className="w-full p-2 border rounded-lg mb-4"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-md">Cancelar</button>
              <button onClick={saveField} disabled={loading} className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-[#7A8358] hover:bg-[#90a06a]'}`}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
