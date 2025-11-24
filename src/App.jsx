import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
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
import MiPerfilDomiciliario from "./pages/MiPerfilDomiciliario";
import AdminProducts from "./pages/AdminProducts";
import ProveedorProducts from "./pages/ProveedorProducts";
import ProveedorProfile from "./pages/ProveedorProfile";
import AdminPedidos from "./pages/AdminPedidos";
import AdminServicios from "./pages/AdminServicios";
import ServiciosMedicos from "./pages/ServiciosMedicos";
import MiCuentaEmprendedor from "./pages/MiCuentaEmprendedor";
import MisServicios from "./pages/MisServicios";
import MisEntregas from "./pages/MisEntregas";
import CitasEmprendedor from "./pages/CitasEmprendedor";
import ReservarServicios from "./pages/ReservarServicios";
import AdminCitas from "./pages/AdminCitas";
import AdminReport from "./pages/AdminReport";
import AdminDenuncias from "./pages/AdminDenuncias";
import AdminDomicilios from "./pages/AdminDomicilios";
import EmprendedorRegister from "./pages/EmprendedorRegister";
import RegisterCliente from "./pages/RegisterCliente";
import PoliticasPrivacidad from "./pages/PoliticasPrivacidad";
// Comments removed from global layout by request
import ProviderMenu from "./components/ProviderMenu";
import "./index.css";
import CrearServicioGuia from "./pages/CrearServicioGuia";
import ManualDomiciliario from "./pages/ManualDomiciliario";
import FAQS from "./pages/FAQS";

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

const ProviderRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || !user.is_proveedor) return <Navigate to="/login" />;
  return children;
};

function App() {
  const location = useLocation();
  const { user } = useAuth();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register";

  // Mini header/footer for proveedores
  const ProviderMiniHeader = () => {
    const navigate = useNavigate();
    return (
      <header className="w-full bg-[#f5f3ee] border-b border-[#e6dfc7] relative">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4 relative">
          <div className="flex items-center gap-3">
            <img src="/img/logo.png" alt="logo" className="w-10 h-10 rounded-full" />
            <div>
              <div className="text-lg font-bold text-[#7a8358]">Proveedor</div>
            </div>
          </div>

          {/* Título exclusivo para la vista de proveedores: centrado absolutamente */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <button onClick={() => navigate('/proveedor/products')} className="text-2xl font-extrabold text-[#7a8358] hover:opacity-90 focus:outline-none cursor-pointer transform transition duration-150 ease-in-out hover:scale-105 active:translate-y-0.5 hover:shadow-md focus:ring-2 focus:ring-[#9cc07a] rounded" title="Ir al panel de productos de proveedor">
              PET HEALT SERVICE`S
            </button>
          </div>

          {/* Mostrar el menú exclusivo de proveedor en el header */}
          <div className="hidden md:block">
            <ProviderMenu />
          </div>
        </div>
      </header>
    );
  };

  const ProviderMiniFooter = () => (
    <footer className="w-full bg-white border-t border-[#e6dfc7] mt-6">
      <div className="max-w-6xl mx-auto flex items-center justify-center p-6">
        <img src="/img/logo.png" alt="logo" className="w-10 h-10 rounded-full" />
      </div>
    </footer>
  );

  // Función para determinar qué navbar mostrar
  const renderNavbar = () => {
    if (hideLayout) return null;
    
  // Para proveedores, mostrar un header minimal con logo, nombre y dos botones
  if (user?.is_proveedor) return <ProviderMiniHeader />;

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
                <Navigate to="/crear-servicio-guia" replace />
              ) : user?.id_rol === ROLES.ADMIN ? (
                <Navigate to="/admin" replace />
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
          <Route
            path="/crear-servicio-guia"
            element={
              <ProtectedRoute role={ROLES.EMPRENDEDOR}>
                <CrearServicioGuia />
              </ProtectedRoute>
            }
          />

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
          <Route path="/faqs" element={<FAQS />} />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role={ROLES.ADMIN}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role={ROLES.ADMIN}>
                <Navigate to="/admin/users" replace />
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
            path="/proveedor/products"
            element={
              <ProviderRoute>
                <ProveedorProducts />
              </ProviderRoute>
            }
          />
          <Route
            path="/proveedor/profile"
            element={
              <ProviderRoute>
                <ProveedorProfile />
              </ProviderRoute>
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
            path="/admin/domicilios"
            element={
              <ProtectedRoute role={ROLES.ADMIN}>
                <AdminDomicilios />
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
            path="/admin/report"
            element={
              <ProtectedRoute role={ROLES.ADMIN}>
                <AdminReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/denuncias"
            element={
              <ProtectedRoute role={ROLES.ADMIN}>
                <AdminDenuncias />
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
            path="/domiciliario"
            element={
              <ProtectedRoute role={ROLES.DOMICILIARIO}>
                <Domiciliary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manual-domiciliario"
            element={
              <ProtectedRoute role={ROLES.DOMICILIARIO}>
                <ManualDomiciliario />
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
          <Route
            path="/mis-entregas"
            element={
              <ProtectedRoute role={ROLES.DOMICILIARIO}>
                <MisEntregas />
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
    </CartProvider>
  );
}

export default App;