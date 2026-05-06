import MatchRequestCard from "../components/MatchCane"
import BreedSelector from "../data/Razza"

const INTENTI = [
    { value: "",              label: "Tutti" },
    { value: "gioco",         label: "Gioco" },
    { value: "accoppiamento", label: "Accoppiamento" },
];

const DISTANZE = [
    { value: "",         label: "Tutta Italia" },
    { value: "provincia", label: "Provincia" },
    { value: "regione",   label: "Regione" },
];

const FilterPill = ({ options, current, onChange }) => (
    <div className="d-flex gap-2 flex-wrap">
        {options.map(o => (
            <button
                key={o.value}
                className="btn btn-sm rounded-pill px-3 fw-semibold"
                style={{
                    backgroundColor: current === o.value ? "#7FBCC8" : "#f0f2f5",
                    color:           current === o.value ? "white"    : "#555",
                    border: "none",
                    fontSize: "0.82rem",
                    transition: "all 0.15s"
                }}
                onClick={() => onChange(o.value)}
            >
                {o.label}
            </button>
        ))}
    </div>
);

const Home = ({ dogs, loading, breed, setBreed, setSelectedDog, handleAcceptMatch, handleRejectDog, user,
                filtroIntento, setFiltroIntento, filtroDistanza, setFiltroDistanza }) => {

    return (
        <div className="container-fluid p-0">
            {/* filtri razza */}
            <div className="d-flex gap-2 overflow-auto pb-2 no-scrollbar">
                <BreedSelector setBreed={setBreed} currentBreed={breed} user={user} />
            </div>

            {/* filtri discovery */}
            <div className="bg-white rounded-4 shadow-sm p-3 mb-4 d-flex flex-wrap gap-3 align-items-center"
                style={{ border: "1px solid #e8f4f8" }}>
                <div className="d-flex align-items-center gap-2">
                    <span className="small fw-bold text-muted" style={{ whiteSpace: "nowrap" }}>Intento:</span>
                    <FilterPill options={INTENTI} current={filtroIntento} onChange={setFiltroIntento} />
                </div>
                <div className="d-flex align-items-center gap-2">
                    <span className="small fw-bold text-muted" style={{ whiteSpace: "nowrap" }}>Distanza:</span>
                    <FilterPill options={DISTANZE} current={filtroDistanza} onChange={setFiltroDistanza} />
                </div>
            </div>

            <h4 className="fw-bold mb-4">Consigliati per te</h4>
            
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-success"></div>
                </div>
            ) : dogs.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    <i className="bi bi-search d-block mb-3" style={{ fontSize: "3rem", opacity: 0.3 }} />
                    <p className="fw-semibold mb-1">Nessun cane trovato</p>
                    <p className="small">
                        {breed
                            ? <>Nessun risultato per <strong>{breed}</strong>. Prova a cambiare razza o <button className="btn btn-link btn-sm p-0" onClick={() => setBreed("")}>mostra tutti</button>.</>
                            : "Hai già visto tutti i cani disponibili. Torna più tardi!"}
                    </p>
                </div>
            ) : (
                <div className="row g-4">
                    {dogs.map((dog) => (
                        <div className="col-12 col-md-6 col-lg-4" key={dog.id}>
                            <MatchRequestCard
                                dog={dog}
                                user={user}
                                onView={(dog) => setSelectedDog(dog)}
                                onAccept={() => handleAcceptMatch(dog.id)}
                                onReject={handleRejectDog}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home