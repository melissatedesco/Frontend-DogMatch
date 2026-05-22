const PLACEHOLDER = "https://cdn-icons-png.flaticon.com/512/616/616408.png";

const buildImgUrl = (raw) => {
  if (!raw || raw === 'default-dog.png') return PLACEHOLDER;
  if (raw.startsWith("http")) return raw;
  return `/uploads/${raw.replace("uploads/", "")}`;
};

const intentoLabel = (intento) => {
  if (intento === 'accoppiamento') return { label: 'Cerca compagno', color: '#EFA6BA', bg: '#fff0f5', icon: 'bi-heart-fill' };
  return { label: 'Vuole giocare', color: '#7FBCC8', bg: '#f0f8fb', icon: 'bi-balloon-heart-fill' };
};

const RichiesteMatch = ({ richieste, onAccetta, onRifiuta, onBack }) => {
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>

      {/* Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
          <h4 className="fw-bold mb-0" style={{ color: "#1c1e21", fontSize: "1.6rem" }}>
            Richieste di Match
          </h4>
          <button
            className="btn btn-sm rounded-pill px-3 fw-semibold"
            style={{ backgroundColor: "#f0f2f5", color: "#555", border: "none", fontSize: "0.82rem" }}
            onClick={onBack}
          >
            <i className="bi bi-arrow-left me-1" />Home
          </button>
        </div>
        <p className="text-muted small mb-0">
          {richieste.length === 0
            ? "Nessuna richiesta in attesa"
            : `${richieste.length} richiesta${richieste.length !== 1 ? 'e' : ''} in attesa`}
        </p>
      </div>

      {/* Empty state */}
      {richieste.length === 0 ? (
        <div
          className="text-center py-5 rounded-4"
          style={{ backgroundColor: "white", border: "1.5px solid #f0e8f5" }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "0.75rem", opacity: 0.25 }}>
            <i className="bi bi-heart" />
          </div>
          <p className="fw-semibold mb-1" style={{ color: "#1c1e21" }}>Nessuna richiesta</p>
          <p className="small text-muted">
            Quando qualcuno mette like al tuo cane, apparirà qui.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {richieste.map((r) => {
            const badge = intentoLabel(r.intento);
            const eta   = r.cane.eta ?? r.cane.età ?? null;
            const sesso = r.cane.sesso
              ? (r.cane.sesso.toLowerCase() === 'maschio' ? '♂ Maschio' : '♀ Femmina')
              : null;
            const ownerName = r.utente?.nome ?? r.utente?.username ?? null;

            return (
              <div
                key={r.interazioneId}
                className="bg-white rounded-4 shadow-sm overflow-hidden"
                style={{ border: "1.5px solid #f0e8f5" }}
              >
                <div className="d-flex align-items-stretch">

                  {/* Foto cane */}
                  <div style={{ width: "130px", flexShrink: 0, position: "relative" }}>
                    <img
                      src={buildImgUrl(r.cane.fotoUrl ?? r.cane.foto_url)}
                      onError={(e) => { e.target.src = PLACEHOLDER; }}
                      style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: "140px" }}
                    />
                    {/* Badge intento sovrapposto */}
                    <span
                      className="position-absolute bottom-0 start-0 m-2 badge rounded-pill text-white px-2 py-1"
                      style={{ backgroundColor: badge.color, fontSize: "0.6rem" }}
                    >
                      <i className={`bi ${badge.icon} me-1`} />{badge.label}
                    </span>
                  </div>

                  {/* Info + azioni */}
                  <div className="flex-grow-1 p-3 d-flex flex-column justify-content-between" style={{ minWidth: 0 }}>

                    {/* Info cane */}
                    <div className="mb-2">
                      <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                        <span className="fw-bold" style={{ color: "#1c1e21", fontSize: "1.05rem" }}>
                          {r.cane.nome}
                        </span>
                      </div>
                      <div className="d-flex flex-wrap gap-2 mb-1">
                        {r.cane.razza && (
                          <span className="small text-muted">
                            <i className="bi bi-tag me-1" style={{ color: "#7FBCC8" }} />
                            {r.cane.razza}
                          </span>
                        )}
                        {sesso && (
                          <span className="small text-muted">
                            <i className="bi bi-gender-ambiguous me-1" style={{ color: "#EFA6BA" }} />
                            {sesso}
                          </span>
                        )}
                        {eta != null && (
                          <span className="small text-muted">
                            <i className="bi bi-calendar3 me-1" style={{ color: "#aaa" }} />
                            {eta} {eta === 1 ? 'anno' : 'anni'}
                          </span>
                        )}
                      </div>
                      {ownerName && (
                        <p className="small mb-0" style={{ color: "#888" }}>
                          <i className="bi bi-person me-1" />di {ownerName}
                        </p>
                      )}
                    </div>

                    {/* Azioni */}
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm rounded-pill fw-bold px-3 text-white flex-grow-1"
                        style={{ backgroundColor: "#7FBCC8", border: "none", fontSize: "0.82rem" }}
                        onClick={() => onAccetta(r)}
                      >
                        <i className="bi bi-check-lg me-1" />Accetta
                      </button>
                      <button
                        className="btn btn-sm rounded-pill fw-bold px-3 flex-grow-1"
                        style={{ backgroundColor: "#f5f5f5", color: "#555", border: "1.5px solid #ddd", fontSize: "0.82rem" }}
                        onClick={() => onRifiuta(r)}
                      >
                        <i className="bi bi-x-lg me-1" />Rifiuta
                      </button>
                    </div>

                  </div>
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
