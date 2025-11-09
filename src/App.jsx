import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
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
import MiCuenta from "./pages/MiCuenta";
import { useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Medicos from "./pages/ServiciosMedicos";
import AdminUsers from "./pages/AdminUsers";
import NavbarAdmin from "./components/NavbarAdmin";
import NavbarEmprendedor from "./components/NavbarEmprendedor";
import AdminRegister from "./components/AdminRegister";
import DomiciliarioRegister from "./components/DomiciliarioRegister";
import NavbarDomiciliarios from "./components/NavbarDomiciliario";
import Domiciliary from "./pages/Domiciliario";       
import Ubicaciones from "./pages/Ubicaciones";
import Veterinarios from "./pages/Veterinarios";
import MiPerfilDomiciliario from "./pages/MiPerfilDomiciliario";
import AdminProducts from "./pages/AdminProducts";
import AdminPedidos from "./pages/AdminPedidos";
import AdminServicios from "./pages/AdminServicios";
import ServiciosMedicos from "./pages/ServiciosMedicos";
import MiCuentaEmprendedor from "./pages/MiCuentaEmprendedor";
import MisServicios from "./pages/MisServicios";
import CitasEmprendedor from "./pages/CitasEmprendedor";
import ReservarServicios from "./pages/ReservarServicios";
import AdminCitas from "./pages/AdminCitas";
import EmprendedorRegister from "./pages/EmprendedorRegister";
import RegisterCliente from "./pages/RegisterCliente";
import PoliticasPrivacidad from "./pages/PoliticasPrivacidad";
import Comments from "./components/Comments";
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
      case ROLES.EMPRENDEDOR:
        return <NavbarEmprendedor />;
      default:
        return <Navbar />;
    }
  };

  return (
    <CartProvider>
      {renderNavbar()}

<main className={`page-load-animation ${!hideLayout ? "main-with-header" : ""}`}>
        
        <Routes>
          <Route
            path="/"
            element={
              user?.id_rol === ROLES.EMPRENDEDOR ? (
                <Navigate to="/crear-servicio" replace />
              ) : (
                <>
                  <Hero />
                  <Slider />
                  <Services />
                  <Home />
                  <Preferences />
                  <Info />
                </>
              )
            }
          />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/register-cliente" element={<RegisterCliente />} />
          <Route path="/register-admin" element={<AdminRegister />} />
          <Route path="/register-domiciliario" element={<DomiciliarioRegister />} />
          <Route path="/register-emprendedor" element={<EmprendedorRegister />} />

          {/* Rutas protegidas */}
          <Route
            path="/productos"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
           
          />
          {/* Página de reserva de servicios (ver ReservarServicios) */}
          <Route
            path="/crear-servicio"
            element={
              <ProtectedRoute role={ROLES.EMPRENDEDOR}>
                <ServiciosMedicos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-servicios"
            element={
              <ProtectedRoute role={ROLES.EMPRENDEDOR}>
                <MisServicios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citas-recibidas"
            element={
              <ProtectedRoute role={ROLES.EMPRENDEDOR}>
                <CitasEmprendedor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservar-servicios"
            element={
              <ProtectedRoute>
                <ReservarServicios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mi-cuenta"
            element={
              <ProtectedRoute>
                {user?.id_rol === ROLES.EMPRENDEDOR ? <MiCuentaEmprendedor /> : <MiCuenta />}
              </ProtectedRoute>
            }
          />
          <Route path="/politicas-privacidad" element={<PoliticasPrivacidad />} />
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
            path="/admin/products"
            element={
              <ProtectedRoute role={ROLES.ADMIN}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role={ROLES.ADMIN}>
                <AdminPedidos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute role={ROLES.ADMIN}>
                <AdminServicios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/citas"
            element={
              <ProtectedRoute role={ROLES.ADMIN}>
                <AdminCitas />
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
          <Route
            path="/domiciliario/perfil"
            element={
              <ProtectedRoute role={ROLES.DOMICILIARIO}>
                <MiPerfilDomiciliario />
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

  {!hideLayout && <Comments />}
  {!hideLayout && <Footer />}
    </CartProvider>
  );
}

export default App;