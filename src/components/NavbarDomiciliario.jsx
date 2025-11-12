import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function DomiciliaryNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // redirige al inicio después de cerrar sesión
  };

  return (
    <nav className="bg-[#7A8358] text-white px-6 py-3 flex justify-between items-center shadow-md fixed w-full z-50">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <img src="/img/logo.png" alt="logo" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
          <div>
            <div className="font-bold text-lg">Panel Domiciliario</div>
          </div>
        </Link>
      </div>

      <ul className="flex gap-6 items-center font-medium">
        <li>
          <Link to="/domiciliario" className="hover:text-gray-200 transition-colors duration-200">Inicio</Link>
        </li>
        <li>
          <Link to="/domiciliario/perfil" className="hover:text-gray-200 transition-colors duration-200">Perfil</Link>
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
