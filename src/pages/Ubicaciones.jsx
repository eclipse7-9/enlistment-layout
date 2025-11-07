import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // ⚠️ Asegúrate de que este import esté antes de renderizar el mapa

// Icono personalizado
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const Ubicaciones = () => {
  const [ubicaciones, setUbicaciones] = useState([
    { id: 1, nombre: "Clínica Central", lat: 4.710989, lng: -74.072092 },
    { id: 2, nombre: "Sede Norte", lat: 4.750989, lng: -74.042092 },
  ]);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Añadir ubicaciones clickeando en el mapa (solo si modo edición está activo)
  const AgregarUbicacion = () => {
    useMapEvents({
      click(e) {
        if (modoEdicion) {
          const nueva = {
            id: Date.now(),
nombre: `Ubicación ${ubicaciones.length + 1}`,
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          };
          setUbicaciones([...ubicaciones, nueva]);
        }
      },
    });
    return null;
  };

  const eliminarUbicacion = (id) => {
    setUbicaciones(ubicaciones.filter((u) => u.id !== id));
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

        {/* Botón modo edición */}
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

        {/* Contenedor del mapa */}
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
                    {modoEdicion && (
                      <button
                        onClick={() => eliminarUbicacion(u.id)}
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

        {/* Pie de sección */}
        <p className="text-sm text-gray-500 mt-6 italic">
          Haz clic en el mapa para agregar una nueva ubicación (solo en modo edición).
        </p>
      </div>
    </div>
  );
};

export default Ubicaciones;