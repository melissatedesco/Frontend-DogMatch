import { useState, useEffect, useRef } from 'react';
import { fetchChat, sendMessage } from '../services/chatServices';
import { getSocket } from '../services/socketService';

const ChatWindow = ({ match, onBack, clearMsgNotifica, onChatChange, onlineMap = {} }) => {
  const [messaggi, setMessaggi]         = useState([]);
  const [nuovoMessaggio, setNuovoMessaggio] = useState('');
  const [invioError, setInvioError]     = useState('');
  const bottomRef = useRef(null);

  const utenteLoggato = JSON.parse(localStorage.getItem('user') || '{}');
  const mioUtenteId   = utenteLoggato?.id || null;

  const caricaMessaggi = async () => {
    if (!match?.interazioneId) return;
    const data = await fetchChat(match.interazioneId);
    if (data.successo) setMessaggi(data.chat);
  };

  // Mount: join chat room, clear badge, notify App which chat is open
  useEffect(() => {
    if (!match?.interazioneId) return;

    caricaMessaggi();
    clearMsgNotifica?.(match.interazioneId);
    onChatChange?.(match.interazioneId);

    const socket = getSocket();
    socket.emit('join_chat', match.interazioneId);

    const handler = ({ interazioneId }) => {
      if (String(interazioneId) === String(match.interazioneId)) {
        caricaMessaggi();
      }
    };
    socket.on('nuova_notifica_messaggio', handler);

    return () => {
      socket.off('nuova_notifica_messaggio', handler);
      onChatChange?.(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.interazioneId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messaggi]);

  const inviaMessaggio = async (e) => {
    e.preventDefault();
    if (!nuovoMessaggio.trim()) return;
    setInvioError('');

    const result = await sendMessage({
      interazioneId: match.interazioneId,
      contenuto: nuovoMessaggio,
    });

    if (result?.successo) {
      setNuovoMessaggio('');
      caricaMessaggi();
    } else {
      setInvioError(result?.errore || 'Impossibile inviare il messaggio.');
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* Header */}
      <div className="p-3 border-bottom bg-white d-flex align-items-center">
        <button className="btn d-md-none me-2" onClick={onBack}>
          <i className="bi bi-arrow-left" />
        </button>
        <div className="d-flex align-items-center gap-2">
          <span
            className="rounded-circle border border-white"
            style={{
              width: "10px", height: "10px", flexShrink: 0,
              backgroundColor: (match.proprietarioId && onlineMap[match.proprietarioId]) ? "#28c76f" : "#adb5bd",
              display: "inline-block",
            }}
          />
          <span className="fw-bold">
            {match.nomeCaneDestinatario || match.nome || match.name || 'Chat Match'}
          </span>
        </div>
      </div>

      {/* Messaggi */}
      <div className="flex-grow-1 overflow-auto p-3 bg-light">
        {match.intento === 'gioco' && (
          <div className="text-center mb-3">
            <span
              className="badge rounded-pill px-3 py-2 fw-semibold"
              style={{ backgroundColor: "#e8f5e9", color: "#2e7d32", fontSize: "0.82rem", whiteSpace: "normal", display: "inline-block", maxWidth: "90%" }}
            >
              <i className="bi bi-circle-fill me-1" />
              Ottimo! Organizzate un incontro in un parco vicino per far correre{match.nomeMioCane ? ` ${match.nomeMioCane} e` : ""} {match.name}!
            </span>
          </div>
        )}
        {messaggi.map((m) => (
          <div
            key={m.id}
            className={`d-flex mb-3 ${m.mittenteUtenteId === mioUtenteId ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div
              className="p-2 rounded-3 px-3 shadow-sm"
              style={{
                backgroundColor: m.mittenteUtenteId === mioUtenteId ? '#d4edda' : '#fce4ec',
                color: '#1c1e21',
                maxWidth: '70%',
                wordBreak: 'break-word',
              }}
            >
              {m.contenuto}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {invioError && (
        <div className="px-3 py-2 bg-white border-top">
          <div className="alert alert-danger small py-1 px-3 mb-0 rounded-pill border-0 text-center">
            {invioError}
          </div>
        </div>
      )}

      {/* Input */}
      <form className="p-3 border-top bg-white d-flex" onSubmit={inviaMessaggio}>
        <input
          type="text"
          className="form-control rounded-pill me-2"
          placeholder="Scrivi un messaggio..."
          value={nuovoMessaggio}
          onChange={(e) => setNuovoMessaggio(e.target.value)}
        />
        <button type="submit" className="btn rounded-circle text-white" style={{ backgroundColor: '#7FBCC8' }}>
          <i className="bi bi-send" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
