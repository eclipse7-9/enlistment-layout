import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DomiciliaryNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // redirige al inicio después de cerrar sesión
  };

  return (
    <nav className="bg-[#7A8358] text-white px-8 py-4 flex justify-between items-center shadow-md fixed w-full z-50">
      <div className="flex items-center gap-2">
        <h1 className="font-bold text-2xl font-[Poppins] tracking-wide">
          Panel Domiciliario
        </h1>
      </div>

      <ul className="flex gap-6 items-center font-medium">
        <li>
          <a
            href="/domiciliario/home"
            className="hover:text-gray-200 transition-colors duration-200"
          >
            Inicio
          </a>
        </li>
        <li>
          <a
            href="/domiciliario/pedidos"
            className="hover:text-gray-200 transition-colors duration-200"
          >
            Pedidos
          </a>
        </li>
        <li>
          <a
            href="/domiciliario/historial"
            className="hover:text-gray-200 transition-colors duration-200"
          >
            Historial
          </a>
        </li>
        <li>
          <a
            href="/domiciliario/perfil"
            className="hover:text-gray-200 transition-colors duration-200"
          >
            Perfil
          </a>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="ml-4 bg-[#7A8358] text-white border border-white px-4 py-2 rounded-lg font-semibold hover:bg-[#6e744f] transition-all duration-300"
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
    </nav>
  );
}
