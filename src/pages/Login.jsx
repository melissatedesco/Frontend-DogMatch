import { useState, useRef } from "react";

const buildImgUrl = (fotoUrl) => {
  if (!fotoUrl) return null;
  if (fotoUrl.startsWith("http")) return fotoUrl;
  return `/uploads/${fotoUrl.replace("uploads/", "").replace("/uploads/", "")}`;
};

const Login = ({ onLogin, onSwitch }) => {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [error, setError]           = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar]         = useState(null);   // { fotoUrl, nome }
  const [avatarLoading, setAvatarLoading] = useState(false);
  const debounceRef = useRef(null);

  // Carica avatar dopo un breve debounce sull'email
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (avatar) setAvatar(null);
    clearTimeout(debounceRef.current);
    if (!val.includes("@")) return;
    debounceRef.current = setTimeout(async () => {
      setAvatarLoading(true);
      try {
        const res  = await fetch(`/api/auth/avatar?email=${encodeURIComponent(val)}`);
        const data = await res.json();
        if (data.trovato) setAvatar(data);
      } catch { /* silent */ } finally {
        setAvatarLoading(false);
      }
    }, 600);
  };

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
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.errore || "Credenziali non valide");
      }
    } catch {
      setError("Il server non risponde. Riprova più tardi.");
    }
  };

  const photoSrc = avatar?.fotoUrl ? buildImgUrl(avatar.fotoUrl) : null;

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center px-3"
      style={{
        background: "linear-gradient(135deg, #e8f4f8 0%, #f5f5f5 40%, #fdedf4 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* bolle decorative */}
      <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(127,188,200,0.18) 0%, transparent 70%)", filter: "blur(30px)" }} />
      <div style={{ position: "absolute", bottom: "-60px", right: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(239,166,186,0.18) 0%, transparent 70%)", filter: "blur(30px)" }} />
      <div style={{ position: "absolute", top: "40%", left: "60%", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,220,230,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />

      {/* Card */}
      <div style={{
        borderRadius: "28px", maxWidth: "400px", width: "100%", padding: "2.2rem 2rem",
        backgroundColor: "rgba(255,255,255,0.75)", backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: "0 8px 40px rgba(127,188,200,0.18), 0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid rgba(255,255,255,0.7)", position: "relative", zIndex: 1,
      }}>

        {/* Avatar circolare — elemento visivo dominante */}
        <div className="text-center" style={{ marginBottom: "1.4rem" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            {photoSrc ? (
              <div style={{
                background: "linear-gradient(135deg, #7FBCC8, #EFA6BA)",
                borderRadius: "50%", padding: "4px", display: "inline-block",
                boxShadow: "0 6px 28px rgba(127,188,200,0.45)",
              }}>
                <img
                  src={photoSrc}
                  alt="Foto profilo"
                  onError={e => { e.target.style.display = 'none'; }}
                  style={{
                    width: "130px", height: "130px", borderRadius: "50%",
                    objectFit: "cover", display: "block", backgroundColor: "#f0f9fa",
                    transition: "opacity 0.25s", opacity: avatarLoading ? 0.5 : 1,
                  }}
                />
              </div>
            ) : (
              <div style={{
                width: 134, height: 134, borderRadius: "50%",
                background: "linear-gradient(135deg, #d0ecf8, #90cce0)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 6px 28px rgba(127,188,200,0.35)",
              }}>
                <i className="bi bi-person-fill" style={{ fontSize: "64px", color: "#5b85b8" }} />
              </div>
            )}
            {avatarLoading && (
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.5)"
              }}>
                <div className="spinner-border" style={{ color: "#7FBCC8", width: "1.8rem", height: "1.8rem" }} />
              </div>
            )}
          </div>

          {avatar?.nome ? (
            <div style={{ marginTop: "10px", fontWeight: 700, color: "#444", fontSize: "1rem" }}>
              Ciao, {avatar.nome}!
            </div>
          ) : (
            <div style={{ marginTop: "10px" }}>
              <img src="/src/assets/logo.png" alt="DogMatch" style={{ height: "32px", opacity: 0.85 }} />
            </div>
          )}
        </div>

        <h2 className="fw-bold mb-1 text-center" style={{ color: "#444", fontSize: "1.4rem" }}>Bentornato</h2>
        <p className="text-muted small mb-3 text-center">Accedi per gestire i match del tuo cane</p>

        {error && (
          <div className="alert alert-danger small py-2 text-center rounded-pill border-0 mb-3">{error}</div>
        )}

        <div className="mb-3">
          <input
            type="email"
            className="form-control rounded-pill py-2 px-4"
            style={{ backgroundColor: "rgba(240,249,250,0.8)", border: "1.5px solid #d4eaf0", boxShadow: "none" }}
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
          />
        </div>

        <div className="mb-4 position-relative">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control rounded-pill py-2 px-4"
            style={{ backgroundColor: "rgba(240,249,250,0.8)", border: "1.5px solid #d4eaf0", boxShadow: "none", paddingRight: "3rem" }}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleFormSubmit()}
          />
          <span
            onClick={() => setShowPassword(prev => !prev)}
            style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#7FBCC8", fontSize: "1.1rem", userSelect: "none" }}
          >
            <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"} />
          </span>
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
