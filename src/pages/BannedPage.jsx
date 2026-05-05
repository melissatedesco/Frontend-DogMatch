const BannedPage = ({ user, onLogout }) => {
    const [messaggio, setMessaggio] = useState('')
    const [inviato, setInviato] = useState(false)

    const handleInviaTicket = async (e) => {
        e.preventDefault()

        // qui chiami il servizio ticket
        console.log("Ricorso inviato da:", user.email, "Messaggio:", messaggio)
        setInviato(true)
    }

    return (
        <div className="d-flex align-items-center justify-content-center
         min-vh-100 bg-light">
            <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5"
                style={{
                    maxWidth: "500px"
                }}>
                <div className="text-center mb-4">
                    <div className="display-1 text-danger">
                        ⚠️
                    </div>

                    <h2 className="fw-bold mt-3">
                        ACCOUNT SOSPESO</h2>
                    <p className="text-muted">
                        Ciao <strong>{user.nome || user.name}</strong>, purtroppo il tuo accesso è stato limitato.
                    </p>
                </div>

                {!inviato ? (
                    <form onSubmit={handleInviaTicket}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold text-secondary">
                                RICORSO ALL'AMMINISTRATORE</label>
                            <textarea
                                className="form-control border-0 bg-light p-3"
                                rows="5"
                                placeholder="Spiega brevemente il motivo del ricorso o chiedi chiarimenti..."
                                value={messaggio}
                                onChange={(e) => setMessaggio(e.target.value)}
                                required
                                style={{ borderRadius: "15px" }}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-info w-100 py-3 rounded-pill 
                            text-white fw-bold shadow-sm"
                            style={{
                                backgroundColor: "#82c1cf",
                                borderColor: "#82c1cf"
                            }}
                        >
                            Invia Richiesta
                        </button>
                    </form>
                ) : (
                    <div className="alert alert-success rounded-4 text-center py-4">
                        <h5 className="alert-heading">
                            Inviato!</h5>
                        <p className="mb-0">La tua richiesta è stata presa in carico.
                            Verrai ricontattato via email.</p>
                    </div>
                )}

                <div className="text-center mt-4">
                    <button onClick={onLogout}
                        className="btn btn-link text-decoration-none text-muted small">
                        Torna al Login
                    </button>
                </div>
            </div>
        </div>
    );
}
export default BannedPage;