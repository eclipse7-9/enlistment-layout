import React from "react";

const ServiceCard = ({ nombre, descripcion }) => {
  return (
    <div className="service-card">
      <h3>{nombre}</h3>
      <p>{descripcion}</p>
    </div>
  );
};

export default ServiceCard;
