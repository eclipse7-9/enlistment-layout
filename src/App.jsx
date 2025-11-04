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
import Ubicaciones from "./pages/Ubicaciones";
import Veterinarios from "./pages/Veterinarios";
import "./index.css";

// Definir roles
const ROLES = {
  ADMIN: 1,
  DOMICILIARIO: 3,
  EMPRENDEDOR: 2
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
            path="/ubicaciones"
            element={
              <ProtectedRoute>
                <Ubicaciones />
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
            path="/Veterinarios"
            element={
              <ProtectedRoute role={ROLES.EMPRENDEDOR}>
                <Veterinarios />
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

          {/* Ruta 404 - debe ir al final */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-[#7a8358] mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Página no encontrada</p>
                  <button 
                    onClick={() => navigate(-1)}
                    className="bg-[#7a8358] text-white px-4 py-2 rounded-lg hover:bg-[#5f6943]"
                  >
                    Volver
                  </button>
                </div>
              </div>
            } 
          />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
