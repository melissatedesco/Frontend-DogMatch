import { useEffect } from "react";

const InfoCane = ({ dog, onClose, onAccept }) => {
  if (!dog) return null;

  const hasPedigree = !!(dog.pedigreeUrl ?? dog.pedigree_url) ||
    (Array.isArray(dog.documenti) && dog.documenti.length > 0);
  const isVaccinato = dog.infoSanitarie
    ? dog.infoSanitarie.toLowerCase().includes('vaccin')
    : false;

  // Chiude con Escape
  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(8px)",
        zIndex: 9000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      {/* Card — stopPropagation impedisce la chiusura al click interno */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          borderRadius: 25, overflow: 'hidden',
          width: '100%', maxWidth: 480,
          backgroundColor: 'white',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
          position: 'relative',
        }}
      >
        {/* Immagine header */}
        <div style={{ position: 'relative' }}>
          <img
            src={dog.photo}
            alt={dog.name}
            style={{ width: "100%", height: "320px", objectFit: "cover", display: 'block' }}
          />

          {/* X visibile */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 12, right: 12,
              width: 38, height: 38, borderRadius: '50%',
              backgroundColor: 'white', border: 'none',
              boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 10, fontSize: '1rem', color: '#333',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; }}
            title="Chiudi"
          >
            <i className="bi bi-x-lg" />
          </button>

          {/* Nome + distanza in basso */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.82))",
            padding: '40px 20px 16px',
            color: 'white',
          }}>
            <h2 style={{ fontWeight: 800, marginBottom: 2, fontSize: '1.7rem' }}>{dog.name || dog.nome}</h2>
            <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              <i className="bi bi-geo-alt-fill me-1" />
              {dog.distance != null ? `${Math.round(dog.distance)} km da te` : "Posizione N/D"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 8px' }}>
          <h6 style={{ fontSize: '0.72rem', letterSpacing: '1px', color: '#999', fontWeight: 700, marginBottom: 12 }}>
            INFORMAZIONI
          </h6>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {dog.eta != null && (
              <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-medium">
                <i className="bi bi-calendar3 me-1" style={{ color: "#7FBCC8" }} />
                {dog.eta} {dog.eta === 1 ? "anno" : "anni"}
              </span>
            )}
            {dog.sesso && (
              <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-medium">
                <i className={`bi ${dog.sesso === 'M' ? 'bi-gender-male' : 'bi-gender-female'} me-1`}
                  style={{ color: dog.sesso === 'M' ? '#7FBCC8' : '#EFA6BA' }} />
                {dog.sesso === 'M' ? 'Maschio' : 'Femmina'}
              </span>
            )}
            {dog.taglia && (
              <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-medium">
                <i className="bi bi-rulers me-1" style={{ color: "#7FBCC8" }} />
                Taglia {dog.taglia}
              </span>
            )}
            {hasPedigree ? (
              <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-medium">
                <i className="bi bi-patch-check text-success me-1" />Pedigree
              </span>
            ) : (
              <span className="badge rounded-pill bg-light text-muted px-3 py-2 fw-medium">
                <i className="bi bi-patch-check me-1" style={{ color: "#ccc" }} />Senza pedigree
              </span>
            )}
            {isVaccinato ? (
              <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-medium">
                <i className="bi bi-shield-check text-warning me-1" />Vaccinato
              </span>
            ) : (
              <span className="badge rounded-pill bg-light text-muted px-3 py-2 fw-medium">
                <i className="bi bi-shield me-1" style={{ color: "#ccc" }} />Vaccinazioni N/D
              </span>
            )}
          </div>

          {dog.descrizione && (
            <>
              <h6 style={{ fontSize: '0.72rem', letterSpacing: '1px', color: '#999', fontWeight: 700, marginBottom: 8 }}>
                BIO
              </h6>
              <p style={{ color: '#555', lineHeight: 1.55, marginBottom: 20 }}>
                {dog.descrizione}
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '0 24px 24px' }}>
          <button
            className="btn rounded-pill fw-bold shadow w-100 text-white"
            onClick={() => onAccept(dog.id)}
            style={{ backgroundColor: "#7FBCC8", border: "none", padding: '14px', fontSize: '1rem' }}
          >
            <i className="bi bi-heart-fill me-2" />FAI MATCH ORA
          </button>
          <button
            className="btn rounded-pill w-100 fw-semibold mt-2"
            onClick={onClose}
            style={{ backgroundColor: '#f0f2f5', border: 'none', color: '#555', padding: '10px' }}
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoCane;
