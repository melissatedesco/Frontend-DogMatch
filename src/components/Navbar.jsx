import logo from "../assets/logo.png";

const PLACEHOLDER = "https://cdn-icons-png.flaticon.com/512/616/616408.png";
const buildImgUrl = (raw) => {
  if (!raw || raw === 'default-dog.png') return PLACEHOLDER;
  if (raw.startsWith("http")) return raw;
  return `/uploads/${raw.replace("uploads/", "")}`;
};

const Navbar = ({ user, onLogout, notifications, richieste = [], onNavigate }) => {
  const totaleNotifiche = (notifications?.richieste ?? 0);

  return (
    <nav
      className="navbar navbar-light shadow-sm bg-white sticky-top mb-4"
      style={{ borderRadius: "0 0 20px 20px", borderBottom: "3px solid #7FBCC8" }}
    >
      <div className="container d-flex align-items-center flex-nowrap">

        {/* Logo */}
        <a className="navbar-brand d-flex align-items-center me-0" href="#"
          onClick={(e) => { e.preventDefault(); onNavigate("home"); }}>
          <img src={logo} alt="DogMatch Logo" height="60" className="me-2" />
          <span className="fw-bold d-none d-sm-inline"
            style={{ color: "#7FBCC8", letterSpacing: "1px", fontSize: "1.4rem" }}>
            DOG <span style={{ color: "#EFA6BA" }}>MATCH</span>
          </span>
        </a>

        {/* Menu destra */}
        <div className="ms-auto d-flex align-items-center flex-row flex-nowrap gap-3">

          {/* Home */}
          <a href="#" className="text-decoration-none" title="Home"
            onClick={(e) => { e.preventDefault(); onNavigate("home"); }}>
            <i className="bi bi-house-door" style={{ color: "#7FBCC8", fontSize: "1.5rem" }} />
          </a>

          {/* Messaggi */}
          <a href="#" className="text-decoration-none position-relative" title="Messaggi"
            onClick={(e) => { e.preventDefault(); onNavigate("messages"); }}>
            <i className="bi bi-chat-dots-fill" style={{ color: "#8A9A9D", fontSize: "1.4rem" }} />
            {notifications?.messages > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light"
                style={{ fontSize: "0.55rem" }}>
                {notifications.messages}
              </span>
            )}
          </a>

          {/* Admin */}
          {user?.isAdmin && (
            <a href="#" className="text-decoration-none" title="Pannello Moderatore"
              onClick={(e) => { e.preventDefault(); onNavigate("admin"); }}>
              <i className="bi bi-shield-lock-fill" style={{ color: "#EFA6BA", fontSize: "1.4rem" }} />
            </a>
          )}

          {/* Profilo */}
          <a href="#" className="text-decoration-none" title="Il mio Profilo"
            onClick={(e) => { e.preventDefault(); onNavigate("profile"); }}>
            <i className="bi bi-person-circle" style={{ color: "#8A9A9D", fontSize: "1.5rem" }} />
          </a>

          {/* Campanello — richieste di match */}
          <div className="nav-item dropdown">
            <div className="position-relative" id="dropdownNotifiche"
              data-bs-toggle="dropdown" aria-expanded="false" style={{ cursor: "pointer" }}>
              <i className="bi bi-bell-fill"
                style={{ color: totaleNotifiche > 0 ? "#EFA6BA" : "#8A9A9D", fontSize: "1.4rem" }} />
              {totaleNotifiche > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill border border-light"
                  style={{ fontSize: "0.55rem", backgroundColor: "#EFA6BA" }}>
                  {totaleNotifiche}
                </span>
              )}
            </div>

            {/* Dropdown */}
            <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-2 mt-2"
              aria-labelledby="dropdownNotifiche"
              style={{ width: "300px", borderRadius: "15px" }}>

              <li className="p-2 fw-bold text-center border-bottom mb-2" style={{ color: "#7FBCC8" }}>
                <i className="bi bi-bell-fill me-1" />Notifiche
              </li>

              {richieste.length > 0 ? (
                richieste.slice(0, 4).map((r) => (
                  <li key={r.interazioneId} className="px-2 py-1">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={buildImgUrl(r.cane?.fotoUrl ?? r.cane?.foto_url)}
                        onError={(e) => { e.target.src = PLACEHOLDER; }}
                        className="rounded-circle flex-shrink-0"
                        style={{ width: "38px", height: "38px", objectFit: "cover", border: "2px solid #EFA6BA" }}
                      />
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div className="fw-bold text-truncate" style={{ fontSize: "0.82rem", color: "#444" }}>
                          {r.cane?.nome} vuole fare match!
                        </div>
                        <div className="text-muted text-capitalize" style={{ fontSize: "0.68rem" }}>
                          {r.cane?.razza} · {r.intento === "accoppiamento" ? "Accoppiamento" : "Gioco"}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-center p-3 text-muted small">
                  <i className="bi bi-emoji-smile d-block mb-2" style={{ fontSize: "1.5rem" }} />
                  Nessuna nuova notifica
                </li>
              )}

              <li><hr className="dropdown-divider" /></li>

              <li>
                <a className="dropdown-item text-center small fw-bold" href="#"
                  onClick={(e) => { e.preventDefault(); onNavigate("requests"); }}
                  style={{ color: "#EFA6BA" }}>
                  Vedi tutte le richieste
                </a>
              </li>
            </ul>
          </div>

          {/* Logout */}
          {user && (
            <button className="btn btn-sm rounded-pill px-3 text-white fw-bold border-0 shadow-sm ms-2"
              onClick={onLogout}
              style={{ backgroundColor: "#EFA6BA", fontSize: "0.8rem" }}>
              Logout <i className="bi bi-box-arrow-right ms-1" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
