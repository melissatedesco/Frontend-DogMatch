const API_URL = '/api/notifiche';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export const fetchNotifiche = async () => {
  try {
    const response = await fetch(API_URL, { headers: getAuthHeader() });
    return await response.json();
  } catch {
    return { successo: false, notifiche: [] };
  }
};

export const segnaNotificaLetta = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}/letto`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    return await response.json();
  } catch { /* silent */ }
};

export const segnaAllNotificheLette = async () => {
  try {
    const response = await fetch(`${API_URL}/segna-tutte-lette`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    return await response.json();
  } catch { /* silent */ }
};
