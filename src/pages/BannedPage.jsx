import { useState } from "react";

const BannedPage = ({ user, onLogout }) => {
  const [testo, setTesto]       = useState("");
  const [stato, setStato]       = useState("idle"); // idle | loading | success | error | duplicate
  const [errore, setErrore]     = useState("");

  const inviaRicorso = async () => {
    if (testo.trim().length < 20) {
      setErrore("Il ricorso deve essere di almeno 20 caratteri.");
      return;
    }
    setStato("loading");
    setErrore("");
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ testo: testo.trim() }),
      });
      const data = await res.json();
      if (res.status === 409) { setStato("duplicate"); return; }
      if (!res.ok) throw new Error(data.errore || "Errore");
      setStato("success");
    } catch (err) {
      setErrore(err.message);
      setStato("error");
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100"
      style={{ backgroundColor: "#fff5f5", padding: "2rem" }}
    >
      <div
        className="bg-white rounded-4 shadow-sm p-5 text-center"
        style={{ maxWidth: "520px", width: "100%", border: "1.5px solid #f5c6cb" }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚫</div>
        <h3 className="fw-bold mb-2" style={{ color: "#c0392b" }}>Account sospeso</h3>
        <p className="text-muted mb-1">Il tuo account è stato sospeso dagli amministratori.</p>
        {user && (
          <p className="small text-muted mb-4">Account: <strong>{user.email}</strong></p>
        )}

        {stato === "success" ? (
          <div className="alert rounded-3 border-0 mb-4" style={{ backgroundColor: "#d4edda", color: "#155724" }}>
            Ricorso inviato correttamente. Ti risponderemo via email.
          </div>
        ) : stato === "duplicate" ? (
          <div className="alert rounded-3 border-0 mb-4" style={{ backgroundColor: "#fff3cd", color: "#856404" }}>
            Hai già un ricorso in attesa di revisione.
          </div>
        ) : (
          <div className="text-start mb-4">
            <p className="small fw-bold mb-2" style={{ color: "#c0392b" }}>Presenta un ricorso</p>
            <textarea
              className="form-control rounded-3 mb-2"
              rows={4}
              placeholder="Spiega il motivo per cui ritieni che la sospensione sia errata (min. 20 caratteri)..."
              style={{ border: "1.5px solid #f5c6cb", fontSize: "0.9rem", resize: "none" }}
              value={testo}
              onChange={(e) => setTesto(e.target.value)}
            />
            {errore && (
              <p className="small text-danger mb-2">{errore}</p>
            )}
            <button
              className="btn w-100 rounded-pill fw-bold"
              style={{ backgroundColor: "#7FBCC8", color: "white", border: "none" }}
              onClick={inviaRicorso}
              disabled={stato === "loading"}
            >
              {stato === "loading"
                ? <span className="spinner-border spinner-border-sm me-2" role="status" />
                : <i className="bi bi-send me-2" />}
              Invia ricorso
            </button>
          </div>
        )}

        <button
          className="btn btn-sm rounded-pill px-4 fw-bold"
          style={{ backgroundColor: "#f0f2f5", color: "#555", border: "none" }}
          onClick={onLogout}
        >
          <i className="bi bi-box-arrow-right me-1" />Esci
        </button>
      </div>
    </div>
  );
};

export default BannedPage;
