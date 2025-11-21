import React from 'react';
import { Link } from 'react-router-dom';

const FooterEmprendedor = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#f6faf3] border-t border-[#d8c6aa] mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-[#3f4a2f]">Zona Emprendedor</h3>
            <p className="text-sm text-gray-600 mt-2">Herramientas para gestionar tus servicios y reservas.</p>
          </div>

          <div>
            <h4 className="font-semibold text-[#4e5932] mb-2">Accesos Rápidos</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><Link to="/crear-servicio" className="hover:underline">Crear Servicio</Link></li>
              <li><Link to="/mis-servicios" className="hover:underline">Mis Servicios</Link></li>
              <li><Link to="/citas-recibidas" className="hover:underline">Citas</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#4e5932] mb-2">Soporte</h4>
            <p className="text-sm text-gray-700">Preguntas: <a href="mailto:emprende@pethealth.example" className="underline">emprende@pethealth.example</a></p>
            <p className="text-sm text-gray-700 mt-2">Promociona tus servicios y llega a más clientes.</p>
          </div>
        </div>

        <div className="border-t border-[#e6e1d6] mt-8 pt-6 text-sm text-gray-600 flex items-center justify-between">
          <div>© {year} PET HEALTH SERVICES - Emprendedor</div>
          <div>Éxitos en tus ventas 🚀</div>
        </div>
      </div>
    </footer>
  );
};

export default FooterEmprendedor;
