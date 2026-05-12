import { useState, useEffect } from "react";
import BarraRicercaRazza from "../components/BarraRicercaRazza";

const PLACEHOLDER = "https://cdn-icons-png.flaticon.com/512/616/616408.png";

const buildImgUrl = (raw) => {
  if (!raw || raw === 'default-dog.png') return PLACEHOLDER;
  if (raw.startsWith("http")) return raw;
  return `/uploads/${raw.replace("uploads/", "")}`;
};

const StatCard = ({ icon, color, label, value, loading }) => (
  <div className="col-12 col-sm-4">
    <div className="bg-white rounded-4 p-3 shadow-sm text-center" style={{ border: `2px solid ${color}22` }}>
      <i className={`bi ${icon}`} style={{ color, fontSize: "1.6rem" }} />
      <p className="fw-bold mb-0 mt-1" style={{ fontSize: "1.8rem", color: "#1c1e21" }}>
        {loading ? <span className="spinner-border spinner-border-sm" role="status" /> : value}
      </p>
      <p className="text-muted small mb-0">{label}</p>
    </div>
  </div>
);

const FILTRI = [
  { id: 'tutti',          label: 'Tutti',                icon: 'bi-grid-fill' },
  { id: 'non_verificati', label: 'In attesa approv.',    icon: 'bi-hourglass-split' },
  { id: 'segnalati',      label: 'Segnalati',            icon: 'bi-flag-fill' },
];

const AdminHome = ({ onNavigate }) => {
  const [cani,        setCani]        = useState([]);
  const [stats,       setStats]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [filtro,      setFiltro]      = useState("tutti");
  const [deletingId,  setDeletingId]  = useState(null);
  const [segnandoId,  setSegnandoId]  = useState(null);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [statsRes, caniRes] = await Promise.all([
          fetch("/api/admin/stats", { headers }),
          fetch("/api/cani/all",    { headers }),
        ]);
        const statsData = await statsRes.json();
        const caniData  = await caniRes.json();
        if (statsData.successo) setStats(statsData.stats);
        if (caniData.successo)  setCani(caniData.cani);
        else console.error("[AdminHome] /api/cani/all error:", caniData);
      } catch (err) {
        console.error("[AdminHome] fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const eliminaCane = async (id) => {
    if (!window.confirm("Eliminare questo cane? L'azione non è reversibile.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/cani/${id}`, { method: "DELETE", headers });
      const data = await res.json();
      if (data.successo) {
        setCani(prev => prev.filter(c => c.id !== id));
        setStats(prev => prev ? { ...prev, cani: prev.cani - 1 } : prev);
      }
    } catch { /* silent */ } finally { setDeletingId(null); }
  };

  const toggleSegnalazione = async (id) => {
    setSegnandoId(id);
    try {
      const res = await fetch(`/api/admin/cani/${id}/segnalazione`, { method: "PUT", headers });
      const data = await res.json();
      if (data.successo) {
        setCani(prev => prev.map(c => c.id === id ? { ...c, isSegnalato: data.isSegnalato } : c));
      }
    } catch { /* silent */ } finally { setSegnandoId(null); }
  };

  const filtered = cani
    .filter(c => {
      if (filtro === 'non_verificati') return !(c.proprietario?.isVerificato || c.proprietario?.is_verificato);
      if (filtro === 'segnalati')      return !!c.isSegnalato;
      return true;
    })
    .filter(c =>
      c.nome?.toLowerCase().includes(search.toLowerCase()) ||
      c.razza?.toLowerCase().includes(search.toLowerCase()) ||
      c.proprietario?.nome?.toLowerCase().includes(search.toLowerCase()) ||
      c.proprietario?.cognome?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="container-fluid p-0">

      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: "#1c1e21" }}>
            <i className="bi bi-shield-lock-fill me-2" style={{ color: "#7FBCC8" }} />
            Dashboard Admin
          </h4>
          <p className="text-muted small mb-0">Panoramica della piattaforma</p>
        </div>
        <button
          className="btn btn-sm rounded-pill px-3 fw-bold"
          style={{ backgroundColor: "#7FBCC8", color: "white", border: "none" }}
          onClick={() => onNavigate("admin")}
        >
          <i className="bi bi-sliders me-1" />Pannello completo
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <StatCard icon="bi-balloon-heart-fill" color="#EFA6BA" label="Cani iscritti"     value={stats?.cani}   loading={loading} />
        <StatCard icon="bi-people-fill"         color="#7FBCC8" label="Utenti registrati" value={stats?.utenti} loading={loading} />
        <StatCard icon="bi-stars"               color="#f0a500" label="Match totali"       value={stats?.match}  loading={loading} />
      </div>

      {/* Barra ricerca + filtri */}
      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
        <h5 className="fw-bold mb-0 me-auto" style={{ color: "#1c1e21" }}>
          Tutti i cani
          {!loading && (
            <span className="ms-2 badge rounded-pill fw-normal"
              style={{ backgroundColor: "#f0f2f5", color: "#555", fontSize: "0.75rem" }}>
              {filtered.length}
            </span>
          )}
        </h5>

        {/* Filtri */}
        <div className="d-flex gap-2 flex-wrap">
          {FILTRI.map(f => (
            <button
              key={f.id}
              className="btn btn-sm rounded-pill fw-semibold px-3"
              style={{
                backgroundColor: filtro === f.id ? (f.id === 'segnalati' ? '#dc3545' : '#7FBCC8') : '#f0f2f5',
                color: filtro === f.id ? 'white' : '#555',
                border: 'none',
                fontSize: '0.8rem'
              }}
              onClick={() => setFiltro(f.id)}
            >
              <i className={`bi ${f.icon} me-1`} />{f.label}
            </button>
          ))}
        </div>

        {/* Ricerca per razza */}
        <BarraRicercaRazza
          isAdmin={true}
          onSearch={razza => setSearch(razza || "")}
        />
      </div>

      {/* Grid cani */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: "#7FBCC8" }} role="status" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-inbox d-block mb-2" style={{ fontSize: "2.5rem", opacity: 0.3 }} />
          <p className="fw-semibold mb-1">Nessun cane trovato</p>
          {filtro !== 'tutti' && (
            <p className="small">
              <button className="btn btn-link btn-sm p-0" onClick={() => setFiltro('tutti')}>
                Mostra tutti i cani
              </button>
            </p>
          )}
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map(cane => (
            <div className="col-12 col-md-6 col-lg-4" key={cane.id}>
              <div
                className="bg-white rounded-4 p-3 shadow-sm h-100 d-flex flex-column gap-2"
                style={{ border: `1.5px solid ${cane.isSegnalato ? '#f5c6cb' : '#f0e0e8'}` }}
              >
                {/* Foto + Nome */}
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={buildImgUrl(cane.fotoUrl ?? cane.foto_url)}
                    onError={e => { e.target.src = PLACEHOLDER; }}
                    style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", border: "2px solid #EFA6BA", flexShrink: 0 }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div className="d-flex align-items-center gap-1 flex-wrap">
                      <span className="fw-bold text-truncate" style={{ color: "#1c1e21" }}>{cane.nome}</span>
                      {cane.isSegnalato && (
                        <span className="badge rounded-pill text-white px-2" style={{ backgroundColor: "#dc3545", fontSize: "0.6rem" }}>
                          <i className="bi bi-flag-fill me-1" />Segnalato
                        </span>
                      )}
                      {(cane.proprietario?.isVerificato || cane.proprietario?.is_verificato) ? (
                        <span className="badge rounded-pill text-white px-2" style={{ backgroundColor: "#28a745", fontSize: "0.6rem" }}>
                          <i className="bi bi-patch-check-fill me-1" />Verificato
                        </span>
                      ) : (
                        <span className="badge rounded-pill px-2" style={{ backgroundColor: "#fff3cd", color: "#856404", fontSize: "0.6rem" }}>
                          <i className="bi bi-hourglass-split me-1" />Non verif.
                        </span>
                      )}
                    </div>
                    {cane.proprietario && (
                      <div className="text-truncate" style={{ fontSize: "0.78rem", color: "#7FBCC8" }}>
                        <i className="bi bi-person-fill me-1" />
                        {cane.proprietario.nome} {cane.proprietario.cognome}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dettagli */}
                <div className="d-flex gap-2 flex-wrap">
                  <span className="badge rounded-pill" style={{ backgroundColor: "#f0f2f5", color: "#555", fontSize: "0.7rem" }}>
                    {cane.razza}
                  </span>
                  <span className="badge rounded-pill" style={{ backgroundColor: "#e8f4f8", color: "#7FBCC8", fontSize: "0.7rem" }}>
                    {cane.eta} {cane.eta === 1 ? "anno" : "anni"}
                  </span>
                  <span className="badge rounded-pill" style={{ backgroundColor: cane.sesso === "M" ? "#d0e8f7" : "#fce4ec", color: "#444", fontSize: "0.7rem" }}>
                    {cane.sesso === "M" ? "♂" : "♀"} {cane.sesso === "M" ? "Maschio" : "Femmina"}
                  </span>
                </div>

                {/* Azioni */}
                <div className="d-flex gap-2 mt-auto flex-wrap">
                  <button
                    className="btn btn-sm rounded-pill fw-bold flex-fill"
                    style={{ backgroundColor: "#7FBCC8", color: "white", border: "none", fontSize: "0.78rem" }}
                    onClick={() => onNavigate("admin")}
                  >
                    <i className="bi bi-pencil-fill me-1" />Gestisci
                  </button>
                  <button
                    className="btn btn-sm rounded-pill fw-bold flex-fill"
                    disabled={segnandoId === cane.id}
                    style={{
                      backgroundColor: cane.isSegnalato ? "#e8f5e9" : "#fff8e1",
                      color: cane.isSegnalato ? "#28a745" : "#856404",
                      border: cane.isSegnalato ? "1.5px solid #c3e6cb" : "1.5px solid #ffd700",
                      fontSize: "0.78rem"
                    }}
                    onClick={() => toggleSegnalazione(cane.id, cane.isSegnalato)}
                  >
                    {segnandoId === cane.id
                      ? <span className="spinner-border spinner-border-sm" role="status" />
                      : cane.isSegnalato
                        ? <><i className="bi bi-flag me-1" />Rimuovi segnalaz.</>
                        : <><i className="bi bi-flag-fill me-1" />Segna</>
                    }
                  </button>
                  <button
                    className="btn btn-sm rounded-pill fw-bold px-3"
                    disabled={deletingId === cane.id}
                    style={{ backgroundColor: "#fff3f3", color: "#dc3545", border: "1.5px solid #f5c6cb", fontSize: "0.78rem" }}
                    onClick={() => eliminaCane(cane.id)}
                  >
                    {deletingId === cane.id
                      ? <span className="spinner-border spinner-border-sm" role="status" />
                      : <i className="bi bi-trash" />
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminHome;
