import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix per le icone leaflet con Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const iconMatch = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const iconGioco = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const PLACEHOLDER = "https://cdn-icons-png.flaticon.com/512/616/616408.png";

// Centra la mappa sui markers quando cambiano
const AutoFit = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 10);
    } else {
      map.fitBounds(L.latLngBounds(positions), { padding: [48, 48] });
    }
  }, [positions, map]);
  return null;
};

const MappaRicerca = ({ dogs, activeDog, onAccept, onPlay }) => {
  const dogsConPos = dogs.filter(d => d.lat != null && d.lng != null);
  const positions = dogsConPos.map(d => [d.lat, d.lng]);

  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: "1.5px solid #e8f4f8", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
      <MapContainer
        center={[41.9, 12.5]}
        zoom={6}
        style={{ height: "520px", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AutoFit positions={positions} />

        {dogsConPos.map(dog => {
          const isCompatibile =
            activeDog &&
            dog.breed === activeDog.razza &&
            dog.sesso && activeDog.sesso &&
            dog.sesso !== activeDog.sesso;

          return (
            <Marker
              key={dog.id}
              position={[dog.lat, dog.lng]}
              icon={isCompatibile ? iconMatch : iconGioco}
            >
              <Popup minWidth={200}>
                <div style={{ textAlign: "center", fontFamily: "inherit" }}>
                  <img
                    src={dog.photo || PLACEHOLDER}
                    onError={e => { e.target.src = PLACEHOLDER; }}
                    alt={dog.name}
                    style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2.5px solid #7FBCC8", marginBottom: 6 }}
                  />
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1c1e21" }}>{dog.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#888", marginBottom: 6 }}>
                    {dog.breed} · {dog.sesso === "M" ? "Maschio" : "Femmina"}
                    {dog.eta != null && ` · ${dog.eta} ${dog.eta === 1 ? "anno" : "anni"}`}
                  </div>
                  {dog.proprietarioNome && (
                    <div style={{ fontSize: "0.7rem", color: "#aaa", marginBottom: 8 }}>
                      <i className="bi bi-person-fill me-1" />{dog.proprietarioNome}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    <button
                      onClick={() => onPlay(dog.id)}
                      style={{ backgroundColor: "#7FBCC8", color: "white", border: "none", borderRadius: 20, padding: "4px 14px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                    >
                      <i className="bi bi-balloon-heart me-1" />Gioca
                    </button>
                    {isCompatibile && (
                      <button
                        onClick={() => onAccept(dog.id)}
                        style={{ backgroundColor: "#28a745", color: "white", border: "none", borderRadius: 20, padding: "4px 14px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
                      >
                        <i className="bi bi-stars me-1" />Match
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {dogsConPos.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px 0", color: "#aaa", backgroundColor: "white" }}>
          <i className="bi bi-geo-alt d-block mb-2" style={{ fontSize: "2rem" }} />
          <div style={{ fontSize: "0.85rem" }}>Nessun cane con posizione disponibile</div>
        </div>
      )}

      {/* Legenda */}
      <div style={{ backgroundColor: "white", padding: "10px 16px", display: "flex", gap: 20, fontSize: "0.75rem", color: "#666", borderTop: "1px solid #f0e8f5" }}>
        <span><span style={{ color: "#28a745", fontWeight: 700 }}>●</span> Compatibile Match</span>
        <span><span style={{ color: "#7FBCC8", fontWeight: 700 }}>●</span> Solo Gioco</span>
        <span style={{ marginLeft: "auto", color: "#aaa" }}>{dogsConPos.length} cani sulla mappa</span>
      </div>
    </div>
  );
};

export default MappaRicerca;
