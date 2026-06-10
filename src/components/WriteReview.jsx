import React, { useState } from "react";

const tagOptions = ["Skincare", "Haircare", "Wellness"];

export default function WriteReview({ userData, onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [tag, setTag] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!rating) { setError("Please select a rating."); return; }
    if (!tag) { setError("Please select a category."); return; }
    if (text.trim().length < 15) { setError("Please write at least a couple of sentences."); return; }
    setError("");
    setSubmitting(true);

    // Simulate backend call — swap this fetch for your real endpoint
    await new Promise(res => setTimeout(res, 900));

    const review = {
      name: userData.username || "Anonymous",
      handle: `@${(userData.username || "user").toLowerCase().replace(/\s+/g, "")}`,
      rating,
      text: text.trim(),
      tag,
      img: userData.profilePhoto || null,
    };

    setSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      onSubmit(review);
      onClose();
    }, 1400);
  };

  const avatarColors = ["#c9a97a","#a0856c","#8c7b6e","#b8a99a","#9e8877","#c4a882"];
  function getColor(name) {
    if (!name) return "#b8a99a";
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return avatarColors[Math.abs(h) % avatarColors.length];
  }
  const avatarColor = getColor(userData.username);

  return (
    <>
      <div className="wr-overlay" onClick={onClose} />
      <div className="wr-panel">
        <button className="wr-close" onClick={onClose}>✕</button>

        {submitted ? (
          <div className="wr-success">
            <div className="wr-success-icon">✦</div>
            <h2>Thank you</h2>
            <p>Your review has been shared with the community.</p>
          </div>
        ) : (
          <>
            <div className="wr-header">
              <span className="wr-eyebrow">Community</span>
              <h2>Share Your Experience</h2>
              <p>Help others on their wellness journey.</p>
            </div>

            {/* Preview card */}
            <div className="wr-preview">
              <div className="wr-preview-avatar-wrap">
                {userData.profilePhoto ? (
                  <img src={userData.profilePhoto} alt="" className="wr-preview-avatar-img" />
                ) : (
                  <div
                    className="wr-preview-avatar-initials"
                    style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}bb)` }}
                  >
                    {userData.username ? userData.username.charAt(0).toUpperCase() : "✦"}
                  </div>
                )}
              </div>
              <div>
                <span className="wr-preview-name">{userData.username || "Your Name"}</span>
                <span className="wr-preview-handle">
                  @{userData.username ? userData.username.toLowerCase().replace(/\s+/g, "") : "username"}
                </span>
              </div>
            </div>

            {/* Star rating */}
            <div className="wr-field">
              <label className="wr-label">Rating</label>
              <div className="wr-stars">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    className={`wr-star${(hoveredStar || rating) >= s ? " active" : ""}`}
                    onMouseEnter={() => setHoveredStar(s)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(s)}
                    type="button"
                  >
                    ★
                  </button>
                ))}
                {rating > 0 && (
                  <span className="wr-rating-label">
                    {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="wr-field">
              <label className="wr-label">Category</label>
              <div className="wr-tags">
                {tagOptions.map(t => (
                  <button
                    key={t}
                    className={`wr-tag-btn${tag === t ? " selected" : ""}`}
                    onClick={() => setTag(t)}
                    type="button"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Text */}
            <div className="wr-field">
              <label className="wr-label">Your Review</label>
              <textarea
                className="wr-textarea"
                placeholder="Share what transformed your routine, what results you noticed, or what made AuraCare special for you…"
                value={text}
                onChange={e => setText(e.target.value)}
                rows={4}
                maxLength={400}
              />
              <div className="wr-char-count">{text.length} / 400</div>
            </div>

            {error && <p className="wr-error">{error}</p>}

            <button
              className={`wr-submit${submitting ? " loading" : ""}`}
              onClick={handleSubmit}
              disabled={submitting}
              type="button"
            >
              {submitting ? (
                <span className="wr-dots">
                  <span /><span /><span />
                </span>
              ) : (
                "Publish Review"
              )}
            </button>
          </>
        )}
      </div>

      <style>{`
        .wr-overlay {
          position: fixed;
          inset: 0;
          background: rgba(30,22,19,0.32);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 10000;
          animation: fadeIn 0.25s ease;
        }
        .wr-panel {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 28px;
          padding: 44px 40px 40px;
          z-index: 10001;
          box-shadow: 0 20px 60px rgba(61,53,50,0.18);
          animation: scaleIn 0.35s cubic-bezier(0.4,0,0.2,1);
          scrollbar-width: thin;
          scrollbar-color: var(--border, #e8e3df) transparent;
        }
        .wr-panel::-webkit-scrollbar { width: 4px; }
        .wr-panel::-webkit-scrollbar-thumb { background: var(--border, #e8e3df); border-radius: 4px; }

        .wr-close {
          position: absolute;
          top: 18px;
          right: 20px;
          border: none;
          background: var(--paper-dark, #f5f0ec);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 0.9rem;
          color: var(--text-secondary, #726861);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .wr-close:hover {
          background: var(--paper-mid, #f0ebe5);
          color: var(--espresso, #3d3532);
        }

        .wr-header {
          margin-bottom: 28px;
        }
        .wr-eyebrow {
          display: block;
          font-size: 0.62rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--muted, #a39b95);
          margin-bottom: 10px;
          font-weight: 400;
        }
        .wr-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 400;
          color: var(--espresso, #3d3532);
          margin-bottom: 8px;
          line-height: 1.2;
        }
        .wr-header p {
          font-family: 'Playfair Display', serif;
          font-size: 0.88rem;
          color: var(--text-secondary, #726861);
          font-weight: 300;
        }

        .wr-preview {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--paper, #fcfaf7);
          border: 1px solid var(--border, #e8e3df);
          border-radius: 18px;
          padding: 16px 20px;
          margin-bottom: 28px;
        }
        .wr-preview-avatar-wrap {
          flex-shrink: 0;
        }
        .wr-preview-avatar-img {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          box-shadow: 0 2px 8px rgba(61,53,50,0.12);
        }
        .wr-preview-avatar-initials {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 400;
          color: white;
          box-shadow: 0 2px 8px rgba(61,53,50,0.12);
        }
        .wr-preview-name {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          font-weight: 400;
          color: var(--espresso, #3d3532);
        }
        .wr-preview-handle {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 0.75rem;
          color: var(--muted, #a39b95);
          font-weight: 300;
        }

        .wr-field {
          margin-bottom: 24px;
        }
        .wr-label {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 0.72rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-secondary, #726861);
          margin-bottom: 10px;
          font-weight: 400;
        }

        .wr-stars {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .wr-star {
          background: none;
          border: none;
          font-size: 1.8rem;
          color: var(--border, #e8e3df);
          cursor: pointer;
          padding: 0 2px;
          transition: color 0.15s ease, transform 0.15s ease;
          line-height: 1;
          font-family: serif;
        }
        .wr-star.active {
          color: var(--espresso, #3d3532);
        }
        .wr-star:hover {
          transform: scale(1.18);
        }
        .wr-rating-label {
          font-family: 'Playfair Display', serif;
          font-size: 0.78rem;
          color: var(--muted, #a39b95);
          font-style: italic;
          margin-left: 8px;
          font-weight: 300;
        }

        .wr-tags {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .wr-tag-btn {
          font-family: 'Playfair Display', serif;
          font-size: 0.82rem;
          padding: 9px 20px;
          border-radius: 40px;
          border: 1px solid var(--border, #e8e3df);
          background: var(--paper, #fcfaf7);
          color: var(--text-secondary, #726861);
          cursor: pointer;
          transition: 0.25s cubic-bezier(0.4,0,0.2,1);
          letter-spacing: 0.3px;
        }
        .wr-tag-btn:hover {
          border-color: #ccc5c0;
          color: var(--espresso, #3d3532);
        }
        .wr-tag-btn.selected {
          background: var(--espresso, #3d3532);
          border-color: var(--espresso, #3d3532);
          color: white;
          box-shadow: 0 4px 14px rgba(61,53,50,0.18);
        }

        .wr-textarea {
          width: 100%;
          padding: 16px 18px;
          border: 1px solid var(--border, #e8e3df);
          border-radius: 18px;
          font-family: 'Playfair Display', serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: var(--espresso, #3d3532);
          background: var(--paper, #fcfaf7);
          resize: none;
          outline: none;
          line-height: 1.65;
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .wr-textarea:focus {
          border-color: var(--espresso, #3d3532);
          background: white;
        }
        .wr-textarea::placeholder {
          color: var(--muted, #a39b95);
          font-style: italic;
        }
        .wr-char-count {
          font-family: 'Playfair Display', serif;
          font-size: 0.7rem;
          color: var(--muted, #a39b95);
          text-align: right;
          margin-top: 6px;
          font-weight: 300;
        }

        .wr-error {
          font-family: 'Playfair Display', serif;
          font-size: 0.82rem;
          color: #9a5050;
          margin-bottom: 14px;
          font-style: italic;
          text-align: center;
          font-weight: 300;
        }

        .wr-submit {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 20px;
          background: var(--espresso, #3d3532);
          color: white;
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: 0.3s cubic-bezier(0.4,0,0.2,1);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
        }
        .wr-submit:hover:not(:disabled) {
          background: #4b3d36;
          transform: translateY(-2px);
          box-shadow: 0 10px 36px rgba(61,53,50,0.14);
        }
        .wr-submit:disabled { opacity: 0.6; cursor: default; transform: none; }
        .wr-submit.loading { background: #4b3d36; }

        .wr-dots {
          display: flex;
          gap: 5px;
          align-items: center;
        }
        .wr-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.7);
          animation: typingDot 1.2s infinite;
        }
        .wr-dots span:nth-child(2) { animation-delay: 0.2s; }
        .wr-dots span:nth-child(3) { animation-delay: 0.4s; }

        /* Success state */
        .wr-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
          gap: 16px;
          animation: fadeIn 0.4s ease;
        }
        .wr-success-icon {
          font-size: 2.8rem;
          color: var(--espresso, #3d3532);
          opacity: 0.5;
          animation: fadeIn 0.5s ease 0.1s both;
        }
        .wr-success h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 400;
          color: var(--espresso, #3d3532);
        }
        .wr-success p {
          font-family: 'Playfair Display', serif;
          font-size: 0.9rem;
          color: var(--text-secondary, #726861);
          font-weight: 300;
          font-style: italic;
          line-height: 1.6;
        }

        @media (max-width: 540px) {
          .wr-panel { padding: 36px 22px 32px; border-radius: 22px; }
          .wr-header h2 { font-size: 1.7rem; }
        }
      `}</style>
    </>
  );
}