import React, { useEffect } from "react";

export default function ReceiptToast({ recibo, onClose }) {
  useEffect(() => {
    if (!recibo) return;
    const t = setTimeout(() => onClose?.(), 12000); // auto-dismiss after 12s
    return () => clearTimeout(t);
  }, [recibo, onClose]);

  if (!recibo) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
          <span className="text-green-700 font-bold">✓</span>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">Pago procesado</h4>
          <p className="text-sm text-gray-600 mt-1">Recibo generado correctamente y guardado.</p>

          <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-3 rounded">
            <p><strong>ID:</strong> {recibo.id_recibo ?? recibo.id}</p>
            <p><strong>Monto:</strong> ${Number(recibo.monto_pagado ?? recibo.monto ?? 0).toFixed(2)}</p>
            {recibo.fecha_creacion && (
              <p><strong>Fecha:</strong> {new Date(recibo.fecha_creacion).toLocaleString()}</p>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                // abrir modal completo o navegar a página del recibo si existe
                // por ahora, simplemente cerrar la notificación
                onClose?.();
              }}
              className="px-3 py-2 bg-[#69774A] text-white rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
