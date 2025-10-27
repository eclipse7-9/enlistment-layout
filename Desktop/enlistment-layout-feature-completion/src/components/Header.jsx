import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header>
      <div className="header-container">
        <div className="logo-container">
          <img
            src="/logo.png" // pon la ruta a tu logo
            alt="Logo"
            className="logo"
          />
          <div>
            <h1 className="site-title">Pet Health-Services</h1>
            <p className="site-subtitle">Ayuda especializada en animales campestres</p>
          </div>
        </div>

        <nav className="header-nav">

          {!user && (
            <>
              <Link to="/login" className="btn btn-login">Iniciar sesión</Link>
              <Link to="/register" className="btn btn-signup">Crear cuenta</Link>
            </>
          )}

          {user && (
            <>
              <Link to="/productos" className="btn btn-primary">Productos</Link>
              <button onClick={logout} className="btn btn-secondary">
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
