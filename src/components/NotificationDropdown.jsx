const TIPO_CONFIG = {
  richiesta_match: { icon: 'bi-heart-arrow',      color: '#EFA6BA', label: 'Richiesta' },
  match_accettato: { icon: 'bi-stars',             color: '#7FBCC8', label: 'Match!'    },
  messaggio:       { icon: 'bi-chat-dots-fill',    color: '#56b4c9', label: 'Messaggio' }
};

const formatOra = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'Adesso';
  if (m < 60) return `${m} min fa`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h fa`;
  return `${Math.floor(h / 24)}g fa`;
};

const NotificationDropdown = ({ notifiche = [], onNotificaClick, onMarkAllRead }) => {
  const nonLette = notifiche.filter(n => !n.letto).length;

  return (
    <div className="nav-item dropdown">
      {/* Campanella */}
      <div
        className="position-relative"
        id="dropdownNotifiche"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ cursor: 'pointer' }}
      >
        <i
          className="bi bi-bell-fill"
          style={{ color: nonLette > 0 ? '#EFA6BA' : '#8A9A9D', fontSize: '1.4rem' }}
        />
        {nonLette > 0 && (
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill border border-light"
            style={{ fontSize: '0.55rem', backgroundColor: '#EFA6BA' }}
          >
            {nonLette > 9 ? '9+' : nonLette}
          </span>
        )}
      </div>

      {/* Dropdown */}
      <ul
        className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-2 mt-2"
        aria-labelledby="dropdownNotifiche"
        style={{ width: 320, borderRadius: 15, maxHeight: 420, overflowY: 'auto' }}
      >
        {/* Header */}
        <li className="d-flex align-items-center justify-content-between px-2 py-1 border-bottom mb-1">
          <span className="fw-bold" style={{ color: '#7FBCC8', fontSize: '0.88rem' }}>
            <i className="bi bi-bell-fill me-1" />Notifiche
          </span>
          {nonLette > 0 && (
            <button
              className="btn btn-link p-0"
              style={{ color: '#EFA6BA', fontSize: '0.7rem' }}
              onClick={(e) => { e.stopPropagation(); onMarkAllRead(); }}
            >
              Segna tutte lette
            </button>
          )}
        </li>

        {/* Lista */}
        {notifiche.length === 0 ? (
          <li className="text-center p-3 text-muted small">
            <i className="bi bi-emoji-smile d-block mb-2" style={{ fontSize: '1.6rem' }} />
            Nessuna notifica
          </li>
        ) : (
          notifiche.slice(0, 10).map((n) => {
            const cfg = TIPO_CONFIG[n.tipo] ?? TIPO_CONFIG.messaggio;
            return (
              <li key={n.id}>
                <div
                  role="button"
                  className="d-flex align-items-start gap-2 px-2 py-2 rounded-3"
                  style={{ backgroundColor: n.letto ? 'transparent' : '#fef6f8', cursor: 'pointer' }}
                  onMouseEnter={e  => { e.currentTarget.style.backgroundColor = '#f0f7f8'; }}
                  onMouseLeave={e  => { e.currentTarget.style.backgroundColor = n.letto ? 'transparent' : '#fef6f8'; }}
                  onClick={() => onNotificaClick(n)}
                >
                  {/* Icona tipo */}
                  <div
                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: cfg.color + '22' }}
                  >
                    <i className={`bi ${cfg.icon}`} style={{ color: cfg.color, fontSize: '1rem' }} />
                  </div>

                  {/* Testo */}
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.79rem', color: '#333', fontWeight: n.letto ? 400 : 600 }}>
                      {n.messaggio}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#aaa', marginTop: 2 }}>
                      {cfg.label} · {formatOra(n.createdAt)}
                    </div>
                  </div>

                  {/* Pallino non letto */}
                  {!n.letto && (
                    <div
                      className="flex-shrink-0 align-self-center"
                      style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cfg.color }}
                    />
                  )}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
