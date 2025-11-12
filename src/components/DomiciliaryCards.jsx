import React from "react";

const DomiciliaryCards = ({ pedido, onSelect }) => {
  return (
    <>
      <div
        onClick={onSelect}
        className="bg-white rounded-2xl shadow-md p-6 cursor-pointer max-w-xs min-h-[300px] flex flex-col justify-between
          hover:shadow-lg hover:scale-[1.04] transition-transform transition-shadow duration-300
          animate-fadeInUp
        "
      >
        <div>
          <h3 className="text-xl font-semibold text-[#4A5B2E] mb-3">
            Domicilio #{pedido.id}
          </h3>
          <div className="space-y-1 text-gray-700">
            {pedido.cliente && (
              <p>
                <strong>Cliente:</strong> {pedido.cliente}
              </p>
            )}
            {pedido.direccion && (
              <p>
                <strong>Dirección:</strong> {pedido.direccion}
              </p>
            )}
            {pedido.productos && (
              <p>
                <strong>Productos:</strong> {pedido.productos.join(", ")}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onSelect}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition"
        >
          Ver Detalle
        </button>
      </div>

      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease forwards;
        }
      `}</style>
    </>
  );
};

export default DomiciliaryCards;
