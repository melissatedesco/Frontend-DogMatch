const InfoCane = ({ dog, onClose, onAccept }) => {
  if (!dog) return null;

  const hasPedigree = Array.isArray(dog.documenti) && dog.documenti.length > 0;
  const isVaccinato = dog.infoSanitarie
    ? dog.infoSanitarie.toLowerCase().includes('vaccin')
    : false;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "25px", overflow: "hidden" }}>

          {/* Immagine header */}
          <div className="position-relative">
            <img
              src={dog.photo}
              alt={dog.name}
              style={{ width: "100%", height: "350px", objectFit: "cover" }}
            />

            <button
              onClick={onClose}
              className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px", zIndex: 10, border: "none" }}
            >
              <i className="bi bi-x-lg" />
            </button>

            <div
              className="position-absolute bottom-0 start-0 p-4 text-white"
              style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))", width: "100%" }}
            >
              <h2 className="fw-bold mb-0">{dog.name || dog.nome}</h2>
              <span className="small">
                <i className="bi bi-geo-alt-fill me-1" />
                {dog.distance || "N/A"} km da te
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body p-4 bg-white">
            <h6 className="fw-bold text-uppercase text-muted mb-3" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
              Informazioni
            </h6>

            <div className="d-flex flex-wrap gap-2 mb-4">
              {/* Età */}
              {dog.eta != null && (
                <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-medium">
                  <i className="bi bi-calendar3 me-1" style={{ color: "#7FBCC8" }} />
                  {dog.eta} {dog.eta === 1 ? "anno" : "anni"}
                </span>
              )}

              {/* Pedigree */}
              {hasPedigree ? (
                <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-medium">
                  <i className="bi bi-patch-check text-success me-1" />
                  Pedigree
                </span>
              ) : (
                <span className="badge rounded-pill bg-light text-muted px-3 py-2 fw-medium">
                  <i className="bi bi-patch-check me-1" style={{ color: "#ccc" }} />
                  Senza pedigree
                </span>
              )}

              {/* Vaccinato */}
              {isVaccinato ? (
                <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-medium">
                  <i className="bi bi-shield-check text-warning me-1" />
                  Vaccinato
                </span>
              ) : (
                <span className="badge rounded-pill bg-light text-muted px-3 py-2 fw-medium">
                  <i className="bi bi-shield me-1" style={{ color: "#ccc" }} />
                  Vaccinazioni N/D
                </span>
              )}
            </div>

            <h6 className="fw-bold text-uppercase text-muted mb-2" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
              Bio
            </h6>
            <p className="text-secondary">
              {dog.descrizione || "Nessuna bio inserita dal proprietario."}
            </p>
          </div>

          <div className="modal-footer border-0 p-4 pt-0">
            <button
              className="btn rounded-pill px-5 py-3 fw-bold shadow-lg w-100 text-white"
              onClick={() => onAccept(dog.id)}
              style={{ backgroundColor: "#7FBCC8", border: "none" }}
            >
              <i className="bi bi-heart-fill me-2" />
              FAI MATCH ORA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCane;
