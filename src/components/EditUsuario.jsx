import React from "react";
import { motion } from "framer-motion";

export default function EditarUsuarioModal({ show, setShow, editData, setEditData, handleUpdateUser }) {
  const [confirmPassword, setConfirmPassword] = React.useState("");

  if (!show) return null;

  const isPasswordEdit = editData.type === 'password';

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-[#d6b991]">
        <h3 className="text-2xl font-bold text-[#7A8358] mb-4">
          {isPasswordEdit ? 'Cambiar contraseña' : 'Editar datos'}
        </h3>

        {!isPasswordEdit ? (
          <>
            <div className="flex flex-col gap-4">
              {/* Nombre */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nombre"
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#7A8358]"
                  value={editData.nombre_usuario || ""}
                  onChange={(e) => setEditData({ ...editData, nombre_usuario: e.target.value })}
                />
                <button
                  onClick={() => handleUpdateUser('nombre_usuario')}
                  className="px-4 py-2 bg-[#7A8358] text-white rounded-full hover:bg-[#68764a] whitespace-nowrap"
                >
                  Guardar nombre
                </button>
              </div>

              {/* Apellido */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Apellido"
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#7A8358]"
                  value={editData.apellido_usuario || ""}
                  onChange={(e) => setEditData({ ...editData, apellido_usuario: e.target.value })}
                />
                <button
                  onClick={() => handleUpdateUser('apellido_usuario')}
                  className="px-4 py-2 bg-[#7A8358] text-white rounded-full hover:bg-[#68764a] whitespace-nowrap"
                >
                  Guardar apellido
                </button>
              </div>

              {/* Correo */}
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Correo"
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#7A8358]"
                  value={editData.correo || ""}
                  onChange={(e) => setEditData({ ...editData, correo: e.target.value })}
                />
                <button
                  onClick={() => handleUpdateUser('correo')}
                  className="px-4 py-2 bg-[#7A8358] text-white rounded-full hover:bg-[#68764a] whitespace-nowrap"
                >
                  Guardar correo
                </button>
              </div>

              {/* Teléfono */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Teléfono"
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#7A8358]"
                  value={editData.telefono_usuario || ""}
                  onChange={(e) => setEditData({ ...editData, telefono_usuario: e.target.value })}
                />
                <button
                  onClick={() => handleUpdateUser('telefono_usuario')}
                  className="px-4 py-2 bg-[#7A8358] text-white rounded-full hover:bg-[#68764a] whitespace-nowrap"
                >
                  Guardar teléfono
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <input
              type="password"
              placeholder="Contraseña actual"
              className="w-full mb-2 p-2 border rounded-lg"
              value={editData.current_password || ""}
              onChange={(e) => setEditData({ ...editData, current_password: e.target.value })}
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              className="w-full mb-2 p-2 border rounded-lg"
              value={editData.new_password || ""}
              onChange={(e) => setEditData({ ...editData, new_password: e.target.value })}
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              className="w-full mb-4 p-2 border rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        )}

        <div className="flex justify-center">
          <button
            onClick={() => {
              setShow(false);
              // Limpiar los campos al cerrar
              setEditData(prev => ({
                ...prev,
                current_password: '',
                new_password: ''
              }));
              setConfirmPassword('');
            }}
            className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>
      </div>
    </motion.div>
  );
}