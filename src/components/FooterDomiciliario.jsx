import React from 'react';
import { Link } from 'react-router-dom';

const FooterDomiciliario = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#f9fbf7] border-t border-[#d8c6aa] mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-[#3f4a2f]">Panel Domiciliario</h3>
            <p className="text-sm text-gray-600 mt-2">Accesos rápidos para gestionar tus entregas y perfil.</p>
          </div>

          <div>
            <h4 className="font-semibold text-[#4e5932] mb-2">Accesos</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li><Link to="/domiciliario" className="hover:underline">Inicio</Link></li>
              <li><Link to="/domiciliario/perfil" className="hover:underline">Mi Perfil</Link></li>
              <li><Link to="/ubicaciones" className="hover:underline">Ubicaciones</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#4e5932] mb-2">Contacto</h4>
            <p className="text-sm text-gray-700">Ayuda: <a href="mailto:soporte@pethealth.example" className="underline">soporte@pethealth.example</a></p>
            <p className="text-sm text-gray-700 mt-2">Horario: Lun - Vie 8:00 - 18:00</p>
          </div>
        </div>

        <div className="border-t border-[#e6e1d6] mt-8 pt-6 text-sm text-gray-600 flex items-center justify-between">
          <div>© {year} PET HEALTH SERVICES - Domiciliario</div>
          <div>Gracias por tu servicio 🛵</div>
        </div>
      </div>
    </footer>
  );
};

export default FooterDomiciliario;
