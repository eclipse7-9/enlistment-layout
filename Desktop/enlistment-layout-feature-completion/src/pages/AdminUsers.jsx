import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function AdminUsers() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [editUser, setEditUser] = useState(null); // usuario que se está editando
  const [formData, setFormData] = useState({
    direccion_usuario: "",
    codigo_postal_usuario: "",
  });

  // Cargar usuarios
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = () => {
    axios
      .get("http://localhost:8000/usuarios")
      .then((res) => setUsuarios(res.data))
      .catch((err) => console.error(err));
  };

  // ---------------- Eliminar ----------------
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        await axios.delete(`http://localhost:8000/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        fetchUsuarios(); // recargar lista
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  // ---------------- Cambiar estado ----------------
  const handleToggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo";
    try {
      await axios.put(`http://localhost:8000/usuarios/${id}`, {
        estado_usuario: nuevoEstado,
      });
      fetchUsuarios();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
    }
  };

  // ---------------- Editar ----------------
  const handleEdit = (usuario) => {
    setEditUser(usuario);
    setFormData({
      direccion_usuario: usuario.direccion_usuario || "",
      codigo_postal_usuario: usuario.codigo_postal_usuario || "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:8000/usuarios/${editUser.id_usuario}`, {
        direccion_usuario: formData.direccion_usuario,
        codigo_postal_usuario: formData.codigo_postal_usuario,
      });
      setEditUser(null);
      fetchUsuarios();
    } catch (err) {
      console.error("Error al editar:", err);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Gestión de Usuarios</h1>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id_usuario}>
                <td>{u.id_usuario}</td>
                <td>
                  {u.nombre_usuario} {u.apellido_usuario}
                </td>
                <td>{u.correo_usuario}</td>
                <td>{u.telefono_usuario}</td>
                <td>{u.id_rol === 1 ? "Administrador" : "Cliente"}</td>
                <td>
                  <span
                    className={`estado ${
                      u.estado_usuario === "activo"
                        ? "estado-activo"
                        : "estado-inactivo"
                    }`}
                  >
                    {u.estado_usuario}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="admin-btn btn-edit"
                      onClick={() => handleEdit(u)}
                    >
                      Editar
                    </button>
                    <button
                      className="admin-btn btn-delete"
                      onClick={() => handleDelete(u.id_usuario)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="admin-btn btn-estado"
                      onClick={() =>
                        handleToggleEstado(u.id_usuario, u.estado_usuario)
                      }
                    >
                      Cambiar Estado
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de edición simple */}
      {editUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>Editar Usuario #{editUser.id_usuario}</h2>
            <label>
              Dirección:
              <input
                type="text"
                value={formData.direccion_usuario}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    direccion_usuario: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Código Postal:
              <input
                type="text"
                value={formData.codigo_postal_usuario}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    codigo_postal_usuario: e.target.value,
                  })
                }
              />
            </label>
            <div className="modal-actions">
              <button onClick={handleSaveEdit} className="admin-btn btn-edit">
                Guardar
              </button>
              <button
                onClick={() => setEditUser(null)}
                className="admin-btn btn-delete"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
