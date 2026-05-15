import logo from "../assets/logo.png";

const NavbarPubblica = ({ onLogin }) => {
  return (
    <nav
      className="navbar navbar-light bg-white shadow-sm px-4 py-2 sticky-top"
      style={{ borderRadius: "0 0 20px 20px", borderBottom: "3px solid #7FBCC8", zIndex: 1100 }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src={logo} alt="DogMatch Logo" height="50" className="me-2" />
          <span className="fw-bold fs-3" style={{ color: "#7FBCC8", letterSpacing: "1px" }}>
            DOG<span style={{ color: "#EFA6BA" }}>MATCH</span>
          </span>
        </div>
        <button
          className="btn text-white rounded-pill px-4 fw-bold shadow-sm"
          style={{ backgroundColor: "#7FBCC8", fontSize: "0.9rem" }}
          onClick={onLogin}
        >
          Accedi
        </button>
      </div>
    </nav>
  );
};

export default NavbarPubblica;
