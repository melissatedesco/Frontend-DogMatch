import { useState } from "react";
import AdminHome from "./AdminHome";
import MatchRequestCard from "../components/MatchCane";
import BarraRicercaRazza from "../components/BarraRicercaRazza";
import MappaRicerca from "../components/MappaRicerca";

const INTENTI = [
  { value: "",              label: "Tutti" },
  { value: "gioco",         label: "Gioco" },
  { value: "accoppiamento", label: "Cerca compagno" },
];

const DISTANZE_BASE = [
  { value: "",          label: "Tutta Italia" },
  { value: "provincia", label: "Provincia" },
  { value: "regione",   label: "Regione" },
];

const DISTANZE_KM = [
  { value: "5",  label: "5 km" },
  { value: "10", label: "10 km" },
  { value: "50", label: "50 km" },
];

const FilterPill = ({ options, current, onChange }) => (
  <div className="d-flex gap-2 flex-wrap">
    {options.map(o => (
      <button
        key={o.value}
        className="btn btn-sm rounded-pill px-3 fw-semibold"
        style={{
          backgroundColor: current === o.value ? "#7FBCC8" : "#f0f2f5",
          color:           current === o.value ? "white"   : "#555",
          border: "none",
          fontSize: "0.82rem",
          transition: "all 0.15s",
        }}
        onClick={() => onChange(o.value)}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const NoCanePrompt = ({ onNavigate }) => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "55vh" }}>
    <div
      className="text-center p-5 rounded-4 shadow-sm"
      style={{ maxWidth: "420px", backgroundColor: "white", border: "1.5px solid #f0e8f5" }}
    >
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🐾</div>
      <h5 className="fw-bold mb-2" style={{ color: "#1c1e21" }}>Aggiungi il tuo cane!</h5>
      <p className="text-muted small mb-4">
        Per vedere altri cani della stessa razza devi prima registrare il tuo.
        Vai al profilo e aggiungi il tuo amico a quattro zampe!
      </p>
      <button
        className="btn fw-bold text-white rounded-pill px-5 py-2"
        style={{ backgroundColor: "#EFA6BA", border: "none", fontSize: "0.95rem" }}
        onClick={() => onNavigate("profile")}
      >
        <i className="bi bi-plus-circle-fill me-2" />Aggiungi il tuo cane
      </button>
    </div>
  </div>
);

const EmptyFeed = ({ feedError, caneRazza, filtroIntento }) => {
  if (feedError === "errore_server") {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-wifi-off d-block mb-3" style={{ fontSize: "3rem", opacity: 0.3 }} />
        <p className="fw-semibold mb-1">Connessione assente</p>
        <p className="small">Errore di connessione al server. Riprova più tardi.</p>
      </div>
    );
  }
  if (filtroIntento === "accoppiamento") {
    const razza = caneRazza || "cani della stessa razza";
    return (
      <div className="text-center py-5 text-muted">
        <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem", opacity: 0.6 }}>🐕</div>
        <p className="fw-semibold mb-1">Nessun {razza} compatibile nei paraggi</p>
        <p className="small">
          Al momento non ci sono altri <strong>{razza}</strong> di sesso opposto disponibili.
          <br />Prova a cambiare zona o invita un amico!
        </p>
      </div>
    );
  }
  return (
    <div className="text-center py-5 text-muted">
      <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem", opacity: 0.6 }}>🐕</div>
      <p className="fw-semibold mb-1">Nessun cane disponibile</p>
      <p className="small">
        Non ci sono altri cani da scoprire in questo momento.
        <br />Prova a cambiare filtro o invita un amico!
      </p>
    </div>
  );
};

const Home = ({
  dogs, loading, feedError, setSelectedDog, handleAcceptMatch, handlePlayClick, user,
  filtroIntento, setFiltroIntento, filtroDistanza, setFiltroDistanza, onNavigate,
  hasLocation, selectedCaneIdx, onSwitchCane, onlineMap = {},
}) => {
  const [localSearch, setLocalSearch] = useState("");
  const [vistaM, setVistaM]           = useState("lista");

  if (user?.ruolo === "admin") {
    return <AdminHome onNavigate={onNavigate} />;
  }

  const caniUtente = user?.iMieiCani ?? [];
  const activeCane = caniUtente[selectedCaneIdx] ?? caniUtente[0];
  const caneRazza  = activeCane?.razza ?? null;

  if (!loading && feedError === "nessun_cane") {
    return <NoCanePrompt onNavigate={onNavigate} />;
  }

  return (
    <div className="container-fluid p-0">

      {/* Selettore cane attivo (solo se l'utente ha più cani) */}
      {caniUtente.length > 1 && (
        <div
          className="bg-white rounded-4 shadow-sm p-3 mb-3 d-flex align-items-center gap-3 flex-wrap"
          style={{ border: "1px solid #e8f4f8" }}
        >
          <span className="small fw-bold text-muted" style={{ whiteSpace: "nowrap" }}>
            <i className="bi bi-balloon-heart me-1" style={{ color: "#EFA6BA" }} />Stai cercando per:
          </span>
          <div className="d-flex gap-2 flex-wrap">
            {caniUtente.map((cane, idx) => (
              <button
                key={cane.id}
                className="btn btn-sm rounded-pill px-3 fw-semibold"
                style={{
                  backgroundColor: idx === selectedCaneIdx ? "#EFA6BA" : "#f0f2f5",
                  color:           idx === selectedCaneIdx ? "white"   : "#555",
                  border: "none",
                  fontSize: "0.82rem",
                }}
                onClick={() => onSwitchCane(idx)}
              >
                {cane.nome}
                <span style={{ opacity: 0.75, fontWeight: 400 }}> · {cane.razza}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filtri */}
      <div
        className="bg-white rounded-4 shadow-sm p-3 mb-4 d-flex flex-wrap gap-3 align-items-center"
        style={{ border: "1px solid #e8f4f8" }}
      >
        <div className="d-flex align-items-center gap-2">
          <span className="small fw-bold text-muted" style={{ whiteSpace: "nowrap" }}>Intento:</span>
          <FilterPill options={INTENTI} current={filtroIntento} onChange={setFiltroIntento} />
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="small fw-bold text-muted" style={{ whiteSpace: "nowrap" }}>Distanza:</span>
          <FilterPill options={DISTANZE_BASE} current={filtroDistanza} onChange={setFiltroDistanza} />
          {hasLocation && (
            <>
              <span className="text-muted small" style={{ opacity: 0.4 }}>|</span>
              <FilterPill options={DISTANZE_KM} current={filtroDistanza} onChange={setFiltroDistanza} />
            </>
          )}
          {!hasLocation && (
            <span className="small text-muted" style={{ opacity: 0.55, fontStyle: "italic" }}>
              <i className="bi bi-geo-alt me-1" />Abilita posizione per filtri km
            </span>
          )}
        </div>
      </div>

      {/* Titolo + toggle vista + ricerca */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <h4 className="fw-bold mb-0">
          {filtroIntento === "accoppiamento" && caneRazza
            ? <>{caneRazza} <span className="fw-normal text-muted" style={{ fontSize: "1rem" }}>— cerca compagno</span></>
            : <span className="text-muted fw-normal" style={{ fontSize: "1rem" }}>Scopri nuovi amici</span>
          }
        </h4>
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex rounded-pill overflow-hidden" style={{ border: "1.5px solid #e0eef2" }}>
            {[{ v: "lista", icon: "bi-grid-3x3-gap-fill" }, { v: "mappa", icon: "bi-map-fill" }].map(({ v, icon }) => (
              <button
                key={v}
                onClick={() => setVistaM(v)}
                style={{
                  padding: "5px 14px",
                  border: "none",
                  backgroundColor: vistaM === v ? "#7FBCC8" : "white",
                  color:           vistaM === v ? "white"   : "#8A9A9D",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <i className={`bi ${icon}`} />
              </button>
            ))}
          </div>
          {vistaM === "lista" && (
            <BarraRicercaRazza
              caneRazza={caneRazza}
              isAdmin={false}
              onSearch={setLocalSearch}
            />
          )}
        </div>
      </div>

      {/* Contenuto */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: "#EFA6BA" }} />
        </div>
      ) : vistaM === "mappa" ? (
        <MappaRicerca
          dogs={dogs}
          activeDog={activeCane}
          onAccept={handleAcceptMatch}
          onPlay={handlePlayClick}
        />
      ) : dogs.length === 0 ? (
        <EmptyFeed feedError={feedError} caneRazza={caneRazza} filtroIntento={filtroIntento} />
      ) : (
        <div className="row g-4">
          {dogs
            .filter(dog =>
              !localSearch ||
              dog.name?.toLowerCase().includes(localSearch.toLowerCase())
            )
            .map((dog) => (
              <div className="col-12 col-md-6 col-lg-4" key={dog.id}>
                <MatchRequestCard
                  dog={dog}
                  activeDog={activeCane}
                  onView={(d) => setSelectedDog(d)}
                  onAccept={() => handleAcceptMatch(dog.id)}
                  onPlay={() => handlePlayClick(dog.id)}
                  isOnline={!!(dog.proprietarioId && onlineMap[dog.proprietarioId])}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Home;
