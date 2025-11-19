import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
  <nav className="fixed w-full z-50 bg-[#7A8358] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3" aria-label="Inicio">
              <img src="/img/logo.png" alt="logo" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
              <div>
                <div className="text-lg font-bold leading-tight">Pet Health Services</div>
                <div className="text-xs opacity-80">Cuidado veterinario y domiciliario</div>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/productos" className="hover:underline hover:opacity-90">Productos</Link>
            <Link to="/reservar-servicios" className="hover:underline hover:opacity-90">Servicios</Link>
            <Link to="/ubicaciones" className="hover:underline hover:opacity-90">Ubicaciones</Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              user.is_proveedor ? (
                <div className="hidden md:flex items-center gap-3">
                  {/* Provider menu moved to app-level header */}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/mi-cuenta" className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20">
                    <FiUser />
                    <span className="text-sm">{user.correo}</span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="px-3 py-1 bg-red-500 rounded-lg text-white text-sm hover:bg-red-600 flex items-center gap-2"
                  >
                    <FiLogOut /> Salir
                  </button>
                </div>
              )
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-3 py-1 bg-white/20 rounded-lg hover:bg-white/30">Iniciar sesión</Link>
                <Link to="/register" className="px-3 py-1 bg-white text-[#4e5932] rounded-lg font-semibold">Registrarse</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md bg-white/10"
              onClick={() => setOpen((v) => !v)}
              aria-label="Abrir menú"
            >
              {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
  <div className={`${open ? "block" : "hidden"} md:hidden bg-linear-to-b from-[#6f774f] to-[#59603e]`}>
        <div className="px-4 pt-4 pb-6 space-y-3">
          <Link to="/productos" className="block text-white/95 px-3 py-2 rounded-md">Productos</Link>
          <Link to="/reservar-servicios" className="block text-white/95 px-3 py-2 rounded-md">Servicios</Link>
          <Link to="/ubicaciones" className="block text-white/95 px-3 py-2 rounded-md">Ubicaciones</Link>
          {!user ? (
            <>
              <Link to="/login" className="block mt-2 px-3 py-2 bg-white/20 rounded-md">Iniciar sesión</Link>
              <Link to="/register" className="block mt-1 px-3 py-2 bg-white rounded-md text-[#4e5932] font-semibold">Registrarse</Link>
            </>
          ) : user.is_proveedor ? (
            <>
              <Link to="/proveedor/profile" className="block mt-2 px-3 py-2 bg-white/10 rounded-md">Perfil</Link>
              <button onClick={() => logout()} className="w-full text-left mt-1 px-3 py-2 bg-red-500 rounded-md text-white">Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/mi-cuenta" className="block mt-2 px-3 py-2 bg-white/10 rounded-md">Mi cuenta</Link>
              <button onClick={() => logout()} className="w-full text-left mt-1 px-3 py-2 bg-red-500 rounded-md text-white">Cerrar sesión</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

