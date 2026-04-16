const Login = ({ onLogin, onSwitch }) => {
  return (
    <div
      className="min-vh-100 d-flex align-items-center
       justify-content-center px-3"
    >
      <div
        className=" card-border-0 shadow-lg p-4"
        style={{
          borderRadius: "30px",
          maxWidth: "400px",
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
            Bentornato
          </h2>
          <p className="text-muted small">
            Accedi per gestire i match del tuo cane
          </p>
        </div>

        <div className="mb-3">
          <input
            type="email"
            className="form-control rounded-pill
            border-light bg-light py-2 px-3"
            placeholder="Email"
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            className="form-control rounded-pill
            border-light bg-light py-2 px-3"
            placeholder="Password"
          />
        </div>

        <button
          className="btn w-100 text-white rounded-pill fw-bold
            py-2 mb-3  shadow-sm"
          style={{
            backgroundColor: "#7FBCC8",
          }}
          onClick={onLogin}
        >
          Accedi
        </button>

        <div className="text-center">
          <span className="small text-muted">Non hai un account?</span>
          <button
            className="btn btn-link btn-sm p-0 fw-bold"
            style={{
              color: "#EFA6BA",
              textDecoration: "none",
            }}
            onClick={() => onSwitch("registrazione")}
          >
            Registrati ora
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
