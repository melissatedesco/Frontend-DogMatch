import MatchList from "./ListaRichieste";

const Messaggi = ({matches, onBack}) => {
    
    return (
        <div className="container py-2">
            <div className="bg-white rounded-4 shadow-lg d-flex"
               style={{
                    height: "80vh",
                    overflow:'hidden'
                  }}>

                    {/* sidebar con la lista dei match */}
                  <div className="col-4 border-end bg-light d-none d-md-block">
                    <div className="p-3 border-bottom bg-white d-flex justify-content-center">
                      <h5 className="fw-bold mb-0">Messaggi</h5>
                     <button className="btn btn-sm btn-light d-md-none"
                     onClick={onBack}>
                        <i className="bi bi-arrow-left"></i>
                        </button> 
                      </div>
                      <div className="overflow-auto"
                      style={{
                        height: 'calc(80vh - 65px)'
                      }}>
                      <MatchList matches={matches} />
                    </div>
                  </div>

                  {/* Area conversazione */}
                  <div className="col-12 col-md-8 d-flex flex-column justify-content-center align-items-center text-center p-4 bg-white">
                    <div className="m-auto">

                   
                    <i className="bi bi-chat-dots text-success mb-3"
                      style={{
                        fontSize: "4rem",
                        opacity:'0.7'
                      }}
                    ></i>
                  <h4 className="fw-bold mb-3"> Le tue converazioni</h4>
                  <p className="text-muted mb-0"
                  style={{
                    maxWidth:'450px',
                    fontSize: '1.1rem'
                  }}>
                    Seleziona un match per discutere i dettagli del Pedigree e organizzare l'incontro per il tuo cane
                  </p>

                  {/* bottone visibile solo su mobile */}
                  <button className="btn btn-success d-md-none mt-4 px-4 rounded-pill"
                  onClick={onBack}>
                    <i className="bi bi-arrow-left me-2"></i>
                  </button>
                  </div>
                </div>
                 </div>
              </div>
    )
}

export default Messaggi