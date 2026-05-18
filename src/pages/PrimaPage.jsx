import snoutBot from "../assets/snoutBot.png";
import Footer from "../components/Footer";
import NavbarPubblica from "../components/NavbarPubblica";

const HERO_IMG = "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000&auto=format&fit=crop";

const STEPS = [
  {
    icon: "bi-person-plus-fill",
    color: "#EFA6BA",
    title: "Registrati",
    desc: "Crea il tuo profilo e carica il pedigree del tuo cane per ottenere la verifica ufficiale.",
  },
  {
    icon: "bi-geo-alt-fill",
    color: "#7FBCC8",
    title: "Scopri i match",
    desc: "Trova cani compatibili per razza, carattere e zona geografica. Like o dislike in un tap.",
  },
  {
    icon: "bi-chat-heart-fill",
    color: "#EFA6BA",
    title: "Chatta e incontra",
    desc: "Una volta ottenuto il match, scrivi al proprietario e organizza il primo incontro.",
  },
];

const PrimaPagina = ({ onStart }) => {
  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "linear-gradient(135deg, #e8f4f8 0%, #f5f5f5 40%, #fdedf4 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Bolle decorative */}
      <div style={{ position: "fixed", top: "-100px", left: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(127,188,200,0.18) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-80px", right: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(239,166,186,0.18) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "40%", left: "55%", width: "250px", height: "250px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,220,230,0.12) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <NavbarPubblica onLogin={() => onStart("login")} />

        {/* Hero */}
        <div className="container py-5">
          <div className="row align-items-center g-5">

            {/* Colonna testo */}
            <div className="col-lg-6 text-center text-lg-start">
              <h1 className="display-4 fw-bold mb-3" style={{ color: "#444", lineHeight: "1.2" }}>
                La tua App per il <br />
                <span style={{ color: "#7FBCC8" }}>Matching Selezionato</span>
                <br />tra Cani
              </h1>
              <p className="lead text-muted mb-4" style={{ fontSize: "1.1rem" }}>
                L'unica piattaforma dedicata esclusivamente all'accoppiamento
                responsabile tra cani con pedigree verificato e identità certificata.
              </p>

              {/* Card SnoutBot */}
              <div
                className="p-4 mb-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  borderRadius: "24px",
                  border: "1.5px solid rgba(127,188,200,0.35)",
                  boxShadow: "0 4px 24px rgba(127,188,200,0.15)",
                }}
              >
                <div className="d-flex align-items-center mb-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                    style={{ width: "54px", height: "54px", backgroundColor: "#7FBCC8", overflow: "hidden", border: "2.5px solid white", boxShadow: "0 4px 12px rgba(127,188,200,0.4)" }}
                  >
                    <img src={snoutBot} alt="SnoutBot" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0" style={{ color: "#444" }}>Incontra SnoutBot 🐾</h6>
                    <small className="text-muted">Il tuo assistente AI personale</small>
                  </div>
                </div>
                <ul className="list-unstyled mb-0 small">
                  {[
                    "Analisi istantanea del Pedigree",
                    "Verifica compatibilità genetica tra i match",
                    "Supporto H24 per la salute del tuo cane",
                  ].map((item, i) => (
                    <li key={i} className="mb-1 d-flex align-items-center gap-2">
                      <i className="bi bi-check2-circle" style={{ color: "#7FBCC8", fontSize: "1rem", flexShrink: 0 }} />
                      <span style={{ color: "#555" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card requisiti */}
              <div
                className="p-4 mb-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  borderRadius: "24px",
                  border: "1.5px solid rgba(239,166,186,0.35)",
                  boxShadow: "0 4px 24px rgba(239,166,186,0.12)",
                }}
              >
                <h6 className="fw-bold mb-3" style={{ color: "#EFA6BA" }}>
                  <i className="bi bi-shield-check me-2" />Accesso Esclusivo
                </h6>
                <div className="d-flex flex-column gap-2">
                  {[
                    { icon: "bi-file-earmark-check-fill", text: "Certificato di Pedigree Originale" },
                    { icon: "bi-person-badge-fill", text: "Verifica dell'identità del proprietario" },
                  ].map((item, i) => (
                    <div key={i} className="d-flex align-items-center gap-2">
                      <i className={`bi ${item.icon}`} style={{ color: "#7FBCC8", fontSize: "1.1rem", flexShrink: 0 }} />
                      <span className="small" style={{ color: "#555" }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-lg text-white rounded-pill px-5 py-3 fw-bold"
                style={{
                  backgroundColor: "#7FBCC8",
                  border: "none",
                  boxShadow: "0 6px 20px rgba(127,188,200,0.45)",
                  fontSize: "1rem",
                }}
                onClick={() => onStart("register")}
              >
                Inizia Verifica Profilo
              </button>
            </div>

            {/* Colonna immagine */}
            <div className="col-lg-6 text-center">
              <div className="position-relative d-inline-block">
                <div
                  className="position-absolute top-50 start-50 translate-middle rounded-circle"
                  style={{ width: "108%", height: "108%", border: "2px dashed rgba(127,188,200,0.5)", zIndex: -1 }}
                />
                <img
                  src={HERO_IMG}
                  alt="Labrador DogMatch"
                  className="img-fluid"
                  style={{
                    borderRadius: "36px",
                    border: "10px solid rgba(255,255,255,0.85)",
                    width: "85%",
                    objectFit: "cover",
                    boxShadow: "0 16px 50px rgba(127,188,200,0.25)",
                  }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Come funziona */}
        <div className="py-5 mt-3">
          <div className="container">
            <h2 className="text-center fw-bold mb-2" style={{ color: "#444" }}>Come funziona</h2>
            <p className="text-center text-muted mb-5 small">Tre passi per trovare il match perfetto per il tuo cane.</p>

            <div className="row g-4 justify-content-center">
              {STEPS.map((step, i) => (
                <div key={i} className="col-md-4">
                  <div
                    className="h-100 text-center p-4"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.75)",
                      backdropFilter: "blur(18px)",
                      WebkitBackdropFilter: "blur(18px)",
                      borderRadius: "24px",
                      border: "1px solid rgba(255,255,255,0.7)",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                      style={{ width: "64px", height: "64px", backgroundColor: step.color + "22" }}
                    >
                      <i className={`bi ${step.icon}`} style={{ fontSize: "1.8rem", color: step.color }} />
                    </div>
                    <span
                      className="fw-bold text-white px-3 py-1 rounded-pill d-inline-block mb-3"
                      style={{ backgroundColor: step.color, fontSize: "0.75rem", letterSpacing: "1px" }}
                    >
                      STEP {i + 1}
                    </span>
                    <h5 className="fw-bold mb-2" style={{ color: "#444" }}>{step.title}</h5>
                    <p className="text-muted small mb-0">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-5">
              <button
                className="btn btn-lg rounded-pill px-5 py-3 fw-bold text-white"
                style={{
                  backgroundColor: "#EFA6BA",
                  border: "none",
                  boxShadow: "0 6px 20px rgba(239,166,186,0.4)",
                  fontSize: "1rem",
                }}
                onClick={() => onStart("register")}
              >
                Inizia ora — è gratis
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default PrimaPagina;
