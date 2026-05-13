import { useState, useEffect, useRef } from "react";
import { dogService } from "../services/dogServices";

const BarraRicercaRazza = ({ caneRazza, isAdmin, onSearch }) => {
    const [input, setInput] = useState("");
    const [razze, setRazze] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [errore, setErrore] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        dogService.getRazze()
            .then(data => setRazze(data.razze || []))
            .catch(() => {});
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const suggestions = input.length > 0
        ? razze.filter(r => r.toLowerCase().includes(input.toLowerCase()))
        : [];

    const isDifferentBreed = (val) => {
        if (isAdmin || !caneRazza || !val) return false;
        const matched = razze.find(r => r.toLowerCase() === val.toLowerCase());
        return matched && matched.toLowerCase() !== caneRazza.toLowerCase();
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setInput(val);
        setShowDropdown(val.length > 0);

        if (!val) {
            setErrore(null);
            onSearch(null);
            return;
        }

        if (isDifferentBreed(val)) {
            setErrore("Puoi cercare solo cani della tua stessa razza");
            onSearch(null);
        } else {
            setErrore(null);
            onSearch(val);
        }
    };

    const selectRazza = (razza) => {
        if (!isAdmin && caneRazza && razza.toLowerCase() !== caneRazza.toLowerCase()) {
            setErrore("Puoi cercare solo cani della tua stessa razza");
            setInput(razza);
            setShowDropdown(false);
            onSearch(null);
            return;
        }
        setInput(razza);
        setShowDropdown(false);
        setErrore(null);
        onSearch(razza);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") setShowDropdown(false);
    };

    const reset = () => {
        setInput("");
        setErrore(null);
        setShowDropdown(false);
        onSearch(null);
    };

    return (
        <div ref={containerRef} style={{ position: "relative", maxWidth: "340px", width: "100%" }}>
            <div className="d-flex gap-2 align-items-center">
                <div style={{ position: "relative", flex: 1 }}>
                    <i
                        className="bi bi-search"
                        style={{
                            position: "absolute", left: "12px", top: "50%",
                            transform: "translateY(-50%)", color: "#aaa",
                            fontSize: "0.82rem", zIndex: 1, pointerEvents: "none"
                        }}
                    />
                    <input
                        type="text"
                        className="form-control form-control-sm rounded-pill"
                        style={{
                            paddingLeft: "30px",
                            paddingRight: input ? "30px" : "12px",
                            border: `1.5px solid ${errore ? "#dc3545" : "#d0e8ed"}`,
                            backgroundColor: "#f7fbfc",
                            fontSize: "0.84rem",
                            boxShadow: "none"
                        }}
                        placeholder={isAdmin ? "Cerca per razza..." : "Cerca per nome..."}
                        value={input}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => input.length > 0 && setShowDropdown(true)}
                    />
                    {input && (
                        <button
                            onClick={reset}
                            style={{
                                position: "absolute", right: "10px", top: "50%",
                                transform: "translateY(-50%)", background: "none",
                                border: "none", padding: 0, cursor: "pointer",
                                color: "#bbb", lineHeight: 1
                            }}
                        >
                            <i className="bi bi-x-circle-fill" style={{ fontSize: "0.82rem" }} />
                        </button>
                    )}
                </div>

                {input && (
                    <button
                        className="btn btn-sm rounded-pill fw-semibold"
                        style={{
                            backgroundColor: "#f0f2f5", color: "#555",
                            border: "none", fontSize: "0.78rem",
                            whiteSpace: "nowrap", padding: "4px 12px"
                        }}
                        onClick={reset}
                    >
                        Mostra tutti
                    </button>
                )}
            </div>

            {errore && (
                <div style={{ fontSize: "0.76rem", color: "#dc3545", marginTop: "4px", paddingLeft: "4px" }}>
                    <i className="bi bi-exclamation-circle-fill me-1" />
                    {errore}
                </div>
            )}

            {showDropdown && suggestions.length > 0 && (
                <div style={{
                    position: "absolute", top: "calc(100% + 5px)", left: 0, right: 0,
                    backgroundColor: "white", borderRadius: "12px",
                    boxShadow: "0 6px 24px rgba(0,0,0,0.11)",
                    border: "1.5px solid #d0e8ed", zIndex: 300,
                    maxHeight: "210px", overflowY: "auto"
                }}>
                    {suggestions.slice(0, 8).map(razza => (
                        <button
                            key={razza}
                            onMouseDown={(e) => { e.preventDefault(); selectRazza(razza); }}
                            className="d-block w-100 text-start"
                            style={{
                                background: "none", border: "none",
                                padding: "8px 16px", fontSize: "0.84rem",
                                color: "#1c1e21", cursor: "pointer",
                                transition: "background 0.1s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f7fbfc"}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                        >
                            <i className="bi bi-arrow-return-right me-2 text-muted" style={{ fontSize: "0.72rem" }} />
                            {razza}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BarraRicercaRazza;
