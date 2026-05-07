import { useState, useEffect } from "react";

const PLACEHOLDER = "https://cdn-icons-png.flaticon.com/512/616/616408.png";

const buildImgUrl = (raw) => {
  if (!raw || raw === 'default-dog.png') return PLACEHOLDER;
  if (raw.startsWith("http")) return raw;
  return `/uploads/${raw.replace("uploads/", "")}`;
};

const formatOra = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'Adesso';
  if (m < 60) return `${m}m fa`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h fa`;
  return `${Math.floor(h / 24)}g fa`;
};

const AdminMatchSidebar = () => {
  const [matches,  setMatches]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/admin/matches-recenti", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.successo) setMatches(d.matches); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-4 shadow-sm p-3 border-0">
      <h6 className="fw-bold mb-1 pb-2 border-bottom" style={{ color: "#7FBCC8", fontSize: "0.88rem" }}>
        <i className="bi bi-stars me-1" style={{ color: "#f0a500" }} />
        Ultimi Match della Piattaforma
      </h6>

      {loading ? (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm" style={{ color: "#7FBCC8" }} role="status" />
        </div>
      ) : matches.length === 0 ? (
        <p className="text-muted small text-center py-3 mb-0">
          <i className="bi bi-heart d-block mb-1" style={{ fontSize: "1.4rem", opacity: 0.25 }} />
          Nessun match ancora
        </p>
      ) : (
        <div className="d-flex flex-column gap-2 mt-2">
          {matches.map(m => (
            <div
              key={m.id}
              className="d-flex align-items-center gap-2 px-2 py-2 rounded-3"
              style={{ backgroundColor: "#f8fbfb" }}
            >
              {/* Foto sovrapposte */}
              <div className="position-relative flex-shrink-0" style={{ width: 44, height: 28 }}>
                <img
                  src={buildImgUrl(m.mittente?.fotoUrl)}
                  onError={e => { e.target.src = PLACEHOLDER; }}
                  style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: "2px solid #EFA6BA", position: "absolute", left: 0, zIndex: 2 }}
                />
                <img
                  src={buildImgUrl(m.ricevente?.fotoUrl)}
                  onError={e => { e.target.src = PLACEHOLDER; }}
                  style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", border: "2px solid #7FBCC8", position: "absolute", left: 16, zIndex: 1 }}
                />
              </div>

              {/* Testo */}
              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                <div className="fw-semibold text-truncate" style={{ fontSize: "0.76rem", color: "#1c1e21" }}>
                  {m.mittente?.nome}
                  <i className="bi bi-heart-fill mx-1" style={{ color: "#EFA6BA", fontSize: "0.55rem" }} />
                  {m.ricevente?.nome}
                </div>
                <div style={{ fontSize: "0.65rem", color: "#aaa" }}>{formatOra(m.updatedAt)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMatchSidebar;
