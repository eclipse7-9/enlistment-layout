import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // ⚠️ Debes tener este contexto configurado

// Icono personalizado
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const Ubicaciones = () => {
  const { user } = useAuth(); // Obtenemos usuario logueado
  const [ubicaciones, setUbicaciones] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);

  // 🔹 Cargar ubicaciones desde la API
  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/ubicaciones");
        setUbicaciones(res.data);
      } catch (error) {
        console.error("Error al obtener ubicaciones:", error);
      }
    };
    fetchUbicaciones();
  }, []);

  // 🔹 Guardar nueva ubicación en el backend
  const agregarUbicacionBackend = async (nuevaUbicacion) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/ubicaciones", nuevaUbicacion);
      setUbicaciones([...ubicaciones, res.data]);
    } catch (error) {
      console.error("Error al guardar ubicación:", error);
    }
  };

  // 🔹 Eliminar ubicación del backend
  const eliminarUbicacionBackend = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/ubicaciones/${id}`);
      setUbicaciones(ubicaciones.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error al eliminar ubicación:", error);
    }
  };

  // 🔹 Añadir ubicaciones clickeando en el mapa (solo si modo edición está activo)
  const AgregarUbicacion = () => {
    useMapEvents({
      click(e) {
        if (modoEdicion && user?.id_rol === 1) {
          const nueva = {
            nombre: `Ubicación ${ubicaciones.length + 1}`,
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          };
          agregarUbicacionBackend(nueva);
        }
      },
    });
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 bg-[#F9FAF8]">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-6xl w-[90%] text-center border border-[#e1e4d3]">
        <h2 className="text-4xl font-bold text-[#7A8358] mb-4 font-[Poppins]">
          Nuestras Ubicaciones
        </h2>
        <p className="text-[#555] mb-8 max-w-2xl mx-auto">
          Explora las sedes disponibles en el mapa. Si eres administrador, activa el modo edición
          para agregar o eliminar ubicaciones fácilmente.
        </p>

        {/* Botón solo visible para administradores */}
        {user?.id_rol === 1 && (
          <button
            onClick={() => setModoEdicion(!modoEdicion)}
            className={`px-6 py-2 rounded-xl text-white font-semibold mb-8 shadow-md transition-all duration-300 ${
              modoEdicion
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#7A8358] hover:bg-[#657347]"
            }`}
          >
            {modoEdicion ? "Salir del modo edición" : "Activar modo edición"}
          </button>
        )}

        <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-[#e8e3d4] h-[500px]">
          <MapContainer
            center={[4.710989, -74.072092]}
            zoom={12}
            className="h-full w-full z-0"
            zoomControl={true}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            <AgregarUbicacion />
            {ubicaciones.map((u) => (
              <Marker key={u.id} position={[u.lat, u.lng]} icon={customIcon}>
                <Popup>
                  <div className="text-center text-sm">
                    <h3 className="font-semibold text-[#7A8358]">{u.nombre}</h3>
                    <p className="text-gray-600">
                      Lat: {u.lat.toFixed(4)}, Lng: {u.lng.toFixed(4)}
                    </p>
                    {modoEdicion && user?.id_rol === 1 && (
                      <button
                        onClick={() => eliminarUbicacionBackend(u.id)}
                        className="mt-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <p className="text-sm text-gray-500 mt-6 italic">
          Haz clic en el mapa para agregar una nueva ubicación (solo modo edición administrador).
        </p>
      </div>
    </div>
  );
};

export default Ubicaciones;
