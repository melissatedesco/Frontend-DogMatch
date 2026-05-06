import React, { useState, useEffect } from "react";
import MatchList from "../components/ListaRichieste.jsx";
import ChatWindow from "../components/ChatWindow";

const Messaggi = ({ matches, onBack, msgNotifiche = {}, clearMsgNotifica, initialMatch }) => {
  const [selectedMatch, setSelectedMatch] = useState(initialMatch || null);

  // Quando viene passato un match da aprire (clic dal sidebar home o da notifica)
  useEffect(() => {
    if (initialMatch) {
      setSelectedMatch(initialMatch);
      if (clearMsgNotifica && initialMatch.interazioneId) {
        clearMsgNotifica(initialMatch.interazioneId);
      }
    }
  }, [initialMatch?.interazioneId]);

  const handleSelectMatch = (m) => {
    setSelectedMatch(m);
    if (clearMsgNotifica && m.interazioneId) {
      clearMsgNotifica(m.interazioneId);
    }
  };

  return (
    <div className="container py-2">
      <div className="bg-white rounded-4 shadow-lg d-flex"
           style={{ height: "80vh", overflow: 'hidden' }}>

        {/* Sidebar: Lista Match */}
        <div className={`col-12 col-md-4 border-end bg-light ${selectedMatch ? 'd-none d-md-block' : 'd-block'}`}>
          <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Messaggi</h5>
            <button className="btn btn-sm btn-light d-md-none" onClick={onBack}>
              <i className="bi bi-arrow-left"></i>
            </button>
          </div>
          <div className="overflow-auto" style={{ height: 'calc(80vh - 65px)' }}>
            <MatchList
              matches={matches}
              onSelectMatch={handleSelectMatch}
              msgNotifiche={msgNotifiche}
            />
          </div>
        </div>

        {/* Area Chat: Destra */}
        <div className={`col-12 col-md-8 d-flex flex-column bg-white ${!selectedMatch ? 'd-none d-md-flex' : 'd-flex'}`}>
          {selectedMatch ? (
            <ChatWindow
              match={selectedMatch}
              onBack={() => setSelectedMatch(null)}
            />
          ) : (
            <div className="m-auto text-center p-4">
              <i className="bi bi-chat-dots mb-3" style={{ fontSize: "4rem", opacity: '0.3', color: '#7FBCC8' }}></i>
              <h4 className="fw-bold">Le tue conversazioni</h4>
              <p className="text-muted">Seleziona un match per iniziare a chattare.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaggi;
