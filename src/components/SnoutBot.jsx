import React, { useState, useEffect, useRef } from "react";
import snoutBot from "../assets/snoutBot.png";

const API_URL = "/api/chat";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const SnoutBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isChatOpen && !historyLoaded) {
      loadHistory();
    }
  }, [isChatOpen, historyLoaded]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const loadHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/bot/history`, { headers: getAuthHeader() });
      const data = await res.json();
      if (data.successo && data.messaggi.length > 0) {
        setMessages(
          data.messaggi.map((m) => ({ role: m.role, text: m.content, id: m.id }))
        );
      } else {
        setMessages([
          { role: "assistant", text: "Ehi! Sono SnoutBot, il tuo assistente cinofilo 🐾 Come posso aiutarti?", id: "intro" },
        ]);
      }
    } catch {
      setMessages([
        { role: "assistant", text: "Ehi! Sono SnoutBot, il tuo assistente cinofilo 🐾 Come posso aiutarti?", id: "intro" },
      ]);
    }
    setHistoryLoaded(true);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", text, id: Date.now() }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/bot`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (data.success && data.data?.text) {
        setMessages((prev) => [...prev, { role: "assistant", text: data.data.text, id: data.data._id }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", text: "Mi dispiace, c'è stato un problema. Riprova!", id: Date.now() }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Errore di connessione. Controlla la rete e riprova.", id: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await fetch(`${API_URL}/bot/history`, { method: "DELETE", headers: getAuthHeader() });
    } catch (err) {
      console.error("Errore cancellazione cronologia:", err);
    }
    setMessages([{ role: "assistant", text: "Cronologia cancellata! Come posso aiutarti? 🐾", id: Date.now() }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div
        className="position-fixed bottom-0 end-0 m-4 shadow-lg d-flex align-items-center justify-content-center"
        style={{
          width: "65px",
          height: "65px",
          backgroundColor: "#7FBCC8",
          borderRadius: "50%",
          cursor: "pointer",
          zIndex: 2000,
          border: "4px solid white",
        }}
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <img src={snoutBot} alt="SnoutBot" style={{ width: "70%", height: "70%", objectFit: "contain" }} />
      </div>

      {isChatOpen && (
        <div
          className="position-fixed shadow-lg d-flex flex-column"
          style={{
            width: "350px",
            height: "490px",
            backgroundColor: "white",
            borderRadius: "25px",
            zIndex: 2001,
            bottom: "100px",
            right: "25px",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div className="p-3 d-flex align-items-center justify-content-between" style={{ backgroundColor: "#7FBCC8" }}>
            <div className="d-flex align-items-center">
              <img src={snoutBot} alt="bot" style={{ width: "30px", height: "30px", marginRight: "10px" }} />
              <span className="text-white fw-bold small">SnoutBot Assistant</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm p-0 text-white opacity-75"
                title="Cancella cronologia"
                onClick={handleClearHistory}
                style={{ background: "none", border: "none", fontSize: "0.8rem" }}
              >
                <i className="bi bi-trash" />
              </button>
              <button className="btn-close btn-close-white" onClick={() => setIsChatOpen(false)} />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow-1 p-3 overflow-auto" style={{ backgroundColor: "#f8fbfb" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 d-flex ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}
              >
                <div
                  className="p-2 px-3 rounded-4 small"
                  style={{
                    maxWidth: "85%",
                    backgroundColor: msg.role === "user" ? "#7FBCC8" : "white",
                    color: msg.role === "user" ? "white" : "#333",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="d-flex justify-content-start mb-2">
                <div className="p-2 px-3 rounded-4 small bg-white shadow-sm" style={{ color: "#888" }}>
                  <span className="spinner-grow spinner-grow-sm me-1" style={{ color: "#7FBCC8" }} />
                  SnoutBot sta scrivendo…
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-top">
            <div className="input-group input-group-sm">
              <input
                type="text"
                className="form-control border-0 bg-light"
                style={{ borderRadius: "25px 0 0 25px" }}
                placeholder="Scrivi qui..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
              />
              <button
                className="btn text-white"
                style={{ backgroundColor: "#7FBCC8", borderRadius: "0 25px 25px 0" }}
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
              >
                <i className="bi bi-send-fill" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SnoutBot;
