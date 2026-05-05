import { useState } from "react";

const BreedSelector = ({ setBreed, currentBreed, user }) => {
  const [inputValue, setInputValue] = useState("");
  const razzaUtente = user?.iMieiCani?.[0]?.razza || "";

  const handleSearch = () => {
    const query = inputValue.trim() || razzaUtente;
    if (query) {
      setBreed(query.toLowerCase());
      setInputValue("");
    }
  };

  const handleReset = () => {
    setBreed("");
    setInputValue("");
  };

  return (
    <div className="w-100">
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <div
          className="input-group overflow-hidden"
          style={{
            border: "1.5px solid #cce0f5",
            borderRadius: "25px",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <input
            type="text"
            className="form-control border-0 py-2 px-3"
            placeholder={razzaUtente ? `Compatibile: ${razzaUtente}` : "Cerca razza"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{
              fontSize: "14px",
              color: "#555",
              backgroundColor: "transparent",
              outline: "none",
              boxShadow: "none",
            }}
          />
          {currentBreed && (
            <button
              type="button"
              onClick={handleReset}
              className="btn px-3 text-muted"
              style={{ border: "none", backgroundColor: "transparent" }}
              title="Mostra tutti"
            >
              <i className="bi bi-x-lg" style={{ fontSize: "12px" }} />
            </button>
          )}
          <button
            className="btn px-4 fw-bold text-white"
            type="submit"
            style={{
              background: "#4A90D9",
              border: "none",
              borderRadius: "0 23px 23px 0",
            }}
          >
            Cerca
          </button>
        </div>
      </form>
    </div>
  );
};

export default BreedSelector;
