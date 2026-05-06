const MatchList = ({ matches, onSelectMatch, msgNotifiche = {} }) => {
  return (
    <div className="card border-0 rounded-4 overflow-hidden bg-white">
      <div className="card-header bg-white border-0 pt-3 pb-0">
        <h5 className="fw-bold mb-0" style={{ color: "#7FBCC8" }}>
          I tuoi Match ({matches.length})
        </h5>
      </div>

      <div className="card-body p-2">
        <div className="d-flex flex-column gap-2">
          {matches.map((match, index) => {
            const unread = msgNotifiche[match.interazioneId] || 0;
            return (
              <div
                key={`${match.id}-${index}`}
                onClick={() => onSelectMatch && onSelectMatch(match)}
                className="d-flex align-items-center p-2 rounded-3"
                style={{
                  background: unread > 0 ? "#eef8fa" : "#f8fbfb",
                  transition: "background-color 0.2s",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f0f7f8")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = unread > 0 ? "#eef8fa" : "#f8fbfb")}
              >
                <div className="position-relative flex-shrink-0">
                  <img
                    src={match.photo}
                    className="rounded-circle border"
                    alt={match.name}
                    style={{ width: "55px", height: "55px", objectFit: "cover", borderColor: "#7FBCC8" }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                  />
                  {/* Badge messaggi non letti */}
                  {unread > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                      style={{ backgroundColor: "#e53935", fontSize: "0.65rem", minWidth: "18px" }}
                    >
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </div>

                <div className="ms-3 flex-grow-1 overflow-hidden">
                  <h6 className="mb-0 fw-bold text-truncate" style={{ color: "#444" }}>
                    {match.name}
                  </h6>
                  <small className="text-muted d-block text-truncate">
                    {unread > 0 ? `${unread} nuovo${unread > 1 ? "i" : ""} messaggio${unread > 1 ? "i" : ""}` : "Ora puoi chattare!"}
                  </small>
                </div>

                <div className="pe-2 flex-shrink-0">
                  <i className="bi bi-chat-left-dots-fill" style={{ color: "#7FBCC8" }}></i>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchList;
