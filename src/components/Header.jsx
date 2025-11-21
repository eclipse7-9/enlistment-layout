import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../index.css";

const Header = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  // 🔹 Cierra el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Cierra el menú al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // 🔹 Cierra el menú al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setMenuOpen(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Controla la visibilidad del menú con animación suave
  useEffect(() => {
    if (menuOpen) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [menuOpen]);

  // 🔹 Efecto al cargar la página
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100); // da un pequeño delay para suavizar
  }, []);

  const handleLogoClick = () => {
    setRotating(true);
    setTimeout(() => setRotating(false), 1000);
  };

  // 🔹 Animación en clic + scroll al inicio
  const handleLinkClick = (e) => {
    const target = e.currentTarget;
    target.classList.add("animate-pulse-once");
    setTimeout(() => target.classList.remove("animate-pulse-once"), 400);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-[#7A8358] text-white shadow-md py-4 px-6 z-50 
      transition-all duration-700 ease-out 
      ${loaded ? "animate-headerLoad opacity-100" : "opacity-0 -translate-y-5"}`}
    >
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* LOGO + TÍTULO */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={handleLogoClick}>
          <img
            src="/img/logo.png"
            alt="Animales de granja - PET HEALTH-SERVICES"
            className={`w-16 h-16 object-cover rounded-full transition-transform duration-700 ${
              rotating ? "rotate-[360deg]" : ""
            }`}
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-[Poppins] uppercase drop-shadow-lg">
              Pet Health-Services
            </h1>
            <p className="text-xs md:text-sm text-gray-100 italic">
              Ayuda especializada en animales campestres
            </p>
          </div>
        </div>

        {/* BOTÓN MENÚ + CONTENEDOR */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`focus:outline-none transition-transform duration-300 ${
              menuOpen ? "rotate-180" : ""
            } relative z-20`}
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* MENÚ DESPLEGABLE */}
          {visible && (
            <div
              className={`absolute right-0 top-0 mt-10 w-64 
                         bg-[#6f7951]/90 backdrop-blur-md 
                         rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.35)] 
                         p-4 space-y-3 transform origin-top transition-all duration-300 ease-out
                         ${menuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-3"}`}
            >
              <Link
                to="/"
                onClick={handleLinkClick}
                className="block bg-[#F2E6D0] text-[#000000] font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Inicio
              </Link>
              <Link
                to="/productos"
                onClick={handleLinkClick}
                className="block bg-white text-[#7A8358] font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Productos
              </Link>
              <Link
                to="/reservar-servicios"
                onClick={handleLinkClick}
                className="block bg-[#F2E6D0] text-[#000000] font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Servicios Médicos
              </Link>
              <Link
                to="/ubicaciones"
                onClick={handleLinkClick}
                className="block bg-white text-[#7A8358] font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Ubicaciones
              </Link>

              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={handleLinkClick}
                    className="block bg-[#d6b991] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#c4a97f] transition"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    onClick={handleLinkClick}
                    className="block bg-[#556140] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#6b7450] transition"
                  >
                    Crear cuenta
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/mi-cuenta"
                    onClick={handleLinkClick}
                    className="block bg-[#F2E6D0] text-[#000000] font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                  >
                    Mi cuenta
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="block w-full bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;