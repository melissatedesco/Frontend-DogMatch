import { useState, useRef, useEffect } from "react";


const PLACEHOLDER_UTENTE = "https://cdn-icons-png.flaticon.com/512/6073/6073873.png";
const PLACEHOLDER_CANE   = "https://cdn-icons-png.flaticon.com/512/616/616408.png";

const buildImgUrl = (raw, placeholder) => {
  if (!raw || raw === 'default-user.png' || raw === 'default-dog.png') return placeholder;
  if (raw.startsWith("http")) return raw;
  return `/uploads/${raw.replace("uploads/", "").replace("/uploads/", "")}`;
};

const UserProfilo = ({ user: userProp, onUpdate, onLogout }) => {
  const [user, setUser] = useState(userProp);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving,  setIsSaving]  = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm,   setDeleteConfirm]   = useState("");
  const [isDeleting,      setIsDeleting]      = useState(false);

  // modal aggiungi/modifica cane
  const [showCaneModal,      setShowCaneModal]      = useState(false);
  const [caneModalModo,      setCaneModalModo]      = useState("add");
  const [caneModalId,        setCaneModalId]        = useState(null);
  const [caneModalNome,      setCaneModalNome]      = useState("");
  const [caneModalRazza,     setCaneModalRazza]     = useState("");
  const [caneModalSesso,     setCaneModalSesso]     = useState("M");
  const [caneModalEta,       setCaneModalEta]       = useState("");
  const [caneModalPeso,      setCaneModalPeso]      = useState("");
  const [caneModalTaglia,    setCaneModalTaglia]    = useState("Media");
  const [caneModalDesc,      setCaneModalDesc]      = useState("");
  const [caneModalDisp,      setCaneModalDisp]      = useState(false);
  const [caneModalSanitarie, setCaneModalSanitarie] = useState("");
  const [caneModalSaving,    setCaneModalSaving]    = useState(false);
  const [caneModalError,     setCaneModalError]     = useState("");

  // draft fields
  const [bioDraft,              setBioDraft]              = useState("");
  const [caneNomeDraft,         setCaneNomeDraft]         = useState("");
  const [caneBioDraft,          setCaneBioDraft]          = useState("");
  const [caneEtaDraft,          setCaneEtaDraft]          = useState("");
  const [canePesoDraft,         setCanePesoDraft]         = useState("");
  const [caneTagliaDraft,       setCaneTagliaDraft]       = useState("Media");
  const [caneSessoDraft,        setCaneSessoDraft]        = useState("M");
  const [caneDisponibilitaDraft,setCaneDisponibilitaDraft]= useState(false);
  const [caneInfoSanitarieDraft,setCaneInfoSanitarieDraft]= useState("");
  const [privacyEmailDraft,     setPrivacyEmailDraft]     = useState(true);
  const [privacyTelefonoDraft,  setPrivacyTelefonoDraft]  = useState(true);
  const [privacyEmail,          setPrivacyEmail]          = useState(user?.mostraEmail ?? true);
  const [privacyTelefono,       setPrivacyTelefono]       = useState(user?.mostraTelefono ?? true);
  const [privacyPosizione,      setPrivacyPosizione]      = useState(user?.mostraPosizione ?? true);

  // file uploads
  const [userPhotoFile,    setUserPhotoFile]    = useState(null);
  const [dogPhotoFile,     setDogPhotoFile]     = useState(null);
  const [pedigreeFile,     setPedigreeFile]     = useState(null);
  const [userPhotoPreview, setUserPhotoPreview] = useState(null);
  const [dogPhotoPreview,  setDogPhotoPreview]  = useState(null);

  const userPhotoRef = useRef(null);
  const dogPhotoRef  = useRef(null);
  const pedigreeRef  = useRef(null);

  useEffect(() => {
    const fetchProfilo = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/utenti/profilo", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.successo && data.profilo) {
          const profiloAggiornato = { ...data.profilo, iMieiCani: data.profilo.iMieiCani ?? [] };
          setUser(profiloAggiornato);
          localStorage.setItem("user", JSON.stringify(profiloAggiornato));
          if (onUpdate) onUpdate(profiloAggiornato);
        }
      } catch {
        // fallback: usa i dati già nel prop
      }
    };
    fetchProfilo();
  }, []);

  if (!user) return <div className="text-center mt-5">Caricamento...</div>;

  const cane        = user.iMieiCani?.[0] ?? null;
  const hasPedigree = (cane?.documenti?.length ?? 0) > 0;

  // badge dinamico
  const badgeConfig = user.isVerificato
    ? { bg: "#28a745", icon: "bi-patch-check-fill", label: "Profilo Verificato" }
    : hasPedigree
      ? { bg: "#f0a500", icon: "bi-hourglass-split",  label: "In Verifica" }
      : { bg: "#dc3545", icon: "bi-x-circle-fill",    label: "Non Verificato" };

  // completeness score 0–4
  let completenessScore = 0;
  if (cane?.descrizione?.trim())                              completenessScore++;
  if (cane?.fotoUrl && cane.fotoUrl !== 'default-dog.png')  completenessScore++;
  if (hasPedigree)                                            completenessScore++;
  if (cane?.infoSanitarie?.trim())                           completenessScore++;
  const completenessPercent = Math.round((completenessScore / 4) * 100);
  const completenessColor   = completenessPercent >= 75 ? "#28a745"
                            : completenessPercent >= 50 ? "#f0a500" : "#7FBCC8";

  const userFoto = buildImgUrl(user.fotoUrl ?? user.foto_url, PLACEHOLDER_UTENTE);
  const caneFoto = buildImgUrl(cane?.fotoUrl ?? cane?.foto_url, PLACEHOLDER_CANE);

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user.email) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/utenti/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.successo) {
        localStorage.clear();
        if (onLogout) onLogout();
      }
    } catch {
      alert("Errore durante l'eliminazione. Riprova.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrivacyToggle = async (field, value) => {
    const newEmail    = field === "email"    ? value : privacyEmail;
    const newTelefono = field === "telefono" ? value : privacyTelefono;
    if (field === "email")    setPrivacyEmail(value);
    else                      setPrivacyTelefono(value);
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("mostraEmail",    String(newEmail));
      fd.append("mostraTelefono", String(newTelefono));
      const res  = await fetch("/api/auth/update-profile", {
        method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: fd,
      });
      const data = await res.json();
      if (data.successo && onUpdate) onUpdate(data.user);
      else throw new Error();
    } catch {
      if (field === "email")    setPrivacyEmail(!value);
      else                      setPrivacyTelefono(!value);
    }
  };

  const handlePosizioneToggle = async (value) => {
    setPrivacyPosizione(value);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/utenti/posizione", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ mostraPosizione: value })
      });
      const data = await res.json();
      if (!data.successo) throw new Error();
    } catch {
      setPrivacyPosizione(!value);
    }
  };

  const openEdit = () => {
    setBioDraft(user.bio ?? "");
    setCaneNomeDraft(cane?.nome ?? "");
    setCaneBioDraft(cane?.descrizione ?? "");
    setCaneEtaDraft(cane?.eta ?? "");
    setCanePesoDraft(cane?.peso ?? "");
    setCaneTagliaDraft(cane?.taglia ?? "Media");
    setCaneSessoDraft(cane?.sesso ?? "M");
    setCaneDisponibilitaDraft(cane?.disponibilitaRiproduttiva ?? false);
    setCaneInfoSanitarieDraft(cane?.infoSanitarie ?? "");
    setPrivacyEmailDraft(user.mostraEmail !== false);
    setPrivacyTelefonoDraft(user.mostraTelefono !== false);
    setUserPhotoFile(null); setDogPhotoFile(null); setPedigreeFile(null);
    setUserPhotoPreview(null); setDogPhotoPreview(null);
    setSaveError("");
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError("");
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("bio", bioDraft);
      if (caneNomeDraft.trim())    fd.append("caneNome", caneNomeDraft.trim());
      fd.append("descrizione",      caneBioDraft);
      if (String(caneEtaDraft) !== "")  fd.append("caneEta",  caneEtaDraft);
      if (String(canePesoDraft) !== "") fd.append("canePeso", canePesoDraft);
      fd.append("caneTaglia",       caneTagliaDraft);
      fd.append("caneSesso",        caneSessoDraft);
      fd.append("disponibilitaRiproduttiva", String(caneDisponibilitaDraft));
      fd.append("infoSanitarie",    caneInfoSanitarieDraft);
      fd.append("mostraEmail",      String(privacyEmailDraft));
      fd.append("mostraTelefono",   String(privacyTelefonoDraft));
      if (userPhotoFile) fd.append("fotoUtente", userPhotoFile);
      if (dogPhotoFile)  fd.append("fotoCane",   dogPhotoFile);
      if (pedigreeFile)  fd.append("pedigreeDoc", pedigreeFile);

      const res  = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.successo) {
        const updatedUser = { ...data.user, iMieiCani: data.user.iMieiCani ?? [] };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        if (onUpdate) onUpdate(updatedUser);
        setPrivacyEmail(privacyEmailDraft);
        setPrivacyTelefono(privacyTelefonoDraft);
        setIsEditing(false);
      } else {
        setSaveError(data.dettaglio ?? data.errore ?? "Errore durante il salvataggio.");
      }
    } catch {
      setSaveError("Server non raggiungibile. Riprova più tardi.");
    } finally {
      setIsSaving(false);
    }
  };

  const refreshProfile = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/utenti/profilo", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (data.successo) {
      const updated = { ...data.profilo, iMieiCani: data.profilo.iMieiCani ?? [] };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      if (onUpdate) onUpdate(updated);
    }
  };

  const openAggiungiCane = () => {
    setCaneModalModo("add"); setCaneModalId(null);
    setCaneModalNome(""); setCaneModalRazza(""); setCaneModalSesso("M");
    setCaneModalEta(""); setCaneModalPeso(""); setCaneModalTaglia("Media");
    setCaneModalDesc(""); setCaneModalDisp(false); setCaneModalSanitarie("");
    setCaneModalError("");
    setShowCaneModal(true);
  };

  const openModificaCane = (c) => {
    setCaneModalModo("edit"); setCaneModalId(c.id);
    setCaneModalNome(c.nome ?? ""); setCaneModalRazza(c.razza ?? ""); setCaneModalSesso(c.sesso ?? "M");
    setCaneModalEta(c.eta ?? ""); setCaneModalPeso(c.peso ?? ""); setCaneModalTaglia(c.taglia ?? "Media");
    setCaneModalDesc(c.descrizione ?? ""); setCaneModalDisp(c.disponibilitaRiproduttiva ?? false);
    setCaneModalSanitarie(c.infoSanitarie ?? "");
    setCaneModalError("");
    setShowCaneModal(true);
  };

  const handleSalvaCane = async () => {
    if (!caneModalNome.trim() || !caneModalRazza.trim()) {
      setCaneModalError("Nome e razza sono obbligatori.");
      return;
    }
    setCaneModalSaving(true); setCaneModalError("");
    try {
      const token = localStorage.getItem("token");
      const url    = caneModalModo === "add" ? "/api/cani" : `/api/cani/${caneModalId}`;
      const method = caneModalModo === "add" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: caneModalNome.trim(), razza: caneModalRazza.trim(), sesso: caneModalSesso,
          eta: caneModalEta || null, peso: caneModalPeso || null, taglia: caneModalTaglia,
          descrizione: caneModalDesc, disponibilitaRiproduttiva: caneModalDisp,
          infoSanitarie: caneModalSanitarie,
        })
      });
      const data = await res.json();
      if (data.successo) { await refreshProfile(); setShowCaneModal(false); }
      else setCaneModalError(data.errore ?? data.dettaglio ?? "Errore durante il salvataggio.");
    } catch { setCaneModalError("Server non raggiungibile."); }
    finally { setCaneModalSaving(false); }
  };

  const handleEliminaCane = async (caneId) => {
    if (!window.confirm("Eliminare questo cane? L'azione non è reversibile.")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/cani/${caneId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      await refreshProfile();
    } catch { /* silent */ }
  };

  /* ── stili condivisi ── */
  const baseInput = {
    borderRadius: "12px", border: "1.5px solid #d0e8ed",
    backgroundColor: "#f7fbfc", color: "#1c1e21",
    padding: "0.5rem 0.75rem", fontSize: "0.9rem", width: "100%",
  };
  const inputStyle  = { ...baseInput, resize: "vertical" };
  const selectStyle = { ...baseInput, resize: "none" };
  const sectionLabel = { color: "#1c1e21", fontSize: "0.72rem", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" };

  return (
    <div style={{ background: "transparent", minHeight: "100vh", marginTop: "-1.5rem" }}>

      {/* ── COVER ── */}
      <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
        <div style={{
          height: "260px",
          background: "linear-gradient(135deg, #7FBCC8 0%, #a8d8e2 40%, #EFA6BA 100%)",
          borderRadius: "0 0 16px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        }} />

        {/* Avatars */}
        <div style={{ position: "absolute", bottom: "-60px", left: "28px", display: "flex", gap: "12px", alignItems: "flex-end" }}>

          {/* Foto utente */}
          <div style={{ position: "relative", cursor: isEditing ? "pointer" : "default" }}
               onClick={() => isEditing && userPhotoRef.current.click()}
               title={isEditing ? "Cambia foto profilo" : ""}>
            <div style={{ background: "linear-gradient(180deg,#7FBCC8,#EFA6BA)", borderRadius: "50%", padding: "4px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
              <img src={userPhotoPreview ?? userFoto} alt="Foto utente"
                   onError={(e) => { e.target.src = PLACEHOLDER_UTENTE; }}
                   style={{ width: "140px", height: "140px", borderRadius: "50%", objectFit: "cover", display: "block", border: "4px solid white" }} />
            </div>
            {isEditing && (
              <div style={{ position: "absolute", bottom: "8px", right: "4px", backgroundColor: "#7FBCC8", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>
                <i className="bi bi-camera-fill" style={{ color: "white", fontSize: "14px" }} />
              </div>
            )}
            <input ref={userPhotoRef} type="file" accept="image/*" className="d-none" onChange={(e) => { const f = e.target.files[0]; if (f) { setUserPhotoFile(f); setUserPhotoPreview(URL.createObjectURL(f)); }}} />
          </div>

          {/* Foto cane */}
          {cane && (
            <div style={{ position: "relative", cursor: isEditing ? "pointer" : "default" }}
                 onClick={() => isEditing && dogPhotoRef.current.click()}
                 title={isEditing ? "Cambia foto del cane" : ""}>
              <div style={{ background: "linear-gradient(180deg,#EFA6BA,#7FBCC8)", borderRadius: "50%", padding: "4px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
                <img src={dogPhotoPreview ?? caneFoto} alt={cane.nome}
                     onError={(e) => { e.target.src = PLACEHOLDER_CANE; }}
                     style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", display: "block", border: "3px solid white" }} />
              </div>
              {isEditing && (
                <div style={{ position: "absolute", bottom: "6px", right: "2px", backgroundColor: "#EFA6BA", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid white" }}>
                  <i className="bi bi-camera-fill" style={{ color: "white", fontSize: "12px" }} />
                </div>
              )}
              <div style={{ position: "absolute", bottom: "0", left: "50%", transform: "translateX(-50%)", backgroundColor: "white", borderRadius: "12px", padding: "1px 8px", fontSize: "11px", fontWeight: "700", color: "#EFA6BA", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", whiteSpace: "nowrap" }}>
                {cane.nome}
              </div>
              <input ref={dogPhotoRef} type="file" accept="image/*" className="d-none" onChange={(e) => { const f = e.target.files[0]; if (f) { setDogPhotoFile(f); setDogPhotoPreview(URL.createObjectURL(f)); }}} />
            </div>
          )}
        </div>

        {/* Bottoni cover */}
        <div style={{ position: "absolute", bottom: "16px", right: "16px", display: "flex", gap: "8px" }}>
          {isEditing ? (
            <>
              <button className="btn fw-bold rounded-pill px-3 py-1"
                style={{ backgroundColor: "rgba(255,255,255,0.85)", color: "#333", fontSize: "0.85rem", border: "none" }}
                onClick={() => setIsEditing(false)} disabled={isSaving}>Annulla</button>
              <button className="btn text-white fw-bold rounded-pill px-3 py-1"
                style={{ backgroundColor: "#7FBCC8", fontSize: "0.85rem", border: "none" }}
                onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Salvataggio..." : <><i className="bi bi-check-lg me-1" />Salva</>}
              </button>
            </>
          ) : (
            <>
              <button className="btn fw-bold rounded-pill px-3 py-1"
                style={{ backgroundColor: "rgba(255,255,255,0.85)", color: "#333", fontSize: "0.85rem", border: "none" }}
                onClick={openEdit}><i className="bi bi-pencil-fill me-1" />Modifica Profilo</button>
              <button className="btn text-white fw-bold rounded-pill px-3 py-1"
                style={{ backgroundColor: "#7FBCC8", fontSize: "0.85rem", border: "none" }}
                onClick={() => setShowPrivacyModal(true)}>
                <i className="bi bi-shield-lock-fill me-1" />Privacy</button>
            </>
          )}
        </div>
      </div>

      {/* ── NOME + BADGE ── */}
      <div style={{ maxWidth: "900px", margin: "0 auto", paddingTop: "72px", padding: "72px 28px 16px", backgroundColor: "white", borderRadius: "0 0 16px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h2 className="fw-bold mb-0" style={{ color: "#1c1e21" }}>{user.nome} {user.cognome}</h2>
        {cane && (
          <p className="mb-1" style={{ fontSize: "0.9rem", color: "#EFA6BA", fontWeight: 600 }}>
            <i className="bi bi-balloon-heart-fill me-1" />{cane.nome}
          </p>
        )}
        {user.posizione?.citta && user.posizione.citta !== "Non specificata" && (
          <p className="mb-2" style={{ fontSize: "0.85rem", color: "#7FBCC8" }}>
            <i className="bi bi-geo-alt-fill me-1" />{user.posizione.citta}
          </p>
        )}
        <div className="d-flex gap-2 flex-wrap align-items-center mt-1">
          <span className="badge rounded-pill px-3 py-2 text-white d-flex align-items-center gap-1"
            style={{ backgroundColor: badgeConfig.bg, fontSize: "0.75rem" }}>
            <i className={`bi ${badgeConfig.icon}`} /> {badgeConfig.label}
          </span>
          {hasPedigree && (
            <span className="badge rounded-pill px-3 py-2 text-white" style={{ backgroundColor: "#7FBCC8", fontSize: "0.75rem" }}>
              <i className="bi bi-award-fill me-1" />Pedigree Certificato
            </span>
          )}
          {completenessPercent >= 75 && (
            <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "#e8f7ee", color: "#28a745", fontSize: "0.75rem", border: "1px solid #c3e6cb" }}>
              <i className="bi bi-stars me-1" />Profilo Completo
            </span>
          )}
        </div>
      </div>

      {/* ── PANNELLO MODIFICA ── */}
      {isEditing && (
        <div style={{ maxWidth: "900px", margin: "16px auto 0", backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h6 className="fw-bold mb-4" style={{ color: "#1c1e21" }}>
            <i className="bi bi-pencil-square me-2" style={{ color: "#7FBCC8" }} />Modifica Profilo
          </h6>

          {/* Bio utente */}
          <div className="mb-4">
            <label className="form-label fw-bold small" style={{ color: "#555" }}>La tua Bio</label>
            <textarea rows={3} style={inputStyle} placeholder="Scrivi qualcosa su di te..."
              value={bioDraft} onChange={(e) => setBioDraft(e.target.value)} />
          </div>

          {cane && (
            <>
              <div className="d-flex align-items-center gap-2 mb-4">
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg,#EFA6BA,transparent)" }} />
                <span className="small fw-bold" style={{ color: "#EFA6BA", letterSpacing: "1px" }}>IL TUO CANE</span>
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(270deg,#EFA6BA,transparent)" }} />
              </div>

              {/* Foto del cane */}
              <div className="p-3 rounded-3 mb-3" style={{ border: "2px dashed #EFA6BA", backgroundColor: "#fff5f8" }}>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <img
                    src={dogPhotoPreview ?? caneFoto}
                    alt={cane.nome}
                    onError={(e) => { e.target.src = PLACEHOLDER_CANE; }}
                    style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover", border: "3px solid #EFA6BA" }}
                  />
                  <div className="flex-grow-1">
                    <p className="fw-bold small mb-0" style={{ color: "#EFA6BA" }}>
                      <i className="bi bi-camera-fill me-1" />Foto del Cane
                    </p>
                    <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>JPG, PNG — max 5 MB</p>
                  </div>
                  <button type="button" className="btn btn-sm rounded-pill fw-bold"
                    style={{ backgroundColor: "#EFA6BA", color: "white", border: "none", fontSize: "0.8rem" }}
                    onClick={() => dogPhotoRef.current.click()}>
                    <i className="bi bi-upload me-1" />
                    {dogPhotoFile ? dogPhotoFile.name.slice(0, 20) + "…" : "Cambia foto"}
                  </button>
                </div>
                {dogPhotoFile && (
                  <p className="text-success small mt-2 mb-0">
                    <i className="bi bi-check-circle-fill me-1" />Pronto: {dogPhotoFile.name}
                  </p>
                )}
              </div>

              {/* Riga 1: nome + razza (readOnly) */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold small" style={{ color: "#555" }}>Nome del Cane</label>
                  <input type="text" style={{ ...inputStyle, resize: "none" }} value={caneNomeDraft}
                    onChange={(e) => setCaneNomeDraft(e.target.value)} placeholder="Nome del cane..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small" style={{ color: "#555" }}>Razza</label>
                  <input type="text" style={{ ...inputStyle, resize: "none", opacity: 0.6, cursor: "not-allowed" }}
                    value={cane.razza} readOnly />
                </div>
              </div>

              {/* Riga 2: età, peso, taglia, sesso */}
              <div className="row g-3 mb-3">
                <div className="col-6 col-md-3">
                  <label className="form-label fw-bold small" style={{ color: "#555" }}>Età (anni)</label>
                  <input type="number" min="0" max="30" style={{ ...inputStyle, resize: "none" }}
                    value={caneEtaDraft} onChange={(e) => setCaneEtaDraft(e.target.value)} />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label fw-bold small" style={{ color: "#555" }}>Peso (kg)</label>
                  <input type="number" min="0" step="0.1" style={{ ...inputStyle, resize: "none" }}
                    value={canePesoDraft} onChange={(e) => setCanePesoDraft(e.target.value)} />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label fw-bold small" style={{ color: "#555" }}>Taglia</label>
                  <select style={selectStyle} value={caneTagliaDraft} onChange={(e) => setCaneTagliaDraft(e.target.value)}>
                    <option value="Piccola">Piccola</option>
                    <option value="Media">Media</option>
                    <option value="Grande">Grande</option>
                    <option value="Gigante">Gigante</option>
                  </select>
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label fw-bold small" style={{ color: "#555" }}>Sesso</label>
                  <select style={selectStyle} value={caneSessoDraft} onChange={(e) => setCaneSessoDraft(e.target.value)}>
                    <option value="M">Maschio</option>
                    <option value="F">Femmina</option>
                  </select>
                </div>
              </div>

              {/* Disponibilità riproduttiva */}
              <div className="mb-3 d-flex align-items-center gap-3 p-3 rounded-3"
                style={{ backgroundColor: "#f7fbfc", border: "1.5px solid #d0e8ed" }}>
                <div className="form-check form-switch mb-0">
                  <input className="form-check-input" type="checkbox" id="disponibilitaSwitch"
                    checked={caneDisponibilitaDraft}
                    onChange={(e) => setCaneDisponibilitaDraft(e.target.checked)}
                    style={{ width: "2.5em", height: "1.3em" }} />
                  <label className="form-check-label fw-bold small ms-2" htmlFor="disponibilitaSwitch" style={{ color: "#555" }}>
                    Disponibile per la riproduzione
                  </label>
                </div>
              </div>

              {/* Bio + Info sanitarie */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold small" style={{ color: "#555" }}>Bio del Cane</label>
                  <textarea rows={4} style={inputStyle} placeholder="Descrivi carattere e abitudini..."
                    value={caneBioDraft} onChange={(e) => setCaneBioDraft(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small" style={{ color: "#555" }}>
                    Informazioni Sanitarie <span className="fw-normal text-muted">(opzionale)</span>
                  </label>
                  <textarea rows={4} style={inputStyle} placeholder="Es. Vaccinato, test HED negativo, allergie..."
                    value={caneInfoSanitarieDraft} onChange={(e) => setCaneInfoSanitarieDraft(e.target.value)} />
                </div>
              </div>

              {/* Upload pedigree */}
              <div className="p-3 rounded-3 mb-4" style={{ border: "2px dashed #7FBCC8", backgroundColor: "#f0f9fa" }}>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div>
                    <p className="fw-bold small mb-0" style={{ color: "#7FBCC8" }}>
                      <i className="bi bi-file-earmark-text-fill me-1" />
                      Carica Pedigree / Documento
                      <span className="fw-normal text-muted ms-1">(opzionale)</span>
                    </p>
                    <p className="text-muted mb-0" style={{ fontSize: "0.72rem" }}>PDF o immagine — max 5 MB</p>
                  </div>
                  <button type="button" className="btn btn-sm rounded-pill fw-bold"
                    style={{ backgroundColor: "#7FBCC8", color: "white", border: "none", fontSize: "0.8rem" }}
                    onClick={() => pedigreeRef.current.click()}>
                    <i className="bi bi-upload me-1" />
                    {pedigreeFile ? pedigreeFile.name.slice(0, 22) + "…" : "Seleziona file"}
                  </button>
                  <input ref={pedigreeRef} type="file" accept="image/*,.pdf" className="d-none"
                    onChange={(e) => { const f = e.target.files[0]; if (f) setPedigreeFile(f); }} />
                </div>
                {hasPedigree && !pedigreeFile && (
                  <p className="text-success small mt-2 mb-0">
                    <i className="bi bi-check-circle-fill me-1" />Pedigree già caricato — carica un nuovo file per sostituirlo
                  </p>
                )}
                {pedigreeFile && (
                  <p className="text-success small mt-2 mb-0">
                    <i className="bi bi-check-circle-fill me-1" />Pronto: {pedigreeFile.name}
                  </p>
                )}
              </div>
            </>
          )}

          {saveError && (
            <div className="alert alert-danger small py-2 mb-3 rounded-3 border-0">
              <i className="bi bi-exclamation-triangle-fill me-1" />{saveError}
            </div>
          )}
          <p className="text-muted small mb-0">
            <i className="bi bi-camera me-1" />Per cambiare la tua foto profilo, clicca sull'avatar in alto a sinistra.
          </p>
        </div>
      )}

      {/* ── GRIGLIA ── */}
      {!isEditing && <div style={{ maxWidth: "900px", margin: "16px auto 0", display: "grid", gridTemplateColumns: "340px 1fr", gap: "16px", padding: "0 0 32px" }}>

        {/* ── COLONNA SX ── */}
        <div className="d-flex flex-column gap-3">

          {/* Bio utente + contatti */}
          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h6 className="fw-bold mb-3" style={{ color: "#1c1e21" }}>Bio dell'utente</h6>
            <p className="text-muted small mb-3" style={{ lineHeight: "1.6" }}>
              {user.bio || "Nessuna bio. Clicca su Modifica Profilo per aggiungerne una!"}
            </p>
            <hr style={{ borderColor: "#f0f0f0", margin: "0 0 12px" }} />
            <p className="mb-2" style={sectionLabel}>Contatti</p>
            <div className="d-flex flex-column gap-2">
              {(user.mostraEmail ?? true)
                ? (
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <i className="bi bi-envelope-fill" style={{ color: "#7FBCC8" }} />
                      <span style={{ fontSize: "0.82rem", wordBreak: "break-all" }}>{user.email}</span>
                    </div>
                    {user.isVerificato
                      ? <span style={{ color: "#28a745", fontSize: "0.72rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                          <i className="bi bi-check-circle-fill me-1" />Verificata
                        </span>
                      : <span style={{ color: "#dc3545", fontSize: "0.72rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                          <i className="bi bi-x-circle-fill me-1" />Non verificata
                        </span>
                    }
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <i className="bi bi-envelope-fill" style={{ color: "#ccc" }} />
                    <span style={{ fontSize: "0.82rem", color: "#bbb", fontStyle: "italic" }}>Email nascosta</span>
                  </div>
                )
              }
              {user.telefono && (
                (user.mostraTelefono ?? true)
                  ? (
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <i className="bi bi-telephone-fill" style={{ color: "#7FBCC8" }} />
                      <span style={{ fontSize: "0.82rem" }}>{user.telefono}</span>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <i className="bi bi-telephone-fill" style={{ color: "#ccc" }} />
                      <span style={{ fontSize: "0.82rem", color: "#bbb", fontStyle: "italic" }}>Telefono nascosto</span>
                    </div>
                  )
              )}
              {user.posizione?.citta && user.posizione.citta !== "Non specificata" && (
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <i className="bi bi-geo-alt-fill" style={{ color: "#7FBCC8" }} />
                  <span style={{ fontSize: "0.82rem" }}>{user.posizione.citta}</span>
                </div>
              )}
            </div>
          </div>

          {/* I miei cani */}
          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold mb-0" style={{ color: "#1c1e21" }}>
                I miei cani ({(user.iMieiCani ?? []).length})
              </h6>
              <button className="btn btn-sm rounded-pill fw-bold px-3"
                style={{ backgroundColor: "#EFA6BA", color: "white", border: "none", fontSize: "0.78rem" }}
                onClick={openAggiungiCane}>
                <i className="bi bi-plus-lg me-1" />Aggiungi
              </button>
            </div>

            {(user.iMieiCani ?? []).length === 0 ? (
              <p className="text-muted small text-center py-2">Nessun cane registrato.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {(user.iMieiCani ?? []).map((c, idx) => {
                  const foto = buildImgUrl(c.fotoUrl ?? c.foto_url, PLACEHOLDER_CANE);
                  const isPrimary = idx === 0;
                  return (
                    <div key={c.id}>
                      {isPrimary && (
                        <div style={{ height: "4px", backgroundColor: "#e9ecef", borderRadius: "2px", marginBottom: "10px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${completenessPercent}%`, backgroundColor: completenessColor, borderRadius: "2px" }} />
                        </div>
                      )}
                      <div className="d-flex align-items-center gap-3">
                        <img src={foto} alt={c.nome} onError={(e) => { e.target.src = PLACEHOLDER_CANE; }}
                          style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", border: `3px solid ${isPrimary ? "#7FBCC8" : "#EFA6BA"}`, flexShrink: 0 }} />
                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                          <p className="fw-bold mb-0" style={{ color: "#1c1e21" }}>{c.nome}</p>
                          <p className="text-muted small mb-0 text-capitalize">{c.razza}</p>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            {c.eta != null && <span className="badge rounded-pill bg-light text-muted" style={{ fontSize: "0.65rem" }}>{c.eta} anni</span>}
                            {c.sesso && <span className="badge rounded-pill bg-light text-muted" style={{ fontSize: "0.65rem" }}>{c.sesso === "M" ? "Maschio" : "Femmina"}</span>}
                            {c.disponibilitaRiproduttiva && <span className="badge rounded-pill text-white" style={{ backgroundColor: "#EFA6BA", fontSize: "0.65rem" }}>Disponibile</span>}
                          </div>
                        </div>
                        <div className="d-flex flex-column gap-1 flex-shrink-0">
                          <button className="btn btn-sm rounded-pill px-2 py-1"
                            style={{ backgroundColor: "#f0f2f5", color: "#555", border: "none", fontSize: "0.72rem" }}
                            onClick={() => openModificaCane(c)}>
                            <i className="bi bi-pencil-fill" />
                          </button>
                          <button className="btn btn-sm rounded-pill px-2 py-1"
                            style={{ backgroundColor: "#fff3f3", color: "#dc3545", border: "1px solid #f5c6cb", fontSize: "0.72rem" }}
                            onClick={() => handleEliminaCane(c.id)}>
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      </div>
                      {idx < (user.iMieiCani ?? []).length - 1 && <hr style={{ borderColor: "#f0f0f0", margin: "12px 0 0" }} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── COLONNA DX ── */}
        <div className="d-flex flex-column gap-3">

          {/* Bio del cane + scheda tecnica */}
          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h6 className="fw-bold mb-3" style={{ color: "#1c1e21" }}>Bio del Cane</h6>
            <div style={{ borderLeft: "4px solid #EFA6BA", paddingLeft: "16px", marginBottom: "16px" }}>
              <p className="mb-0" style={{ color: "#555", lineHeight: "1.7" }}>
                {cane?.descrizione || "Nessuna bio. Clicca su Modifica Profilo per aggiungerne una!"}
              </p>
            </div>

            {cane && (
              <>
                <p className="mb-2" style={sectionLabel}>Scheda Tecnica</p>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {cane.peso != null && (
                    <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-medium">
                      <i className="bi bi-speedometer2 me-1" style={{ color: "#7FBCC8" }} />{cane.peso} kg
                    </span>
                  )}
                  {cane.taglia && (
                    <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-medium">
                      <i className="bi bi-rulers me-1" style={{ color: "#7FBCC8" }} />Taglia {cane.taglia}
                    </span>
                  )}
                  {cane.eta != null && (
                    <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-medium">
                      <i className="bi bi-calendar3 me-1" style={{ color: "#7FBCC8" }} />{cane.eta} {cane.eta === 1 ? "anno" : "anni"}
                    </span>
                  )}
                  {cane.sesso && (
                    <span className="badge rounded-pill bg-light text-dark px-3 py-2 fw-medium">
                      <i className={`bi ${cane.sesso === "M" ? "bi-gender-male" : "bi-gender-female"} me-1`} style={{ color: "#EFA6BA" }} />
                      {cane.sesso === "M" ? "Maschio" : "Femmina"}
                    </span>
                  )}
                  {hasPedigree && (
                    <span className="badge rounded-pill text-white px-3 py-2 fw-medium" style={{ backgroundColor: "#7FBCC8" }}>
                      <i className="bi bi-award-fill me-1" />Pedigree
                    </span>
                  )}
                  {cane.disponibilitaRiproduttiva && (
                    <span className="badge rounded-pill text-white px-3 py-2 fw-medium" style={{ backgroundColor: "#EFA6BA" }}>
                      <i className="bi bi-heart-fill me-1" />Disponibile
                    </span>
                  )}
                </div>

                {cane.infoSanitarie && (
                  <>
                    <p className="mb-2" style={sectionLabel}>Informazioni Sanitarie</p>
                    <div style={{ borderLeft: "4px solid #7FBCC8", paddingLeft: "16px" }}>
                      <p className="mb-0 text-muted small" style={{ lineHeight: "1.6" }}>{cane.infoSanitarie}</p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Info Account */}
          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            <h6 className="fw-bold mb-3" style={{ color: "#1c1e21" }}>Info Account</h6>
            <div className="d-flex flex-column gap-2">
              {(user.mostraEmail ?? true) ? (
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <i className="bi bi-envelope-fill" style={{ color: "#7FBCC8" }} />
                  <span>{user.email}</span>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2 small">
                  <i className="bi bi-envelope-fill" style={{ color: "#ccc" }} />
                  <span style={{ color: "#bbb", fontStyle: "italic" }}>Email nascosta</span>
                </div>
              )}
              {user.posizione?.citta && user.posizione.citta !== "Non specificata" && (
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <i className="bi bi-geo-alt-fill" style={{ color: "#7FBCC8" }} />
                  <span>{user.posizione.citta}</span>
                </div>
              )}
              <div className="d-flex align-items-center gap-2 text-muted small">
                <i className="bi bi-shield-check" style={{ color: "#7FBCC8" }} />
                <span>{user.isVerificato ? "Account verificato" : "Account non verificato"}</span>
              </div>
              {hasPedigree && (
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <i className="bi bi-award-fill" style={{ color: "#7FBCC8" }} />
                  <span>Pedigree certificato</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>}

      {/* ── MODAL AGGIUNGI / MODIFICA CANE ── */}
      {showCaneModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000 }}
             onClick={(e) => { if (e.target === e.currentTarget) setShowCaneModal(false); }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg" style={{ overflow: "hidden" }}>

              <div style={{ background: "linear-gradient(135deg,#EFA6BA,#f7c5d5)", padding: "20px 24px 16px" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="fw-bold mb-0 text-white">
                    <i className="bi bi-balloon-heart-fill me-2" />
                    {caneModalModo === "add" ? "Aggiungi un cane" : "Modifica cane"}
                  </h5>
                  <button className="btn btn-sm text-white p-0" style={{ background: "none", border: "none", fontSize: "1.3rem" }}
                    onClick={() => setShowCaneModal(false)}>
                    <i className="bi bi-x-lg" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small" style={{ color: "#555" }}>Nome *</label>
                    <input type="text" className="form-control rounded-3" placeholder="Es. Fido"
                      value={caneModalNome} onChange={(e) => setCaneModalNome(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small" style={{ color: "#555" }}>
                      Razza * {caneModalModo === "edit" && <span className="fw-normal text-muted">(non modificabile)</span>}
                    </label>
                    <input type="text" className="form-control rounded-3" placeholder="Es. Labrador"
                      value={caneModalRazza} onChange={(e) => setCaneModalRazza(e.target.value)}
                      readOnly={caneModalModo === "edit"}
                      style={caneModalModo === "edit" ? { opacity: 0.6, cursor: "not-allowed" } : {}} />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6 col-md-3">
                    <label className="form-label fw-bold small" style={{ color: "#555" }}>Sesso</label>
                    <select className="form-select rounded-3" value={caneModalSesso} onChange={(e) => setCaneModalSesso(e.target.value)}>
                      <option value="M">Maschio</option>
                      <option value="F">Femmina</option>
                    </select>
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label fw-bold small" style={{ color: "#555" }}>Età (anni)</label>
                    <input type="number" min="0" max="30" className="form-control rounded-3"
                      value={caneModalEta} onChange={(e) => setCaneModalEta(e.target.value)} />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label fw-bold small" style={{ color: "#555" }}>Peso (kg)</label>
                    <input type="number" min="0" step="0.1" className="form-control rounded-3"
                      value={caneModalPeso} onChange={(e) => setCaneModalPeso(e.target.value)} />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label fw-bold small" style={{ color: "#555" }}>Taglia</label>
                    <select className="form-select rounded-3" value={caneModalTaglia} onChange={(e) => setCaneModalTaglia(e.target.value)}>
                      <option value="Piccola">Piccola</option>
                      <option value="Media">Media</option>
                      <option value="Grande">Grande</option>
                      <option value="Gigante">Gigante</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3 d-flex align-items-center gap-3 p-3 rounded-3"
                  style={{ backgroundColor: "#fff5f8", border: "1.5px solid #f7c5d5" }}>
                  <div className="form-check form-switch mb-0">
                    <input className="form-check-input" type="checkbox" id="caneModalDispSwitch"
                      checked={caneModalDisp} onChange={(e) => setCaneModalDisp(e.target.checked)}
                      style={{ width: "2.5em", height: "1.3em" }} />
                    <label className="form-check-label fw-bold small ms-2" htmlFor="caneModalDispSwitch" style={{ color: "#555" }}>
                      Disponibile per la riproduzione
                    </label>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold small" style={{ color: "#555" }}>Bio del cane</label>
                    <textarea rows={3} className="form-control rounded-3" placeholder="Carattere, abitudini..."
                      value={caneModalDesc} onChange={(e) => setCaneModalDesc(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold small" style={{ color: "#555" }}>Info sanitarie</label>
                    <textarea rows={3} className="form-control rounded-3" placeholder="Vaccinazioni, allergie..."
                      value={caneModalSanitarie} onChange={(e) => setCaneModalSanitarie(e.target.value)} />
                  </div>
                </div>

                {caneModalError && (
                  <div className="alert alert-danger small py-2 rounded-3 border-0 mb-3">
                    <i className="bi bi-exclamation-triangle-fill me-1" />{caneModalError}
                  </div>
                )}

                <div className="d-flex gap-2 justify-content-end">
                  <button className="btn btn-light rounded-pill px-4 fw-bold"
                    onClick={() => setShowCaneModal(false)} disabled={caneModalSaving}>
                    Annulla
                  </button>
                  <button className="btn rounded-pill px-4 fw-bold text-white"
                    style={{ backgroundColor: "#EFA6BA", border: "none" }}
                    onClick={handleSalvaCane} disabled={caneModalSaving}>
                    {caneModalSaving ? "Salvataggio..." : <><i className="bi bi-check-lg me-1" />Salva</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL PRIVACY ── */}
      {showPrivacyModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000 }}
             onClick={(e) => { if (e.target === e.currentTarget) setShowPrivacyModal(false); }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg" style={{ overflow: "hidden" }}>

              {/* Header */}
              <div style={{ background: "linear-gradient(135deg,#7FBCC8,#a8d8e2)", padding: "20px 24px 16px" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="fw-bold mb-0 text-white">
                    <i className="bi bi-shield-lock-fill me-2" />Privacy
                  </h5>
                  <button className="btn btn-sm text-white p-0" style={{ background: "none", border: "none", fontSize: "1.3rem", lineHeight: 1 }}
                    onClick={() => setShowPrivacyModal(false)}>
                    <i className="bi bi-x-lg" />
                  </button>
                </div>
                <p className="text-white mb-0 mt-1" style={{ fontSize: "0.82rem", opacity: 0.85 }}>
                  Scegli quali informazioni rendere visibili agli altri utenti.
                </p>
              </div>

              {/* Toggles */}
              <div className="p-4">
                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="d-flex align-items-center justify-content-between p-3 rounded-3"
                       style={{ backgroundColor: "#f7fbfc", border: "1.5px solid #d0e8ed" }}>
                    <div className="d-flex align-items-center gap-2 small" style={{ color: "#555" }}>
                      <i className="bi bi-envelope-fill" style={{ color: "#7FBCC8" }} />
                      <span>Mostra email agli altri utenti</span>
                    </div>
                    <div className="form-check form-switch mb-0">
                      <input className="form-check-input" type="checkbox" id="privacyEmailModal"
                        checked={privacyEmail}
                        onChange={(e) => handlePrivacyToggle("email", e.target.checked)}
                        style={{ width: "2.5em", height: "1.3em" }} />
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between p-3 rounded-3"
                       style={{ backgroundColor: "#f7fbfc", border: "1.5px solid #d0e8ed" }}>
                    <div className="d-flex align-items-center gap-2 small" style={{ color: "#555" }}>
                      <i className="bi bi-telephone-fill" style={{ color: "#7FBCC8" }} />
                      <span>Mostra numero di telefono agli altri utenti</span>
                    </div>
                    <div className="form-check form-switch mb-0">
                      <input className="form-check-input" type="checkbox" id="privacyTelefonoModal"
                        checked={privacyTelefono}
                        onChange={(e) => handlePrivacyToggle("telefono", e.target.checked)}
                        style={{ width: "2.5em", height: "1.3em" }} />
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between p-3 rounded-3"
                       style={{ backgroundColor: "#f7fbfc", border: "1.5px solid #d0e8ed" }}>
                    <div className="d-flex align-items-center gap-2 small" style={{ color: "#555" }}>
                      <i className="bi bi-geo-alt-fill" style={{ color: "#7FBCC8" }} />
                      <div>
                        <span>Mostra posizione agli altri utenti</span>
                        <p className="mb-0" style={{ fontSize: "0.72rem", color: "#999" }}>
                          Disattiva per non apparire nei filtri per distanza
                        </p>
                      </div>
                    </div>
                    <div className="form-check form-switch mb-0">
                      <input className="form-check-input" type="checkbox" id="privacyPosizioneModal"
                        checked={privacyPosizione}
                        onChange={(e) => handlePosizioneToggle(e.target.checked)}
                        style={{ width: "2.5em", height: "1.3em" }} />
                    </div>
                  </div>
                </div>

                <hr style={{ borderColor: "#ffe0e0", margin: "0 0 16px" }} />
                <h6 className="fw-bold mb-1" style={{ color: "#dc3545", fontSize: "0.85rem" }}>
                  <i className="bi bi-exclamation-triangle-fill me-2" />Zona pericolosa
                </h6>
                <p className="text-muted small mb-3">L'eliminazione è definitiva e rimuove tutti i tuoi dati, il tuo cane e i match.</p>
                <button
                  className="btn btn-outline-danger rounded-pill px-4 py-2 fw-bold small"
                  onClick={() => { setShowPrivacyModal(false); setShowDeleteModal(true); setDeleteConfirm(""); }}
                >
                  <i className="bi bi-trash3-fill me-2" />Elimina il mio account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONFERMA ELIMINAZIONE ── */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 2000 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg p-4">
              <h5 className="fw-bold mb-1" style={{ color: "#dc3545" }}>
                <i className="bi bi-exclamation-triangle-fill me-2" />Sei sicuro?
              </h5>
              <p className="text-muted small mb-3">
                Questa azione è <strong>irreversibile</strong>. Verranno eliminati il tuo profilo, il tuo cane e tutti i match.
              </p>
              <p className="small mb-1 fw-bold">Digita la tua email per confermare:</p>
              <p className="small text-muted mb-2" style={{ fontFamily: "monospace" }}>{user.email}</p>
              <input
                type="email"
                className="form-control rounded-3 mb-3"
                placeholder="Inserisci la tua email..."
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                style={{ border: "1.5px solid #f5c6cb" }}
              />
              <div className="d-flex gap-2">
                <button
                  className="btn btn-light rounded-pill fw-bold flex-grow-1"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                >
                  Annulla
                </button>
                <button
                  className="btn btn-danger rounded-pill fw-bold flex-grow-1"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== user.email || isDeleting}
                >
                  {isDeleting ? "Eliminazione..." : "Elimina definitivamente"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilo;
