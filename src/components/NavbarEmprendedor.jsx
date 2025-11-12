import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMenu } from "react-icons/fi";

const NavbarEmprendedor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[#7A8358] text-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y Nombre */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                className="h-12 w-auto"
                src="/img/logo.png"
                alt="Logo"
              />
              <span className="text-white font-bold text-xl ml-2">
                PetHealth Services
              </span>
            </Link>
          </div>

          {/* Enlaces de navegación - Escritorio */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/crear-servicio"
              className="text-white hover:opacity-90 px-3 py-2 rounded-md font-medium"
            >
              Crear Servicio
            </Link>
            <Link
              to="/mis-servicios"
              className="text-white hover:opacity-90 px-3 py-2 rounded-md font-medium"
            >
              Mis Servicios
            </Link>
            <Link
              to="/citas-recibidas"
              className="text-white hover:opacity-90 px-3 py-2 rounded-md font-medium"
            >
              Citas
            </Link>
            <div className="relative group">
              {/* Hacer el texto un Link para que en click navegue también (útil en mobile/no-hover) */}
              <Link
                to="/mi-cuenta"
                className="text-[#4e5932] hover:text-[#7a8358] px-3 py-2 rounded-md font-medium"
              >
                Mi Cuenta
              </Link>
              <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link
                  to="/mi-cuenta"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Editar Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Botón menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:opacity-90"
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`md:hidden ${
          isOpen ? "block" : "hidden"
        } bg-[#7A8358] shadow-lg`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/crear-servicio"
            className="block text-white hover:opacity-90 px-3 py-2 rounded-md text-base font-medium"
          >
            Crear Servicio
          </Link>
          <Link
            to="/mis-servicios"
            className="block text-[#4e5932] hover:text-[#7a8358] px-3 py-2 rounded-md text-base font-medium"
          >
            Mis Servicios
          </Link>
          <Link
            to="/mi-cuenta"
            className="block text-[#4e5932] hover:text-[#7a8358] px-3 py-2 rounded-md text-base font-medium"
          >
            Mi Cuenta
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-base font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarEmprendedor;