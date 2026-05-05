const API_URL = '/api/messaggi';

const getAuthHeader = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
});

export const fetchChat = async (interazioneId) => {
    try {
        const response = await fetch(`${API_URL}/${interazioneId}`, {
            headers: getAuthHeader()
        });
        return await response.json();
    } catch (error) {
        console.error("Errore recupero chat:", error);
        return [];
    }
};

export const sendMessage = async (messaggioData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(messaggioData)
        });
        return await response.json();
    } catch (error) {
        console.error('Errore invio messaggio', error);
    }
};
