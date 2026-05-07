const API = '/api/notifiche';
const auth = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

export const fetchNotifiche = async (limit = 20) => {
    const res = await fetch(`${API}?limit=${limit}`, { headers: auth() });
    if (!res.ok) throw new Error('Errore recupero notifiche');
    return res.json();
};

export const segnaNotificaLetta = async (id) => {
    await fetch(`${API}/${id}/letto`, { method: 'PATCH', headers: auth() });
};

export const segnaAllNotificheLette = async () => {
    await fetch(`${API}/segna-tutte-lette`, { method: 'PATCH', headers: auth() });
};
