import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-[#f3efe6] to-[#e8e3d5] border-t border-[#d8c6aa] mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-3">
              <img src="/img/logo.png" alt="logo" className="w-14 h-14 rounded-full shadow" />
              <div>
                <div className="text-lg font-bold text-[#4e5932]">Pet Health Services</div>
                <div className="text-sm text-gray-600">Cuidado veterinario y domiciliario</div>
              </div>
            </Link>
            <p className="text-sm text-gray-600">Proporcionamos servicios confiables para la salud de tus animales. Atención humana y profesional en todo momento.</p>

            <div className="flex items-center gap-3 mt-2">
              <a href="https://www.facebook.com/AlvaroUribeVel/?locale=es_LA" aria-label="Facebook" className="text-[#3b5998] bg-white p-2 rounded-full shadow-sm hover:scale-105 transition">
                <FaFacebookF />
              </a>
              <a href="https://www.instagram.com/ingrodolfohernandez/?hl=es" aria-label="Instagram" className="text-[#e1306c] bg-white p-2 rounded-full shadow-sm hover:scale-105 transition">
                <FaInstagram />
              </a>
              <a href="https://x.com/petrogustavo" aria-label="Twitter" className="text-[#1da1f2] bg-white p-2 rounded-full shadow-sm hover:scale-105 transition">
                <FaTwitter />
              </a>
              <a href="#" aria-label="WhatsApp" className="text-[#25D366] bg-white p-2 rounded-full shadow-sm hover:scale-105 transition">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[#4e5932] font-semibold mb-3">Enlaces rápidos</h3>
            <ul className="space-y-2 text-gray-700">
              <li><Link to="/productos" className="hover:underline">Productos</Link></li>
              <li> <Link to="/manual/index.html" target="_blank"Manual de Usuario></Link></li>
              <li><Link to="/reservar-servicios" className="hover:underline">Servicios</Link></li>
              <li><Link to="/ubicaciones" className="hover:underline">Ubicaciones</Link></li>
              <li><Link to="/politicas-privacidad" className="hover:underline">Política de privacidad</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#4e5932] font-semibold mb-3">Contáctanos</h3>
            <p className="text-gray-700 text-sm">Correo: <a href="kurco911@gmail.com" className="text-[#7a8358] underline">kurco911@gmail.com</a></p>
            <p className="text-gray-700 text-sm">Tel: <a href="tel:+314 2111364" className="text-[#7a8358] underline">+57 3142111364</a></p>
            <p className="text-gray-700 text-sm mt-3">Horario de atención: Lun - Vie 8:00 - 18:00</p>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-[#4e5932]">Suscríbete (opcional)</h4>
              <form className="mt-2 flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Tu correo" className="px-3 py-2 rounded-lg border border-[#d8c6aa] bg-white/90 outline-none text-sm flex-1" />
                <button className="px-4 py-2 bg-[#7a8358] text-white rounded-lg text-sm">Enviar</button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-[#d8c6aa] mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          <div>© {year} PET HEALTH SERVICES. Todos los derechos reservados.</div>
          <div className="mt-3 md:mt-0">Hecho con ❤️ · <Link to="/" className="underline text-[#4e5932]">Pet Health Team</Link></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
