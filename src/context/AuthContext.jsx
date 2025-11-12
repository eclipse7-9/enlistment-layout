// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const correo = localStorage.getItem("correo");
    const id_usuario = localStorage.getItem("id_usuario");
    const id_rol = localStorage.getItem("id_rol");
    const imagen_usuario = localStorage.getItem("imagen_usuario");
    const id_proveedor = localStorage.getItem("id_proveedor");
    const nombre_compania = localStorage.getItem("nombre_compania");
    return token && correo && id_usuario && id_rol
      ? {
          correo,
          token,
          id_usuario: Number(id_usuario),
          id_rol: Number(id_rol),
          imagen_usuario,
        }
      : token && id_proveedor
      ? {
          correo,
          token,
          id_proveedor: Number(id_proveedor),
          is_proveedor: true,
          nombre_compania: nombre_compania || null,
        }
      : null;
  });

  const login = (userData) => {
    // Support both usuario and proveedor login payloads
    localStorage.setItem("token", userData.token);
    if (userData.correo) localStorage.setItem("correo", userData.correo);
    if (userData.id_usuario !== undefined) localStorage.setItem("id_usuario", userData.id_usuario);
    if (userData.id_rol !== undefined) localStorage.setItem("id_rol", userData.id_rol);
    if (userData.imagen_usuario) {
      localStorage.setItem("imagen_usuario", userData.imagen_usuario);
    }
    if (userData.id_proveedor !== undefined) {
      localStorage.setItem("id_proveedor", userData.id_proveedor);
      localStorage.setItem("nombre_compania", userData.nombre_compania || "");
    }

    // Build frontend user object
    const frontendUser = userData.id_proveedor !== undefined
      ? {
          correo: userData.correo || userData.correo_proveedor,
          token: userData.token,
          id_proveedor: userData.id_proveedor,
          is_proveedor: true,
          nombre_compania: userData.nombre_compania || null,
        }
      : {
          correo: userData.correo,
          token: userData.token,
          id_usuario: userData.id_usuario,
          id_rol: userData.id_rol,
          imagen_usuario: userData.imagen_usuario,
        };

    setUser(frontendUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("correo");
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("id_rol");
    localStorage.removeItem("imagen_usuario");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
