import MatchRequestCard from "../components/MatchCane"
import BreedSelector from "../data/Razza"

const Home = ({dogs, loading, breed, setBreed, setSelectedDog, handleAcceptMatch, handleRejectDog, user}) => {
    
    return (
        <div className="container-fluid p-0">
            {/* filtri razza */}
            <div className="d-flex gap-2 overflow-auto pb-2 no-scrollbar">
                <BreedSelector setBreed={setBreed} currentBreed={breed} user={user} />
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