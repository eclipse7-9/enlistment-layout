import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

// Importar tus componentes con los nombres correctos
import EditarUsuarioModal from "../components/EditUsuario.jsx";
import RegistrarMascotaModal from "../components/RegistrarMascota.jsx";

export default function MiCuenta() {
  const { user, setUser } = useAuth();

  const getProfileImageSrc = (img) => {
    if (!img) return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    if (img.startsWith('data:')) return img;
    if (img.startsWith('http')) return img;
    return `http://localhost:8000${img}`;
  };

  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [recibos, setRecibos] = useState([]);
  const [editingPedidoId, setEditingPedidoId] = useState(null);
  const [editForm, setEditForm] = useState({ total: "", estado_pedido: "" });
  const [selectedRecibo, setSelectedRecibo] = useState(null);
  const [showReciboModal, setShowReciboModal] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Estados para mostrar los modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);

  // Estado para el formulario de mascota
  const [petForm, setPetForm] = useState({
    nombre_mascota: "",
    peso_mascota: "",
    especie_mascota: "",
    raza_mascota: "",
    edad_mascota: "",
    altura_mascota: "",
  });

  // Estado para editar usuario
  const [editData, setEditData] = useState({
    correo: user?.correo || "",
  });

  // Función para actualizar usuario
  const handleUpdateUser = async () => {
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const response = await axios.patch(
        `http://localhost:8000/usuarios/${user.id_usuario}`,
        editData,
        { headers }
      );
      setUser(response.data);
      alert("Datos actualizados correctamente");
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      alert("Error al actualizar datos del usuario");
    }
  };

  // Función para registrar mascota
  const handleRegisterPet = async () => {
    try {
      if (!user) return;
      const headers = { Authorization: `Bearer ${user.token}` };
      await axios.post("http://localhost:8000/mascotas", petForm, { headers });
      alert("Mascota registrada correctamente");
      setShowPetModal(false);
      setPetForm({
        nombre_mascota: "",
        peso_mascota: "",
        especie_mascota: "",
        raza_mascota: "",
        edad_mascota: "",
        altura_mascota: "",
      });
    } catch (err) {
      console.error(err);
      alert("Error al registrar la mascota");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return setLoading(false);
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const [pedRes, recRes] = await Promise.all([
          axios.get("http://localhost:8000/pedidos/", { headers }),
          axios.get("http://localhost:8000/recibos/", { headers }),
        ]);
        setPedidos(Array.isArray(pedRes.data) ? pedRes.data : []);
        setRecibos(Array.isArray(recRes.data) ? recRes.data : []);
      } catch (err) {
        console.error("Error cargando datos de cuenta:", err);
        setError("No se pudieron cargar los datos. Revisa la consola.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 via-yellow-100 to-green-200 px-4">
        <div className="text-center p-10 bg-white rounded-3xl shadow-lg max-w-md animate-fadeIn">
          <h2 className="text-3xl font-bold mb-4 text-[#7A8358]">Acceso requerido</h2>
          <p className="text-gray-600 text-lg">Debes iniciar sesión para ver tu cuenta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F3EE] to-[#E6E3D3] py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold text-[#7A8358] drop-shadow-md tracking-wide animate-fadeInDown">Mi cuenta</h1>

        {/* Datos de usuario */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-green-200 animate-fadeInUp hover:shadow-2xl transition-shadow duration-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-green-300 pb-2">Datos de usuario</h2>
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Foto de perfil */}
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
                      formData.append('file', file);
                      const headers = { Authorization: `Bearer ${user.token}`, 'Accept': 'application/json' };
                      delete headers['Content-Type'];
                      const response = await axios.patch(
                        `http://localhost:8000/usuarios/${user.id_usuario}/imagen`,
                        formData,
                        { headers }
                      );
                      const newImageUrl = response.data.imagen_usuario;
                      localStorage.setItem("imagen_usuario", newImageUrl);
                      setUser(prev => ({ ...prev, imagen_usuario: newImageUrl }));
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
                  onClick={() => document.getElementById('profile-picture-input').click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-[#7A8358] hover:bg-[#90a06a] disabled:bg-gray-400 transition-colors rounded-full text-white text-sm font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-green-400"
                >
                  {uploading ? 'Subiendo...' : 'Cambiar foto'}
                </button>
              </div>
            </div>

            {/* Datos del usuario */}
            <div className="flex-1">
              <p className="text-lg mb-2"><strong className="text-[#7A8358]">Correo:</strong> {user.correo}</p>
              <p className="text-lg mb-2"><strong className="text-[#7A8358]">ID usuario:</strong> {user.id_usuario}</p>
              <p className="text-sm text-gray-500 italic">Rol: {user.id_rol}</p>

              {/* Botones de los modales */}
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-5 py-2 bg-[#7A8358] hover:bg-[#90a06a] text-white rounded-full font-semibold shadow-md transition"
                >
                  📝 Editar usuario
                </button>
                <button
                  onClick={() => setShowPetModal(true)}
                  className="px-5 py-2 bg-[#c8a67a] hover:bg-[#b18f65] text-white rounded-full font-semibold shadow-md transition"
                >
                  🐾 Registrar mascota
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Aquí van tus secciones de pedidos y recibos */}
        {/* ... tu código de historial de pedidos y recibos ... */}

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
