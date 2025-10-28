import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../index.css";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#7A8358] text-white shadow-md py-4 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
        
        {/* LOGO + TÍTULO */}
        <div className="flex items-center gap-4">
          <img
            src="/img/logo.png"
            alt="Animales de granja - PET HEALTH-SERVICES"
            className="w-16 h-16 rounded-full shadow-md"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-[Poppins] uppercase drop-shadow-lg">
              Pet Health-Services
            </h1>
            <p className="text-sm md:text-base text-gray-100 italic">
              Ayuda especializada en animales campestres
            </p>
          </div>
        </div>

        {/* NAV */}
        <nav className="mt-4 md:mt-0 flex items-center gap-3">
          {!user && (
            <>
              <Link
                to="/login"
                className="bg-[#D6B991] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="bg-[#556140] text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-[#6b7450] transition"
              >
                Crear cuenta
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                to="/productos"
                className="bg-white text-[#7A8358] font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition"
              >
                Productos
              </Link>
              <button
                onClick={logout}
                className="bg-[#556140] hover:bg-[#6b7450] text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
