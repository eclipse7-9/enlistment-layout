import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import Swal from "sweetalert2";

// Importar tus componentes
import EditarUsuarioModal from "../components/EditUsuario.jsx";
import RegistrarMascotaModal from "../components/RegistrarMascota.jsx";

export default function MiCuenta() {
  const { user, setUser, logout } = useAuth();
  const { showAlert } = useAlert();

  const getProfileImageSrc = (img) => {
    if (!img)
      return "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
    if (img.startsWith("data:")) return img;
    if (img.startsWith("http")) return img;
    return `http://localhost:8000${img}`;
  };

  const [loading, setLoading] = useState(true);
  const [citas, setCitas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [recibos, setRecibos] = useState([]);
  const [selectedRecibo, setSelectedRecibo] = useState(null);
  const [showReciboModal, setShowReciboModal] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Estados para mostrar modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [mascotas, setMascotas] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [servicios, setServicios] = useState([]);

  const [paymentForm, setPaymentForm] = useState({
    tipo_metodo: "",
    numero_cuenta: "",
    titular: "",
  });

  // Formulario mascota
  const [petForm, setPetForm] = useState({
    nombre_mascota: "",
    peso_mascota: "",
    especie_mascota: "",
    raza_mascota: "",
    edad_mascota: "",
    altura_mascota: "",
  });

  // Formulario editar usuario
  const [editData, setEditData] = useState({
    correo: user?.correo || "",
    password: "",
    nombre_usuario: user?.nombre_usuario || "",
    telefono_usuario: user?.telefono_usuario || "",
    direccion_usuario: user?.direccion_usuario || "",
  });

  // Actualizar usuario
  const handleUpdateUser = async (field) => {
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      
  if (editData.type === 'password') {
        // Validar contraseñas
        if (!editData.current_password || !editData.new_password) {
          showAlert({ type: 'warning', message: 'Ingresa la contraseña actual y la nueva contraseña' });
          return;
        }
        // Actualizar contraseña
        await axios.put(
          `http://localhost:8000/usuarios/${user.id_usuario}/password`,
          {
            current_password: editData.current_password,
            new_password: editData.new_password
          },
          { headers }
        );
  showAlert({ type: 'success', message: 'Contraseña actualizada correctamente' });
        setEditData(prev => ({ ...prev, current_password: '', new_password: '' }));
      } else {
        // Actualizar campo específico
        const updateData = {};
        if (field === 'correo') {
          updateData.correo_usuario = editData.correo;
        } else if (field === 'nombre_usuario') {
          updateData.nombre_usuario = editData.nombre_usuario;
        } else if (field === 'apellido_usuario') {
          updateData.apellido_usuario = editData.apellido_usuario;
        } else if (field === 'telefono_usuario') {
          updateData.telefono_usuario = editData.telefono_usuario;
        }
        
        const response = await axios.put(
          `http://localhost:8000/usuarios/${user.id_usuario}`,
          updateData,
          { headers }
        );

        // Actualizar el estado del usuario con el campo específico
        setUser(prev => ({
          ...prev,
          correo: field === 'correo' ? response.data.correo_usuario : prev.correo,
          nombre_usuario: field === 'nombre_usuario' ? response.data.nombre_usuario : prev.nombre_usuario,
          apellido_usuario: field === 'apellido_usuario' ? response.data.apellido_usuario : prev.apellido_usuario,
          telefono_usuario: field === 'telefono_usuario' ? response.data.telefono_usuario : prev.telefono_usuario
        }));

  showAlert({ type: 'success', message: 'Datos actualizados correctamente' });
      }
    } catch (err) {
      console.error(err);
      showAlert({ type: 'error', message: err.response?.data?.detail || 'Error al actualizar usuario' });
    }
  };

  // Registrar mascota
  const handleRegisterPet = async () => {
    try {
      if (!user) return;

      // validar campos mínimos
        if (!petForm.nombre_mascota || !petForm.especie_mascota || !petForm.raza_mascota) {
        showAlert({ type: 'warning', message: 'Completa nombre, especie y raza' });
        return;
      }

      // normalizar tipos numéricos
      const mascotaData = {
        nombre_mascota: petForm.nombre_mascota,
        peso_mascota: Number(petForm.peso_mascota) || 0,
        especie_mascota: petForm.especie_mascota,
        raza_mascota: petForm.raza_mascota,
        edad_mascota: parseInt(petForm.edad_mascota) || 0,
        altura_mascota: petForm.altura_mascota ? Number(petForm.altura_mascota) : null,
      };

      const headers = { Authorization: `Bearer ${user.token}` };
      await axios.post("http://localhost:8000/mascotas", mascotaData, { headers });
  showAlert({ type: 'success', message: 'Mascota registrada correctamente' });
      setShowPetModal(false);
      setPetForm({
        nombre_mascota: "",
        peso_mascota: "",
        especie_mascota: "",
        raza_mascota: "",
        edad_mascota: "",
        altura_mascota: "",
      });

      // refrescar lista de mascotas
      await fetchMascotas();
    } catch (err) {
      console.error('Error al registrar mascota:', err.response?.data || err);
      showAlert({ type: 'error', message: 'Error al registrar la mascota: ' + (err.response?.data?.detail || err.message) });
    }
  };

  // función para traer mascotas del usuario
  const fetchMascotas = async () => {
    if (!user) return;
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const res = await axios.get("http://localhost:8000/mascotas/mis-mascotas", { headers });
      setMascotas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error al cargar mascotas:', err);
    }
  };

  // función para traer citas del usuario
  const fetchCitas = async () => {
    if (!user) return;
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const res = await axios.get("http://localhost:8000/citas/", { headers });
      // filtrar solo las citas del usuario actual
      const misCitas = res.data.filter(c => c.id_usuario === user.id_usuario);
      setCitas(misCitas);
    } catch (err) {
      console.error('Error al cargar citas:', err);
    }
  };

  // traer métodos de pago del usuario
  const fetchMetodosPago = async () => {
    if (!user) return;
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const res = await axios.get("http://localhost:8000/metodo_pago/", { headers });
      setMetodosPago(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error al cargar métodos de pago:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return setLoading(false);
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const [pedRes, recRes, citasRes, servRes] = await Promise.all([
          axios.get("http://localhost:8000/pedidos/", { headers }),
          axios.get("http://localhost:8000/recibos/", { headers }),
          axios.get("http://localhost:8000/citas/", { headers }),
          axios.get("http://localhost:8000/servicios/", { headers })
        ]);
        setPedidos(Array.isArray(pedRes.data) ? pedRes.data : []);
        setRecibos(Array.isArray(recRes.data) ? recRes.data : []);
        setServicios(Array.isArray(servRes.data) ? servRes.data : []);
        // filtrar solo las citas del usuario actual
        const misCitas = Array.isArray(citasRes.data) 
          ? citasRes.data.filter(c => c.id_usuario === user.id_usuario)
          : [];
        console.log("Citas cargadas:", misCitas); // Debug
        setCitas(misCitas);

        // traer mascotas también
        await fetchMascotas();
        await fetchMetodosPago();
      } catch (err) {
        console.error("Error cargando datos de cuenta:", err);
        setError("No se pudieron cargar los datos. Revisa la consola.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Crear método de pago
  const handleCreateMetodoPago = async () => {
    if (!user) { await Swal.fire('Inicia sesión', 'Debes iniciar sesión', 'warning'); return; }
    if (!paymentForm.tipo_metodo) { showAlert({ type: 'warning', message: 'Selecciona tipo de método' }); return; }
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const payload = {
        tipo_metodo: paymentForm.tipo_metodo,
        numero_cuenta: paymentForm.numero_cuenta || null,
        titular: paymentForm.titular || null,
      };
      const res = await axios.post("http://localhost:8000/metodo_pago/", payload, { headers });
  showAlert({ type: 'success', message: 'Método de pago creado correctamente' });
      setPaymentForm({ tipo_metodo: '', numero_cuenta: '', titular: '' });
      // refrescar lista
      await fetchMetodosPago();
    } catch (err) {
      console.error('Error creando método de pago:', err.response?.data || err);
      showAlert({ type: 'error', message: 'No se pudo crear el método de pago: ' + (err.response?.data?.detail || err.message) });
    }
  };

  const handleDeleteMetodo = async (id) => {
    if (!confirm('¿Eliminar este método de pago?')) return;
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      await axios.delete(`http://localhost:8000/metodo_pago/${id}`, { headers });
      showAlert({ type: 'success', message: 'Método eliminado' });
      await fetchMetodosPago();
    } catch (err) {
      console.error('Error eliminando método:', err.response?.data || err);
      showAlert({ type: 'error', message: 'No se pudo eliminar el método: ' + (err.response?.data?.detail || err.message) });
    }
  };

  // Desactivar cuenta (no borrar) — cambia estado_usuario a 'Inactivo' y cierra sesión
  const handleDeactivateAccount = async () => {
    if (!confirm('¿Estás seguro de desactivar tu cuenta? Esto cerrará tu sesión y no podrás volver a iniciar sesión hasta reactivar.')) return;
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      await axios.put(`http://localhost:8000/usuarios/${user.id_usuario}`, { estado_usuario: 'Inactivo' }, { headers });
      showAlert({ type: 'info', message: 'Tu cuenta ha sido marcada como inactiva. Se cerrará la sesión.' });
      // cerrar sesión en frontend
      logout();
    } catch (err) {
      console.error('Error desactivando cuenta:', err.response?.data || err);
      showAlert({ type: 'error', message: 'No se pudo desactivar la cuenta: ' + (err.response?.data?.detail || err.message) });
    }
  };

  // Actualizar estado de cita
  const handleUpdateCitaEstado = async (citaId, nuevoEstado) => {
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      await axios.put(`http://localhost:8000/citas/${citaId}`, 
        { estado_cita: nuevoEstado },
        { headers }
      );
      // Actualizar lista de citas
      const citasActualizadas = citas.map(c => 
        c.id_cita === citaId ? { ...c, estado_cita: nuevoEstado } : c
      );
      setCitas(citasActualizadas);
    } catch (err) {
      console.error('Error actualizando cita:', err.response?.data || err);
      showAlert({ type: 'error', message: 'No se pudo actualizar el estado de la cita: ' + (err.response?.data?.detail || err.message) });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 via-yellow-100 to-green-200 px-4">
        <div className="text-center p-10 bg-white rounded-3xl shadow-lg max-w-md animate-fadeIn">
          <h2 className="text-3xl font-bold mb-4 text-[#7A8358]">
            Acceso requerido
          </h2>
          <p className="text-gray-600 text-lg">
            Debes iniciar sesión para ver tu cuenta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F3EE] to-[#E6E3D3] py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold text-[#7A8358] drop-shadow-md tracking-wide animate-fadeInDown">
          Mi cuenta
        </h1>

        {/* Datos del usuario */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-green-200 animate-fadeInUp hover:shadow-2xl transition-shadow duration-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-green-300 pb-2">
            Datos de usuario
          </h2>
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Foto */}
            <div className="w-full md:w-48 flex flex-col items-center gap-4">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#7A8358] shadow-lg">
                <img
                  src={getProfileImageSrc(user.imagen_usuario)}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  id="profile-picture-input"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      setUploading(true);
                      const formData = new FormData();
                      formData.append("file", file);
                      const headers = {
                        Authorization: `Bearer ${user.token}`,
                        Accept: "application/json",
                      };
                      delete headers["Content-Type"];
                      const response = await axios.patch(
                        `http://localhost:8000/usuarios/${user.id_usuario}/imagen`,
                        formData,
                        { headers }
                      );
                      const newImageUrl = response.data.imagen_usuario;
                      localStorage.setItem("imagen_usuario", newImageUrl);
                      setUser((prev) => ({
                        ...prev,
                        imagen_usuario: newImageUrl,
                      }));
                      alert("Imagen de perfil actualizada correctamente");
                    } catch (err) {
                      console.error(err);
                      alert("Error al actualizar la imagen de perfil.");
                    } finally {
                      setUploading(false);
                    }
                  }}
                />
                <button
                  onClick={() =>
                    document.getElementById("profile-picture-input").click()
                  }
                  disabled={uploading}
                  className="px-4 py-2 bg-[#7A8358] hover:bg-[#90a06a] disabled:bg-gray-400 transition-colors rounded-full text-white text-sm font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-green-400"
                >
                  {uploading ? "Subiendo..." : "Cambiar foto"}
                </button>
              </div>
            </div>

            {/* Info usuario */}
            <div className="flex-1">
              <p className="text-lg mb-2">
                <strong className="text-[#7A8358]">Correo:</strong> {user.correo}
              </p>
              {/* No mostramos IDs en la interfaz */}
              
              

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => {
                    setEditData(prev => ({...prev, type: 'datos'}));
                    setShowEditModal(true);
                  }}
                  className="px-5 py-2 bg-[#7A8358] hover:bg-[#90a06a] text-white rounded-full font-semibold shadow-md transition"
                >
                  📝 Editar datos
                </button>
                {/* Opción de cambiar contraseña removida del perfil de usuario (según solicitud) */}
                <button
                  onClick={() => setShowPetModal(true)}
                  className="px-5 py-2 bg-[#c8a67a] hover:bg-[#b18f65] text-white rounded-full font-semibold shadow-md transition"
                >
                  🐾 Registrar mascota
                </button>
                <button
                  onClick={handleDeactivateAccount}
                  className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold shadow-md transition"
                >
                  🗑️ Desactivar cuenta
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Sección mascotas */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-amber-200 animate-fadeInUp hover:shadow-2xl transition-shadow duration-500 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-amber-300 pb-2">
            Mis Mascotas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mascotas.map((mascota) => (
              <div
                key={mascota.id_mascota}
                className="p-4 rounded-xl border bg-amber-50 hover:bg-amber-100 transition-colors"
              >
                <h3 className="font-semibold text-lg text-amber-800">
                  {mascota.nombre_mascota}
                </h3>
                <p className="text-amber-700">
                  Especie: {mascota.especie_mascota}
                </p>
                <p className="text-amber-700">Raza: {mascota.raza_mascota}</p>
                <p className="text-amber-700">
                  Edad: {mascota.edad_mascota} años
                </p>
                <p className="text-amber-700">
                  Peso: {mascota.peso_mascota} kg
                </p>
              </div>
            ))}
            <button
              onClick={() => setShowPetModal(true)}
              className="p-4 rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-400 flex items-center justify-center text-amber-600 hover:text-amber-700 transition-colors"
            >
              + Agregar nueva mascota
            </button>
          </div>
        </section>

        {/* Sección métodos de pago */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-blue-200 animate-fadeInUp hover:shadow-2xl transition-shadow duration-500 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-blue-300 pb-2">
            Métodos de pago
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Crear nuevo método</h3>
              <label className="block text-sm font-medium text-gray-700">Tipo de método<span className="text-red-500"> *</span></label>
              <select
                className="mt-1 mb-3 block w-full rounded-md border-gray-300 shadow-sm"
                value={paymentForm.tipo_metodo}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, tipo_metodo: e.target.value }))}
              >
                <option value="">-- Selecciona --</option>
                <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                <option value="Tarjeta Débito">Tarjeta Débito</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Nequi">Nequi</option>
                <option value="Daviplata">Daviplata</option>
                <option value="PSE">PSE</option>
              </select>

              <label className="block text-sm font-medium text-gray-700">Número / cuenta *</label>
              <input
                type="text"
                className="mt-1 mb-3 block w-full rounded-md border-gray-300 shadow-sm"
                value={paymentForm.numero_cuenta}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, numero_cuenta: e.target.value }))}
              />

              <label className="block text-sm font-medium text-gray-700">Titular *</label>
              <input
                type="text"
                className="mt-1 mb-4 block w-full rounded-md border-gray-300 shadow-sm"
                value={paymentForm.titular}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, titular: e.target.value }))}
              />

              <div className="flex gap-3">
                <button
                  onClick={handleCreateMetodoPago}
                  className="px-4 py-2 bg-[#7A8358] text-white rounded-full"
                >
                  Guardar método
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Tus métodos</h3>
              {metodosPago.length === 0 ? (
                <p className="text-sm text-gray-500">No tienes métodos registrados.</p>
              ) : (
                <div className="space-y-3">
                  {metodosPago.map((m) => (
                    <div key={m.id_metodo_pago} className="p-3 rounded-lg border bg-blue-50 flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{m.tipo_metodo} {m.titular ? `— ${m.titular}` : ''}</div>
                        <div className="text-sm text-gray-600">{m.numero_cuenta ? (m.numero_cuenta.length > 6 ? '****' + m.numero_cuenta.slice(-6) : m.numero_cuenta) : '—'}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteMetodo(m.id_metodo_pago)}
                          className="px-3 py-1 bg-red-500 text-white rounded-full text-sm"
                        >Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sección citas */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-indigo-200 animate-fadeInUp hover:shadow-2xl transition-shadow duration-500 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-indigo-300 pb-2">
            Mis Citas Médicas
          </h2>
          {loading ? (
            <p>Cargando citas...</p>
          ) : citas.length === 0 ? (
            <p>No tienes citas agendadas.</p>
          ) : (
            <div className="space-y-4">
              {citas.map((cita) => {
                const mascota = mascotas.find(m => m.id_mascota === cita.id_mascota);
                const servicio = servicios?.find(s => s.id_servicio === cita.id_servicio);
                console.log("Cita data:", cita); // Debug
                return (
                  <div
                    key={cita.id_cita}
                    className="p-4 rounded-xl border bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-indigo-900">
                          Cita #{cita.id_cita}
                        </h3>
                        <p className="text-indigo-700">
                          Mascota: {mascota?.nombre_mascota || 'No disponible'}
                        </p>
                        <p className="text-indigo-700">
                          Servicio: {servicio?.tipo_servicio || 'No disponible'}
                        </p>
                        <p className="text-indigo-700">
                          Fecha: {new Date(cita.fecha_cita).toLocaleDateString()}
                        </p>
                        <p className="text-indigo-700">
                          Hora: {typeof cita.hora_cita === 'string' ? cita.hora_cita.substring(0, 5) : '--:--'}
                        </p>
                        <p className="text-indigo-700">
                          Estado: <span className={`font-medium ${
                            cita.estado_cita === 'pendiente' ? 'text-yellow-600' :
                            cita.estado_cita === 'confirmada' ? 'text-green-600' :
                            cita.estado_cita === 'cancelada' ? 'text-red-600' :
                            'text-blue-600'
                          }`}>{cita.estado_cita || 'pendiente'}</span>
                        </p>
                        <p className="text-indigo-700">
                          Método de pago: {cita.metodo_pago || 'No especificado'}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {cita.estado_cita === 'pendiente' && (
                          <>
                            <button
                              onClick={() => handleUpdateCitaEstado(cita.id_cita, 'confirmada')}
                              className="px-3 py-1 bg-green-500 text-white rounded-full text-sm hover:bg-green-600"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => handleUpdateCitaEstado(cita.id_cita, 'cancelada')}
                              className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Pedidos */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-green-200 animate-fadeInUp hover:shadow-2xl transition-shadow duration-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-green-300 pb-2">
            Historial de pedidos
          </h2>
          {loading ? (
            <p>Cargando pedidos...</p>
          ) : pedidos.length === 0 ? (
            <p>No tienes pedidos aún.</p>
          ) : (
            <div className="space-y-4">
              {pedidos.map((p) => {
                const pedidoRecibo = recibos.find(
                  (r) => r.id_pedido === p.id_pedido
                );
                return (
                  <div
                    key={p.id_pedido}
                    className="p-4 rounded-xl border bg-gray-50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold">Pedido #{p.id_pedido}</p>
                      <p className="text-sm text-gray-600">
                        Estado: <span className="font-medium">{p.estado_pedido}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: <span className="font-medium">${Number(p.total).toFixed(2)}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Fecha:{" "}
                        {p.fecha_pedido
                          ? new Date(p.fecha_pedido).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {pedidoRecibo ? (
                        <button
                          onClick={async () => {
                            try {
                              // obtener detalles y productos para mostrar precio por producto
                              const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
                              const [detRes, prodRes] = await Promise.all([
                                axios.get('http://localhost:8000/detalle_pedido/', { headers }),
                                axios.get('http://localhost:8000/productos/', { headers })
                              ]);
                              const detalles = Array.isArray(detRes.data) ? detRes.data : [];
                              const productos = Array.isArray(prodRes.data) ? prodRes.data : [];
                              const items = detalles
                                .filter(d => d.id_pedido === p.id_pedido)
                                .map(d => {
                                  const prod = productos.find(x => x.id_producto === d.id_producto) || {};
                                  return {
                                    id_detalle: d.id_detalle_pedido,
                                    id_producto: d.id_producto,
                                    nombre_producto: prod.nombre_producto || 'Producto',
                                    precio_unitario: prod.precio_producto ? Number(prod.precio_producto) : (d.subtotal ? Number(d.subtotal) : 0),
                                    cantidad: d.cantidad,
                                    subtotal: Number(d.subtotal)
                                  };
                                });

                              // attach items to the recibo object for the modal
                              setSelectedRecibo({ ...pedidoRecibo, items, pedido: p });
                              setShowReciboModal(true);
                            } catch (err) {
                              console.error('Error cargando detalles del recibo', err);
                              // fallback: mostrar recibo sin detalles
                              setSelectedRecibo(pedidoRecibo);
                              setShowReciboModal(true);
                            }
                          }}
                          className="px-4 py-2 bg-[#7A8358] text-white rounded-full"
                        >
                          Ver recibo
                        </button>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">
                          No pagado
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Modal Recibo */}
        {showReciboModal && selectedRecibo && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl max-w-lg w-full">
              <button
                className="float-right text-gray-500"
                onClick={() => setShowReciboModal(false)}
              >
                Cerrar
              </button>
              <h3 className="text-xl font-bold mb-4">Recibo</h3>
              <div>
                <p>
                  <strong>ID Recibo:</strong> {selectedRecibo.id_recibo}
                </p>
                <p>
                  <strong>Monto:</strong> $
                  {Number(selectedRecibo.monto_pagado).toFixed(2)}
                </p>
                {/* Mostrar items del pedido con precio unitario si están disponibles */}
                {selectedRecibo.items && selectedRecibo.items.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-semibold mb-2">Detalle</h4>
                    <div className="space-y-2">
                      {selectedRecibo.items.map(it => (
                        <div key={it.id_detalle} className="flex justify-between text-sm text-gray-700">
                          <div>
                            <div className="font-medium">{it.nombre_producto}</div>
                            <div className="text-xs text-gray-500">Cantidad: {it.cantidad}</div>
                          </div>
                          <div className="text-right">
                            <div>${Number(it.precio_unitario).toFixed(2)}</div>
                            <div className="text-xs text-gray-500">Subtotal: ${Number(it.subtotal).toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <p>
                  <strong>Estado:</strong> {selectedRecibo.estado_recibo}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {selectedRecibo.fecha_recibo
                    ? new Date(selectedRecibo.fecha_recibo).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modales */}
        <EditarUsuarioModal
          show={showEditModal}
          setShow={setShowEditModal}
          editData={editData}
          setEditData={setEditData}
          handleUpdateUser={handleUpdateUser}
        />

        <RegistrarMascotaModal
          show={showPetModal}
          setShow={setShowPetModal}
          petForm={petForm}
          setPetForm={setPetForm}
          handleRegisterPet={handleRegisterPet}
        />
      </div>
    </div>
  );
}
