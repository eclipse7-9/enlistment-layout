import React from "react";
import { motion } from "framer-motion";

export default function RegistrarMascotaModal({ show, setShow, petForm = {}, setPetForm, handleRegisterPet }) {
  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-[#d6b991]">
        <h3 className="text-2xl font-bold text-[#7A8358] mb-4">Registrar nueva mascota</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nombre:<span className="text-red-500"> *</span></label>
            <input
              type="text"
              placeholder="Nombre"
              className="p-2 border rounded-lg w-full"
              value={petForm.nombre_mascota || ""}
              onChange={(e) => setPetForm({ ...petForm, nombre_mascota: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Peso:</label>
            <input
              type="number"
              placeholder="Peso"
              className="p-2 border rounded-lg w-full"
              value={petForm.peso_mascota || ""}
              onChange={(e) => setPetForm({ ...petForm, peso_mascota: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Especie:<span className="text-red-500"> *</span></label>
            <input
              type="text"
              placeholder="Especie"
              className="p-2 border rounded-lg w-full"
              value={petForm.especie_mascota || ""}
              onChange={(e) => setPetForm({ ...petForm, especie_mascota: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Raza:<span className="text-red-500"> *</span></label>
            <input
              type="text"
              placeholder="Raza"
              className="p-2 border rounded-lg w-full"
              value={petForm.raza_mascota || ""}
              onChange={(e) => setPetForm({ ...petForm, raza_mascota: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Edad:</label>
            <input
              type="number"
              placeholder="Edad"
              className="p-2 border rounded-lg w-full"
              value={petForm.edad_mascota || ""}
              onChange={(e) => setPetForm({ ...petForm, edad_mascota: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Altura:</label>
            <input
              type="number"
              placeholder="Altura"
              className="p-2 border rounded-lg w-full"
              value={petForm.altura_mascota || ""}
              onChange={(e) => setPetForm({ ...petForm, altura_mascota: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setShow(false)}
            className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleRegisterPet && handleRegisterPet()}
            className="px-4 py-2 bg-[#c8a67a] text-white rounded-full hover:bg-[#b18f65]"
          >
            Registrar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
