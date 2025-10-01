import React, { useState } from "react";
import "../styles/AdminUsers.css"; // Creamos un CSS separado o puedes usar el mismo estilo base

// Datos iniciales de ejemplo
const initialUsers = [
  { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "Administrador" },
  { id: 2, name: "María López", email: "maria@example.com", role: "Usuario" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });

  // Eliminar usuario
  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // Editar usuario
  const handleEdit = (id) => {
    const user = users.find((u) => u.id === id);
    const updatedName = prompt("Editar nombre:", user.name);
    const updatedEmail = prompt("Editar email:", user.email);
    const updatedRole = prompt("Editar rol:", user.role);
    if (updatedName && updatedEmail && updatedRole) {
      setUsers(
        users.map((u) =>
          u.id === id ? { ...u, name: updatedName, email: updatedEmail, role: updatedRole } : u
        )
      );
    }
  };

  // Agregar usuario
  const handleAdd = () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      alert("Completa todos los campos");
      return;
    }
    setUsers([...users, { ...newUser, id: Date.now() }]);
    setNewUser({ name: "", email: "", role: "" });
  };

  return (
    <section className="admin-users">
      <h2>Administrar Usuarios</h2>

      {/* Formulario agregar usuario */}
      <div className="add-user-form">
        <input
          type="text"
          placeholder="Nombre"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Rol (Administrador/Usuario)"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        />
        <button onClick={handleAdd}>Agregar Usuario</button>
      </div>

      {/* Lista de usuarios */}
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <p>
              <b>{user.name}</b> <br />
              {user.email} <br />
              Rol: {user.role}
            </p>
            <button onClick={() => handleEdit(user.id)}>Editar</button>
            <button onClick={() => handleDelete(user.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminUsers;
