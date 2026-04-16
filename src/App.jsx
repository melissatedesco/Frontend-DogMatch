import { useEffect, useState, useReducer } from "react";
import MatchRequestCard from "./components/MatchCane";
import dogReducer from "./components/DogReducer";
import BreedSelector from "./components/Razza";
import MatchList from "./components/ListaRichieste";
import InfoCane from "./modal/InfoCane";
import Navbar from "./components/Navbar";
import MatchAnimation from "./css/MatchAnimation";
import UserProfilo from "./components/UserProfilo";
import PrimaPagina from "./components/PrimaPage";
import Login from "./components/Login";
import Registrazione from "./components/Registrazione";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Messaggi from "./components/Chat";

function App() {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [breed, setBreed] = useState("labrador");
  const [selectedDog, setSelectedDog] = useState(null);
  const [showMatchAlert, setShowMatchAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState("landing");

  // Stato per  le notifiche della navbar
  const [notifications, setNotifications] = useState({
    messages: 0,
    matches: 0,
  });

  const emptyUser = {
    username: "",
    email: "",
    phone: "",
    hasPedigree: false,
    isVerified: false,
    isPremium: false,
    photo: "",
  };

  // gestione navigazione
  const handleStart = (page) => setCurrentPage(page);

  // simulazione utente loggato con requisiti pedigree  e verifica
  const [user, setUser] = useState(emptyUser);

  const handleLoginSuccess = () => {
    setUser({
      username: "Mario Rossi",
      dogBreed: 'Labrador',
      email: "mario.rossi@example.it",
      phone: "3331234567",
      hasPedigree: true,
      isVerified: true,
      isPremium: true,
      photo: "https://cdn-icons-png.flaticon.com/512/6073/6073873.png",
    });
    setCurrentPage("home");
  };

  const handleRegisterSuccess = () => {
    // Qui simuli l'invio documenti
    alert("Registrazione completata! Documenti in fase di revisione.");
    setCurrentPage("home");
  };

  // reducer, carica i match precedenti dal localStorage se esistono
  const initialState = {
    requests: [],
    matches: JSON.parse(localStorage.getItem("dogMatches")) || [],
  };
  const [state, dispatch] = useReducer(dogReducer, initialState);

  // logica match con controllo requisiti
  const handleAcceptMatch = (dogId) => {
    // troviamo l'oggetto cane completo per controllare la razza
    const selectedDogData = dogs.find((d) => d.id === dogId);

    // controllo razza devono essere uguali
    const userBreed = user.dogBreed || "Labrador";
    const isSameBreed =
      selectedDogData.breed.toUpperCase() === userBreed.toUpperCase();

    if (!isSameBreed) {
      alert(
        `RAZZA NON COMPATIBILE\n\nPuoi fare match solo con esemplari di razza ${userBreed} per finalità di accoppiamento`,
      );
      return;
    }

    // Controllo abbonamento
    if (!user.isPremium) {
      alert(
        `⭐ FUNZIONE PREMIUM\n\n Il match tra esemplari di razza pure è una funzione Premium. Abbonati per continuare!`,
      );
      setCurrentPage("profile");
      return;
    }

    // controllo documenti, controllo pedigree e verifica
    if (!user.hasPedigree || !user.isVerified) {
      alert(
        `🔒 DOCUMENTAZIONE MANCANTE \n\n` +
          `Per accoppiamenti di razza certificata, il tuo profilo deve avere il Pedigree ed essere verificato`,
      );
      return;
    }
    //  se è tutto ok fa il match
    dispatch({ type: "ACCETTA_MATCH", payload: dogId });
    setSelectedDog(null);

    // animazione
    triggerMatchAnimation();

    // transizione alla schermata della chat dopo due secondi
    setTimeout(() => {
      setCurrentPage("messages");
    }, 2000);
  };

  // Logica match
  const triggerMatchAnimation = () => {
    setShowMatchAlert(true);
    setTimeout(() => setShowMatchAlert(false), 2000);
  };

  // Fetch api per il feed
  useEffect(() => {
    setLoading(true);
    fetch(`https://dog.ceo/api/breed/${breed}/images/random/3`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          const dogObjects = data.message.map((url, index) => ({
            id: `${breed} - ${index} - ${Date.now()}`,
            name: `Esemplare ${index + 1}`,
            photo: url,
            breed: breed.charAt(0).toUpperCase() + breed.slice(1),
            distance: Math.floor(Math.random() * 20) + 1,
          }));
          setDogs(dogObjects);
        }
        setLoading(false);
      })
      .catch(() => {
        setBreed("Labrador");
        setLoading(false);
      });
  }, [breed]);

  // Aggiorna il numero di notifiche match quando lo stato dei match cambia
  useEffect(() => {
    setNotifications((prev) => ({ ...prev, matches: state.matches.length }));
    localStorage.setItem("dogMatches", JSON.stringify(state.matches));
  }, [state.matches]);

  return (
    <>
      {/* 1. PAGINE DI AUTENTICAZIONE */}
      {currentPage === "landing" && <PrimaPagina onStart={handleStart} />}
      {currentPage === "login" && (
        <Login onLogin={handleLoginSuccess} onSwitch={setCurrentPage} />
      )}
      {currentPage === "register" && (
        <Registrazione
          onRegister={handleRegisterSuccess}
          onSwitch={setCurrentPage}
        />
      )}

      {/* 2. AREA RISERVATA (HOME PROFILO Messaggi) */}
      {["home", "profile", "messages"].includes(currentPage) && (
        <div
          className="d-flex flex-column min-vh-100"
          style={{
            backgroundColor: "#f8fbfb",
          }}
        >
          <Navbar
            user={user}
            onLogout={() => setCurrentPage("landing")}
            notifications={notifications}
            onNavigate={(page) => setCurrentPage(page)}
          />

          <main className="container-fluid px-2 px-md-5 flex-grow-1 py-4">
            {/* pagina profilo */}
            {currentPage === "profile" && <UserProfilo user={user} />}

            {/* pagina home (solo feed e lista match) */}
            {currentPage === "home" && (
              <div className="row g-3 g-lg-4">
                <div className="col-xl-9 col-lg-8">
                  <Home
                    dogs={dogs}
                    loading={loading}
                    breed={breed}
                    setBreed={setBreed}
                    setSelectedDog={setSelectedDog}
                    handleAcceptMatch={handleAcceptMatch}
                    setDogs={setDogs}
                    user={user}
                  />
                </div>

                {/* Colonna DX lista match */}
                <div className="col-xl-3 col-lg-4">
                  <div
                    className="sticky-top"
                    style={{
                      top: "90px",
                    }}
                  >
                    <div className="bg-white rounded-4 shadow-sm p-3 border-0">
                      <h6 className="fw-bold mb-3 border-bottom pb-2 text-secondary">
                        Match ({state.matches.length})
                      </h6>
                      <div
                        style={{
                          maxHeight: "70vh",
                          overflowY: "auto",
                        }}
                      >
                        {state.matches.length === 0 ? (
                          <p className="text-muted mb-0 small text-center py-4">
                            Ancora nessun match
                          </p>
                        ) : (
                          <MatchList matches={state.matches} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* pagina messaggi */}
            {currentPage === "messages" && (
              <Messaggi
              matches={state.matches}
              onBack={() => setCurrentPage('home')}/>
                  
                  
            )}
          </main>

          <Footer />

          {/* Modali e Animazioni (Dentro il blocco loggato) */}
          {selectedDog && (
            <InfoCane
              dog={selectedDog}
              onClose={() => setSelectedDog(null)}
              onAccept={handleAcceptMatch}
            />
          )}
          {showMatchAlert && <MatchAnimation />}
        </div>
      )}
    </>
  );
}

export default App;
