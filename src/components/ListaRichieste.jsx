const MatchList = ({ matches }) => {
  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
      <div className="card-header bg-white border-0 pt-3 pb-0">
        <h5
          className="fw-bold mb-0"
          style={{
            color: "#7FBCC8",
          }}
        >
          I tuoi Match ({matches.length})
        </h5>
      </div>

      <div className="card-body p-2">
        <div className="d-flex flex-column gap-2">
          {matches.map((match) => (
            <div
              key={match.id}
              className="d-flex align-items-center p-2 rounded-3"
              style={{
                background: "#f8fbfb",
                transition: "backgroud-color 0.2s",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f7f8")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#f8fbfb")
              }
            >
              <div className="position-relative">
                <img
                  src={match.photo}
                  className="rounded-circle border"
                  alt={match.name}
                  style={{
                    width: "55px",
                    height: "55px",
                    objectFit: "cover",
                    borderColor: "#7FBCC8",
                  }}
                />

                {/* indicatore online (pallino verde) */}
                <span
                  className="position-absolute bottom-0
                         end-0 border border-white rounded-circle bg-success "
                  style={{
                    width: "12px",
                    height: "12px",
                  }}
                ></span>
              </div>

              {/* Testo a fianco */}
              <div className="ms-3 flex-grow-1">
                <h6
                  className="mb-0 fw-bold"
                  style={{
                    color: "#444",
                  }}
                >
                  {match.name}
                </h6>
                <small className="text-muted d-block">Ora puoi chattare!</small>
              </div>

              {/* Icona chat */}
              <div className="text-muted pe-2">
                <i
                  className="bi bi-chat-left-dots-fill"
                  style={{
                    color: "#7FBCC8",
                  }}
                ></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchList;
