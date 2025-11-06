import React, { useState, useEffect } from "react";
import axios from "axios";
import AppointmentForm from "../components/AppointmentForm.jsx";

const MedicalServices = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const handleAgendar = (servicio) => {
    setSelectedService(servicio);
    setShowForm(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/servicios/");
        console.log("Respuesta del servidor:", response.data);

        // Mapear campos del backend al frontend
        const mappedServices = response.data.map((s) => ({
          id_servicio: s.id_servicio,
          nombre: s.tipo_servicio,
          descripcion: s.descripcion_servicio,
          precio: s.precio || 0, // si aún no tienes precio, usar 0
          duracion: s.duracion || 30, // si quieres duración por defecto
        }));

        setServices(mappedServices);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar servicios:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  const toggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (error)
    return (
      <div className="text-center text-red-500 p-4">Error: {error}</div>
    );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#52734D]"></div>
        <span className="ml-3">Cargando servicios...</span>
      </div>
    );

  if (services.length === 0)
    return (
      <div className="text-center text-gray-600 p-4">
        No hay servicios disponibles.
      </div>
    );

  return (
    <section className="bg-[#F6F8F2] min-h-screen py-16 px-6 md:px-12 font-[Poppins]">
      <h2 className="text-center text-4xl md:text-5xl font-extrabold text-[#4A5B2E] mb-12 tracking-wide">
        🩺 Servicios <span className="text-[#7A8358]">Médicos</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id_servicio}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <button
              onClick={() => toggle(service.id_servicio)}
              className="w-full text-left flex items-center justify-between focus:outline-none"
              aria-expanded={expandedId === service.id_servicio}
            >
              <h3 className="text-lg font-semibold text-[#52734D]">
                {service.nombre}
              </h3>
              <span className="text-sm text-gray-500">
                {expandedId === service.id_servicio ? "▲" : "▼"}
              </span>
            </button>

            <div
              className={`mt-3 text-gray-700 transition-all duration-200 ${
                expandedId === service.id_servicio
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <p className="mb-3">{service.descripcion}</p>
              <div className="flex items-center justify-between">
                <span className="text-[#52734D] font-bold">
                  ${service.precio}
                </span>
                {service.duracion !== undefined && (
                  <span className="text-sm text-gray-500">
                    Duración: {service.duracion} min
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => handleAgendar(service.nombre)}
                className="bg-[#556140] hover:bg-[#6b7450] text-white font-semibold px-4 py-2 rounded-lg shadow-sm transform transition-all duration-300 ease-in-out
                hover:scale-110 hover:rotate-2 hover:shadow-xl
                active:scale-95 active:rotate-0 motion-safe:hover:-translate-y-1"
              >
                Agendar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="mt-16">
          <AppointmentForm
            servicio={selectedService}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}
    </section>
  );
};

export default MedicalServices;
