const API_URL = '/api/interazioni';

const getAuthHeader = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
});

export const getRichiesteRicevute = async (mioCaneId) => {
    try {
        const response = await fetch(`${API_URL}/ricevuti/${mioCaneId}`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error('Errore nel recupero richieste');
        return await response.json();
    } catch (error) {
        console.error("Errore richieste ricevute", error);
        return { successo: false, richieste: [] };
    }
};

export const rifiutaRichiesta = async (interazioneId) => {
    try {
        const response = await fetch(`${API_URL}/${interazioneId}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });
        return await response.json();
    } catch (error) {
        console.error("Errore rifiuto richiesta", error);
        throw error;
    }
};

export const getMyMatches = async (mioCaneId) => {
    try {
        const response = await fetch(`${API_URL}/matches/${mioCaneId}`, {
            headers: getAuthHeader()
        });
        if (!response.ok) throw new Error('Errore nel recupero match');
        return await response.json();
    } catch (error) {
        console.error("Errore Match", error);
        return [];
    }
};

export const inviaLike = async (mittenteCaneId, destinatarioCaneId, intento = 'gioco') => {
    try {
        const response = await fetch(`${API_URL}/like`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ mittenteCaneId, destinatarioCaneId, intento })
        });
        return await response.json();
    } catch (error) {
        console.error("Errore invio like", error);
        throw error;
    }
};

export const inviaDislike = async (mittenteCaneId, destinatarioCaneId) => {
    try {
        const response = await fetch(`${API_URL}/dislike`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ mittenteCaneId, destinatarioCaneId })
        });
        return await response.json();
    } catch (error) {
        console.error("Errore invio dislike", error);
        throw error;
    }
};
