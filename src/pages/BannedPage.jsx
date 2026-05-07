const BannedPage = ({ user, onLogout }) => {
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

        <p className="small text-muted mb-4">
          Per contestare la sospensione contatta il supporto via email.
        </p>

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
