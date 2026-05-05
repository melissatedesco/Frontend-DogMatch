import React, { useState } from "react";
import snoutBot from "../assets/snoutBot.png";

const SnoutBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Bottone Flottante (Sempre visibile) */}
      <div 
        className="position-fixed bottom-0 end-0 m-4 shadow-lg d-flex align-items-center justify-content-center"
        style={{ 
          width: "65px", 
          height: "65px", 
          backgroundColor: "#7FBCC8", 
          borderRadius: "50%", 
          cursor: "pointer", 
          zIndex: 2000, // Z-index altissimo per stare sopra a tutto
          border: "4px solid white"
        }}
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <img src={snoutBot} alt="SnoutBot" style={{ width: "70%", height: "70%", objectFit: "contain" }} />
      </div>

      {/* Finestra di Chat */}
      {isChatOpen && (
        <div 
          className="position-fixed shadow-lg d-flex flex-column"
          style={{ 
            width: "350px", 
            height: "450px", 
            backgroundColor: "white", 
            borderRadius: "25px", 
            zIndex: 2001,
            bottom: "100px", 
            right: "25px",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div className="p-3 d-flex align-items-center justify-content-between" style={{ backgroundColor: "#7FBCC8" }}>
            <div className="d-flex align-items-center">
              <img src={snoutBot} alt="bot" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
              <span className="text-white fw-bold small">SnoutBot Assistant</span>
            </div>
            <button className="btn-close btn-close-white" onClick={() => setIsChatOpen(false)}></button>
          </div>

          {/* Body */}
          <div className="flex-grow-1 p-3 overflow-auto" style={{ backgroundColor: "#f8fbfb" }}>
            <div className="bg-white p-3 rounded-4 shadow-sm small mb-2" style={{ maxWidth: "85%" }}>
              Ehi! Sono qui per aiutarti. Vuoi analizzare un pedigree o cercare match simili? 🐾
            </div>
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-top">
            <div className="input-group input-group-sm">
              <input type="text" className="form-control border-0 bg-light rounded-pill-start" placeholder="Scrivi qui..." />
              <button className="btn text-white" style={{ backgroundColor: "#7FBCC8", borderRadius: "0 25px 25px 0" }}>
                <i className="bi bi-send-fill"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SnoutBot;