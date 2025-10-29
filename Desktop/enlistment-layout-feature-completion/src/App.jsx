import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from 'react';
import Header from "./components/Header";
import Hero from "./components/Hero";
import Home from "./components/Home";
import Slider from "./components/Slider";
import Services from "./components/Services";
import Preferences from "./components/Preferences";
import Info from "./components/Info";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";
import Products from "./pages/Products";
import { useAuth } from "./context/AuthContext";
import Medicos from "./pages/ServiciosMedicos";
import AdminUsers from "./pages/AdminUsers"; 
import './index.css'  // 👈 importar

function App() {
  const location = useLocation();
  const { user } = useAuth();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/productos";

  return (
    <>
      {!hideLayout && <Header />}

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <PageTransition>
                <>
                  <Hero />
                  <Slider />
                  <Services />
                  <Home />
                  <Preferences />
                  <Info />
                </>
              </PageTransition>
            }
          />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Rutas protegidas */}
          <Route
            path="/productos"
            element={user ? <Products /> : <Navigate to="/login" />}
          />
          <Route
            path="/servicios"
            element={user ? <Medicos /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/users"
            element={
              user && user.id_rol === 1
                ? <AdminUsers />
                : <Navigate to="/" />
            }
          />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
