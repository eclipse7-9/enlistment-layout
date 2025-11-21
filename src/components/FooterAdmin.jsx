import React from 'react';
import { Link } from 'react-router-dom';

const FooterAdmin = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#f7f8f5] border-t border-[#d8c6aa] mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-[#3f4a2f]">Panel Administrador</h3>
            <p className="text-sm text-gray-600 mt-2">Enlaces rápidos para administración del sistema.</p>
          </div>

          <div>
            <h4 className="font-semibold text-[#4e5932] mb-2">Gestión</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><Link to="/admin/users" className="hover:underline">Usuarios</Link></li>
              <li><Link to="/admin/products" className="hover:underline">Productos</Link></li>
              <li><Link to="/admin/orders" className="hover:underline">Pedidos</Link></li>
              <li><Link to="/admin/services" className="hover:underline">Servicios</Link></li>
              <li><Link to="/admin/citas" className="hover:underline">Citas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#4e5932] mb-2">Soporte</h4>
            <p className="text-sm text-gray-700">Correo: <a href="mailto:soporte@pethealth.example" className="underline">soporte@pethealth.example</a></p>
            <p className="text-sm text-gray-700 mt-2">Tel: <a href="tel:+573001231234" className="underline">+57 300 1231234</a></p>
          </div>
        </div>

        <div className="border-t border-[#e6e1d6] mt-8 pt-6 text-sm text-gray-600 flex items-center justify-between">
          <div>© {year} PET HEALTH SERVICES - Admin</div>
          <div>Hecho con ♥ por el equipo</div>
        </div>
      </div>
    </footer>
  );
};

export default FooterAdmin;
