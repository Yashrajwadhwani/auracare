import React, { useState, useEffect, useRef } from "react";
import CameraCapture from "./CameraCapture";

export default function AuraAssistant({ chatOpen, setChatOpen, userData }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [pendingImages, setPendingImages] = useState([]);
  const [imageError, setImageError] = useState(null);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    if (chatOpen && !greeted) {
      setGreeted(true);
      setTimeout(() => {
        setChatMessages([{ type: "bot", text: `Hello${userData?.username ? `, ${userData.username}` : ""} ✦` }]);
      }, 180);
      setTimeout(() => {
        setChatMessages(prev => [...prev, { type: "bot", text: "What would you like to explore today — skin, hair, or wellness? You can also send a photo for a personalised analysis." }]);
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

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const currentCount = pendingImages.length;
    const remainingSlots = 5 - currentCount;

    if (remainingSlots <= 0) {
      setImageError("You can only upload 5 photos at once");
      setTimeout(() => setImageError(null), 3000);
      e.target.value = "";
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      setImageError("You can only upload 5 photos at once");
      setTimeout(() => setImageError(null), 3000);
    }

    const newImages = [];
    let processed = 0;

    filesToProcess.forEach((file) => {
      const mediaType = file.type;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        const base64 = dataUrl.split(",")[1];
        const preview = dataUrl;
        newImages.push({ base64, mediaType, preview, id: Date.now() + Math.random() });
        processed++;
        if (processed === filesToProcess.length) {
          setPendingImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removePendingImage = (index) => {
    setPendingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleChatSend = async () => {
    if ((!chatInput.trim() && !pendingImages.length) || chatLoading) return;
    const userMsg = chatInput.trim();
    const imagesToSend = [...pendingImages];

    setChatInput("");
    setPendingImages([]);

    setChatMessages(prev => [...prev, {
      type: "user",
      text: userMsg,
      images: imagesToSend.map(img => img.preview)
    }]);
    setChatLoading(true);

    try {
      const userContent = [];
      if (imagesToSend.length > 0) {
        imagesToSend.forEach(img => {
          userContent.push({
            type: "image",
            source: {
              type: "base64",
              media_type: img.mediaType,
              data: img.base64
            }
          });
        });
      }
      if (userMsg) {
        userContent.push({ type: "text", text: userMsg });
      } else if (imagesToSend.length > 0) {
        userContent.push({ type: "text", text: "Please analyse these images and give me personalised skincare, haircare, or wellness advice based on what you see." });
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are AuraAssistant , a warm and knowledgeable wellness assistant specialising in skincare, haircare, and holistic self-care. The user's name is ${userData?.username || "there"}. Their skin type is ${userData?.skinType || "not specified"}. Their hair type is ${userData?.hairType || "not specified"}. Skin concerns: ${userData?.skinConcerns?.join(", ") || "none"}. Hair concerns: ${userData?.hairConcerns?.join(", ") || "none"}. If the user sends a photo, analyse it thoughtfully — for skin photos comment on visible concerns, texture, tone; for hair photos comment on condition, texture, potential issues; be warm, constructive and never harsh. Respond warmly and concisely. Max 4 sentences unless a list is genuinely useful. No markdown formatting — plain text only.`,
          messages: [{ role: "user", content: userContent }]
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
  const showSuggestions = !chatMessages.some(m => m.type === "user") && !pendingImages.length;

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
        @keyframes ac-preview-in {
          from { opacity:0; transform:scale(0.9) translateY(4px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
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

        .ac-user-msg-img {
          align-self: flex-end;
          max-width: 76%;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          animation: ac-msg-user 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }
        .ac-msg-photo {
          width: 160px;
          height: 160px;
          object-fit: cover;
          border-radius: 16px 16px 4px 16px;
          border: 2px solid rgba(252,250,247,0.15);
          display: block;
        }
        .ac-msg-text-below {
          background: var(--espresso, #3d3532);
          color: rgba(252,250,247,0.95);
          padding: 10px 16px;
          border-radius: 14px 14px 4px 14px;
          font-size: 0.9rem;
          line-height: 1.65;
          font-weight: 300;
          font-family: 'Playfair Display', serif;
          max-width: 100%;
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

        .ac-pending-preview {
          padding: 0 4px 10px;
          animation: ac-preview-in 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }
        .ac-pending-inner {
          position: relative;
          display: inline-block;
        }
        .ac-pending-thumb {
          width: 72px;
          height: 72px;
          object-fit: cover;
          border-radius: 14px;
          border: 2px solid rgba(252,250,247,0.3);
          display: block;
        }
        .ac-pending-remove {
          position: absolute;
          top: -7px; right: -7px;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: var(--espresso, #3d3532);
          border: 1.5px solid rgba(252,250,247,0.6);
          color: rgba(252,250,247,0.9);
          font-size: 9px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: 0.2s ease;
          line-height: 1;
        }
        .ac-pending-remove:hover {
          background: #5a2d2d;
        }
        .ac-pending-label {
          font-size: 0.62rem;
          color: rgba(252,250,247,0.5);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-family: 'Playfair Display', serif;
          margin-top: 5px;
        }

        .ac-input-pill {
          display: flex;
          align-items: center;
          background: var(--paper, #fcfaf7);
          border-radius: 40px;
          border: 1px solid var(--border, #e8e3df);
          padding: 6px 6px 6px 8px;
          gap: 6px;
          box-shadow: 0 8px 32px rgba(30,22,19,0.18);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .ac-input-pill:focus-within {
          border-color: #ddd7d2;
          box-shadow: 0 12px 40px rgba(30,22,19,0.22);
        }

        .ac-photo-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: var(--paper-dark, #f5f0ec);
          border: 1px solid var(--border, #e8e3df);
          color: var(--muted, #a39b95);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .ac-photo-btn:hover {
          background: var(--paper-mid, #f0ebe5);
          color: var(--espresso, #3d3532);
          border-color: #ddd7d2;
          transform: scale(1.05);
        }

        .ac-input {
          flex: 1;
          border: none; outline: none;
          background: transparent;
          font-family: 'Playfair Display', serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: var(--espresso, #3d3532);
          padding: 10px 4px;
          line-height: 1.4;
          min-width: 0;
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
          .ac-msg-photo { width: 130px; height: 130px; }
        }
      `}</style>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="visually-hidden"
        onChange={handleImageSelect}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="visually-hidden"
        onChange={handleImageSelect}
      />

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
                <span className="ac-brand">AuraAssistant</span>
                <span className="ac-online">
                  <span className="ac-online-dot" />
                  Active
                </span>
              </div>
              <button className="ac-close" onClick={() => setChatOpen(false)}>✕</button>
            </div>

            <div className="ac-messages" ref={chatBodyRef}>
              {chatMessages.map((msg, i) => {
                if (msg.type === "user" && msg.images && msg.images.length > 0) {
                  return (
                    <div key={i} className="ac-user-msg-img">
                      <div className="ac-msg-photos-grid" style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {msg.images.map((img, idx) => (
                          <img key={idx} src={img} alt="shared" className="ac-msg-photo" style={{ width: msg.images.length === 1 ? "160px" : "100px", height: msg.images.length === 1 ? "160px" : "100px" }} />
                        ))}
                      </div>
                      {msg.text && <div className="ac-msg-text-below">{msg.text}</div>}
                    </div>
                  );
                }
                return (
                  <div key={i} className={msg.type === "bot" ? "ac-bot-msg" : "ac-user-msg"}>
                    {msg.text}
                  </div>
                );
              })}
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

            {pendingImages.length > 0 && (
              <div className="ac-pending-preview">
                <div className="ac-pending-inner" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {pendingImages.map((img, idx) => (
                    <div key={img.id} style={{ position: "relative", display: "inline-block" }}>
                      <img src={img.preview} alt="pending" className="ac-pending-thumb" style={{ width: "72px", height: "72px" }} />
                      <button className="ac-pending-remove" onClick={() => removePendingImage(idx)}>✕</button>
                    </div>
                  ))}
                </div>
                <div className="ac-pending-label">{pendingImages.length} photo{pendingImages.length > 1 ? "s" : ""} ready to send</div>
              </div>
            )}

            {imageError && (
              <div className="ac-image-error" style={{
                padding: "0 4px 10px",
                animation: "ac-preview-in 0.3s cubic-bezier(0.16,1,0.3,1) both"
              }}>
                <span style={{
                  display: "inline-block",
                  background: "#fdf5f5",
                  border: "1px solid #d4b8b8",
                  color: "#9a4040",
                  padding: "8px 16px",
                  borderRadius: "40px",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "0.78rem",
                  fontWeight: "300",
                  letterSpacing: "0.3px"
                }}>{imageError}</span>
              </div>
            )}

            <div className="ac-input-pill">
              <button
                className="ac-photo-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Upload from gallery"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </button>
              <button
                className="ac-photo-btn"
                onClick={() => setCameraOpen(true)}
                title="Take a photo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>

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
                disabled={chatLoading || (!chatInput.trim() && !pendingImages.length)}
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
      <CameraCapture
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(dataUrl) => {
          if (pendingImages.length >= 5) {
            setImageError("You can only upload 5 photos at once");
            setTimeout(() => setImageError(null), 3000);
            return;
          }
          const base64 = dataUrl.split(",")[1];
          setPendingImages(prev => [...prev, { base64, mediaType: "image/jpeg", preview: dataUrl, id: Date.now() + Math.random() }]);
        }}
        title="Take Photo"
      />
    </>
  );
}