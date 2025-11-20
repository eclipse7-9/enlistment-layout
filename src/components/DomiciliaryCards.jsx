import React from "react";

const DomiciliaryCards = ({ pedido, onSelect }) => {
  return (
    <>
      <div
        onClick={onSelect}
        className="bg-white rounded-2xl shadow-md p-5 cursor-pointer w-full min-h-[260px] flex flex-col justify-between
          hover:shadow-xl hover:scale-[1.03] transition-transform transition-shadow duration-250
          animate-fadeInUp
        "
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[#3f5323] mb-1">Domicilio #{pedido.id}</h3>
            <div className="text-sm text-gray-700 space-y-1">
              {pedido.cliente && (
                <p className="truncate"><strong className="font-medium">Cliente:</strong> <span className="ml-1">{pedido.cliente}</span></p>
              )}
              {pedido.direccion && (
                <p className="text-sm text-gray-600 truncate"><strong className="font-medium">Dirección:</strong> <span className="ml-1">{pedido.direccion}</span></p>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            {pedido.estado_domicilio && (
              <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${pedido.estado_domicilio === 'Entregado' ? 'bg-green-100 text-green-800' : pedido.estado_domicilio === 'En-entrega' ? 'bg-yellow-100 text-yellow-800' : pedido.estado_domicilio === 'Cancelado' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                {pedido.estado_domicilio}
              </span>
            )}
            <div className="text-xs text-gray-500 mt-2">{pedido.productos ? `${Array.isArray(pedido.productos) ? pedido.productos.length : 0} item(s)` : '—'}</div>
          </div>
        </div>

        <div className="mt-4">
          {pedido.productos && (
            <p className="text-sm text-gray-700 truncate"><strong className="font-medium">Productos:</strong> {Array.isArray(pedido.productos) ? pedido.productos.join(', ') : pedido.productos}</p>
          )}
        </div>

        <button
          onClick={onSelect}
          className="mt-4 w-full bg-gradient-to-r from-[#6fa64c] to-[#4a7a2f] hover:from-[#5f923f] hover:to-[#3e6524] text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          Ver detalle
        </button>
      </div>

      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.45s ease forwards; }
      `}</style>
    </>
  );
};

export default DomiciliaryCards;
