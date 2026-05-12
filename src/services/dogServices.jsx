const API_URL = '/api/cani';

// Funzione helper per recuperare il token (dipende da dove lo salvi, es. localStorage)
const getAuthHeader = () => {
    const token = localStorage.getItem('token'); 
    return { 'Authorization': `Bearer ${token}`,
            'Content-Type' : 'application/json' };
};

export const dogService = {
    // GET Discovery Feed (quello che usi per la Home)
    getDiscovery: async (caneId) => {
        try {
            const response = await fetch(`${API_URL}/discovery/${caneId}`, {
                method: 'GET',
                headers: getAuthHeader()
            });
           if (!response.ok) throw new Error('Errore nel caricamento del feed');
            return await response.json();
        } catch (error) {
            console.error("Service getDiscovery:", error);
            throw error;
        }
    },

   // 2. Prende i cani dell'utente loggato
    getMieiCani: async () => {
        try {
            const response = await fetch(`${API_URL}/miei`, {
                method: 'GET',
                headers: getAuthHeader() // CORRETTO: rimosso 's' finale
            });
            if (!response.ok) throw new Error('Errore nel caricamento dei tuoi cani');
            return await response.json();
        } catch (error) {
            console.error("Service getMieiCani:", error);
            throw error;
        }
    },

   // 3. Aggiunge un nuovo cane
    aggiungiCane: async (datiCane) => {
        try {
            const response = await fetch(`${API_URL}/`, {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify(datiCane)
            });
            return await response.json();
        } catch (error) {
            console.error("Service aggiungiCane:", error);
            throw error;
        }
    },

    // 4. Aggiorna un cane esistente
    aggiornaCane: async (id, datiAggiornati) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: getAuthHeader(),
                body: JSON.stringify(datiAggiornati)
            });
            return await response.json();
        } catch (error) {
            console.error("Service aggiornaCane:", error);
            throw error;
        }
    },

    // 5. Elimina un cane
    eliminaCane: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader()
            });
            return await response.json();
        } catch (error) {
            console.error("Service eliminaCane:", error);
            throw error;
        }
    }
};