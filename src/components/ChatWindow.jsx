import React, { useState, useEffect } from 'react';

const ChatWindow = ({match, onBack}) => {
    const [messaggi, setMessaggi] = useState([])
    const [nuovoMessaggio, setNuovoMessaggio] = useState('')
    const [invioError, setInvioError] = useState('')
    const token = localStorage.getItem('token')
    const utenteLoggato = JSON.parse(localStorage.getItem('user') || '{}')
    const mioUtenteId = utenteLoggato?.id || null

    //  recupero i messaggi
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

    useEffect(() => {
        caricaMessaggi();
        // Opzionale: potresti mettere un setInterval per ricaricare ogni 5 secondi
    }, [match.id]);

    // 2. Invio un messaggio (La POST di Postman)
    const inviaMessaggio = async (e) => {
        e.preventDefault();
        if (!nuovoMessaggio.trim()) return;
        setInvioError('');

        try {
            const response = await fetch(`/api/messaggi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    interazioneId: match.interazioneId,
                    contenuto: nuovoMessaggio
                })
            });

            if (response.ok) {
                setNuovoMessaggio("");
                caricaMessaggi();
            } else {
                const data = await response.json();
                setInvioError(data.errore || "Impossibile inviare il messaggio.");
            }
        } catch (err) {
            console.error("Errore nell'invio", err);
            setInvioError("Errore di rete. Riprova.");
        }
    };

    return (
        <div className="d-flex flex-column h-100">
            {/* Header Chat */}
            <div className="p-3 border-bottom bg-white d-flex align-items-center">
                <button className="btn d-md-none me-2" onClick={onBack}>
                    <i className="bi bi-arrow-left"></i>
                </button>
                <div className="fw-bold">{match.nomeCaneDestinatario || match.nome || match.name || "Chat Match"}</div>
            </div>

            {/* Area Messaggi */}
            <div className="flex-grow-1 overflow-auto p-3 bg-light">
                {messaggi.map((m) => (
                    <div key={m.id} className={`d-flex mb-3 ${m.mittenteUtenteId === mioUtenteId ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div className={`p-2 rounded-3 px-3 shadow-sm ${m.mittenteUtenteId === mioUtenteId ? 'bg-success text-white' : 'bg-white'}`}>
                            {m.contenuto}
                        </div>
                    </div>
                ))}
            </div>

            {/* Errore invio */}
            {invioError && (
                <div className="px-3 py-2 bg-white border-top">
                    <div className="alert alert-danger small py-1 px-3 mb-0 rounded-pill border-0 text-center">
                        {invioError}
                    </div>
                </div>
            )}

            {/* Input Invio */}
            <form className="p-3 border-top bg-white d-flex" onSubmit={inviaMessaggio}>
                <input 
                    type="text" 
                    className="form-control rounded-pill me-2" 
                    placeholder="Scrivi un messaggio..." 
                    value={nuovoMessaggio}
                    onChange={(e) => setNuovoMessaggio(e.target.value)}
                />
                <button type="submit" className="btn rounded-circle text-white" style={{ backgroundColor: "#7FBCC8" }}>
                    <i className="bi bi-send"></i>
                </button>
            </form>
        </div>
    );
};

export default ChatWindow