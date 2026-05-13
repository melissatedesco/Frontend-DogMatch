const formatDistanza = (km) => {
  if (km == null) return null;
  if (km < 1) return "A meno di 1km da te";
  return `A ${Math.round(km)} km da te`;
};

function MatchRequestCard({ dog, onAccept, onPlay, onView, activeDog, isOnline = false }) {
  const distanzaLabel = formatDistanza(dog.distance);
  const hasPedigree = !!(dog.pedigreeUrl || dog.pedigree_url);

  // Compatibile per il match se stessa razza e sesso opposto
  const isMatchCompatible =
    activeDog &&
    dog.breed === activeDog.razza &&
    dog.sesso &&
    activeDog.sesso &&
    dog.sesso !== activeDog.sesso;

  return (
    <div
      className="card shadow-sm h-100 border-0"
      style={{ borderRadius: "20px", overflow: "hidden", transition: "transform 0.15s, box-shadow 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ""; }}
    >
      {/* Immagine */}
      <div className="position-relative" style={{ cursor: "pointer" }} onClick={() => onView(dog)}>
        <img
          src={dog.photo}
          className="card-img-top"
          alt={dog.name}
          style={{ height: "210px", objectFit: "cover" }}
        />

        {/* Indicatore online */}
        <span
          className="position-absolute top-0 end-0 m-2 rounded-circle border border-white"
          style={{
            width: "13px", height: "13px", zIndex: 3,
            backgroundColor: isOnline ? "#28c76f" : "#adb5bd",
            display: "block",
          }}
        />

        {/* Badge distanza — in basso a sinistra sull'immagine */}
        {distanzaLabel && (
          <div className="position-absolute bottom-0 start-0 m-2" style={{ zIndex: 2 }}>
            <span
              className="badge rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1"
              style={{
                backgroundColor: "rgba(0,0,0,0.55)",
                color: "white",
                fontSize: "0.72rem",
                backdropFilter: "blur(4px)",
              }}
            >
              <i className="bi bi-geo-alt-fill" style={{ color: "#7FBCC8" }} />
              {distanzaLabel}
            </span>
          </div>
        )}

        {/* Badge pedigree — in alto a destra (solo se reale) */}
        {hasPedigree && (
          <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 2 }}>
            <span
              className="badge rounded-pill px-2 py-1 fw-semibold"
              style={{ backgroundColor: "rgba(127,188,200,0.92)", color: "white", fontSize: "0.65rem" }}
            >
              <i className="bi bi-award-fill me-1" />Pedigree
            </span>
          </div>
        )}

        {/* Badge compatibilità match — in alto a sinistra */}
        {isMatchCompatible && (
          <div className="position-absolute top-0 start-0 m-2" style={{ zIndex: 2 }}>
            <span
              className="badge rounded-pill px-2 py-1 fw-semibold"
              style={{ backgroundColor: "rgba(40,167,69,0.88)", color: "white", fontSize: "0.65rem" }}
            >
              <i className="bi bi-heart-fill me-1" />Compatibile
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="card-body d-flex flex-column p-3" style={{ gap: "6px" }}>

        <div>
          <h6 className="fw-bold mb-0" style={{ fontSize: "1.05rem", color: "#1c1e21" }}>{dog.name}</h6>
          <div className="text-muted small">{dog.breed}</div>
        </div>

        <div className="text-muted small">
          {dog.eta != null ? `${dog.eta} ${dog.eta === 1 ? "anno" : "anni"}` : ""}
          {dog.sesso ? ` · ${dog.sesso === "M" ? "Maschio" : "Femmina"}` : ""}
          {dog.taglia ? ` · Taglia ${dog.taglia}` : ""}
        </div>

        {dog.descrizione && (
          <p
            className="text-muted small mb-0"
            style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.4" }}
          >
            {dog.descrizione}
          </p>
        )}

        {/* Pulsanti azione */}
        <div className="d-flex flex-column gap-2 mt-auto" style={{ marginTop: "8px" }}>

          {/* Pulsante Gioca — sempre visibile */}
          <button
            className="btn fw-bold text-white w-100 rounded-pill"
            style={{
              backgroundColor: "#7FBCC8",
              border: "none",
              padding: "0.6rem 1rem",
              fontSize: "0.9rem",
              letterSpacing: "0.02em",
              boxShadow: "0 4px 14px rgba(127,188,200,0.4)",
              transition: "background-color 0.15s, box-shadow 0.15s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = "#5ea8b8";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(94,168,184,0.45)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = "#7FBCC8";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(127,188,200,0.4)";
            }}
            onClick={() => onPlay(dog.id)}
          >
            <i className="bi bi-circle-fill me-2" />Gioca!
          </button>

          {/* Pulsante Match — solo se compatibile per accoppiamento */}
          {isMatchCompatible && (
            <button
              className="btn fw-bold text-white w-100 rounded-pill"
              style={{
                backgroundColor: "#28a745",
                border: "none",
                padding: "0.7rem 1rem",
                fontSize: "0.95rem",
                letterSpacing: "0.02em",
                boxShadow: "0 4px 14px rgba(40,167,69,0.4)",
                transition: "background-color 0.15s, box-shadow 0.15s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "#1e7e34";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(30,126,52,0.45)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "#28a745";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(40,167,69,0.4)";
              }}
              onClick={() => onAccept(dog.id)}
            >
              <i className="bi bi-stars me-2" />Match
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

export default MatchRequestCard;
