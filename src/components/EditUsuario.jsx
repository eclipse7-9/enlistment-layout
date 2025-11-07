import React from "react";
import { motion } from "framer-motion";

export default function EditarUsuarioModal({ show, setShow, editData, setEditData, handleUpdateUser }) {
  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-[#d6b991]">
        <h3 className="text-2xl font-bold text-[#7A8358] mb-4">Editar datos</h3>
        <input
          type="email"
          placeholder="Correo"
          className="w-full mb-4 p-2 border rounded-lg focus:ring-2 focus:ring-[#7A8358]"
          value={editData.correo}
          onChange={(e) => setEditData({ ...editData, correo: e.target.value })}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShow(false)}
            className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpdateUser}
            className="px-4 py-2 bg-[#7A8358] text-white rounded-full hover:bg-[#68764a]"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </motion.div>
  );
}