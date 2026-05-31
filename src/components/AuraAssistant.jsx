import React, { useState, useEffect, useRef } from "react";

export default function AuraAssistant({ chatOpen, setChatOpen, userData }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatOpen && !greeted) {
      setGreeted(true);
      setTimeout(() => {
        setChatMessages([{ type: "bot", text: `Hello${userData?.username ? `, ${userData.username}` : ""} ✦` }]);
      }, 180);
      setTimeout(() => {
        setChatMessages(prev => [...prev, { type: "bot", text: "What would you like to explore today — skin, hair, or wellness?" }]);
      }, 600);
    }
  }, [chatOpen]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages, chatLoading]);

  useEffect(() => {
    if (chatOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [chatOpen]);

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { type: "user", text: userMsg }]);
    setChatLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are AuraCare AI, a warm and knowledgeable wellness assistant specializing in skincare, haircare, and holistic self-care. The user's name is ${userData?.username || "there"}. Their skin type is ${userData?.skinType || "not specified"}. Their hair type is ${userData?.hairType || "not specified"}. Skin concerns: ${userData?.skinConcerns?.join(", ") || "none"}. Hair concerns: ${userData?.hairConcerns?.join(", ") || "none"}. Respond warmly and concisely. Max 3 sentences unless a list is genuinely useful. No markdown formatting — plain text only.`,
          messages: [{ role: "user", content: userMsg }]
        })
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "I'm here to support your wellness journey.";
      setChatMessages(prev => [...prev, { type: "bot", text: reply }]);
    } catch {
      setChatMessages(prev => [...prev, { type: "bot", text: "Having trouble connecting right now. Please try again." }]);
    }
    setChatLoading(false);
  };

  const suggestions = ["My morning skincare routine", "Help with hair fall", "Stress relief rituals"];
  const showSuggestions = !chatMessages.some(m => m.type === "user");

  return (
    <>
      <style>{`
        @keyframes ac-pulse {
          0%,100% { box-shadow: 0 8px 28px rgba(61,53,50,0.18), 0 0 0 0 rgba(61,53,50,0.15); }
          50%      { box-shadow: 0 8px 28px rgba(61,53,50,0.18), 0 0 0 8px rgba(61,53,50,0); }
        }
        @keyframes ac-overlay-in {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes ac-panel-in {
          from { opacity:0; transform: translateY(40px) scale(0.97); }
          to   { opacity:1; transform: translateY(0) scale(1); }
        }
        @keyframes ac-msg-bot {
          from { opacity:0; transform: translateX(-10px); }
          to   { opacity:1; transform: translateX(0); }
        }
        @keyframes ac-msg-user {
          from { opacity:0; transform: translateX(10px); }
          to   { opacity:1; transform: translateX(0); }
        }
        @keyframes ac-dot {
          0%,60%,100% { transform:translateY(0); opacity:0.3; }
          30%          { transform:translateY(-4px); opacity:1; }
        }
        @keyframes ac-suggest-in {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .ac-trigger {
          position: fixed;
          bottom: 32px; right: 32px;
          width: 52px; height: 52px;
          border-radius: 50%;
          background: var(--espresso, #3d3532);
          border: none; color: white;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          z-index: 900;
          transition: 0.3s cubic-bezier(0.4,0,0.2,1);
          animation: ac-pulse 4s ease-in-out infinite 2s;
        }
        .ac-trigger:hover {
          transform: scale(1.1);
          background: var(--espresso-light, #4b3d36);
        }
        .ac-trigger.hide {
          opacity: 0; transform: scale(0.6);
          pointer-events: none;
          animation: none;
        }

        .ac-overlay {
          position: fixed; inset: 0;
          background: rgba(26,18,15,0.72);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 0 20px 36px;
          animation: ac-overlay-in 0.3s ease both;
          font-family: 'Playfair Display', serif;
        }

        .ac-panel {
          width: 100%;
          max-width: 560px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          animation: ac-panel-in 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        .ac-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4px 20px;
        }
        .ac-topbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ac-brand {
          font-family: 'Playfair Display', serif;
          font-size: 0.82rem;
          font-weight: 400;
          color: rgba(252,250,247,0.96);
          letter-spacing: 1px;
        }
        .ac-online {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.62rem;
          color: rgba(252,250,247,0.55);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-family: 'Playfair Display', serif;
        }
        .ac-online-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #8fba8f;
        }
        .ac-close {
          width: 30px; height: 30px;
          border-radius: 50%;
          background: rgba(252,250,247,0.12);
          border: 1px solid rgba(252,250,247,0.22);
          color: rgba(252,250,247,0.75);
          font-size: 11px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: 0.2s ease;
          font-family: 'Playfair Display', serif;
        }
        .ac-close:hover {
          background: rgba(252,250,247,0.22);
          color: rgba(252,250,247,1);
        }

        .ac-messages {
          max-height: 52vh;
          overflow-y: auto;
          padding: 0 4px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scrollbar-width: none;
        }
        .ac-messages::-webkit-scrollbar { display: none; }

        .ac-bot-msg {
          align-self: flex-start;
          max-width: 76%;
          background: var(--paper-dark, #f5f0ec);
          color: var(--espresso, #3d3532);
          padding: 12px 18px;
          border-radius: 20px 20px 20px 4px;
          font-size: 0.9rem;
          line-height: 1.65;
          font-weight: 300;
          font-family: 'Playfair Display', serif;
          border: 1px solid var(--border, #e8e3df);
          animation: ac-msg-bot 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }
        .ac-user-msg {
          align-self: flex-end;
          max-width: 76%;
          background: var(--espresso, #3d3532);
          color: rgba(252,250,247,0.95);
          padding: 12px 18px;
          border-radius: 20px 20px 4px 20px;
          font-size: 0.9rem;
          line-height: 1.65;
          font-weight: 300;
          font-family: 'Playfair Display', serif;
          animation: ac-msg-user 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }

        .ac-typing {
          align-self: flex-start;
          background: var(--paper-dark, #f5f0ec);
          border: 1px solid var(--border, #e8e3df);
          padding: 14px 20px;
          border-radius: 20px 20px 20px 4px;
          display: flex; gap: 5px; align-items: center;
          animation: ac-msg-bot 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }
        .ac-typing span {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--muted, #a39b95);
          animation: ac-dot 1.3s ease-in-out infinite;
        }
        .ac-typing span:nth-child(2) { animation-delay: 0.16s; }
        .ac-typing span:nth-child(3) { animation-delay: 0.32s; }

        .ac-suggestions {
          display: flex; flex-wrap: wrap; gap: 8px;
          padding: 0 4px 16px;
        }
        .ac-suggest {
          background: rgba(252,250,247,0.1);
          border: 1px solid rgba(252,250,247,0.28);
          color: rgba(252,250,247,0.88);
          padding: 7px 16px;
          border-radius: 40px;
          font-family: 'Playfair Display', serif;
          font-size: 0.75rem;
          font-weight: 300;
          cursor: pointer;
          transition: 0.2s ease;
          letter-spacing: 0.2px;
          animation: ac-suggest-in 0.4s ease both;
        }
        .ac-suggest:nth-child(1) { animation-delay: 0.05s; }
        .ac-suggest:nth-child(2) { animation-delay: 0.12s; }
        .ac-suggest:nth-child(3) { animation-delay: 0.19s; }
        .ac-suggest:hover {
          background: rgba(252,250,247,0.2);
          color: rgba(252,250,247,1);
          border-color: rgba(252,250,247,0.45);
        }

        .ac-input-pill {
          display: flex;
          align-items: center;
          background: var(--paper, #fcfaf7);
          border-radius: 40px;
          border: 1px solid var(--border, #e8e3df);
          padding: 6px 6px 6px 22px;
          gap: 10px;
          box-shadow: 0 8px 32px rgba(30,22,19,0.18);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .ac-input-pill:focus-within {
          border-color: #ddd7d2;
          box-shadow: 0 12px 40px rgba(30,22,19,0.22);
        }
        .ac-input {
          flex: 1;
          border: none; outline: none;
          background: transparent;
          font-family: 'Playfair Display', serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: var(--espresso, #3d3532);
          padding: 10px 0;
          line-height: 1.4;
        }
        .ac-input::placeholder {
          color: var(--muted, #a39b95);
          font-style: italic;
        }
        .ac-send {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: var(--espresso, #3d3532);
          border: none; color: white;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .ac-send:hover:not(:disabled) {
          transform: scale(1.08);
          background: var(--espresso-light, #4b3d36);
        }
        .ac-send:disabled { opacity: 0.35; cursor: default; }

        @media (max-width: 600px) {
          .ac-overlay { padding: 0 12px 20px; }
          .ac-trigger { right: 20px; bottom: 22px; }
          .ac-bot-msg, .ac-user-msg { max-width: 88%; font-size: 0.85rem; }
        }
      `}</style>

      <button
        className={`ac-trigger${chatOpen ? " hide" : ""}`}
        onClick={() => setChatOpen(true)}
        title="Open AuraCare Assistant"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 4C9 6.5 6 10 6 13.5C6 17 8.5 19.5 12 19.5C15.5 19.5 18 17 18 13.5C18 10 15 6.5 12 4Z" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.2"/>
          <circle cx="12" cy="13" r="2.2" fill="white" fillOpacity="0.9"/>
        </svg>
      </button>

      {chatOpen && (
        <div className="ac-overlay" onClick={() => setChatOpen(false)}>
          <div className="ac-panel" onClick={e => e.stopPropagation()}>

            <div className="ac-topbar">
              <div className="ac-topbar-left">
                <span className="ac-brand">AuraCare</span>
                <span className="ac-online">
                  <span className="ac-online-dot" />
                  Active
                </span>
              </div>
              <button className="ac-close" onClick={() => setChatOpen(false)}>✕</button>
            </div>

            <div className="ac-messages" ref={chatBodyRef}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={msg.type === "bot" ? "ac-bot-msg" : "ac-user-msg"}>
                  {msg.text}
                </div>
              ))}
              {chatLoading && (
                <div className="ac-typing">
                  <span /><span /><span />
                </div>
              )}
            </div>

            {showSuggestions && chatMessages.length > 0 && (
              <div className="ac-suggestions">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    className="ac-suggest"
                    onClick={() => {
                      setChatInput(s);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="ac-input-pill">
              <input
                ref={inputRef}
                className="ac-input"
                type="text"
                placeholder="Ask about your wellness…"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleChatSend()}
              />
              <button
                className="ac-send"
                onClick={handleChatSend}
                disabled={chatLoading || !chatInput.trim()}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"/>
                  <polyline points="5 12 12 5 19 12"/>
                </svg>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}