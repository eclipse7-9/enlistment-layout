import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";


export default function NavbarAdmin() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // redirige al inicio después de cerrar sesión
  };

  return (
    <nav className="bg-[#7A8358] text-white px-8 py-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-2">
        <h1 className="font-bold text-2xl font-[Poppins] tracking-wide">
          Panel de Administración
        </h1>
      </div>

      <ul className="flex gap-6 items-center font-medium">
        <li>
          <Link
            to="/admin/users"
            className="hover:text-gray-200 transition-colors duration-200"
          >
            Usuarios
          </Link>
        </li>
        <li>
          <Link
            to="/admin/products"
            className="hover:text-gray-200 transition-colors duration-200"
          >
            Productos
          </Link>
        </li>
        <li>
          <Link
            to="/admin/orders"
            className="hover:text-gray-200 transition-colors duration-200"
          >
            Pedidos
          </Link>
        </li>
        <li>
          <Link
            to="/admin/services"
            className="hover:text-gray-200 transition-colors duration-200"
          >
            Servicios
          </Link>
        </li>
        <li>
          <Link
            to="/admin/citas"
            className="hover:text-gray-200 transition-colors duration-200"
          >
            Citas
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="ml-4 bg-white text-[#7A8358] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
    </nav>
  );
}
