import logo from "../assets/logo.png";
import Footer from "./Footer";

const PrimaPagina = ({ onStart }) => {
  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        backgroundColor: " #f8fbfb",
      }}
    >
      {/* navbar  */}
      <nav
        className="navbar navbar-light bg-white shadow-sm px-4 py-2"
        style={{
          borderRadius: "0 0 20px 20px",
        }}
      >
        <div
          className="container d-flex justify-content-between
                    align-items-center"
        >
          <div className="d.flex align-items-center">
            <img src={logo} alt="Dog Match Logo" height="50" className="me-2" />
            <span
              className="fw-bold fs-3"
              style={{
                color: "#7FBCC8",
              }}
            >
              DOG
              <span
                style={{
                  color: "#EFA6BA",
                }}
              >
                MATCH
              </span>
            </span>
          </div>

          <button
            className="btn text-white rounded-pill px-4 fw-bold shadow-sm"
            style={{
              backgroundColor: "#7FBCC8",
              fontSize: "0.9rem",
            }}
            onClick={() => onStart("login")}
          >
            Accedi
          </button>
        </div>
      </nav>

      {/* hero content */}

      <div className="container flex-flex-grow-1 d-flex align-items-center py-5">
        <div className="row align-items-center">
          {/*  colonna Testo */}
          <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
            <h1
              className="display-4 fw-bold mb-3"
              style={{
                color: "#555",
                lineHeight: "1.2",
              }}
            >
              La tua App per il <br />
              <span
                style={{
                  color: "#7BFCC8",
                }}
              >
                Matching Selezionato
              </span>
              <br />
              tra Cani
            </h1>
            <p className="lead text-muted mb-4 fs-4">
              L'unica piattaforma dedicata esclusivamente all'accoppiamento
              responsabile tra cani di razza con pedigree verificato ed identità
              certificata.
            </p>

            {/* requisiti obbligatori */}
            <div
              className="card border-0 shadow-sm p-4 mb-4"
              style={{
                borderRadius: "25px",
                borderLeft: "6px solid #EFA6BA",
                backgroundColor: "#fff",
              }}
            >
              <h5
                className="fw-bold mb-3"
                style={{
                  color: "#EFA6BA",
                }}
              >
                Accesso Esclusivo:
              </h5>
              <ul className="list-unstyled mb-0 fs-6">
                <li className="mb-3 d-flex align-items-center">
                  <i
                    className="bi bi-file-earmark-check-fill me-3"
                    style={{
                      color: "#7FBCC8",
                    }}
                  ></i>
                  <span>
                    {" "}
                    Certificato di <strong>Pedigree</strong> Originale
                  </span>
                </li>

                <li className="mb-3 d-flex align-items-center">
                  <i
                    className="bi bi-person-badge-fill me-2"
                    style={{
                      color: "#7FBCC8",
                    }}
                  ></i>
                  <span>Verifica dell'identità del proprietario</span>
                </li>

                <li className="mb-0 d-flex align-items-center">
                  <i
                    className="bi bi-intersect me-3"
                    style={{
                      color: "#7FBCC8",
                      fontSize: "1.4rem",
                    }}
                  ></i>
                  <span>
                    Match esclusivo tra esemplari della{" "}
                    <strong>stessa razza</strong>{" "}
                  </span>
                </li>
              </ul>
            </div>

            <div
              className="d-flex flex-column flex-sm-row gap-3 
                        justify-content-center justify-content-lg-start"
            >
              <button
                className="btn btn-lg text-white rounded-pill 
                            px-5 py-3 fw-bold shadow-lg"
                style={{
                  backgroundColor: "#EFA6BA",
                  fontSize: "1.1rem",
                }}
                onClick={() => onStart("register")}
              >
                Inizia Verifica Profilo
              </button>
            </div>
            <p className="text-muted small mt-3 italic text-center text-lg-start">
              *Il matching è riservato ai soli utenti con abbonamento Premium
              attivo.
            </p>
          </div>

          {/* Colonna immagine */}
          <div className="col-lg-6 text-center">
            <div className="position-relative d-inline-block">
              <div
                className="position-absolute top-50 start-50
                                translate-middle rounded-circle"
                style={{
                  width: "105%",
                  height: "105%",
                  border: "2px dashed #7FBCC8",
                  zIndex: -1,
                }}
              ></div>

              <img
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000&auto=format&fit=crop"
                alt="Labrador"
                className="img-fluid shadow-lg"
                style={{
                  borderRadius: "40px",
                  border: "10px solid white", // Cornice Bianca
                  width: "85%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrimaPagina;
