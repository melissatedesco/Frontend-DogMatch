import { useState, useEffect } from "react";

const PLACEHOLDER_USER = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const PLACEHOLDER_DOG  = "https://cdn-icons-png.flaticon.com/512/616/616408.png";

const buildImg = (url, fallback) => {
  if (!url) return fallback;
  if (url.startsWith("http")) return url;
  return `/uploads/${url.replace("uploads/", "").replace("/uploads/", "")}`;
};

const ViewProfiloUtente = ({ utenteId, onBack }) => {
  const [utente, setUtente]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!utenteId) return;
    const token = localStorage.getItem("token");
    setLoading(true);
    fetch(`/api/utenti/${utenteId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => {
        if (d.successo || d.utente || d.id) {
          setUtente(d.utente ?? d);
        } else {
          setError("Profilo non trovato.");
        }
      })
      .catch(() => setError("Errore di connessione."))
      .finally(() => setLoading(false));
  }, [utenteId]);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border" style={{ color: "#EFA6BA" }} />
    </div>
  );

  if (error) return (
    <div className="text-center py-5 text-muted">
      <i className="bi bi-exclamation-circle d-block mb-2" style={{ fontSize: "2rem" }} />
      <p>{error}</p>
      <button className="btn rounded-pill px-4" style={{ backgroundColor: "#7FBCC8", color: "white", border: "none" }} onClick={onBack}>
        <i className="bi bi-arrow-left me-1" />Torna indietro
      </button>
    </div>
  );

  const cane = utente?.iMieiCani?.[0] ?? null;

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>

      {/* Tasto indietro */}
      <button
        className="btn btn-sm rounded-pill mb-3 fw-semibold"
        style={{ backgroundColor: "#f0f2f5", color: "#555", border: "none" }}
        onClick={onBack}
      >
        <i className="bi bi-arrow-left me-1" />Indietro
      </button>

      {/* Card utente */}
      <div className="bg-white rounded-4 shadow-sm p-4 mb-3" style={{ border: "1.5px solid #e8f4f8" }}>
        <div className="d-flex align-items-center gap-3 mb-3">
          <img
            src={buildImg(utente?.fotoUrl, PLACEHOLDER_USER)}
            onError={e => { e.target.src = PLACEHOLDER_USER; }}
            alt={utente?.nome}
            style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid #7FBCC8" }}
          />
          <div>
            <h5 className="fw-bold mb-0" style={{ color: "#1c1e21" }}>
              {utente?.nome} {utente?.cognome}
            </h5>
            {utente?.provincia && (
              <div className="small text-muted">
                <i className="bi bi-geo-alt-fill me-1" style={{ color: "#EFA6BA" }} />
                {utente.provincia}{utente.regione ? `, ${utente.regione}` : ""}
              </div>
            )}
            <div style={{ marginTop: 4 }}>
              {utente?.isVerificato && (
                <span className="badge rounded-pill text-white me-1" style={{ backgroundColor: "#28a745", fontSize: "0.65rem" }}>
                  <i className="bi bi-patch-check-fill me-1" />Verificato
                </span>
              )}
              {utente?.ruolo && utente.ruolo !== "privato" && (
                <span className="badge rounded-pill text-white" style={{ backgroundColor: "#7FBCC8", fontSize: "0.65rem" }}>
                  {utente.ruolo}
                </span>
              )}
            </div>
          </div>
        </div>

        {utente?.bio && (
          <p className="text-muted small mb-0" style={{ fontStyle: "italic", lineHeight: 1.5 }}>
            "{utente.bio}"
          </p>
        )}
      </div>

      {/* Card cane */}
      {cane && (
        <div className="bg-white rounded-4 shadow-sm p-4" style={{ border: "1.5px solid #f0e8f5" }}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-balloon-heart-fill" style={{ color: "#EFA6BA", fontSize: "1.1rem" }} />
            <span className="fw-bold" style={{ color: "#EFA6BA" }}>Il suo cane</span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <img
              src={buildImg(cane.fotoUrl ?? cane.foto_url, PLACEHOLDER_DOG)}
              onError={e => { e.target.src = PLACEHOLDER_DOG; }}
              alt={cane.nome}
              style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #EFA6BA" }}
            />
            <div>
              <h6 className="fw-bold mb-0" style={{ color: "#1c1e21" }}>{cane.nome}</h6>
              <div className="text-muted small">{cane.razza}</div>
              <div className="text-muted small">
                {cane.sesso === "M" ? "Maschio" : "Femmina"}
                {cane.eta != null && ` · ${cane.eta} ${cane.eta === 1 ? "anno" : "anni"}`}
                {cane.taglia && ` · Taglia ${cane.taglia}`}
              </div>
              {cane.disponibilitaRiproduttiva && (
                <span className="badge rounded-pill text-white mt-1" style={{ backgroundColor: "#28a745", fontSize: "0.6rem" }}>
                  <i className="bi bi-check-circle-fill me-1" />Disponibile riproduzione
                </span>
              )}
            </div>
          </div>

          {cane.descrizione && (
            <p className="text-muted small mt-3 mb-0" style={{ lineHeight: 1.5 }}>
              {cane.descrizione}
            </p>
          )}

          {cane.infoSanitarie && (
            <div className="mt-2 p-2 rounded-3 small" style={{ backgroundColor: "#f0f9fa", color: "#555" }}>
              <i className="bi bi-heart-pulse-fill me-1" style={{ color: "#7FBCC8" }} />
              {cane.infoSanitarie}
            </div>
          )}

          {(cane.pedigreeUrl ?? cane.pedigree_url) && (
            <div className="mt-2">
              <span className="badge rounded-pill text-white" style={{ backgroundColor: "#f0a500", fontSize: "0.65rem" }}>
                <i className="bi bi-award-fill me-1" />Pedigree disponibile
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewProfiloUtente;
