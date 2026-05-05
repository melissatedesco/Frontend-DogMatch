const PLACEHOLDER = "https://cdn-icons-png.flaticon.com/512/616/616408.png";

const buildImgUrl = (raw) => {
  if (!raw || raw === 'default-dog.png') return PLACEHOLDER;
  if (raw.startsWith("http")) return raw;
  return `/uploads/${raw.replace("uploads/", "")}`;
};

const intentoLabel = (intento) => {
  if (intento === 'accoppiamento') return { label: 'Accoppiamento', color: '#EFA6BA', icon: 'bi-heart-fill' };
  return { label: 'Gioco', color: '#7FBCC8', icon: 'bi-balloon-heart-fill' };
};

const RichiesteMatch = ({ richieste, onAccetta, onRifiuta, onBack }) => {
  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>

      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: "#1c1e21" }}>
            <i className="bi bi-heart-arrow me-2" style={{ color: "#EFA6BA" }} />
            Richieste di Match
          </h4>
          <p className="text-muted small mb-0">
            {richieste.length === 0
              ? "Nessuna richiesta in attesa"
              : `${richieste.length} richiesta${richieste.length > 1 ? 'e' : ''} in attesa`}
          </p>
        </div>
        <button
          className="btn btn-sm rounded-pill px-3 fw-bold"
          style={{ backgroundColor: "#f0f2f5", color: "#555", border: "none" }}
          onClick={onBack}
        >
          <i className="bi bi-arrow-left me-1" />Torna alla home
        </button>
      </div>

      {richieste.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-heart d-block mb-3" style={{ fontSize: "3rem", opacity: 0.25 }} />
          <p className="fw-semibold mb-1">Nessuna richiesta</p>
          <p className="small">Quando qualcuno mette like al tuo cane, apparirà qui.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {richieste.map((r) => {
            const badge = intentoLabel(r.intento);
            return (
              <div
                key={r.interazioneId}
                className="bg-white rounded-4 p-3 shadow-sm d-flex align-items-center gap-3"
                style={{ border: "1.5px solid #f0e0e8" }}
              >
                <img
                  src={buildImgUrl(r.cane.fotoUrl ?? r.cane.foto_url)}
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                  style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "2px solid #EFA6BA", flexShrink: 0 }}
                />

                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                    <span className="fw-bold" style={{ color: "#1c1e21" }}>{r.cane.nome}</span>
                    <span className="badge rounded-pill text-white px-2 py-1" style={{ backgroundColor: badge.color, fontSize: "0.65rem" }}>
                      <i className={`bi ${badge.icon} me-1`} />{badge.label}
                    </span>
                  </div>
                  <p className="text-muted small mb-0 text-capitalize">{r.cane.razza}</p>
                </div>

                <div className="d-flex flex-column gap-2 flex-shrink-0">
                  <button
                    className="btn btn-sm rounded-pill fw-bold px-3 text-white"
                    style={{ backgroundColor: "#7FBCC8", border: "none", fontSize: "0.8rem", minWidth: "80px" }}
                    onClick={() => onAccetta(r)}
                  >
                    <i className="bi bi-check-lg me-1" />Accetta
                  </button>
                  <button
                    className="btn btn-sm rounded-pill fw-bold px-3"
                    style={{ backgroundColor: "#fff3f3", color: "#dc3545", border: "1.5px solid #f5c6cb", fontSize: "0.8rem", minWidth: "80px" }}
                    onClick={() => onRifiuta(r)}
                  >
                    <i className="bi bi-x-lg me-1" />Rifiuta
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RichiesteMatch;
