import { useEffect, useState, useReducer, useRef, useCallback } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";
import dogReducer from "./store/reducers/dogReducer";
import MatchList from "./components/ListaRichieste";
import AdminMatchSidebar from "./components/AdminMatchSidebar";
import InfoCane from "./components/modals/InfoCane";
import Navbar from "./components/Navbar";
import MatchAnimation from "./components/MatchAnimation";
import UserProfilo from "./pages/UserProfilo";
import ViewProfiloUtente from "./pages/ViewProfiloUtente";
import AdminPanel from "./pages/AdminPanel";
import PrimaPagina from "./pages/PrimaPage";
import Login from "./pages/Login";
import Registrazione from "./pages/Registrazione";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Messaggi from "./pages/Messaggi";
import RichiesteMatch from "./pages/RichiesteMatch";
import SnoutBot from "./components/SnoutBot";
import { dogService } from "./services/dogServices";
import { inviaLike, getRichiesteRicevute, rifiutaRichiesta } from "./services/interazioneServices";
import { getSocket } from "./services/socketService";
import { fetchNotifiche, segnaNotificaLetta, segnaAllNotificheLette } from "./services/notificaServices";
import { useAuth } from "./hooks/useAuth";

function ViewProfiloWrapper({ onBack }) {
  const { id } = useParams();
  return <ViewProfiloUtente utenteId={id} onBack={onBack} />;
}

function AuthLayout({
  user, onLogout, notifications, richieste, notifiche,
  onNavigate, onNotificaClick, onMarkAllRead,
  onAccettaRichiesta, onRifiutaRichiesta, onViewProfilo,
  selectedDog, onCloseDog, onAcceptDog,
  showMatchAlert, toastRichiesta, onDismissToast,
  children,
}) {
  return (
    <div className="d-flex flex-column min-vh-100" style={{ background: "linear-gradient(135deg, #e8f4f8 0%, #f5f5f5 40%, #fdedf4 100%)", position: "relative", overflow: "hidden" }}>
      {/* Bolle decorative */}
      <div style={{ position: "fixed", top: "-100px", left: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(127,188,200,0.15) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-80px", right: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(239,166,186,0.15) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "45%", left: "60%", width: "250px", height: "250px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,220,230,0.1) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />
      <Navbar
        user={user}
        onLogout={onLogout}
        notifications={notifications}
        richieste={richieste}
        onNavigate={onNavigate}
        notifiche={notifiche}
        onNotificaClick={onNotificaClick}
        onMarkAllRead={onMarkAllRead}
        onAccettaRichiesta={onAccettaRichiesta}
        onRifiutaRichiesta={onRifiutaRichiesta}
        onViewProfilo={onViewProfilo}
      />

      <main className="container-fluid px-2 px-md-5 flex-grow-1 py-4">
        {children}
      </main>

      <Footer />

      {selectedDog && (
        <InfoCane dog={selectedDog} onClose={onCloseDog} onAccept={onAcceptDog} />
      )}
      {showMatchAlert && <MatchAnimation />}
      <SnoutBot />

      {toastRichiesta.show && toastRichiesta.notifica && (() => {
        const n               = toastRichiesta.notifica;
        const isRichiesta     = n.tipo === 'richiesta_match' && n.payload;
        const payload         = n.payload;
        const pendingRichiesta = isRichiesta
          ? richieste.find(r => r.interazioneId === payload.interazioneId)
          : null;
        const caneImg = (pendingRichiesta?.cane?.fotoUrl ?? payload?.cane?.fotoUrl)
          ? (() => {
              const raw = pendingRichiesta?.cane?.fotoUrl ?? payload?.cane?.fotoUrl;
              if (raw.startsWith('http')) return raw;
              return `/uploads/${raw.replace('uploads/', '').replace('/uploads/', '')}`;
            })()
          : null;
        const caneName    = pendingRichiesta?.cane?.nome ?? payload?.cane?.nome;
        const intentoText = (pendingRichiesta?.intento ?? payload?.intento) === 'accoppiamento'
          ? 'un Match' : 'giocare insieme';

        return (
          <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
            <div className="shadow-lg" style={{
              backgroundColor: 'white', borderRadius: '18px', width: '320px',
              border: '1.5px solid #f0e0e8', overflow: 'hidden',
              animation: 'slideInUp 0.25s ease-out',
            }}>
              <div className="d-flex align-items-center justify-content-between px-3 py-2"
                style={{ background: isRichiesta ? 'linear-gradient(90deg, #EFA6BA, #7FBCC8)' : '#7FBCC8' }}>
                <div className="d-flex align-items-center gap-2 text-white">
                  <i className="bi bi-bell-fill" style={{ fontSize: '0.85rem' }} />
                  <span className="fw-bold" style={{ fontSize: '0.82rem' }}>
                    {isRichiesta ? 'Nuova richiesta' : 'Notifica'}
                  </span>
                </div>
                <button className="btn-close btn-close-white" style={{ fontSize: '0.6rem' }} onClick={onDismissToast} />
              </div>

              <div className="px-3 py-3">
                {isRichiesta ? (
                  <>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      {caneImg ? (
                        <img src={caneImg} alt={caneName}
                          onError={e => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/616/616408.png'; }}
                          style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #EFA6BA', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#fef6f8', border: '2px solid #EFA6BA', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bi bi-heart-fill" style={{ color: '#EFA6BA', fontSize: '1.4rem' }} />
                        </div>
                      )}
                      <div>
                        {caneName && <div className="fw-bold" style={{ fontSize: '0.9rem', color: '#1c1e21' }}>{caneName}</div>}
                        <div style={{ fontSize: '0.78rem', color: '#777' }}>vorrebbe {intentoText} con il tuo cane!</div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm rounded-pill fw-bold text-white flex-grow-1"
                        style={{ backgroundColor: '#28a745', border: 'none', fontSize: '0.82rem' }}
                        onClick={() => { if (pendingRichiesta) onAccettaRichiesta(pendingRichiesta); onDismissToast(); }}>
                        <i className="bi bi-check-lg me-1" />Accetta
                      </button>
                      <button className="btn btn-sm rounded-pill fw-bold flex-grow-1"
                        style={{ backgroundColor: '#fff3f3', color: '#dc3545', border: '1.5px solid #f5c6cb', fontSize: '0.82rem' }}
                        onClick={() => { if (pendingRichiesta) onRifiutaRichiesta(pendingRichiesta); onDismissToast(); }}>
                        <i className="bi bi-x-lg me-1" />Rifiuta
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-bell text-muted" style={{ fontSize: '1.1rem' }} />
                    <div style={{ fontSize: '0.82rem', color: '#555' }}>{n.messaggio}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function App() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [dogs, setDogs]               = useState([]);
  const { user, setUser, authChecked, handleLoginSuccess, handleRegisterSuccess, handleLogout } = useAuth();

  const [loading, setLoading]         = useState(false);
  const [feedError, setFeedError]     = useState(null);
  const [selectedDog, setSelectedDog] = useState(null);
  const [filtroIntento, setFiltroIntento]     = useState("");
  const [filtroDistanza, setFiltroDistanza]   = useState("");
  const [userLocation, setUserLocation]       = useState(null);
  const [selectedCaneIdx, setSelectedCaneIdx] = useState(0);
  const [showMatchAlert, setShowMatchAlert]   = useState(false);

  const [notifications, setNotifications]   = useState({ messages: 0, matches: 0, richieste: 0 });
  const [richieste, setRichieste]           = useState([]);
  const [msgNotifiche, setMsgNotifiche]     = useState({});
  const [selectedMatchToOpen, setSelectedMatchToOpen] = useState(null);
  const [onlineMap, setOnlineMap]           = useState({});
  const [notifiche, setNotifiche]           = useState([]);
  const [toastRichiesta, setToastRichiesta] = useState({ show: false, notifica: null });

  const pollingRef      = useRef(null);
  const chatApertaIdRef = useRef(null);
  const toastTimerRef   = useRef(null);

  useEffect(() => {
    if (!user || user.ruolo === 'admin') return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setUserLocation(coords);
        const token = localStorage.getItem('token');
        fetch('/api/utenti/posizione', {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitudine: coords.lat, longitudine: coords.lon }),
        }).catch(() => {});
      },
      () => {}
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, user?.ruolo]);

  useEffect(() => {
    if (location.pathname === '/messages') {
      setNotifications(prev => ({ ...prev, messages: 0 }));
    } else {
      chatApertaIdRef.current = null;
    }
  }, [location.pathname]);

  const aggiornaSollecitiRichieste = useCallback(async () => {
    try {
      const data = await getRichiesteRicevute();
      if (data.successo) {
        setRichieste(data.richieste ?? []);
        setNotifications(prev => ({ ...prev, richieste: (data.richieste ?? []).length }));
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (!user) return;
    const caneId = user.iMieiCani?.[0]?.id;
    if (caneId) {
      const token = localStorage.getItem('token');
      fetch(`/api/interazioni/matches/${caneId}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (data.successo && data.matches) {
            const formattati = data.matches.map(interazione => {
              const altroCane = interazione.mittenteCaneId === caneId
                ? interazione.ricevente : interazione.mittente;
              const mioCane = interazione.mittenteCaneId === caneId
                ? interazione.mittente : interazione.ricevente;
              if (!altroCane) return null;
              const rawFile  = altroCane.fotoUrl ?? "";
              const nomeFile = rawFile.replace('uploads/', '').replace('/uploads/', '');
              const ultimoMsg = interazione.conversazione?.[0] ?? null;
              return {
                ...altroCane, interazioneId: interazione.id,
                intento: interazione.intento,
                name: altroCane.nome, nomeCaneDestinatario: altroCane.nome,
                nomeMioCane: mioCane?.nome ?? null,
                proprietarioId: altroCane.utenteId ? String(altroCane.utenteId) : null,
                photo: nomeFile ? `/uploads/${nomeFile}` : "https://via.placeholder.com/400",
                ultimoMessaggio: ultimoMsg ? { testo: ultimoMsg.contenuto, data: ultimoMsg.createdAt } : null,
              };
            }).filter(Boolean);
            dispatch({ type: "CARICA_MATCHES", payload: formattati });
          }
        }).catch(() => {});
    }
    aggiornaSollecitiRichieste();
    pollingRef.current = setInterval(() => aggiornaSollecitiRichieste(), 30000);
    fetchNotifiche().then(d => { if (d.successo) setNotifiche(d.notifiche); }).catch(() => {});
    return () => clearInterval(pollingRef.current);
  }, [user, aggiornaSollecitiRichieste]);

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();

    socket.emit('get_online_users');

    const handleList    = (ids) => setOnlineMap(Object.fromEntries(ids.map(id => [String(id), true])));
    const handleOnline  = (id) => setOnlineMap(prev => ({ ...prev, [String(id)]: true }));
    const handleOffline = (id) => setOnlineMap(prev => { const n = { ...prev }; delete n[String(id)]; return n; });

    socket.on('online_users',  handleList);
    socket.on('user_online',   handleOnline);
    socket.on('user_offline',  handleOffline);

    return () => {
      socket.off('online_users',  handleList);
      socket.off('user_online',   handleOnline);
      socket.off('user_offline',  handleOffline);
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const socket  = getSocket();
    const handler = ({ interazioneId }) => {
      if (String(interazioneId) === String(chatApertaIdRef.current)) return;
      setMsgNotifiche(prev => ({ ...prev, [interazioneId]: (prev[interazioneId] || 0) + 1 }));
      setNotifications(prev => ({ ...prev, messages: prev.messages + 1 }));
    };
    socket.on('nuova_notifica_messaggio', handler);
    return () => socket.off('nuova_notifica_messaggio', handler);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const socket  = getSocket();
    const handler = (notifica) => {
      setNotifiche(prev => {
        if (prev.some(n => n.id === notifica.id)) return prev;
        return [notifica, ...prev].slice(0, 50);
      });
      if (notifica.tipo === 'richiesta_match' && notifica.payload) {
        const { interazioneId, intento, cane, utente: utentePayload } = notifica.payload;
        setRichieste(prev => {
          if (prev.some(r => r.interazioneId === interazioneId)) return prev;
          return [...prev, { interazioneId, intento, cane, utente: utentePayload }];
        });
        setNotifications(prev => ({ ...prev, richieste: prev.richieste + 1 }));
      }
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [[880, 0, 0.18], [1100, 0.12, 0.18]].forEach(([freq, delay, dur]) => {
          const osc = ctx.createOscillator(), gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.type = 'sine'; osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.22, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
          osc.start(ctx.currentTime + delay); osc.stop(ctx.currentTime + delay + dur);
        });
      } catch { /* audio non supportato */ }
      setToastRichiesta({ show: true, notifica });
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(
        () => setToastRichiesta({ show: false, notifica: null }), 5000
      );
    };
    socket.on('nuova_notifica', handler);
    return () => { socket.off('nuova_notifica', handler); clearTimeout(toastTimerRef.current); };
  }, [user]);

  useEffect(() => {
    if (!user || user.ruolo !== 'admin') return;
    const socket  = getSocket();
    const handler = (notifica) => {
      const entry = { id: `sys_${Date.now()}`, letto: false, ...notifica };
      setNotifiche(prev => [entry, ...prev].slice(0, 50));
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        [[660, 0, 0.15], [880, 0.1, 0.15]].forEach(([freq, delay, dur]) => {
          const osc = ctx.createOscillator(), gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.type = 'sine'; osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.18, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
          osc.start(ctx.currentTime + delay); osc.stop(ctx.currentTime + delay + dur);
        });
      } catch { /* audio non supportato */ }
      setToastRichiesta({ show: true, notifica: entry });
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(
        () => setToastRichiesta({ show: false, notifica: null }), 5000
      );
    };
    socket.on('notifica_admin', handler);
    return () => { socket.off('notifica_admin', handler); };
  }, [user]);

  const clearMsgNotifica = (interazioneId) => {
    setMsgNotifiche(prev => { const next = { ...prev }; delete next[interazioneId]; return next; });
    setNotifications(prev => ({ ...prev, messages: Math.max(0, prev.messages - 1) }));
  };

  const handleMarkNotificaRead = async (id) => {
    setNotifiche(prev => prev.map(n => n.id === id ? { ...n, letto: true } : n));
    segnaNotificaLetta(id).catch(() => {});
  };

  const handleMarkAllNotificheRead = async () => {
    setNotifiche(prev => prev.map(n => ({ ...n, letto: true })));
    segnaAllNotificheLette().catch(() => {});
  };

  const handleNotificaClick = (notifica) => {
    handleMarkNotificaRead(notifica.id);
    if (notifica.link === 'requests') {
      navigate('/requests');
    } else if (notifica.link?.startsWith('chat:')) {
      const interazioneId = notifica.link.split(':')[1];
      const match = state.matches.find(m => String(m.interazioneId) === String(interazioneId));
      if (match) apriChat(match); else navigate('/messages');
    }
  };

  const apriChat = (match) => {
    setSelectedMatchToOpen(match);
    navigate('/messages');
  };

  useEffect(() => {
    const caricaFeedReale = async () => {
      if (location.pathname !== '/home' || !user) return;
      setLoading(true); setFeedError(null);
      try {
        const caniUtente    = user.iMieiCani || user.cani || [];
        const activeCane    = caniUtente[selectedCaneIdx] ?? caniUtente[0];
        const mioCaneId     = activeCane?.id ?? null;
        if (!mioCaneId) { setDogs([]); setFeedError("nessun_cane"); setLoading(false); return; }

        const KM_FILTERS        = ["5", "10", "50"];
        const isKmFilter        = KM_FILTERS.includes(filtroDistanza);
        const useVicini         = isKmFilter && userLocation;
        const discoveryDistanza = isKmFilter ? "" : filtroDistanza;

        const response = useVicini
          ? await dogService.getVicini(mioCaneId, Number(filtroDistanza))
          : await dogService.getDiscovery(mioCaneId, { intento: filtroIntento, distanza: discoveryDistanza });
        const data = response.data || response;

        if (data.successo && data.cani) {
          setDogs(data.cani.map(dog => {
            const rawFile  = dog.fotoUrl || dog.foto_url || "";
            const nomeFile = rawFile.replace('uploads/', '').replace('/uploads/', '');
            return {
              ...dog, name: dog.nome,
              photo: nomeFile ? `/uploads/${nomeFile}` : "https://via.placeholder.com/400",
              breed: dog.razza,
              distance: dog.distanza_km != null ? parseFloat(dog.distanza_km) : null,
              lat: dog.proprietario?.latitudine ?? null, lng: dog.proprietario?.longitudine ?? null,
              proprietarioNome: dog.proprietario?.nome ?? null,
              proprietarioId: dog.proprietario?.id ? String(dog.proprietario.id) : null,
            };
          }));
        } else {
          setDogs([]); setFeedError(data.errore || "errore_generico");
        }
      } catch (err) {
        if (err.status === 403) {
          const banned = { ...user, isBanned: true, isBloccato: true };
          setUser(banned); localStorage.setItem("user", JSON.stringify(banned)); return;
        }
        setDogs([]); setFeedError("errore_server");
      } finally { setLoading(false); }
    };
    caricaFeedReale();
  }, [location.pathname, user, filtroIntento, filtroDistanza, userLocation, selectedCaneIdx]);

  const initialState      = { requests: [], matches: [] };
  const [state, dispatch] = useReducer(dogReducer, initialState);

  const sendLike = async (dogId, intento) => {
    const selectedDogData = dogs.find(d => d.id === dogId);
    if (!selectedDogData || !user) return;
    const caniUtente = user.iMieiCani || user.cani || [];
    const mioCaneId  = (caniUtente[selectedCaneIdx] ?? caniUtente[0])?.id;
    if (!mioCaneId) { alert("Nessun cane associato al tuo account."); return; }
    try {
      const result = await inviaLike(mioCaneId, dogId, intento);
      if (!result.successo) return;
      setDogs(prev => prev.filter(d => d.id !== dogId));
      setSelectedDog(null);
      if (result.isMatch) {
        const mioCane = (caniUtente[selectedCaneIdx] ?? caniUtente[0]);
        dispatch({ type: "AGGIUNGI_MATCH_DIRETTO", payload: { ...selectedDogData, interazioneId: result.data?.id || null, intento, nomeMioCane: mioCane?.nome ?? null, proprietarioId: selectedDogData.proprietarioId ?? null } });
        triggerMatchAnimation();
        setTimeout(() => navigate('/messages'), 2000);
      }
    } catch (err) { console.error("Errore durante il like:", err); }
  };

  const handleAcceptMatch = (dogId) => sendLike(dogId, 'accoppiamento');
  const handlePlayClick   = (dogId) => sendLike(dogId, 'gioco');

  const triggerMatchAnimation = () => {
    setShowMatchAlert(true);
    setTimeout(() => setShowMatchAlert(false), 2000);
  };

  const handleAccettaRichiesta = async (richiesta) => {
    const mioCaneId = user?.iMieiCani?.[0]?.id;
    if (!mioCaneId) return;
    try {
      const result = await inviaLike(mioCaneId, richiesta.cane.id, richiesta.intento);
      if (!result.successo) return;
      setRichieste(prev => prev.filter(r => r.interazioneId !== richiesta.interazioneId));
      setNotifications(prev => ({ ...prev, richieste: Math.max(0, prev.richieste - 1) }));
      if (result.isMatch) {
        const rawFile  = richiesta.cane.fotoUrl ?? richiesta.cane.foto_url ?? "";
        const nomeFile = rawFile.replace('uploads/', '').replace('/uploads/', '');
        dispatch({
          type: "AGGIUNGI_MATCH_DIRETTO",
          payload: {
            ...richiesta.cane, name: richiesta.cane.nome,
            photo: nomeFile ? `/uploads/${nomeFile}` : "https://via.placeholder.com/400",
            interazioneId: result.data?.id || null,
            intento: richiesta.intento,
            nomeMioCane: user?.iMieiCani?.[0]?.nome ?? null,
            proprietarioId: richiesta.utente?.id ? String(richiesta.utente.id) : null,
          },
        });
        triggerMatchAnimation();
        setTimeout(() => navigate('/messages'), 2000);
      }
    } catch (err) { console.error("Errore accetta richiesta:", err); }
  };

  const handleRifiutaRichiesta = async (richiesta) => {
    try {
      await rifiutaRichiesta(richiesta.interazioneId);
      setRichieste(prev => prev.filter(r => r.interazioneId !== richiesta.interazioneId));
      setNotifications(prev => ({ ...prev, richieste: Math.max(0, prev.richieste - 1) }));
    } catch (err) { console.error("Errore rifiuta richiesta:", err); }
  };

  useEffect(() => {
    setNotifications(prev => ({ ...prev, matches: state.matches.length }));
    localStorage.setItem("dogMatches", JSON.stringify(state.matches));
  }, [state.matches]);

  if (!authChecked) return null;

  const layoutProps = {
    user, onLogout: handleLogout,
    notifications, richieste, notifiche,
    onNavigate: (page) => navigate('/' + page),
    onNotificaClick: handleNotificaClick,
    onMarkAllRead: handleMarkAllNotificheRead,
    onAccettaRichiesta: handleAccettaRichiesta,
    onRifiutaRichiesta: handleRifiutaRichiesta,
    onViewProfilo: (utenteId) => navigate('/view-profile/' + utenteId),
    selectedDog,
    onCloseDog: () => setSelectedDog(null),
    onAcceptDog: handleAcceptMatch,
    showMatchAlert,
    toastRichiesta,
    onDismissToast: () => setToastRichiesta({ show: false, notifica: null }),
  };

  return (
    <Routes>
      {/* Rotte pubbliche */}
      <Route path="/"
        element={user
          ? <Navigate to="/home" replace />
          : <PrimaPagina onStart={(page) => navigate('/' + page)} />}
      />
      <Route path="/login"
        element={user
          ? <Navigate to="/home" replace />
          : <Login onLogin={handleLoginSuccess} onSwitch={(page) => navigate('/' + page)} />}
      />
      <Route path="/register"
        element={user
          ? <Navigate to="/home" replace />
          : <Registrazione onSwitch={(page) => navigate('/' + page)} onRegisterSuccess={handleRegisterSuccess} />}
      />

      {/* Rotte protette */}
      <Route path="/home" element={
        !user ? <Navigate to="/" replace /> :
        <AuthLayout {...layoutProps}>
          <div className="row g-3 g-lg-4">
            <div className="col-xl-9 col-lg-8">
              <Home
                dogs={dogs.filter(dog =>
                  !state.matches.some(m => m.id === dog.id) &&
                  !richieste.some(r => r.cane?.id === dog.id)
                )} loading={loading} feedError={feedError}
                setSelectedDog={setSelectedDog}
                handleAcceptMatch={handleAcceptMatch} handlePlayClick={handlePlayClick}
                user={user}
                filtroIntento={filtroIntento} setFiltroIntento={setFiltroIntento}
                filtroDistanza={filtroDistanza} setFiltroDistanza={setFiltroDistanza}
                onNavigate={(page) => navigate('/' + page)}
                hasLocation={!!userLocation}
                selectedCaneIdx={selectedCaneIdx}
                onSwitchCane={(idx) => { setSelectedCaneIdx(idx); setDogs([]); }}
                onlineMap={onlineMap}
              />
            </div>
            <div className="col-xl-3 col-lg-4">
              <div className="sticky-top" style={{ top: "90px" }}>
                {user?.ruolo === 'admin' ? (
                  <AdminMatchSidebar />
                ) : (
                  <div className="bg-white rounded-4 shadow-sm p-3 border-0">
                    <h6 className="fw-bold mb-3 border-bottom pb-2 text-secondary">
                      I tuoi Match ({state.matches.length})
                    </h6>
                    <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
                      {state.matches.length === 0
                        ? <p className="text-muted mb-0 small text-center py-4">Ancora nessun match</p>
                        : <MatchList matches={state.matches} msgNotifiche={msgNotifiche} onSelectMatch={apriChat} onlineMap={onlineMap} />
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </AuthLayout>
      } />

      <Route path="/messages" element={
        !user ? <Navigate to="/" replace /> :
        <AuthLayout {...layoutProps}>
          <Messaggi
            matches={state.matches}
            onBack={() => { setSelectedMatchToOpen(null); navigate('/home'); }}
            msgNotifiche={msgNotifiche}
            clearMsgNotifica={clearMsgNotifica}
            initialMatch={selectedMatchToOpen}
            onChatChange={(id) => { chatApertaIdRef.current = id; }}
            onlineMap={onlineMap}
          />
        </AuthLayout>
      } />

      <Route path="/profile" element={
        !user ? <Navigate to="/" replace /> :
        <AuthLayout {...layoutProps}>
          <UserProfilo
            user={user}
            onUpdate={(updatedUser) => {
              setUser(updatedUser);
              localStorage.setItem("user", JSON.stringify(updatedUser));
            }}
            onLogout={handleLogout}
          />
        </AuthLayout>
      } />

      <Route path="/requests" element={
        !user ? <Navigate to="/" replace /> :
        <AuthLayout {...layoutProps}>
          <RichiesteMatch
            richieste={richieste}
            onAccetta={handleAccettaRichiesta}
            onRifiuta={handleRifiutaRichiesta}
            onBack={() => navigate('/home')}
          />
        </AuthLayout>
      } />

      <Route path="/admin" element={
        !user || user.ruolo !== 'admin' ? <Navigate to="/" replace /> :
        <AuthLayout {...layoutProps}>
          <AdminPanel onBack={() => navigate('/home')} />
        </AuthLayout>
      } />

      <Route path="/view-profile/:id" element={
        !user ? <Navigate to="/" replace /> :
        <AuthLayout {...layoutProps}>
          <ViewProfiloWrapper onBack={() => navigate(-1)} />
        </AuthLayout>
      } />

      <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
    </Routes>
  );
}

export default App;
