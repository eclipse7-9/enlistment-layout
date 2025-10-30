import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Home from "./components/Home";
import Slider from "./components/Slider";
import Services from "./components/Services";
import Preferences from "./components/Preferences";
import Info from "./components/Info";
import Footer from "./components/Footer";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";
import Products from "./pages/Products";
import { useAuth } from "./context/AuthContext";
import Medicos from "./pages/ServiciosMedicos";
import AdminUsers from "./pages/AdminUsers";
import NavbarAdmin from "./components/NavbarAdmin";
import NavbarDomiciliarios from "./components/NavbarDomiciliario";
import Domiciliary from "./pages/Domiciliario";       
import "./index.css";

// Definir roles
const ROLES = {
  ADMIN: 1,
  DOMICILIARIO: 3,
};

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (role && user.id_rol !== role) return <Navigate to="/" />;

  return children;
};

function App() {
  const location = useLocation();
  const { user } = useAuth();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register";

  // Función para determinar qué navbar mostrar
  const renderNavbar = () => {
    if (hideLayout) return null;
    
    switch (user?.id_rol) {
      case ROLES.ADMIN:
        return <NavbarAdmin />;
      case ROLES.DOMICILIARIO:
        return <NavbarDomiciliarios />;
      default:
        return <Header />;
    }
  };

  return (
    <>
      {renderNavbar()}

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Slider />
                <Services />
                <Home />
                <Preferences />
                <Info />
              </>
            }
          />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Rutas protegidas */}
          <Route
            path="/productos"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/servicios"
            element={
              <ProtectedRoute>
                <Medicos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role={ROLES.ADMIN}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/domiciliario"
            element={
              <ProtectedRoute role={ROLES.DOMICILIARIO}>
                <Domiciliary />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
