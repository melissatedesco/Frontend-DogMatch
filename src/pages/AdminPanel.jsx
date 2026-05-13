import { useState, useEffect } from "react";

const PLACEHOLDER_USER = "https://cdn-icons-png.flaticon.com/512/6073/6073873.png";
const PLACEHOLDER_DOG  = "https://cdn-icons-png.flaticon.com/512/616/616408.png";

const buildImgUrl = (raw, fallback) => {
  if (!raw || raw === 'default-user.png' || raw === 'default-dog.png') return fallback;
  if (raw.startsWith("http")) return raw;
  return `/uploads/${raw.replace("uploads/", "")}`;
};

const AdminPanel = ({ onBack }) => {
  const [vista,      setVista]      = useState("utenti"); // "utenti" | "cani"
  const [utenti,     setUtenti]     = useState([]);
  const [cani,       setCani]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [savingId,   setSavingId]   = useState(null);
  const [blockingId, setBlockingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filtro,     setFiltro]     = useState("tutti");

  const token = localStorage.getItem("token");

  const fetchUtenti = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/utenti", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.successo) setUtenti(data.utenti);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const fetchCani = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/cani", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.successo) setCani(data.cani);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchUtenti();
    fetchCani();
  }, []);

  const toggleVerifica = async (id, current) => {
    setSavingId(id);
    try {
      await fetch(`/api/admin/utenti/${id}/verifica`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ isVerificato: !current })
      });
      setUtenti(prev => prev.map(u => u.id === id ? { ...u, isVerificato: !current } : u));
    } catch { /* silent */ } finally { setSavingId(null); }
  };

  const toggleBlocco = async (id) => {
    setBlockingId(id);
    try {
      const res  = await fetch(`/api/admin/utenti/${id}/blocco`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.successo) setUtenti(prev => prev.map(u => u.id === id ? { ...u, isBloccato: data.isBloccato } : u));
    } catch { /* silent */ } finally { setBlockingId(null); }
  };

  const eliminaUtente = async (id) => {
    if (!window.confirm("Eliminare questo utente? L'azione non è reversibile.")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/utenti/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setUtenti(prev => prev.filter(u => u.id !== id));
      setCani(prev => prev.filter(c => c.Utente?.id !== id));
    } catch { /* silent */ } finally { setDeletingId(null); }
  };

  const eliminaCane = async (id) => {
    if (!window.confirm("Eliminare questo cane? L'azione non è reversibile.")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/cani/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setCani(prev => prev.filter(c => c.id !== id));
    } catch { /* silent */ } finally { setDeletingId(null); }
  };

  const stats = {
    totalUtenti:   utenti.length,
    verificati:    utenti.filter(u => u.isVerificato).length,
    daVerificare:  utenti.filter(u => !u.isVerificato && (u.iMieiCani?.[0]?.documenti?.length ?? 0) > 0).length,
    bloccati:      utenti.filter(u => u.isBloccato).length,
    totalCani:     cani.length,
  };

  const filteredUtenti = utenti
    .filter(u => {
      if (filtro === "daVerificare") return !u.isVerificato && (u.iMieiCani?.[0]?.documenti?.length ?? 0) > 0;
      if (filtro === "verificati")   return u.isVerificato;
      if (filtro === "bloccati")     return u.isBloccato;
      return true;
    })
    .filter(u =>
      u.nome?.toLowerCase().includes(search.toLowerCase()) ||
      u.cognome?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    );

  const filteredCani = cani.filter(c =>
    c.nome?.toLowerCase().includes(search.toLowerCase()) ||
    c.razza?.toLowerCase().includes(search.toLowerCase()) ||
    c.Utente?.nome?.toLowerCase().includes(search.toLowerCase()) ||
    c.Utente?.cognome?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: "#1c1e21" }}>
            <i className="bi bi-shield-lock-fill me-2" style={{ color: "#7FBCC8" }} />
            Pannello Moderatore
          </h4>
          <p className="text-muted small mb-0">Gestisci utenti e cani registrati</p>
        </div>
        <button className="btn btn-sm rounded-pill px-3 fw-bold"
          style={{ backgroundColor: "#f0f2f5", color: "#555", border: "none" }}
          onClick={onBack}>
          <i className="bi bi-arrow-left me-1" />Torna alla home
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: "Utenti totali",  value: stats.totalUtenti,   color: "#7FBCC8", icon: "bi-people-fill",       id: "tutti" },
          { label: "Verificati",     value: stats.verificati,    color: "#28a745", icon: "bi-patch-check-fill",  id: "verificati" },
          { label: "In attesa",      value: stats.daVerificare,  color: "#f0a500", icon: "bi-hourglass-split",   id: "daVerificare" },
          { label: "Bloccati",       value: stats.bloccati,      color: "#dc3545", icon: "bi-slash-circle-fill", id: "bloccati" },
        ].map(s => (
          <div className="col-3" key={s.id}>
            <div
              className="bg-white rounded-4 p-3 shadow-sm text-center"
              style={{ cursor: "pointer", border: filtro === s.id ? `2px solid ${s.color}` : "2px solid transparent", transition: "border 0.2s" }}
              onClick={() => { setFiltro(filtro === s.id ? "tutti" : s.id); setVista("utenti"); }}
            >
              <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: "1.4rem" }} />
              <p className="fw-bold mb-0 mt-1" style={{ fontSize: "1.5rem", color: "#1c1e21" }}>{s.value}</p>
              <p className="text-muted small mb-0">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-3">
        {[
          { id: "utenti", label: "Utenti", icon: "bi-people-fill",     count: stats.totalUtenti },
          { id: "cani",   label: "Cani",   icon: "bi-balloon-heart-fill", count: stats.totalCani },
        ].map(t => (
          <button key={t.id}
            className="btn btn-sm rounded-pill px-4 fw-bold"
            onClick={() => { setVista(t.id); setSearch(""); setFiltro("tutti"); }}
            style={{
              backgroundColor: vista === t.id ? "#7FBCC8" : "#f0f2f5",
              color: vista === t.id ? "white" : "#555",
              border: "none",
              fontSize: "0.85rem"
            }}>
            <i className={`bi ${t.icon} me-1`} />{t.label}
            <span className="ms-2 badge rounded-pill"
              style={{ backgroundColor: vista === t.id ? "rgba(255,255,255,0.3)" : "#ddd", color: vista === t.id ? "white" : "#555", fontSize: "0.7rem" }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Ricerca */}
      <div className="mb-3 position-relative">
        <i className="bi bi-search position-absolute" style={{ left: "16px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
        <input
          type="text"
          className="form-control rounded-pill ps-5"
          style={{ border: "1.5px solid #d0e8ed", backgroundColor: "#f7fbfc", color: "#1c1e21" }}
          placeholder={vista === "utenti" ? "Cerca per nome o email..." : "Cerca per nome cane, razza o proprietario..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border spinner-border-sm me-2" role="status" />
          Caricamento...
        </div>
      ) : vista === "utenti" ? (

        /* ── LISTA UTENTI ── */
        filteredUtenti.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox d-block mb-2" style={{ fontSize: "2rem" }} />
            Nessun utente trovato
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {filteredUtenti.map(utente => {
              const cane        = utente.iMieiCani?.[0];
              const hasPedigree = !!(cane?.pedigreeUrl ?? cane?.pedigree_url);
              const borderColor = utente.isBloccato ? "#f5c6cb" : utente.isVerificato ? "#c3e6cb" : hasPedigree ? "#ffc107" : "#e9ecef";

              return (
                <div key={utente.id}
                  className="bg-white rounded-4 p-3 shadow-sm d-flex align-items-center gap-3"
                  style={{ border: `1.5px solid ${borderColor}` }}>

                  <img
                    src={buildImgUrl(utente.fotoUrl ?? utente.foto_url, PLACEHOLDER_USER)}
                    onError={(e) => { e.target.src = PLACEHOLDER_USER; }}
                    style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", border: "2px solid #7FBCC8", flexShrink: 0 }}
                  />

                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="fw-bold" style={{ color: "#1c1e21" }}>{utente.nome} {utente.cognome}</span>
                      {utente.ruolo === 'admin' && (
                        <span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: "#7FBCC8", color: "white", fontSize: "0.65rem" }}>
                          <i className="bi bi-shield-fill me-1" />Admin
                        </span>
                      )}
                      {utente.isBloccato && (
                        <span className="badge rounded-pill text-white px-2 py-1" style={{ backgroundColor: "#dc3545", fontSize: "0.65rem" }}>
                          <i className="bi bi-slash-circle-fill me-1" />Bloccato
                        </span>
                      )}
                      {utente.isVerificato ? (
                        <span className="badge rounded-pill text-white px-2 py-1" style={{ backgroundColor: "#28a745", fontSize: "0.65rem" }}>
                          <i className="bi bi-patch-check-fill me-1" />Verificato
                        </span>
                      ) : hasPedigree ? (
                        <span className="badge rounded-pill text-white px-2 py-1" style={{ backgroundColor: "#f0a500", fontSize: "0.65rem" }}>
                          <i className="bi bi-hourglass-split me-1" />Pedigree caricato
                        </span>
                      ) : (
                        <span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: "#f0f2f5", color: "#aaa", fontSize: "0.65rem" }}>
                          Nessun pedigree
                        </span>
                      )}
                    </div>
                    <p className="text-muted small mb-0" style={{ fontSize: "0.82rem" }}>{utente.email}</p>
                    {cane && (
                      <p className="small mb-0" style={{ color: "#7FBCC8", fontSize: "0.8rem" }}>
                        <i className="bi bi-balloon-heart-fill me-1" />{cane.nome} · {cane.razza}
                        {hasPedigree && (
                          <span className="ms-2 text-success">
                            <i className="bi bi-file-earmark-check-fill me-1" />Pedigree allegato
                          </span>
                        )}
                      </p>
                    )}
                    {!cane && (
                      <p className="small mb-0 text-muted" style={{ fontSize: "0.8rem" }}>
                        <i className="bi bi-dash-circle me-1" />Nessun cane registrato
                      </p>
                    )}
                  </div>

                  <div className="d-flex flex-column gap-2 flex-shrink-0">
                    <button
                      className="btn btn-sm rounded-pill fw-bold px-3"
                      disabled={savingId === utente.id}
                      onClick={() => toggleVerifica(utente.id, utente.isVerificato)}
                      style={{
                        backgroundColor: utente.isVerificato ? "#fff3f3" : "#7FBCC8",
                        color: utente.isVerificato ? "#dc3545" : "white",
                        border: utente.isVerificato ? "1.5px solid #f5c6cb" : "none",
                        fontSize: "0.8rem", minWidth: "90px"
                      }}>
                      {savingId === utente.id
                        ? <span className="spinner-border spinner-border-sm" role="status" />
                        : utente.isVerificato
                          ? <><i className="bi bi-x-circle me-1" />Revoca</>
                          : <><i className="bi bi-patch-check me-1" />Verifica</>
                      }
                    </button>
                    {utente.ruolo !== 'admin' && (
                      <>
                        <button
                          className="btn btn-sm rounded-pill fw-bold px-3"
                          disabled={blockingId === utente.id}
                          onClick={() => toggleBlocco(utente.id, utente.isBloccato)}
                          style={{
                            backgroundColor: utente.isBloccato ? "#e8f5e9" : "#fff3f3",
                            color: utente.isBloccato ? "#28a745" : "#dc3545",
                            border: utente.isBloccato ? "1.5px solid #c3e6cb" : "1.5px solid #f5c6cb",
                            fontSize: "0.8rem", minWidth: "90px"
                          }}>
                          {blockingId === utente.id
                            ? <span className="spinner-border spinner-border-sm" role="status" />
                            : utente.isBloccato
                              ? <><i className="bi bi-unlock me-1" />Sblocca</>
                              : <><i className="bi bi-slash-circle me-1" />Blocca</>
                          }
                        </button>
                        <button
                          className="btn btn-sm rounded-pill fw-bold px-3"
                          disabled={deletingId === utente.id}
                          onClick={() => eliminaUtente(utente.id)}
                          style={{ backgroundColor: "#fff3f3", color: "#dc3545", border: "1.5px solid #f5c6cb", fontSize: "0.8rem", minWidth: "90px" }}>
                          {deletingId === utente.id
                            ? <span className="spinner-border spinner-border-sm" role="status" />
                            : <><i className="bi bi-trash me-1" />Elimina</>
                          }
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )

      ) : (

        /* ── LISTA CANI ── */
        filteredCani.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-inbox d-block mb-2" style={{ fontSize: "2rem" }} />
            Nessun cane trovato
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {filteredCani.map(cane => {
              const hasPedigree = !!(cane.pedigreeUrl ?? cane.pedigree_url);

              return (
                <div key={cane.id}
                  className="bg-white rounded-4 p-3 shadow-sm d-flex align-items-center gap-3"
                  style={{ border: `1.5px solid ${hasPedigree ? "#ffc107" : "#e9ecef"}` }}>

                  <img
                    src={buildImgUrl(cane.fotoUrl ?? cane.foto_url, PLACEHOLDER_DOG)}
                    onError={(e) => { e.target.src = PLACEHOLDER_DOG; }}
                    style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", border: "2px solid #EFA6BA", flexShrink: 0 }}
                  />

                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="fw-bold" style={{ color: "#1c1e21" }}>{cane.nome}</span>
                      <span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: "#f0f2f5", color: "#555", fontSize: "0.65rem" }}>
                        {cane.razza}
                      </span>
                      <span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: cane.sesso === "M" ? "#d0e8f7" : "#fce4ec", color: "#444", fontSize: "0.65rem" }}>
                        {cane.sesso === "M" ? "Maschio" : "Femmina"}
                      </span>
                      {hasPedigree && (
                        <span className="badge rounded-pill text-white px-2 py-1" style={{ backgroundColor: "#f0a500", fontSize: "0.65rem" }}>
                          <i className="bi bi-file-earmark-check-fill me-1" />Pedigree
                        </span>
                      )}
                    </div>
                    <p className="text-muted small mb-0" style={{ fontSize: "0.82rem" }}>
                      {cane.eta} {cane.eta === 1 ? "anno" : "anni"} · {cane.peso} kg · {cane.taglia}
                    </p>
                    {cane.proprietario && (
                      <p className="small mb-0" style={{ color: "#7FBCC8", fontSize: "0.8rem" }}>
                        <i className="bi bi-person-fill me-1" />
                        {cane.proprietario.nome} {cane.proprietario.cognome}
                        <span className="text-muted ms-1">· {cane.proprietario.email}</span>
                      </p>
                    )}
                  </div>

                  <div className="d-flex flex-column gap-2 flex-shrink-0">
                    <button
                      className="btn btn-sm rounded-pill fw-bold px-3"
                      disabled={deletingId === cane.id}
                      onClick={() => eliminaCane(cane.id)}
                      style={{ backgroundColor: "#fff3f3", color: "#dc3545", border: "1.5px solid #f5c6cb", fontSize: "0.8rem", minWidth: "90px" }}>
                      {deletingId === cane.id
                        ? <span className="spinner-border spinner-border-sm" role="status" />
                        : <><i className="bi bi-trash me-1" />Elimina</>
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default AdminPanel;
