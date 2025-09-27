// src/components/Header.jsx
function Header() {
  return (
    <header>
      <div className="header-container">
        <div className="logo-container">
          <img src="/logo.png" alt="PET HEALTH-SERVICES - Logo" className="logo" />
          <div>
            <h1 className="site-title">PET-HEALTH SERVICES</h1>
          </div>
        </div>
        <nav className="header-nav">
          <a href="login.html" className="btn btn-login">Iniciar sesión</a>
          <a href="register.html" className="btn btn-signup">Registrarse</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
