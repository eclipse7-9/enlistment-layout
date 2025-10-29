import React from "react";
import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#7A8358] text-white py-10 px-6 md:px-16">
      {/* Contenedor principal */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20">
        {/* Columna 1: Logo y descripción */}
        <div>
          <h2 className="text-2xl font-bold font-[Poppins] mb-3">
            Pet-Health Services
          </h2>
          <p className="text-sm leading-relaxed text-gray-100">
            Expertos en el cuidado de animales de granja. Brindamos soluciones
            veterinarias integrales con calidad, confianza y compromiso por el
            bienestar animal.
          </p>
        </div>

        {/* Columna 2: Información de contacto */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contáctanos</h3>
          <ul className="space-y-2 text-gray-100">
            <li className="flex items-center gap-2">
              <Mail size={18} /> info@pethealth.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} /> +57 310 456 7890
            </li>
            <li>Bogotá, Colombia</li>
          </ul>
        </div>

        {/* Columna 3: Redes sociales */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Síguenos</h3>
          <div className="flex gap-4 mt-2">
            <a
              href="#"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
              aria-label="Facebook"
            >
              <Facebook size={22} />
            </a>
            <a
              href="#"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
              aria-label="Instagram"
            >
              <Instagram size={22} />
            </a>
            <a
              href="#"
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
              aria-label="Twitter"
            >
              <Twitter size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-t border-white/20 mt-10 pt-6 text-center text-sm text-gray-100">
        © 2025 <span className="font-semibold">PET-HEALTH SERVICES</span>. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;

export default Footer;
