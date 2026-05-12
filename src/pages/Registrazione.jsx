import { useState, useRef } from "react";

const Registrazione = ({ onSwitch, onRegisterSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    telefono: "",
    citta: "",
    caneNome: "",
    caneRazza: "",
    caneEta: "",
    canePeso: "",
    caneSesso: "M",
    caneTaglia: "Media",
    pedigreeDoc: null,
    fotoCane: null,
    fotoUtente: null,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Anteprima foto cane
  const [fotoPreview, setFotoPreview] = useState(null);
  const fotoInputRef = useRef(null);
  // Anteprima foto utente
  const [fotoUtentePreview, setFotoUtentePreview] = useState(null);
  const fotoUtenteInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "fotoCane" && files && files[0]) {
      setFormData({ ...formData, fotoCane: files[0] });
      setFotoPreview(URL.createObjectURL(files[0]));
    } else if (name === "fotoUtente" && files && files[0]) {
      setFormData({ ...formData, fotoUtente: files[0] });
      setFotoUtentePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: files ? files[0] : value });
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === "citta") return; // gestito separatamente come posizione
      let value = formData[key];
      if (key === "caneEta" || key === "canePeso") value = Number(value);
      if (value !== null && value !== undefined) dataToSend.append(key, value);
    });
    dataToSend.append("posizione", JSON.stringify({ citta: formData.citta || "Non specificata" }));

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: dataToSend,
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        alert("Benvenuto a bordo! 🐾");
        if (onRegisterSuccess) onRegisterSuccess(result.user);
      } else {
        const msg = result.errors ? result.errors[0].msg : (result.errore || "Registrazione fallita");
        const detail = result.dettaglio ? `\n(${result.dettaglio})` : "";
        alert(`Errore: ${msg}${detail}`);
      }
    } catch (error) {
      console.error("Errore di rete:", error);
      alert("Server non raggiungibile.");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = formData.password !== "" && formData.password === confirmPassword;
  const confirmTouched = confirmPassword !== "";

  const inputStyle = {
    borderRadius: "25px",
    border: "1.5px solid #b8dde6",
    backgroundColor: "#f0f9fa",
    padding: "0.45rem 1rem",
  };

  const labelStyle = {
    color: "#222",
    fontSize: "0.72rem",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "4px",
    display: "block",
  };

  const StepIndicator = () => (
    <div className="d-flex align-items-center justify-content-center gap-0 mb-4">
      {/* step 1 */}
      <div className="d-flex flex-column align-items-center">
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: "linear-gradient(135deg, #7FBCC8, #5aaabb)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: "700", fontSize: "14px",
          boxShadow: step === 1 ? "0 0 0 4px rgba(127,188,200,0.25)" : "none",
        }}>
          {step > 1 ? <i className="bi bi-check-lg" /> : "1"}
        </div>
        <span style={{ fontSize: "10px", color: "#7FBCC8", fontWeight: "600", marginTop: "4px" }}>I TUOI DATI</span>
      </div>

      {/* linea */}
      <div style={{ width: "60px", height: "2px", background: step === 2 ? "linear-gradient(90deg, #7FBCC8, #EFA6BA)" : "#ddd", margin: "0 6px", marginBottom: "20px" }} />

      {/* step 2 */}
      <div className="d-flex flex-column align-items-center">
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: step === 2 ? "linear-gradient(135deg, #EFA6BA, #e08aaa)" : "#e0e0e0",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: "700", fontSize: "14px",
          boxShadow: step === 2 ? "0 0 0 4px rgba(239,166,186,0.25)" : "none",
        }}>
          2
        </div>
        <span style={{ fontSize: "10px", color: step === 2 ? "#EFA6BA" : "#aaa", fontWeight: "600", marginTop: "4px" }}>IL TUO CANE</span>
      </div>
    </div>
  );

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center px-3 py-5"
      style={{ background: "linear-gradient(135deg, #e4f4f8 0%, #fdedf4 100%)" }}
    >
      <div className="card border-0 shadow-lg" style={{ borderRadius: "30px", maxWidth: "500px", width: "100%", overflow: "hidden", backgroundColor: "#f5f5f5" }}>

        <div style={{ height: "7px", background: "linear-gradient(90deg, #7FBCC8, #EFA6BA)" }} />

        <div className="px-4 pt-4 pb-4">
          <div className="text-center mb-3">
            <img src="/src/assets/logo.png" alt="DogMatch" style={{ height: "60px", marginBottom: "8px" }} />
            <h2 className="fw-bold mb-0" style={{ color: "#7FBCC8" }}>Unisciti al DogMatch</h2>
            <p className="small mb-0" style={{ color: "#EFA6BA" }}>Crea il tuo profilo certificato</p>
          </div>

          <StepIndicator />

          {/* ── STEP 1: I TUOI DATI ── */}
          {step === 1 && (
            <form onSubmit={handleNext}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #7FBCC8, transparent)" }} />
                <span className="small fw-bold" style={{ color: "#7FBCC8", letterSpacing: "1px" }}>I TUOI DATI</span>
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(270deg, #7FBCC8, transparent)" }} />
              </div>

              {/* Foto profilo utente */}
              <div className="mb-4 text-center">
                <div
                  className="position-relative d-inline-block"
                  onClick={() => fotoUtenteInputRef.current.click()}
                  style={{ cursor: "pointer" }}
                >
                  {fotoUtentePreview ? (
                    <div style={{
                      background: "linear-gradient(135deg, #7FBCC8, #EFA6BA)",
                      borderRadius: "50%", padding: "3px", display: "inline-block",
                      boxShadow: "0 4px 16px rgba(127,188,200,0.35)",
                    }}>
                      <img
                        src={fotoUtentePreview}
                        alt="Foto profilo"
                        className="rounded-circle"
                        style={{ width: "88px", height: "88px", objectFit: "cover", display: "block", backgroundColor: "#f0f9fa" }}
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: 94, height: 94, borderRadius: "50%",
                      background: "linear-gradient(135deg, #d0ecf8, #90cce0)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 4px 16px rgba(127,188,200,0.3)",
                    }}>
                      <i className="bi bi-person-fill" style={{ fontSize: "44px", color: "#5b85b8" }} />
                    </div>
                  )}
                  <div
                    className="position-absolute bottom-0 end-0 rounded-circle shadow d-flex align-items-center justify-content-center"
                    style={{ width: "30px", height: "30px", backgroundColor: "#EFA6BA", border: "2px solid white", zIndex: 2 }}
                  >
                    <i className="bi bi-camera-fill" style={{ fontSize: "13px", color: "white" }} />
                  </div>
                </div>
                <input ref={fotoUtenteInputRef} name="fotoUtente" type="file" accept="image/*" className="d-none" onChange={handleChange} />
                <p className="small mt-2 mb-0" style={{ color: "#7FBCC8" }}>Foto profilo (opzionale)</p>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>NOME</label>
                  <input name="nome" type="text" className="form-control" style={inputStyle} value={formData.nome} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>COGNOME</label>
                  <input name="cognome" type="text" className="form-control" style={inputStyle} value={formData.cognome} onChange={handleChange} required />
                </div>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>EMAIL</label>
                <input name="email" type="email" className="form-control" style={inputStyle} value={formData.email} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label style={labelStyle}>PASSWORD</label>
                <div className="position-relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    style={{ ...inputStyle, paddingRight: "2.8rem" }}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(prev => !prev)}
                    style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#7FBCC8", fontSize: "1rem", userSelect: "none" }}
                  >
                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"} />
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>CONFERMA PASSWORD</label>
                <div className="position-relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    style={{
                      ...inputStyle,
                      paddingRight: "2.8rem",
                      border: confirmTouched
                        ? `1.5px solid ${passwordsMatch ? "#28a745" : "#dc3545"}`
                        : inputStyle.border,
                    }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ripeti la password"
                    required
                  />
                  <span
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    style={{ position: "absolute", right: "0.9rem", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#7FBCC8", fontSize: "1rem", userSelect: "none" }}
                  >
                    <i className={showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"} />
                  </span>
                  {confirmTouched && passwordsMatch && (
                    <span style={{ position: "absolute", right: "2.4rem", top: "50%", transform: "translateY(-50%)", color: "#28a745", fontSize: "0.9rem" }}>
                      <i className="bi bi-check-circle-fill" />
                    </span>
                  )}
                </div>
                {confirmTouched && !passwordsMatch && (
                  <p className="mb-0 mt-1" style={{ color: "#dc3545", fontSize: "0.75rem", paddingLeft: "0.8rem" }}>
                    Le password non coincidono
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label style={labelStyle}>TELEFONO</label>
                <input name="telefono" type="text" className="form-control" style={inputStyle} value={formData.telefono} onChange={handleChange} required />
              </div>

              <div className="mb-4">
                <label style={labelStyle}>CITTÀ</label>
                <input name="citta" type="text" className="form-control" style={inputStyle} value={formData.citta} onChange={handleChange} placeholder="es. Roma" required />
              </div>

              <button
                type="submit"
                disabled={!passwordsMatch}
                className="btn w-100 text-white rounded-pill fw-bold py-2 mb-3 shadow-sm"
                style={{ backgroundColor: passwordsMatch ? "#7FBCC8" : "#aaa", border: "none", transition: "background-color 0.2s" }}
              >
                Avanti <i className="bi bi-arrow-right ms-1" />
              </button>

              <div className="text-center">
                <button className="btn btn-link btn-sm p-0 fw-bold" style={{ color: "#7FBCC8", textDecoration: "none" }} onClick={() => onSwitch("login")}>
                  Hai già un account? Accedi
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 2: IL TUO CANE ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #EFA6BA, transparent)" }} />
                <span className="small fw-bold" style={{ color: "#EFA6BA", letterSpacing: "1px" }}>IL TUO CANE</span>
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(270deg, #EFA6BA, transparent)" }} />
              </div>

              {/* Foto del cane */}
              <div className="mb-4 text-center">
                <label style={labelStyle}>FOTO DEL CANE</label>
                <div
                  className="position-relative d-inline-block"
                  onClick={() => fotoInputRef.current.click()}
                  style={{ cursor: "pointer" }}
                >
                  <div style={{
                    background: "linear-gradient(180deg, #7FBCC8 0%, #5aaabb 100%)",
                    borderRadius: "50%", padding: "4px", display: "inline-block",
                    boxShadow: "0 4px 16px rgba(127,188,200,0.4)",
                  }}>
                    <img
                      src={fotoPreview || "https://cdn-icons-png.flaticon.com/512/6073/6073873.png"}
                      alt="Foto cane"
                      className="rounded-circle"
                      style={{ width: "110px", height: "110px", objectFit: "cover", display: "block", backgroundColor: "#f0f9fa" }}
                    />
                  </div>
                  <div
                    className="position-absolute bottom-0 end-0 rounded-circle shadow d-flex align-items-center justify-content-center"
                    style={{ width: "34px", height: "34px", backgroundColor: "#7FBCC8", border: "2px solid white" }}
                  >
                    <i className="bi bi-camera-fill" style={{ fontSize: "14px", color: "white" }}></i>
                  </div>
                </div>
                <input ref={fotoInputRef} name="fotoCane" type="file" accept="image/*" className="d-none" onChange={handleChange} />
                <p className="small mt-2 mb-0" style={{ color: "#7FBCC8" }}>Tocca per aggiungere una foto</p>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>NOME DEL CANE</label>
                <input name="caneNome" type="text" className="form-control" style={inputStyle} value={formData.caneNome} onChange={handleChange} required />
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label style={labelStyle}>ETÀ (ANNI)</label>
                  <input name="caneEta" type="number" className="form-control" style={inputStyle} value={formData.caneEta} onChange={handleChange} required />
                </div>
                <div className="col-md-4 mb-3">
                  <label style={labelStyle}>PESO (KG)</label>
                  <input name="canePeso" type="number" className="form-control" style={inputStyle} value={formData.canePeso} onChange={handleChange} required />
                </div>
                <div className="col-md-4 mb-3">
                  <label style={labelStyle}>SESSO</label>
                  <select name="caneSesso" className="form-select" style={inputStyle} value={formData.caneSesso} onChange={handleChange}>
                    <option value="M">Maschio</option>
                    <option value="F">Femmina</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>TAGLIA</label>
                <select name="caneTaglia" className="form-select" style={inputStyle} value={formData.caneTaglia} onChange={handleChange}>
                  <option value="Piccola">Piccola</option>
                  <option value="Media">Media</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>

              <div className="mb-3">
                <label style={labelStyle}>RAZZA DEL TUO CANE</label>
                <input
                  name="caneRazza"
                  type="text"
                  className="form-control"
                  style={inputStyle}
                  value={formData.caneRazza}
                  onChange={handleChange}
                  placeholder="es. Pastore Tedesco"
                  required
                />
              </div>

              <div className="mb-4 rounded-4 text-center p-3" style={{ border: "2px dashed #7FBCC8", backgroundColor: "#f0f9fa" }}>
                <p className="small fw-bold mb-1" style={{ color: "#7FBCC8" }}>Carica il Certificato di Pedigree</p>
                <input name="pedigreeDoc" type="file" className="form-control form-control-sm" style={{ borderRadius: "20px" }} onChange={handleChange} required />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn rounded-pill fw-bold py-2 shadow-sm"
                  style={{ backgroundColor: "#7FBCC8", border: "none", color: "white", width: "40%" }}
                  onClick={() => setStep(1)}
                >
                  <i className="bi bi-arrow-left me-1" /> Indietro
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn text-white rounded-pill fw-bold py-2 shadow-sm"
                  style={{ backgroundColor: "#7FBCC8", border: "none", flex: 1 }}
                >
                  {loading ? "Invio in corso..." : "Invia Richiesta"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registrazione;
