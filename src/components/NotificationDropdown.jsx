import { useState, useRef, useEffect } from "react";

const PLACEHOLDER_USER = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const PLACEHOLDER_DOG  = "https://cdn-icons-png.flaticon.com/512/616/616408.png";

const TIPO_CONFIG = {
  richiesta_match: { icon: 'bi-heart-arrow',       color: '#EFA6BA', label: 'Richiesta'    },
  match_accettato: { icon: 'bi-stars',              color: '#7FBCC8', label: 'Match!'       },
  messaggio:       { icon: 'bi-chat-dots-fill',     color: '#56b4c9', label: 'Messaggio'    },
  nuovo_utente:    { icon: 'bi-person-plus-fill',   color: '#28a745', label: 'Nuovo utente' },
  nuovo_cane:      { icon: 'bi-balloon-heart-fill', color: '#EFA6BA', label: 'Nuovo cane'   },
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

const buildImg = (url, fallback) => {
  if (!url || url === 'default-dog.png') return fallback;
  if (url.startsWith('http')) return url;
  return `/uploads/${url.replace('uploads/', '').replace('/uploads/', '')}`;
};

// ── Sezione 1: Richiesta stile Facebook ──────────────────────────────────────
const RichiestaItem = ({ richiesta, onAccetta, onRifiuta, onViewProfilo }) => {
  const { cane, utente, intento } = richiesta;
  const isMatch   = intento === 'accoppiamento';
  const accentColor = isMatch ? '#EFA6BA' : '#7FBCC8';
  const badgeLabel  = isMatch ? 'Match' : 'Gioco';
  const badgeIcon   = isMatch ? 'bi-heart-fill' : 'bi-balloon-heart-fill';

  // Foto: preferisce foto profilo utente, fallback foto cane, poi placeholder
  const avatarSrc = utente?.fotoUrl
    ? buildImg(utente.fotoUrl, PLACEHOLDER_USER)
    : cane?.fotoUrl
      ? buildImg(cane.fotoUrl, PLACEHOLDER_DOG)
      : PLACEHOLDER_USER;

  const nomeUtente = utente
    ? `${utente.nome}${utente.cognome ? ' ' + utente.cognome : ''}`
    : cane?.nome ?? 'Qualcuno';

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 10px', borderRadius: 14,
      border: `1.5px solid ${accentColor}22`,
      backgroundColor: isMatch ? '#fff8fb' : '#f5fbfc',
      marginBottom: 6,
    }}>

      {/* Avatar cliccabile */}
      <div
        onClick={() => utente?.id && onViewProfilo?.(utente.id)}
        style={{ flexShrink: 0, cursor: utente?.id ? 'pointer' : 'default', position: 'relative' }}
        title={utente?.id ? `Vedi il profilo di ${nomeUtente}` : ''}
      >
        <img
          src={avatarSrc}
          alt={nomeUtente}
          onError={e => { e.target.src = PLACEHOLDER_USER; }}
          style={{
            width: 48, height: 48, borderRadius: '50%', objectFit: 'cover',
            border: `2.5px solid ${accentColor}`,
          }}
        />
        {/* badge tipo piccolo */}
        <div style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 18, height: 18, borderRadius: '50%',
          backgroundColor: accentColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1.5px solid white',
        }}>
          <i className={`bi ${badgeIcon}`} style={{ color: 'white', fontSize: '0.55rem' }} />
        </div>
      </div>

      {/* Testo */}
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.8rem', color: '#1c1e21', lineHeight: 1.35 }}>
          <span
            style={{ fontWeight: 700, cursor: utente?.id ? 'pointer' : 'default', color: accentColor }}
            onClick={() => utente?.id && onViewProfilo?.(utente.id)}
          >
            {nomeUtente}
          </span>
          {' '}e il suo{' '}
          <span style={{ fontWeight: 600 }}>{cane?.razza ?? ''} "{cane?.nome ?? ''}"</span>
          {' '}
          {isMatch
            ? 'vuole fare un 💚 Match con te!'
            : 'vuole 🎾 Giocare con te!'}
        </div>
        <div style={{ fontSize: '0.65rem', color: '#aaa', marginTop: 3 }}>
          <span className="badge rounded-pill text-white me-1"
            style={{ backgroundColor: accentColor, fontSize: '0.58rem', padding: '2px 6px' }}>
            <i className={`bi ${badgeIcon} me-1`} />{badgeLabel}
          </span>
          Adesso
        </div>

        {/* Bottoni azione */}
        <div style={{ display: 'flex', gap: 6, marginTop: 7 }}>
          <button
            className="btn btn-sm rounded-pill fw-bold text-white"
            style={{ backgroundColor: '#28a745', border: 'none', fontSize: '0.72rem', padding: '3px 14px', flex: 1 }}
            onClick={e => { e.stopPropagation(); onAccetta(richiesta); }}
          >
            <i className="bi bi-check-lg me-1" />Accetta
          </button>
          <button
            className="btn btn-sm rounded-pill fw-bold"
            style={{ backgroundColor: '#fff3f3', color: '#dc3545', border: '1.5px solid #f5c6cb', fontSize: '0.72rem', padding: '3px 14px', flex: 1 }}
            onClick={e => { e.stopPropagation(); onRifiuta(richiesta); }}
          >
            <i className="bi bi-x-lg me-1" />Rifiuta
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Sezione 2: Notifica informativa ──────────────────────────────────────────
const NotificaItem = ({ n, onClick }) => {
  const cfg = TIPO_CONFIG[n.tipo] ?? TIPO_CONFIG.messaggio;
  const payload = n.payload ?? {};
  const avatarSrc = payload.utente?.fotoUrl
    ? buildImg(payload.utente.fotoUrl, PLACEHOLDER_USER)
    : payload.cane?.fotoUrl
      ? buildImg(payload.cane.fotoUrl, PLACEHOLDER_DOG)
      : null;

  return (
    <div
      role="button"
      onClick={() => onClick(n)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '8px 10px', borderRadius: 10, marginBottom: 3, cursor: 'pointer',
        backgroundColor: n.letto ? 'transparent' : '#fef6f8',
        border: '1px solid transparent',
        transition: 'background-color 0.12s',
      }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f0f7f8'; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = n.letto ? 'transparent' : '#fef6f8'; }}
    >
      {/* Avatar o icona */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        backgroundColor: cfg.color + '22',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        border: avatarSrc ? `2px solid ${cfg.color}` : 'none',
      }}>
        {avatarSrc
          ? <img src={avatarSrc} alt="" onError={e => { e.target.src = PLACEHOLDER_DOG; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <i className={`bi ${cfg.icon}`} style={{ color: cfg.color, fontSize: '0.9rem' }} />
        }
      </div>

      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.77rem', color: '#444', fontWeight: n.letto ? 400 : 600, lineHeight: 1.3 }}>
          {n.messaggio}
        </div>
        <div style={{ fontSize: '0.63rem', color: '#aaa', marginTop: 2 }}>
          {cfg.label} · {formatOra(n.createdAt)}
        </div>
      </div>
      {!n.letto && (
        <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: cfg.color, flexShrink: 0, marginTop: 4 }} />
      )}
    </div>
  );
};

// ── Componente principale ─────────────────────────────────────────────────────
const NotificationDropdown = ({
  notifiche = [],
  richieste = [],
  onNotificaClick,
  onMarkAllRead,
  onAccetta,
  onRifiuta,
  onViewProfilo,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const nonLette  = notifiche.filter(n => !n.letto).length;
  const badgeCount = richieste.length + nonLette;

  useEffect(() => {
    if (!isOpen) return;
    const handle = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen]);

  const handleNotificaClick = n => { onNotificaClick(n); setIsOpen(false); };
  const isEmpty = richieste.length === 0 && notifiche.length === 0;

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>

      {/* Campanella */}
      <div
        onClick={() => setIsOpen(prev => !prev)}
        title="Notifiche"
        style={{ cursor: 'pointer', position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      >
        <i className="bi bi-bell-fill" style={{ color: badgeCount > 0 ? '#EFA6BA' : '#8A9A9D', fontSize: '1.4rem' }} />
        {badgeCount > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', left: '100%', transform: 'translateX(-50%)',
            backgroundColor: '#dc3545', color: 'white', borderRadius: '50%',
            fontSize: '0.52rem', fontWeight: 700,
            minWidth: '16px', height: '16px', lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1.5px solid white',
          }}>
            {badgeCount > 9 ? '9+' : badgeCount}
          </span>
        )}
      </div>

      {/* Pannello */}
      {isOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 12px)', right: 0,
          width: 360, maxHeight: 520, overflowY: 'auto',
          backgroundColor: 'white', borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)', border: '1px solid #f0e8f5',
          zIndex: 99999, padding: '6px 8px 8px',
        }}>

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '6px 4px 8px', borderBottom: '1px solid #f0e8f5', marginBottom: 6,
          }}>
            <span style={{ fontWeight: 700, color: '#7FBCC8', fontSize: '0.88rem' }}>
              <i className="bi bi-bell-fill me-1" />Notifiche
            </span>
            {nonLette > 0 && (
              <button
                className="btn btn-link p-0"
                style={{ color: '#EFA6BA', fontSize: '0.68rem', textDecoration: 'none' }}
                onClick={e => { e.stopPropagation(); onMarkAllRead(); }}
              >
                Segna tutte lette
              </button>
            )}
          </div>

          {isEmpty ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#aaa' }}>
              <i className="bi bi-emoji-smile d-block mb-2" style={{ fontSize: '1.8rem' }} />
              <div style={{ fontSize: '0.82rem' }}>Tutto tranquillo!</div>
            </div>
          ) : (
            <>
              {richieste.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{
                    fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.8px',
                    color: '#EFA6BA', padding: '0 4px 6px', textTransform: 'uppercase',
                  }}>
                    <i className="bi bi-hourglass-split me-1" />
                    In attesa · {richieste.length}
                  </div>
                  {richieste.map(r => (
                    <RichiestaItem
                      key={r.interazioneId}
                      richiesta={r}
                      onAccetta={onAccetta}
                      onRifiuta={onRifiuta}
                      onViewProfilo={id => { onViewProfilo?.(id); setIsOpen(false); }}
                    />
                  ))}
                </div>
              )}

              {richieste.length > 0 && notifiche.length > 0 && (
                <div style={{ height: 1, backgroundColor: '#f0e8f5', margin: '4px 0 8px' }} />
              )}

              {notifiche.length > 0 && (
                <div>
                  <div style={{
                    fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.8px',
                    color: '#7FBCC8', padding: '0 4px 5px', textTransform: 'uppercase',
                  }}>
                    <i className="bi bi-clock-history me-1" />Recenti
                  </div>
                  {notifiche.slice(0, 8).map(n => (
                    <NotificaItem key={n.id} n={n} onClick={handleNotificaClick} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
