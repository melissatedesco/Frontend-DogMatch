import { useEffect, useState, useReducer, useRef, useCallback } from "react";
import dogReducer from "./store/reducers/dogReducer";
import MatchList from "./components/ListaRichieste";
import InfoCane from "./modal/InfoCane";
import Navbar from "./components/Navbar";
import MatchAnimation from "./components/MatchAnimation";
import UserProfilo from "./pages/UserProfilo";
import AdminPanel from "./pages/AdminPanel";
import PrimaPagina from "./pages/PrimaPage";
import Login from "./pages/Login";
import Registrazione from "./pages/Registrazione";
import BannedPage from "./pages/BannedPage";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Messaggi from "./pages/Messaggi";
import RichiesteMatch from "./pages/RichiesteMatch";
import SnoutBot from "./components/SnoutBot";
import { dogService } from "./services/dogServices";
import { inviaLike, inviaDislike, getRichiesteRicevute, rifiutaRichiesta } from "./services/interazioneServices";


function App() {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [breed, setBreed] = useState("");
  const [selectedDog, setSelectedDog] = useState(null);
  const [filtroIntento, setFiltroIntento] = useState("");
  const [filtroDistanza, setFiltroDistanza] = useState("");
  const [showMatchAlert, setShowMatchAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState("landing");
  const [user, setUser] = useState(null); // Parte come null

  const [notifications, setNotifications] = useState({
    messages: 0,
    matches: 0,
    richieste: 0,
  });
  const [richieste, setRichieste] = useState([]);
  const pollingRef = useRef(null);

  // 1. Controllo sessione all'avvio
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setCurrentPage("home");
      } catch (e) {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  // Polling richieste ricevute
  const aggiornaSollecitiRichieste = useCallback(async (userData) => {
    const caneId = (userData ?? user)?.iMieiCani?.[0]?.id;
    if (!caneId) return;
    try {
      const data = await getRichiesteRicevute(caneId);
      if (data.successo) {
        setRichieste(data.richieste ?? []);
        setNotifications(prev => ({ ...prev, richieste: (data.richieste ?? []).length }));
      }
    } catch { /* silent */ }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const caneId = user.iMieiCani?.[0]?.id;

    // Carica matches dal backend
    if (caneId) {
      const token = localStorage.getItem('token');
      fetch(`/api/interazioni/matches/${caneId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => {
          if (data.successo && data.matches) {
            const formattati = data.matches
              .map(interazione => {
                // interazione ha mittente e ricevente — prendiamo il cane dell'altro
                const altroCane = interazione.mittenteCaneId === caneId
                  ? interazione.ricevente
                  : interazione.mittente;
                if (!altroCane) return null;
                const rawFile = altroCane.fotoUrl ?? "";
                const nomeFile = rawFile.replace('uploads/', '').replace('/uploads/', '');
                return {
                  ...altroCane,
                  interazioneId: interazione.id,
                  name: altroCane.nome,
                  nomeCaneDestinatario: altroCane.nome,
                  photo: nomeFile ? `/uploads/${nomeFile}` : "https://via.placeholder.com/400",
                };
              })
              .filter(Boolean);
            dispatch({ type: "CARICA_MATCHES", payload: formattati });
          }
        })
        .catch(() => { });
    }

    // Polling richieste
    aggiornaSollecitiRichieste(user);
    pollingRef.current = setInterval(() => aggiornaSollecitiRichieste(user), 30000);
    return () => clearInterval(pollingRef.current);
  }, [user]);

  // Registrazione
  const handleRegisterSuccess = (userData) => {
    localStorage.removeItem('dogMatches');
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setCurrentPage("home");
  };

  // 2. Gestione Login
  const handleLoginSuccess = (userData) => {
    localStorage.removeItem('dogMatches');
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage("home");
  };

  // 3. Gestione Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('dogMatches');
    setUser(null);
    setCurrentPage('landing');
  };

  // 4. Caricamento Feed dal Database
  useEffect(() => {
    const caricaFeedReale = async () => {
      // 1. Se non siamo in home o l'utente non c'è, fermati
      if (currentPage !== "home" || !user) return;

      setLoading(true);
      try {

        const caniUtente = user.iMieiCani || user.cani || [];
        console.log("Dati utente attuale:", user);
        const mioCaneId = caniUtente.length > 0 ? caniUtente[0].id : null;

        if (!mioCaneId) {
          console.log("Nessun cane trovato per questo utente");
          setDogs([]);
          setLoading(false);
          return;
        }

        const response = await dogService.getDiscovery(mioCaneId, { intento: filtroIntento, distanza: filtroDistanza });
        // Assicuriamoci di prendere i dati corretti sia che usiamo fetch o axios
        const data = response.data || response;

        if (data.successo && data.cani) {
          const caniFormattati = data.cani.map(dog => {
            const rawFile = dog.fotoUrl || dog.foto_url || "";
            const nomeFile = rawFile.replace('uploads/', '').replace('/uploads/', '');

            return {
              ...dog,
              name: dog.nome,
              photo: nomeFile
                ? `/uploads/${nomeFile}`
                : "https://via.placeholder.com/400",
              breed: dog.razza,
              distance: Math.floor(Math.random() * 20) + 1
            };
          });
          setDogs(caniFormattati);
        }
      } catch (err) {
        console.error("Errore caricamento feed:", err);
      } finally {
        setLoading(false);
      }
    };

    caricaFeedReale();
  }, [currentPage, user, filtroIntento, filtroDistanza]);

  // 5. Reducer per i Match
  const initialState = {
    requests: [],
    matches: [],
  };

  // collega lo stato al reducer
  const [state, dispatch] = useReducer(dogReducer, initialState);

  // 6. Logica Match
  const handleAcceptMatch = async (dogId) => {
    const selectedDogData = dogs.find((d) => d.id === dogId);

    if (!selectedDogData || !user) return;

    const mioCaneId = user.iMieiCani?.[0]?.id;
    if (!mioCaneId) {
      alert("Nessun cane associato al tuo account.");
      return;
    }

    // Controllo compatibilità razza solo per accoppiamento
    if (filtroIntento === 'accoppiamento') {
      const userBreed = user.iMieiCani?.[0]?.razza || "Meticcio";
      if ((selectedDogData.razza ?? '').toUpperCase() !== userBreed.toUpperCase()) {
        alert(`RAZZA NON COMPATIBILE\n\nPer l'accoppiamento puoi fare match solo con esemplari di razza ${userBreed}`);
        return;
      }
    }

    try {
      const result = await inviaLike(mioCaneId, dogId, filtroIntento || 'gioco');

      if (!result.successo) return;

      setDogs((prev) => prev.filter((d) => d.id !== dogId));
      setSelectedDog(null);

      if (result.isMatch) {
        const matchDog = {
          ...selectedDogData,
          interazioneId: result.data?.id || null,
        };
        dispatch({ type: "AGGIUNGI_MATCH_DIRETTO", payload: matchDog });
        triggerMatchAnimation();
        setTimeout(() => {
          setCurrentPage("messages");
        }, 2000);
      }
    } catch (err) {
      console.error("Errore durante il like:", err);
    }
  };

  const handleRejectDog = async (dogId) => {
    const mioCaneId = user?.iMieiCani?.[0]?.id;
    if (!mioCaneId) return;
    try {
      await inviaDislike(mioCaneId, dogId);
    } catch (err) {
      console.error("Errore durante il dislike:", err);
    }
    setDogs((prev) => prev.filter((d) => d.id !== dogId));
  };

  const triggerMatchAnimation = () => {
    setShowMatchAlert(true);
    setTimeout(() => setShowMatchAlert(false), 2000);
  };

  // Accetta richiesta di match
  const handleAccettaRichiesta = async (richiesta) => {
    const mioCaneId = user?.iMieiCani?.[0]?.id;
    if (!mioCaneId) return;
    try {
      const result = await inviaLike(mioCaneId, richiesta.cane.id, richiesta.intento);
      if (!result.successo) return;
      // Rimuovi dalla lista richieste
      setRichieste(prev => prev.filter(r => r.interazioneId !== richiesta.interazioneId));
      setNotifications(prev => ({ ...prev, richieste: Math.max(0, prev.richieste - 1) }));

      if (result.isMatch) {
        const rawFile = richiesta.cane.fotoUrl ?? richiesta.cane.foto_url ?? "";
        const nomeFile = rawFile.replace('uploads/', '').replace('/uploads/', '');
        const matchDog = {
          ...richiesta.cane,
          name: richiesta.cane.nome,
          photo: nomeFile ? `/uploads/${nomeFile}` : "https://via.placeholder.com/400",
          interazioneId: result.data?.id || null,
        };
        dispatch({ type: "AGGIUNGI_MATCH_DIRETTO", payload: matchDog });
        triggerMatchAnimation();
        setTimeout(() => setCurrentPage("messages"), 2000);
      }
    } catch (err) {
      console.error("Errore accetta richiesta:", err);
    }
  };

  // Rifiuta richiesta di match
  const handleRifiutaRichiesta = async (richiesta) => {
    try {
      await rifiutaRichiesta(richiesta.interazioneId);
      setRichieste(prev => prev.filter(r => r.interazioneId !== richiesta.interazioneId));
      setNotifications(prev => ({ ...prev, richieste: Math.max(0, prev.richieste - 1) }));
    } catch (err) {
      console.error("Errore rifiuta richiesta:", err);
    }
  };

  const handleStart = (page) => setCurrentPage(page);

  // Aggiorna contatore notifiche
  useEffect(() => {
    setNotifications((prev) => ({ ...prev, matches: state.matches.length }));
    localStorage.setItem("dogMatches", JSON.stringify(state.matches));
  }, [state.matches]);

  // logica di blocco
  if (user && user.isBanned) {
    return <BannedPage user={user} onLogout={handleLogout} />;
  }

  return (
    <>
      {currentPage === "landing" && <PrimaPagina onStart={handleStart} />}
      {currentPage === "login" && (
        <Login onLogin={handleLoginSuccess} onSwitch={setCurrentPage} />
      )}

      {currentPage === "register" && (
        <Registrazione
          onSwitch={setCurrentPage}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {["home", "profile", "messages", "admin", "requests"].includes(currentPage) && user && (
        <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#f8fbfb" }}>
          <Navbar
            user={user}
            onLogout={handleLogout}
            notifications={notifications}
            richieste={richieste}
            onNavigate={(page) => setCurrentPage(page)}
          />

          <main className="container-fluid px-2 px-md-5 flex-grow-1 py-4">
            {currentPage === "requests" && (
              <RichiesteMatch
                richieste={richieste}
                onAccetta={handleAccettaRichiesta}
                onRifiuta={handleRifiutaRichiesta}
                onBack={() => setCurrentPage("home")}
              />
            )}

            {currentPage === "admin" && user?.ruolo === 'admin' && (
              <AdminPanel onBack={() => setCurrentPage("home")} />
            )}

            {currentPage === "profile" && (
              <UserProfilo
                user={user}
                onUpdate={(updatedUser) => {
                  setUser(updatedUser);
                  localStorage.setItem("user", JSON.stringify(updatedUser));
                }}
                onLogout={handleLogout}
              />
            )}

            {currentPage === "home" && (
              <div className="row g-3 g-lg-4">
                <div className="col-xl-9 col-lg-8">
                  <Home
                    dogs={breed ? dogs.filter(d => d.razza?.toLowerCase().includes(breed.toLowerCase())) : dogs}
                    loading={loading}
                    breed={breed}
                    setBreed={setBreed}
                    setSelectedDog={setSelectedDog}
                    handleAcceptMatch={handleAcceptMatch}
                    handleRejectDog={handleRejectDog}
                    user={user}
                    filtroIntento={filtroIntento}
                    setFiltroIntento={setFiltroIntento}
                    filtroDistanza={filtroDistanza}
                    setFiltroDistanza={setFiltroDistanza}
                  />
                </div>

                <div className="col-xl-3 col-lg-4">
                  <div className="sticky-top" style={{ top: "90px" }}>
                    <div className="bg-white rounded-4 shadow-sm p-3 border-0">
                      <h6 className="fw-bold mb-3 border-bottom pb-2 text-secondary">
                        Match ({state.matches.length})
                      </h6>
                      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
                        {state.matches.length === 0 ? (
                          <p className="text-muted mb-0 small text-center py-4">Ancora nessun match</p>
                        ) : (
                          <MatchList matches={state.matches} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentPage === "messages" && (
              <Messaggi matches={state.matches} onBack={() => setCurrentPage('home')} />
            )}
          </main>

          <Footer />

          {selectedDog && (
            <InfoCane
              dog={selectedDog}
              onClose={() => setSelectedDog(null)}
              onAccept={handleAcceptMatch}
            />
          )}
          {showMatchAlert && <MatchAnimation />}
          <SnoutBot />
        </div>
      )}
    </>
  );
}

export default App;