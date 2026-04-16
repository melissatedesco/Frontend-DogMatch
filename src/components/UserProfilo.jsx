const UserProfilo = ({ user }) => {
  // controllo se l'utente esiste
  if (!user) return;
  <div className="text-center mt-5"> Caricamento..</div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {/* card profilo */}
          <div
            className="card border-0 shadow-lg text-center"
            style={{
              borderRadius: "30px",
              overflow: "visible",
              backgroundColor: "#fff",
            }}
          >
            <div className="card-body p-5">
              {/* foto profilo contenitore */}
              <div className="mb-4 d-flex justify-content-center">
                <div className="position-relative">
                  <img
                    src={
                      user.photo ||
                      "https://cdn-icons-png.flaticon.com/512/6073/6073873.png"
                    }
                    alt="Profilo Mario"
                    className="rounded-circle border border-4 border-white shadow"
                    style={{
                      width: "140px",
                      height: "140px",
                      objectFit: "cover",
                      backgroundColor: "white",
                    }}
                  />

                  {/* icon camera */}
                  <div
                    className="btn btn-sm btn-light position-absolute 
                  bottom-0 rounded-circle shadow-sm border"
                    style={{
                      cursor: "pointer",
                      transform: "translate(10%, 10%)",
                    }}
                  >
                    <i className="bi bi-camera-fill"></i>
                  </div>
                </div>
              </div>

              {/* info utente - email*/}
              <div className="mt-4 mb-3">
                <h2
                  className="fw-bold mb-1"
                  style={{
                    color: "#7FBCC8",
                  }}
                >
                  {user.username}
                    </h2>
                    <p className="text-muted small">
                        {user.email}
                    </p>
                </div>

              {/* Badge  */}
              <div className="d-flex justify-content-center gap-2 mb-4">
                {/* badge pedigree */}
                {user.hasPedigree ? (
                  <span className="badge rounded-pill px-3 text-white shadow-sm"
                  style={{
                    backgroundColor: '#7FBCC8',
                    fontSize: '0.75rem'
                  }}>
                    <i className="bi bi-award me-1"></i>
                    Pedigree Certificato
                  </span>
                ) : (
                  <span className="badge rounded-pill px-3 py-2 bg-secondary text-white shadow-sm "
                  style={{
                  fontSize:'0.75rem'
                  }}>
                    Nessun Pedigree
                  </span>
                )}
                {/* badge verifica */}
                <span className={`badge rouded-pill px-3 py-2 shadow-sm 
                ${user.isVerified ? 'bg-primary' : 'bg-danger'}`}
                style={{
                    fontSize: '0.75rem'
                }}>
                    {user.isVerified ? 'Verificato' : 'Non Verificato'}
                </span>
              </div>

              {/* Info cane */}
              <div className="p-4 rounded-4 mb-5 text-start"
              style={{
                backgroundColor: '#fcf8f9',
                borderLeft: '5px solid #EFA6BA'
              }}>
                <label
                  className="small fw-bold text-uppercase text-muted mb-2 d-block"
                  style={{
                    letterSpacing: "1px",
                  }}
                >
                  Bio del Cane
                </label>
                <p
                  className="mb-0"
                  style={{
                    color: "#555",
                    lineHeight: "1.6",
                  }}
                >
                  {user.dogBio}
                </p>
              </div>
                
              

              {/* Bottoni */}
              <div className="d-flex gap-3 d-sm-flex justify-content-sm-center">
                <button className="btn btn-outline-secondary rounded-pill px-4 fw-bold">
                  Modifica Profilo
                </button>

                <button
                  className="btn text-white rounded-pill px-4 fw-bold shadow-sm"
                  style={{
                    backgroundColor: "#7FBCC8",
                  }}
                >
                  {" "}
                  Impostazione privacy{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilo;
