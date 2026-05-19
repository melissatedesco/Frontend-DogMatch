import React, { useState, useRef, useEffect } from "react";
import snoutBot from "../assets/snoutBot.png";

const API_URL = "/api/chat/bot";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const WELCOME = {
  id: "welcome",
  role: "bot",
  text: "Ehi! Sono SnoutBot 🐾 Chiedimi tutto su DogMatch, razze, consigli e molto altro!",
};

const TypingDots = () => (
  <div className="d-flex align-items-center gap-1 px-1" style={{ height: "20px" }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          backgroundColor: "#aaa",
          animation: "bounce 1.2s infinite",
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-6px); }
      }
    `}</style>
  </div>
);

const SCREEN_LABELS = {
  "/home":          "Home / Discovery (feed cani)",
  "/messages":      "Messaggi e chat con i match",
  "/profile":       "Profilo utente",
  "/requests":      "Richieste di match ricevute",
  "/admin":         "Pannello amministratore",
};

function getCurrentScreen() {
  const path = window.location.pathname;
  if (SCREEN_LABELS[path]) return SCREEN_LABELS[path];
  if (path.startsWith("/view-profile/")) return "Visualizzazione profilo di un altro utente";
  return "App DogMatch";
}

const SnoutBot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isChatOpen && !historyLoaded) {
      fetch(`${API_URL}/history`, { headers: getAuthHeader() })
        .then((r) => r.json())
        .then((data) => {
          if (data?.messaggi?.length) {
            const storico = data.messaggi.map((m) => ({
              id: m.id,
              role: m.role === "assistant" ? "bot" : "user",
              text: m.content,
            }));
            setMessages([WELCOME, ...storico]);
          }
        })
        .catch(() => {})
        .finally(() => setHistoryLoaded(true));
    }
    if (isChatOpen) setUnread(0);
  }, [isChatOpen, historyLoaded]);

  useEffect(() => {
    if (isChatOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  const clearHistory = async () => {
    if (!window.confirm("Vuoi cancellare tutta la cronologia della chat?")) return;
    await fetch(`${API_URL}/history`, { method: "DELETE", headers: getAuthHeader() }).catch(() => {});
    setMessages([WELCOME]);
    setHistoryLoaded(false);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({ message: text, screen: getCurrentScreen() }),
      });
      const data = await res.json();
      const botText = data?.data?.text || "Bau... scusa, mi sono distratto. Puoi ripetere? 🐾";
      const botMsg = { id: Date.now() + 1, role: "bot", text: botText };
      setMessages((prev) => [...prev, botMsg]);
      if (!isChatOpen) setUnread((n) => n + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: "Ops, qualcosa è andato storto. Riprova tra poco 🐾" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
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
          transition: "transform 0.2s",
        }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <img src={snoutBot} alt="SnoutBot" style={{ width: "70%", height: "70%", objectFit: "contain" }} />
        {!isChatOpen && unread > 0 && (
          <div
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              backgroundColor: "#E91E63",
              color: "white",
              borderRadius: "50%",
              width: "22px",
              height: "22px",
              fontSize: "11px",
              fontWeight: "900",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid white",
            }}
          >
            {unread > 9 ? "9+" : unread}
          </div>
        )}
      </div>

      {/* Chat window */}
      {isChatOpen && (
        <div
          className="position-fixed shadow-lg d-flex flex-column"
          style={{
            width: "360px",
            height: "480px",
            backgroundColor: "white",
            borderRadius: "25px",
            zIndex: 2001,
            bottom: "100px",
            right: "25px",
            overflow: "hidden",
            animation: "slideUp 0.2s ease-out",
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          {/* Header */}
          <div
            className="p-3 d-flex align-items-center justify-content-between"
            style={{ backgroundColor: "#7FBCC8", flexShrink: 0 }}
          >
            <div className="d-flex align-items-center gap-2">
              <img src={snoutBot} alt="bot" style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid white" }} />
              <div>
                <div className="text-white fw-bold small lh-1">SnoutBot</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.8)" }}>
                  {isTyping ? "sta scrivendo..." : "Online"}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm p-0 border-0"
                style={{ background: "none", opacity: 0.8 }}
                onClick={clearHistory}
                title="Cancella cronologia"
              >
                <i className="bi bi-trash text-white" style={{ fontSize: "14px" }} />
              </button>
              <button className="btn-close btn-close-white" onClick={() => setIsChatOpen(false)} />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow-1 p-3 overflow-auto" style={{ backgroundColor: "#f8fbfb" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`d-flex mb-2 align-items-end gap-2 ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}
              >
                {msg.role === "bot" && (
                  <img src={snoutBot} alt="bot" style={{ width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0 }} />
                )}
                <div
                  className="p-2 px-3 rounded-4 shadow-sm small"
                  style={{
                    maxWidth: "78%",
                    backgroundColor: msg.role === "user" ? "#7FBCC8" : "white",
                    color: msg.role === "user" ? "white" : "#1c1e21",
                    wordBreak: "break-word",
                    lineHeight: "1.5",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="d-flex mb-2 align-items-end gap-2 justify-content-start">
                <img src={snoutBot} alt="bot" style={{ width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0 }} />
                <div className="bg-white p-2 px-3 rounded-4 shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-top" style={{ flexShrink: 0 }}>
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
                autoFocus
              />
              <button
                className="btn text-white"
                style={{
                  backgroundColor: isTyping || !input.trim() ? "#b0d6de" : "#7FBCC8",
                  borderRadius: "0 25px 25px 0",
                  transition: "background-color 0.2s",
                }}
                onClick={sendMessage}
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
