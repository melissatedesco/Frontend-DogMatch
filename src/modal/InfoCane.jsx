const InfoCane = ({ dog, onClose, onAccept }) => {
  if (!dog) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(10px)",
          zIndex: 1050,
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content border-0 shadow-lg"
            style={{
              borderRadius: "25px",
              overflow:'hidden'
            }}
          >

            {/* immagine header con tasto chiudi */}
            <div className="position-relative">
              
              <img
                src={dog.photo}
                alt={dog.name}
                className="rounded mb-3 shadow-sm"
                style={{
                  width: "100%",
                  height: "350px",
                  objectFit: "cover"
                }}
            />

                {/* tasto chiudi */}
               <button onClick={onClose}
               className="btn btn-light position-absolute top-0 end-0 m-3 rounded-bi-circle
               shadow-sm d-flex align-items-center justify-content-center"
               style={{
                width:'40px',
                height:'40px',
                opacity:'0.9',
                border: 'none'    
                }}>
                  <i className="bi bi-x-lg"></i>
                </button> 

                {/* overlay testo su immagine */}
              <div className="position-absolute bottom-0 start-0 p-4 text-white"
              style={{
                background:'linear-gradient(transparent, rgba(0,0,0,0.8))',
                width: '100%'
              }}>
                <h2 className="fw-bold mb-0">{dog.name}, 2 anni</h2>
              <span className="small">
                <i className="bi bi-geo-alt-fill me-1"></i>
                {dog.distance}
              km da te
              </span>
              </div>
            </div>

              <div className="modal-body p-4 bg-white">
               <h6 className="fw-bold text-uppercase text-muted mb-3"
               style={{
                fontSize:'0.75rem',
                letterSpacing:'1px'
               }}>
                Informazioni
               </h6>

               <div className="d-flex flex-wrap gap-2 mb-4">
                <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-medium">
                  <i className="bi bi-patch-check text-success me-1"></i>
                Pedigree
                </span>
                 <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-medium">
                  <i className="bi bi-dna text-info me-1"></i>
              Genetica
                </span>
                 <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-medium">
                  <i className="bi bi-shield-check text-warning me-1"></i>
               Vaccinato
                </span>
               </div>

               <h6 className="fw-bold text-uppercase text-muted mb-2"
               style={{
                fontSize:'0.75rem',
                letterSpacing:'1px'
               }}> Bio</h6>
               <p className="text-secondary">Un {dog.breed} giocherellone che ama le lunghe passeggiate e rincorrere le palline da tennis.</p>
            </div>

            <div className="modal-footer border-0 p-4 pt-0">
              <button
                className="btn btn-success rounded-pill px-5 py-3 fw-bold shadow-lg w-100 "
                onClick={() => onAccept(dog.id)}
                style={{
                  backgroundColor: '#2DC96E',
                  border:'none'
                }}
              >
                <i className="bi bi-heart-fill me-2"></i>
                FAI MATCH ORA
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoCane;
