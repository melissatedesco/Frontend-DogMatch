import logo from "../assets/logo.png";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = ({ user, onLogout, notifications, onNavigate, notifiche = [], richieste = [], onNotificaClick, onMarkAllRead, onAccettaRichiesta, onRifiutaRichiesta, onViewProfilo }) => {

  return (
    <nav
      className="navbar navbar-light shadow-sm bg-white sticky-top mb-4"
      style={{ borderRadius: "0 0 20px 20px", borderBottom: "3px solid #7FBCC8", zIndex: 1100 }}
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
          {user?.ruolo === 'admin' && (
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

          {/* Centro notifiche */}
          <NotificationDropdown
            notifiche={notifiche}
            richieste={richieste}
            onNotificaClick={onNotificaClick}
            onMarkAllRead={onMarkAllRead}
            onAccetta={onAccettaRichiesta}
            onRifiuta={onRifiutaRichiesta}
            onViewProfilo={onViewProfilo}
          />

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
