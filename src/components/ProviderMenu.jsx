import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProviderMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const goMy = () => {
    setOpen(false);
    navigate('/proveedor/products');
  };

  const goAdd = () => {
    setOpen(false);
    navigate('/proveedor/products?focus=create');
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

  if (!user || !user.is_proveedor) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md"
      >
        <img src="/img/logo.png" alt="logo" className="w-8 h-8 rounded-full" />
        <span className="hidden sm:inline font-medium text-sm">{user.nombre_compania}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-md z-40">
          <button className="w-full text-left px-4 py-2 hover:bg-gray-50" onClick={goMy}>Mis productos</button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-50" onClick={goAdd}>Agregar producto</button>
          <div className="border-t" />
          <button className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}
