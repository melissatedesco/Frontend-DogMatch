const MatchList = ({ matches, onSelectMatch, msgNotifiche = {}, onlineMap = {} }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
      <div className="card-header bg-white border-0 pt-3 pb-0">
        <h5 className="fw-bold mb-0" style={{ color: "#7FBCC8" }}>
          I tuoi Match ({matches.length})
        </h5>
      </div>

      <div className="card-body p-2">
        <div className="d-flex flex-column gap-2">
          {matches.map((match, index) => {
            const unread = msgNotifiche?.[match.interazioneId] || 0;
            return (
              <div
                key={`${match.interazioneId || match.id}-${index}`}
                onClick={() => onSelectMatch?.(match)}
                className="d-flex align-items-center p-2 rounded-3"
                style={{ background: "#f8fbfb", transition: "background-color 0.2s", cursor: "pointer" }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f0f7f8")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f8fbfb")}
              >
                <div className="position-relative">
                  <img
                    src={match.photo}
                    className="rounded-circle border"
                    alt={match.name}
                    style={{ width: "55px", height: "55px", objectFit: "cover", borderColor: "#7FBCC8" }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                  />
                  <span
                    className="position-absolute bottom-0 end-0 border border-white rounded-circle"
                    style={{
                      width: "12px", height: "12px",
                      backgroundColor: (match.proprietarioId && onlineMap[match.proprietarioId]) ? "#28c76f" : "#adb5bd",
                    }}
                  />
                </div>

                <div className="ms-3 flex-grow-1 overflow-hidden">
                  <h6 className="mb-0 fw-bold" style={{ color: "#444" }}>{match.name}</h6>
                  <small className="text-muted d-block text-truncate" style={{ maxWidth: "160px" }}>
                    {unread > 0
                      ? `${unread} nuovo${unread > 1 ? 'i' : ''} messaggio${unread > 1 ? 'i' : ''}`
                      : match.ultimoMessaggio
                        ? match.ultimoMessaggio.testo
                        : "Ora puoi chattare!"}
                  </small>
                </div>

                <div className="pe-2 d-flex align-items-center gap-1">
                  {unread > 0 && (
                    <span
                      className="badge rounded-pill"
                      style={{ backgroundColor: "#EFA6BA", fontSize: "0.72rem" }}
                    >
                      {unread}
                    </span>
                  )}
                  <i className="bi bi-chat-left-dots-fill" style={{ color: "#7FBCC8" }} />
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
