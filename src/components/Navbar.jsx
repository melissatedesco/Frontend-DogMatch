import logo from "../assets/logo.png";

const Navbar = ({
  user,
  onLogout,
  notifications,
  recentMatches,
  onNavigate,
}) => {
  return (
    <nav
      className="navbar navbar-light 
        shadow-sm bg-white sticky-top mb-4"
      style={{
        borderRadius: "0 0 20px 20px",
        borderBottom: "3px solid #7FBCC8",
      }}
    >
      <div className="container d-flex align-items-center flex-nowrap">
        {/* Logo e nome app Torna alla home */}
        <a
          className=" navbar-brand d-flex align-items-center me-0"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home");
          }}
        >
          <img src={logo} alt="DogMatch Logo" height="60" className="me-2" />
          <span
            className="fw-bold d-none d-sm-inline"
            style={{
              color: "#7FBCC8",
              letterSpacing: "1px",
              fontSize: "1.4rem",
            }}
          >
            DOG <span style={{ color: "#EFA6BA" }}>MATCH</span>
          </span>
        </a>

        {/*  menu destra */}
        <div className="ms-auto d-flex align-items-center flex-row flex-nowrap gap-3">
          {/* icona home  */}
          <a
            href="#"
            className="text-decoration-none"
            title="Home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("home");
            }}
          >
            <i
              className="bi bi-house-door"
              style={{
                color: "#7FBCC8",
                fontSize: "1.5rem",
              }}
            ></i>
          </a>

          {/* messaggi con badge notifica */}
          <a
            href="#"
            className="text-decoration-none position-relative"
            title="Messaggi"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("messages");
            }}
          >
            <i
              className="bi bi-chat-dots-fill"
              style={{
                color: "#8A9A9D",
                fontSize: "1.4rem",
              }}
            ></i>
            
            {notifications?.messages > 0 && (
              <span
                className="position-absolute top-0 start-100
                    translate-middle badge rounded-pill bg-danger border border-light"
                style={{
                  fontSize: "0.55rem",
                }}
              >
                {notifications.messages}
              </span>
            )}
          </a>

          {/* vai al profilo e dropdown match */}
          <div className="nav-item dropdown d-flex align-items-center">
            {/* icona profilo singola */}
            <a
              href="#"
              className="text-decoration-none me-3"
              title="Il mio Profilo"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("profile");
              }}
            >
              <i
                className="bi bi-person-circle"
                style={{
                  color: "#8A9A9D",
                  fontSize: "1.5rem",
                }}
              ></i>
            </a>

            {/* menu tendina notifiche con il badge  */}
            <div
              className="position-relative ms-1"
              id="dropdownNotifiche"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                cursor: "pointer",
              }}
            >
            
                <i
                  className='bi bi-bell-fill'
                  style={{
                   color: notifications?.matches > 0 ? '#EFA6BA' : '#8A9A9D',
                   fontSize: '1.4rem'
                  }}
                >
                </i>

                  {notifications?.matches > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill border border-light"
                  style={{
                    fontSize:'0.55rem',
                    backgroundColor:'#EFA6BA'
                  }}>
                  {notifications.matches}
                  </span>
                  )}
            </div>

            {/* menu a tendina con link cliccabili */}
            <ul
              className="dropdown-menu dropdown-menu-end
            shadow-lg border-0 p-2 mt-2"
            aria-labelledby="dropdownNotifiche"
              style={{
                width: "280px",
                borderRadius: "15px",
              }}
            >
              <li
                className="p-2 fw-bold text-center border-bottom mb-2"
                style={{
                  color: "#7FBCC8",
                }}
              >
                Notifiche Match
              </li>

              {recentMatches && recentMatches.length > 0 ? (
                recentMatches.map((match) => (
                  <li key={match.id}>
                    {/* singolo match */}
                    <a
                      className="dropdown-item d-flex align-items-center p-2 rounded"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate("chat", { matchId: match.id });
                      }}
                    >
                      <img
                        src={match.photo}
                        alt={match.name}
                        className="rounded-circle me-3"
                        style={{
                          width: "35px",
                          height: "35px",
                          objectFit: "cover",
                          border: "2px solid #EFA6BA",
                        }}
                      />

                      <div>
                        <div
                          className="fw-bold"
                          style={{
                            fontSize: "0.85rem",
                            color: "#444",
                          }}
                        >
                         Nuovo match con {match.name}
                        </div>
                        <div
                          className="text-muted"
                          style={{
                            fontSize: "0.65rem",
                          }}
                        >
                          Clicca per rispondere
                        </div>
                      </div>
                    </a>
                  </li>
                ))
              ) : (
                <li className="text-center p-3 text-muted small">
                  <i className="bi bi-emoji-smile d-block mb-2"
                  style={{
                    fontSize:'1.5rem'
                  }}></i>
                  Nessuna nuova notifica
                </li>
              )}

              <li>
                <hr className="dropdown-divider" />
              </li>

              {/* vedi tutti i match */}
              <li>
                <a
                  className="dropdown-item text-center small fw-bold"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate("chat");
                  }}
                  style={{
                    color: "#EFA6BA",
                  }}
                >
                  Vedi tutti i match
                </a>
              </li>
            </ul>
          </div>

          {/* logout*/}

          {user && (
            <button
              className="btn btn-sm rounded-pill px-3 text-white fw-bold border-0 shadow-sm ms-2"
              onClick={onLogout}
              style={{
                backgroundColor: "#EFA6BA",
                fontSize: "0.8rem",
              }}
            >
              Logout
              <i className="bi bi-box-arrow-right ms-1"></i>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
