import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FaEdit, FaExchangeAlt } from "react-icons/fa";

export default function AdminUsers() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [query, setQuery] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [estadoUser, setEstadoUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    apellido_usuario: "",
    correo_usuario: "",
    telefono_usuario: "",
    direccion_usuario: "",
    codigo_postal_usuario: "",
  });

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const filteredUsuarios = usuarios.filter((u) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (u.nombre_usuario || "").toLowerCase().includes(q) ||
      (u.apellido_usuario || "").toLowerCase().includes(q) ||
      (u.correo_usuario || "").toLowerCase().includes(q)
    );
  });

  const fetchUsuarios = () => {
    axios
      .get("http://localhost:8000/usuarios")
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error(err));
  };

  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      await axios.put(`http://localhost:8000/usuarios/${id}`, {
        estado_usuario: nuevoEstado,
      });
      setEstadoUser(null);
      fetchUsuarios();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  const handleEdit = (usuario) => {
    if (Number(usuario.id_rol) === 1) return; // Los admins (rol 1) no se editan

    setEditUser(usuario);
    setFormData({
      nombre_usuario: usuario.nombre_usuario || "",
      apellido_usuario: usuario.apellido_usuario || "",
      correo_usuario: usuario.correo_usuario || "",
      telefono_usuario: usuario.telefono_usuario || "",
      direccion_usuario: usuario.direccion_usuario || "",
      codigo_postal_usuario: usuario.codigo_postal_usuario || "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:8000/usuarios/${editUser.id_usuario}`, formData);
      setEditUser(null);
      fetchUsuarios();
    } catch (err) {
      console.error("Error al editar:", err);
    }
  };

  return (
    <section className="min-h-screen bg-[#f5f3ee] py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm border border-[#d8c6aa] shadow-lg rounded-2xl p-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-[#7a8358] mb-8 text-center font-[Poppins]"
        >
          Gestión de Usuarios
        </motion.h1>

        <div className="flex items-center justify-between mb-6">
          <div />
          <div className="w-full max-w-sm">
            <input
              type="search"
              placeholder="Buscar usuario por nombre o correo..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-2 border border-[#cfc7b2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a8358]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-[#d8c6aa] rounded-lg overflow-hidden">
            <thead className="bg-[#7a8358] text-white text-left">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="text-[#4e5932] bg-white">
              {filteredUsuarios.map((u, index) => {
                const isAdmin = Number(u.id_rol) === 1; // Rol 1 = admin

                return (
                  <motion.tr
                    key={u.id_usuario}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`border-t border-[#e0d8c6] hover:bg-[#f7f4ef] transition-colors ${
                      !isAdmin ? "bg-[#f2f0e5]" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3">{u.id_usuario}</td>
                    <td className="px-4 py-3">
                      {u.nombre_usuario} {u.apellido_usuario}
                    </td>
                    <td className="px-4 py-3">{u.correo_usuario}</td>
                    <td className="px-4 py-3">{u.telefono_usuario}</td>
                    <td className="px-4 py-3">
                      {isAdmin ? "Administrador" : "Cliente"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          u.estado_usuario === "activo"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.estado_usuario}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        {/* Editar */}
                        <button
                          disabled={isAdmin}
                          onClick={() => !isAdmin && handleEdit(u)}
                          className={`px-3 py-1 rounded-lg flex items-center gap-1 ${
                            !isAdmin
                              ? "text-[#7a8358] hover:text-[#5c6343] bg-[#e8e4d8]"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <FaEdit /> Editar
                        </button>

                        {/* Cambiar estado */}
                        <button
                          disabled={isAdmin}
                          onClick={() => !isAdmin && setEstadoUser(u)}
                          className={`px-3 py-1 rounded-lg flex items-center gap-1 ${
                            !isAdmin
                              ? "text-white bg-[#7a8358] hover:bg-[#687149]"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <FaExchangeAlt /> Estado
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de edición */}
      {editUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 w-96"
          >
            <h2 className="text-xl font-bold text-[#7a8358] mb-4">
              Editar Usuario #{editUser.id_usuario}
            </h2>

            {Object.entries({
              nombre_usuario: "Nombre",
              apellido_usuario: "Apellido",
              correo_usuario: "Correo",
              telefono_usuario: "Teléfono",
              direccion_usuario: "Dirección",
              codigo_postal_usuario: "Código Postal",
            }).map(([key, label]) => (
              <label key={key} className="block mb-3">
                <span className="text-[#4e5932] font-semibold">{label}:</span>
                <input
                  type="text"
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  className="w-full mt-1 border border-[#cfc7b2] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#7a8358]"
                />
              </label>
            ))}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleSaveEdit}
                className="bg-[#7a8358] hover:bg-[#687149] text-white px-4 py-2 rounded-lg"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditUser(null)}
                className="bg-[#CC271B] hover:bg-[#9e4039] text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de cambiar estado */}
      {estadoUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 w-80 text-center"
          >
            <h2 className="text-xl font-bold text-[#7a8358] mb-6">
              Cambiar Estado
            </h2>
            <p className="text-[#4e5932] mb-6">
              Selecciona el nuevo estado para{" "}
              <strong>{estadoUser.nombre_usuario}</strong>
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() =>
                  handleChangeEstado(estadoUser.id_usuario, "activo")
                }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Activo
              </button>
              <button
                onClick={() =>
                  handleChangeEstado(estadoUser.id_usuario, "inactivo")
                }
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Inactivo
              </button>
            </div>

            <button
              onClick={() => setEstadoUser(null)}
              className="mt-6 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Cancelar
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
