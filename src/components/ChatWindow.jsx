import React, { useState, useEffect, useRef } from 'react';
import { getSocket } from '../services/socketService';

const ChatWindow = ({ match, onBack }) => {
    const [messaggi, setMessaggi] = useState([]);
    const [nuovoMessaggio, setNuovoMessaggio] = useState('');
    const [invioError, setInvioError] = useState('');
    const token = localStorage.getItem('token');
    const utenteLoggato = JSON.parse(localStorage.getItem('user') || '{}');
    const mioUtenteId = utenteLoggato?.id || null;
    const bottomRef = useRef(null);

    // Auto-scroll ogni volta che i messaggi cambiano
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messaggi]);

    const caricaMessaggi = async () => {
        if (!match.interazioneId) return;
        try {
            const response = await fetch(`/api/messaggi/${match.interazioneId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.successo) setMessaggi(data.chat);
        } catch (err) {
            console.error("Errore nel caricamento messaggi", err);
        }
    };

    // Connessione socket + caricamento iniziale
    useEffect(() => {
        caricaMessaggi();

        const socket = getSocket();
        socket.emit('join_chat', match.interazioneId);

        const handleNuovoMessaggio = (msg) => {
            setMessaggi(prev => {
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        };

        socket.on('nuovo_messaggio', handleNuovoMessaggio);

        return () => {
            socket.off('nuovo_messaggio', handleNuovoMessaggio);
        };
    }, [match.interazioneId]);

    const inviaMessaggio = async (e) => {
        e.preventDefault();
        if (!nuovoMessaggio.trim()) return;
        setInvioError('');
        const testo = nuovoMessaggio.trim();
        setNuovoMessaggio('');

        try {
            const response = await fetch('/api/messaggi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    interazioneId: match.interazioneId,
                    contenuto: testo
                })
            });

            const data = await response.json();
            if (!response.ok) {
                setInvioError(data.errore || "Impossibile inviare il messaggio.");
                setNuovoMessaggio(testo);
            }
            // Il messaggio arriva via socket 'nuovo_messaggio', non serve ricaricare
        } catch (err) {
            console.error("Errore nell'invio", err);
            setInvioError("Errore di rete. Riprova.");
            setNuovoMessaggio(testo);
        }
    };

    return (
        <div className="d-flex flex-column h-100">
            {/* Header Chat */}
            <div className="p-3 border-bottom bg-white d-flex align-items-center gap-2">
                <button className="btn d-md-none p-1" onClick={onBack}>
                    <i className="bi bi-arrow-left"></i>
                </button>
                <img
                    src={match.photo || "https://via.placeholder.com/40"}
                    alt={match.name}
                    className="rounded-circle border"
                    style={{ width: 38, height: 38, objectFit: 'cover', borderColor: '#7FBCC8' }}
                    onError={e => { e.target.src = "https://via.placeholder.com/40"; }}
                />
                <div className="fw-bold" style={{ color: '#444' }}>
                    {match.nomeCaneDestinatario || match.nome || match.name || "Chat Match"}
                </div>
            </div>

            {/* Area Messaggi */}
            <div className="flex-grow-1 overflow-auto p-3" style={{ backgroundColor: '#f0f7f8' }}>
                {messaggi.length === 0 && (
                    <div className="text-center text-muted small py-4 opacity-50">
                        Inizia la conversazione!
                    </div>
                )}
                {messaggi.map((m) => {
                    const isMio = m.mittenteUtenteId === mioUtenteId;
                    return (
                        <div key={m.id} className={`d-flex mb-2 ${isMio ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div
                                className="px-3 py-2 rounded-4 shadow-sm"
                                style={{
                                    backgroundColor: isMio ? '#7FBCC8' : '#ffffff',
                                    color: isMio ? '#fff' : '#333',
                                    maxWidth: '72%',
                                    wordBreak: 'break-word',
                                    fontSize: '0.92rem'
                                }}
                            >
                                {m.contenuto}
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {invioError && (
                <div className="px-3 py-2 bg-white border-top">
                    <div className="alert alert-danger small py-1 px-3 mb-0 rounded-pill border-0 text-center">
                        {invioError}
                    </div>
                </div>
            )}

            {/* Input Invio */}
            <form className="p-3 border-top bg-white d-flex gap-2" onSubmit={inviaMessaggio}>
                <input
                    type="text"
                    className="form-control rounded-pill"
                    style={{ backgroundColor: '#f0f9fa', border: '1.5px solid #d4eaf0' }}
                    placeholder="Scrivi un messaggio..."
                    value={nuovoMessaggio}
                    onChange={(e) => setNuovoMessaggio(e.target.value)}
                />
                <button
                    type="submit"
                    className="btn rounded-circle text-white flex-shrink-0"
                    style={{ backgroundColor: '#7FBCC8', width: 40, height: 40 }}
                >
                    <i className="bi bi-send-fill" style={{ fontSize: '0.85rem' }}></i>
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
