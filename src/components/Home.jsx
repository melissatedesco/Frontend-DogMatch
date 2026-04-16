import MatchRequestCard from "./MatchCane"
import BreedSelector from "./Razza"

const Home = ({dogs, loading, breed, setBreed, setSelectedDog, handleAcceptMatch, setDogs, user}) => {

    return (
        <div className="container-fluid p-0">

            {/* filtri razza */}
               <div className="d-flex gap-2 overflow-auto pb-2 no-scrollbar">
             
                    <BreedSelector setBreed={setBreed} 
                    currentBreed={breed} />
                </div> 

                <h4 className="fw-bold mb-4">Consigliati per te</h4>
               
                {/* Griglia dei cani - due colonne */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success">
                             </div>
                </div>
                    ) : (
                        // griglia principale: tre card per riga su desktop
                        <div className="row g-4">
                            {dogs.map((dog) => (
                                <div className="col-12 col-md-6 col-lg-4" 
                                key={dog.id}>
                                    <MatchRequestCard
                                    dog={dog}
                                    user={user}
                                    onView={(dog) => setSelectedDog(dog)}
                                    onAccept={() => handleAcceptMatch(dog.id)}
                                    onReject={(id) => setDogs(dogs.filter(d => d.id !== id))}
                                    />
                                    </div>
                            ))}
                            </div>
                    )}
        </div>

    )
}

export default Home