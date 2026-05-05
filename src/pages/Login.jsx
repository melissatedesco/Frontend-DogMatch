import { useState } from "react";

const Login = ({ onLogin, onSwitch }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 const handleFormSubmit = async () => {
    setError(""); 

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // --- QUESTA È LA PARTE DA CORREGGERE ---
        localStorage.setItem("token", data.token);
        
        // Salviamo i dati usando il nome 'user' (come nel tuo controller)
        localStorage.setItem("user", JSON.stringify(data.user));

        // Passiamo data.user alla funzione onLogin
        onLogin(data.user); 
        // ---------------------------------------
      } else {
        // Qui gestisci l'errore che arriva dal backend (es: "Credenziali non valide")
        setError(data.errore || "Credenziali non valide");
      }
    } catch (err) {
      // Questo interviene se il server è offline
      setError("Il server non risponde. Riprova più tardi.");
    }
  };
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center px-3"
      style={{
        background: "linear-gradient(135deg, #e8f4f8 0%, #f5f5f5 40%, #fdedf4 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* bolle decorative "smoke" */}
      <div style={{
        position: "absolute", top: "-80px", left: "-80px",
        width: "320px", height: "320px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(127,188,200,0.18) 0%, transparent 70%)",
        filter: "blur(30px)",
      }} />
      <div style={{
        position: "absolute", bottom: "-60px", right: "-60px",
        width: "280px", height: "280px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(239,166,186,0.18) 0%, transparent 70%)",
        filter: "blur(30px)",
      }} />
      <div style={{
        position: "absolute", top: "40%", left: "60%",
        width: "200px", height: "200px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,220,230,0.15) 0%, transparent 70%)",
        filter: "blur(40px)",
      }} />

      {/* Card */}
      <div
        style={{
          borderRadius: "28px",
          maxWidth: "400px",
          width: "100%",
          padding: "2.2rem 2rem",
          backgroundColor: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 8px 40px rgba(127,188,200,0.18), 0 2px 12px rgba(0,0,0,0.06)",
          border: "1px solid rgba(255,255,255,0.7)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="text-center mb-4">
          <img src="/src/assets/logo.png" alt="DogMatch" style={{ height: "52px", marginBottom: "10px" }} />
          <h2 className="fw-bold mb-1" style={{ color: "#444", fontSize: "1.6rem" }}>
            Bentornato
          </h2>
          <p className="text-muted small mb-0">
            Accedi per gestire i match del tuo cane
          </p>
        </div>

        {error && (
          <div className="alert alert-danger small py-2 text-center rounded-pill border-0 mb-3">
            {error}
          </div>
        )}

        <div className="mb-3">
          <input
            type="email"
            className="form-control rounded-pill py-2 px-4"
            style={{ backgroundColor: "rgba(240,249,250,0.8)", border: "1.5px solid #d4eaf0", boxShadow: "none" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>

        <div className="mb-4">
          <input
            type="password"
            className="form-control rounded-pill py-2 px-4"
            style={{ backgroundColor: "rgba(240,249,250,0.8)", border: "1.5px solid #d4eaf0", boxShadow: "none" }}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn w-100 text-white rounded-pill fw-bold py-2 mb-3"
          style={{ backgroundColor: "#7FBCC8", border: "none", boxShadow: "0 4px 14px rgba(127,188,200,0.45)" }}
          onClick={handleFormSubmit}
        >
          Accedi
        </button>

        <div className="text-center">
          <span className="small text-muted">Non hai un account? </span>
          <button
            className="btn btn-link btn-sm p-0 fw-bold"
            style={{ color: "#EFA6BA", textDecoration: "none" }}
            onClick={() => onSwitch("register")}
          >
            Registrati ora
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
