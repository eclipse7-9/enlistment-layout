import React from "react";
import { Link } from "react-router-dom";

const PoliticasPrivacidad = () => {
  return (
    <div className="min-h-screen bg-[#f5f3ee] pt-20 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#7a8358] mb-6">Política de Privacidad</h1>

          <p className="mb-4 text-gray-700">
            Bienvenido a Pet Health Services. Esta página explica cómo recopilamos, usamos,
            almacenamos y protegemos los datos personales de los usuarios, y cómo puedes ejercer
            tus derechos según la normativa colombiana (Ley 1581 de 2012 y Decreto 1377 de 2013).
          </p>

          <h2 className="text-xl font-semibold text-[#4e5932] mt-4">1. Responsable del tratamiento</h2>
          <p className="text-gray-700 mb-3">
            El responsable del tratamiento de los datos es Pet Health Services. Para consultas,
            ejercicios de derechos o reclamos, contacta al responsable a través del correo
            electrónico proporcionado en la aplicación o al endpoint de atención al usuario.
          </p>

          <h2 className="text-xl font-semibold text-[#4e5932] mt-4">2. Qué datos recogemos</h2>
          <p className="text-gray-700 mb-3">
            Podemos recolectar datos de identificación (nombre, correo, teléfono), datos de
            ubicación (región/ciudad), datos de mascotas (cuando aplique), credenciales de
            acceso (contraseña en forma segura) e información relacionada con transacciones y
            pagos. También podemos recolectar datos técnicos (dirección IP, usuario-agente,
            cookies) para fines operativos y de seguridad.
          </p>

          <h2 className="text-xl font-semibold text-[#4e5932] mt-4">3. Finalidades</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-3">
            <li>Procesar el registro y autenticación de usuarios.</li>
            <li>Gestionar reservas, pedidos, pagos y la comunicación entre proveedores y clientes.</li>
            <li>Enviar notificaciones relacionadas con el servicio (confirmaciones, recibos).</li>
            <li>Cumplir obligaciones legales y fiscales aplicables.</li>
            <li>Mejorar la experiencia del usuario y la seguridad de la plataforma.</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#4e5932] mt-4">4. Base legal y consentimiento</h2>
          <p className="text-gray-700 mb-3">
            Tratamos tus datos bajo las bases legales previstas en la Ley 1581 de 2012: cuando
            existe tu consentimiento para finalidades específicas; cuando el tratamiento es
            necesario para ejecutar un contrato; y cuando la ley autoriza o exige el
            tratamiento. Al aceptar las políticas y registrarte, otorgas consentimiento para
            las finalidades descritas.
          </p>

          <h2 className="text-xl font-semibold text-[#4e5932] mt-4">5. Derechos ARCO</h2>
          <p className="text-gray-700 mb-3">
            Tienes derecho a Acceder, Rectificar, Cancelar y Oponerte al tratamiento de tus
            datos (derechos ARCO). Para ejercerlos, envía una solicitud al correo de contacto
            o al endpoint de atención al usuario. Incluye tu identificación, la petición clara
            y los documentos que soporten tu solicitud.
          </p>

          <h2 className="text-xl font-semibold text-[#4e5932] mt-4">6. Terceros y transferencias</h2>
          <p className="text-gray-700 mb-3">
            Podemos compartir datos con proveedores que prestan servicios para la plataforma
            (procesamiento de pagos, almacenamiento). En caso de transferencias internacionales
            se tomarán las medidas de seguridad y cumplimiento legal necesarias.
          </p>

          <h2 className="text-xl font-semibold text-[#4e5932] mt-4">7. Retención y seguridad</h2>
          <p className="text-gray-700 mb-3">
            Conservamos tus datos mientras exista la relación contractual y conforme a las
            obligaciones legales. Implementamos medidas técnicas y organizativas razonables
            para proteger la información frente a accesos no autorizados, pérdida o alteración.
          </p>

          <h2 className="text-xl font-semibold text-[#4e5932] mt-4">8. Cookies y tecnologías similares</h2>
          <p className="text-gray-700 mb-3">
            Utilizamos cookies para mejorar la experiencia, mantener sesiones y realizar
            análisis. Puedes configurar tu navegador para bloquear o eliminar cookies, aunque
            esto puede afectar la funcionalidad del sitio.
          </p>

          <h2 className="text-xl font-semibold text-[#4e5932] mt-4">9. Cambios en la política</h2>
          <p className="text-gray-700 mb-6">
            Esta política puede actualizarse. Las modificaciones relevantes se comunicarán a
            través de la aplicación o por correo. Revisa periódicamente la fecha de vigencia.
          </p>

          <div className="flex justify-between items-center">
            <small className="text-gray-500">Vigente desde: 2025-11-08</small>
            <div>
              <Link to="/register" className="text-[#7a8358] underline mr-4">Volver al registro</Link>
              <Link to="/" className="text-[#4e5932] underline">Inicio</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliticasPrivacidad;
