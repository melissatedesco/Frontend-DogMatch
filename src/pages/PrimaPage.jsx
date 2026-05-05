import React from "react";
import logo from "../assets/logo.png";
import snoutBot from "../assets/snoutBot.png"; 
import Footer from "../components/Footer";

const PrimaPagina = ({ onStart }) => {
  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        backgroundColor: " #f8fbfb",
      }}
    >
      {/* navbar */}
      <nav
        className="navbar navbar-light bg-white shadow-sm px-4 py-2"
        style={{
          borderRadius: "0 0 20px 20px",
        }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
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
      <div className="container flex-grow-1 d-flex align-items-center py-5">
        <div className="row align-items-center w-100">
          
          {/* colonna testo */}
          <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
            <h1
              className="display-4 fw-bold mb-3"
              style={{
                color: "#555",
                lineHeight: "1.2",
              }}
            >
              La tua App per il <br />
              <span style={{ color: "#7FBCC8" }}>Matching Selezionato</span>
              <br />
              tra Cani
            </h1>
            <p className="lead text-muted mb-4 fs-4">
              L'unica piattaforma dedicata esclusivamente all'accoppiamento
              responsabile tra cani di razze con pedigree verificato ed identità
              certificata.
            </p>

            {/* presentazione snout */}
            <div
              className="p-4 shadow-sm mb-4"
              style={{
                backgroundColor: "#f0f9fa",
                borderRadius: "30px",
                border: "2px solid #7FBCC8",
              }}
            >
              <div className="d-flex align-items-center mb-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#7FBCC8",
                    overflow: "hidden",
                    border: "2px solid white"
                  }}
                >
                  <img
                    src={snoutBot}
                    alt="snoutBot"
                    className="img-fluid"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <h5 className="fw-bold mb-0" style={{ color: "#555" }}>
                  Incontra SnoutBot 🐾
                </h5>
              </div>

              <p className="small text-muted mb-2">
                Il tuo assistente AI personale che ti guiderà passo dopo passo:
              </p>
              <ul className="list-unstyled mt-2 mb-0 small">
                <li className="mb-1">
                  <i className="bi bi-check2-circle me-2 text-success"></i>
                  Analisi istantanea del <strong>Pedigree</strong>
                </li>
                <li className="mb-1">
                  <i className="bi bi-check2-circle me-2 text-success"></i>
                  Verifica compatibilità genetica tra i match
                </li>
                <li className="mb-1">
                  <i className="bi bi-check2-circle me-2 text-success"></i>
                  Supporto H24 per la salute del tuo cane
                </li>
              </ul>
            </div>

            {/* requisiti obbligatori */}
            <div
              className="card border-0 shadow-sm p-4 mb-4"
              style={{
                borderRadius: "25px",
                borderLeft: "6px solid #EFA6BA",
                backgroundColor: "#fff",
              }}
            >
              <h5 className="fw-bold mb-3" style={{ color: "#EFA6BA" }}>
                Accesso Esclusivo:
              </h5>
              <ul className="list-unstyled mb-0 fs-6">
                <li className="mb-3 d-flex align-items-center">
                  <i
                    className="bi bi-file-earmark-check-fill me-3"
                    style={{ color: "#7FBCC8" }}
                  ></i>
                  <span>
                    Certificato di <strong>Pedigree</strong> Originale
                  </span>
                </li>
                <li className="mb-3 d-flex align-items-center">
                  <i
                    className="bi bi-person-badge-fill me-3"
                    style={{ color: "#7FBCC8" }}
                  ></i>
                  <span>Verifica dell'identità del proprietario</span>
                </li>
              </ul>
            </div>

            <div className="d-flex justify-content-center justify-content-lg-start">
              <button
                className="btn btn-lg text-white rounded-pill px-5 py-3 fw-bold shadow-lg"
                style={{
                  backgroundColor: "#7FBCC8",
                  fontSize: "1.1rem",
                }}
                onClick={() => onStart("register")}
              >
                Inizia Verifica Profilo
              </button>
            </div>
            {/* <p className="text-muted small mt-3 italic text-center text-lg-start">
              *Il matching è riservato ai soli utenti con abbonamento Premium attivo.
            </p> */}
          </div>

          {/* Colonna immagine Labrador */}
          <div className="col-lg-6 text-center">
            <div className="position-relative d-inline-block">
              <div
                className="position-absolute top-50 start-50 translate-middle rounded-circle"
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
                  border: "10px solid white",
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