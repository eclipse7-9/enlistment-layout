import React, { useState } from "react";
import "../styles/ServiciosMedicos.css";
import AppointmentForm from "../components/AppointmentForm.jsx";

const services = [
  { nombre: "Consulta General", img: "https://a.storyblok.com/f/160385/890x605/5c17d389ae/chequeo-medico-general-bovinos.jpg", descripcion: "Evaluación médica básica para bovinos, porcinos, equinos, aves, etc." },
  { nombre: "Vacunación", img: "https://cdn.shopify.com/s/files/1/0268/6861/files/veterinario-vacuna-oveja-explotacion-ganadera_1133896806_68313498_667x375_e8a0cd69-19e4-4838-bbfc-ae4366520e43_grande.jpg?v=1550251229", descripcion: "Aplicación de vacunas esenciales para prevenir enfermedades." },
  { nombre: "Desparasitación", img: "https://a.storyblok.com/f/160385/fd8de3931a/desparacitacion-oral-bovina.jpg", descripcion: "Tratamiento interno y externo contra parásitos en especies poco convencionales." },
  { nombre: "Cirugía Especializada", img: "https://a.storyblok.com/f/160385/f85c2e25bd/operando.jpg/m/?w=256&q=100", descripcion: "Procedimientos quirúrgicos para casos complejos y emergencias." },
  { nombre: "Odontología", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-Js_3Q8ogsMSR8iDhu00G5ZsXM19cTTHlwQ&s", descripcion: "Cuidado dental especializado para bovinos, porcinos y equinos." },
  { nombre: "Plan de Nutrición", img: "https://www.clubganadero.com/wp-content/uploads/sites/78/2024/09/image_d48800.jpeg", descripcion: "Dietas balanceadas y personalizadas según especie y edad." },
  { nombre: "Radiología", img: "https://www.or-technology.com/images/2023/02/28/ttl-equipo-de-rayos-x-portatil-para-veterinarios-de-equidos-m.webp", descripcion: "Diagnóstico por imágenes para detectar fracturas o anomalías." },
  { nombre: "Análisis Clínicos", img: "https://axoncomunicacion.net/wp-content/uploads/2023/06/mujer-joven-veterinaria-tableta-examinando-cabra-fondo-rancho-medico-veterinario-revisa-cabra-granja-ecologica-natural-cuidado-animales-concepto-ganaderia-ecologica.jpg", descripcion: "Exámenes de laboratorio para control preventivo y diagnóstico." },
  { nombre: "Control Reproductivo", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA7dlj7fIse1rLlhHBV6yna9Y7WdFiklTlkg&s", descripcion: "Manejo reproductivo seguro en aves y mamíferos." },
  { nombre: "Emergencias 24/7", img: "https://www.woah.org/app/uploads/2022/06/cow-being-swabbed-copyright-julio-gouveia-carvalho-1.jpg", descripcion: "Atención inmediata para accidentes y enfermedades graves." },
  { nombre: "Oftalmología", img: "https://blog.uchceu.es/veterinaria/wp-content/uploads/sites/12/2021/11/slit-lamp-2-650x650.jpg", descripcion: "Cuidado y tratamiento de problemas oculares en exóticos." },
  { nombre: "Fisioterapia", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdP9zyght9rDQwMaTKYwk4WPdX_Ru6X0uQtA&s", descripcion: "Rehabilitación física tras lesiones o cirugías." },
];



const MedicalServices = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const handleAgendar = (servicio) => {
    setSelectedService(servicio);
    setShowForm(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div>
      <section className="services">
        <h2>SERVICIOS MÉDICOS</h2>
        <div className="product-list">
          {services.map((service, index) => (
            <div className="product-card" key={index}>
              <img src={service.img} alt={service.nombre} />
              <p>
                <b>{service.nombre}</b>
                <br />
                {service.descripcion}
              </p>
              <button className="btn btn-med" onClick={() => handleAgendar(service.nombre)}>
                Agendar
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Mostrar formulario solo cuando se presione Agendar */}
      {showForm && (
        <AppointmentForm
          servicio={selectedService}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default MedicalServices;

