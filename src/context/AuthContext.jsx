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
    return token && correo && id_usuario && id_rol
      ? {
          correo,
          token,
          id_usuario: Number(id_usuario),
          id_rol: Number(id_rol),
          imagen_usuario,
        }
      : null;
  });

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("correo", userData.correo);
    localStorage.setItem("id_usuario", userData.id_usuario);
    localStorage.setItem("id_rol", userData.id_rol);
    if (userData.imagen_usuario) {
      localStorage.setItem("imagen_usuario", userData.imagen_usuario);
    }

    setUser({
      correo: userData.correo,
      token: userData.token,
      id_usuario: userData.id_usuario,
      id_rol: userData.id_rol,
      imagen_usuario: userData.imagen_usuario,
    });
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
