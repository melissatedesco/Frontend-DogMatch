const Registrazione = ({ onRegister, onSwitch }) => {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center
        justify-content-center px-3 py-5"
      style={{
        backgroundColor: "#f8fbfb",
      }}
    >
      <div
        className="card border-0 shadow-lg p-4"
        style={{
          borderRadius: "30px",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <div className="text-center mb-4">
          <h2
            className="fw-bold"
            style={{
              color: "#555",
            }}
          >
            Unisciti al Club
          </h2>
          <p className="text-muted small">Crea il tuo profilo certificato</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="row">
            {/* nome  */}
            <div className="col-md-6 mb-3">
              <label className="small fw-bold mb-1 text-muted ms-2">NOME</label>
              <input
                type="text"
                className="form-control rounded-pill border-light bg-light px-3"
                placeholder="Mario"
                required
              />
            </div>
            {/* cognome */}
            <div className="col-md-6 mb-3">
              <label className="small fw-bold mb-1 text-muted ms-2">
                COGNOME
              </label>
              <input
                type="text"
                className="form-control rounded-pill border-light bg-light px-3"
                placeholder="Rossi"
                required
              />
            </div>
          </div>

          {/* email */}
          <div className="mb-3">
            <label className="small fw-bold mb-1 text-muted ms-2">EMAIL</label>
            <input
              type="email"
              className="form-control rounded-pill border-light bg-light px-3"
              placeholder="email"
              required
            />
          </div>

          {/* telefono */}
          <div className="mb-3">
            <label className="small fw-bold mb-1 text-muted ms-2">
              TELEFONO
            </label>
            <input
              type="telefono"
              className="form-control rounded-pill border-light bg-light px-3"
              placeholder="telefono"
              required
            />
          </div>

          {/* seleziona razza */}
          <div className="mb-3">
            <label className="small fw-bold mb-1 text-muted ms-2">
              RAZZA DEL TUO CANE
            </label>
            <select className="form-select rounded-pill border-light bg-light px-3 text-muted">
              <option> Seleziona Razza</option>
              <option>Labrador</option>
              <option>Golden Retriver</option>
              <option>Pastore Tedesco</option>
              <option>Altro (Specificato nel Pedigree)</option>
            </select>
          </div>

          {/* caricamento pedigree */}
          <div
            className="mb-4 border-dashed rounded-4 text-center"
            style={{
              border: "2px dashed #7FBCC8",
              backgroundColor: "#f0f9fa",
            }}
          >
            <i
              className="bi bi-file-earmark-arrow-up-fill fs-2"
              style={{
                color: "#7FBCC8",
              }}
            ></i>
            <p className="small fw-bold mb-1 mt-2">
              Carica il Certificato di Pedigree
            </p>
            <p
              className="text-muted mb-2"
              style={{
                fontSize: "0.7rem",
              }}
            >
              Formati accettati: PDF, JPG. PNG
            </p>
            <input
              type="file"
              className="form-control form-control-sm"
              required
            />
          </div>

          <button
            className="btn w-100 text-white rounded-pill fw-bold py-2 mb-3 shadow-sm"
            style={{
              backgroundColor: "#EFA6BA",
              fontSize: "1.1rem",
            }}
            onClick={onRegister}
          >
            Invia Richiesta di Verifica
          </button>
        </form>

        <div className="text-center">
          <span className="small text-muted">Hai già un account? </span>
          <button
            className="btn btn-link btn-sm p-0 fw-bold"
            style={{ color: "#7FBCC8", textDecoration: "none" }}
            onClick={() => onSwitch("login")}
          >
            Accedi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registrazione;
