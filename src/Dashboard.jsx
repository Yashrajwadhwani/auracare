import React, { useState, useMemo } from "react";
import SkincareSpace from "./components/SkincareSpace";
import HaircareSpace from "./components/HaircareSpace";
import SelfcareSpace from "./components/SelfcareSpace";
import ProfilePage from "./components/ProfilePage";
import AuraAssistant from "./components/AuraAssistant";

// ── Insights pool ──────────────────────────────────────────────────────────
const INSIGHTS = [
  "True wellness is quiet harmony.",
  "Nourish the skin you're in, not the skin you wish for.",
  "Rest is not laziness — it is the deepest act of self-care.",
  "Consistency, not perfection, is the root of radiance.",
  "What you put on your body matters as much as what you put in it.",
  "A calm mind is the foundation of glowing skin.",
  "Hydration is the simplest luxury you can give yourself.",
  "Beauty begins the moment you decide to be yourself.",
  "Slow mornings are a form of self-respect.",
  "Your skin keeps a diary. Let it write good stories.",
];

const avatarColors = [
  "#c9a97a", "#a0856c", "#8c7b6e", "#b8a99a",
  "#9e8877", "#c4a882", "#7a6a60", "#d4b896"
];

function getAvatarColor(name) {
  if (!name) return "#b8a99a";
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

// ── Base discipline data ───────────────────────────────────────────────────
const BASE_DISCIPLINES = [
  {
    id: "skincare",
    label: "Skincare",
    sub: "Personalized glow rituals for your skin type.",
    img: "skincare.jpeg",
    imgPosition: "center center",
    linkedGoals: ["Reduce Acne", "Glowing Skin"]
  },
  {
    id: "haircare",
    label: "Haircare",
    sub: "Scalp & strand recovery protocols.",
    img: "haircare.jpeg",
    imgPosition: "center center",
    linkedGoals: ["Healthy Hair"]
  },
  {
    id: "wellness",
    label: "Wellness",
    sub: "Mind & body restoration rituals.",
    img: "welness.jpeg",
    imgPosition: "center 80%",
    linkedGoals: ["Stress Relief"]
  }
];

function getPrioritizedDisciplines(userData, isLoggedIn) {
  if (!isLoggedIn || !userData?.goals || userData.goals.length === 0) {
    return BASE_DISCIPLINES;
  }

  const matches = BASE_DISCIPLINES.filter(d =>
    d.linkedGoals.some(g => userData.goals.includes(g))
  );

  if (matches.length === 0) {
    return BASE_DISCIPLINES;
  }

  const winner = matches.length === 1
    ? matches[0]
    : matches[Math.floor(Math.random() * matches.length)];

  const others = BASE_DISCIPLINES.filter(d => d.id !== winner.id);
  return [winner, ...others];
}

// Streak config
const STREAK_FILLED = 5;
const STREAK_TOTAL  = 7;

function Dashboard({ userData, setUserData, reviews, onNewReview, onLogout, avatarColor, onBackToHome }) {
  const [activeTab, setActiveTab] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [insight] = useState(
    () => INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)]
  );

  const disciplines = useMemo(
    () => getPrioritizedDisciplines(userData, true),
    [userData]
  );

  const currentHour = new Date().getHours();
  let greeting = "Good evening";
  if (currentHour < 12) greeting = "Good morning";
  else if (currentHour < 18) greeting = "Good afternoon";

  return (
    <div className="dashboard-root">
      <div className="app-container">
        {/* ── Top Bar ───────────────── */}
        <div className="top-bar">
          <div className="brand-name-wrap">
            <span
              className="nav-italiana-logo"
              onClick={onBackToHome}
              title="Back to Home"
              style={{ cursor: "pointer" }}
            >
              auracare
            </span>
          </div>
          <div className="top-bar-right">
            <div
              className="profile-circle"
              onClick={() => setProfileOpen(true)}
              title={`${userData.username || "Profile"}`}
              style={
                userData.profilePhoto
                  ? {
                      cursor: "pointer",
                      border: `2px solid ${avatarColor}66`,
                      boxShadow: "0 2px 10px rgba(61,53,50,0.18)",
                      overflow: "hidden",
                      padding: 0,
                    }
                  : {
                      background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}cc)`,
                      cursor: "pointer",
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: "17px",
                      fontWeight: "500",
                      color: "white",
                      border: `2px solid ${avatarColor}66`,
                      boxShadow: "0 2px 10px rgba(61,53,50,0.18)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      userSelect: "none",
                    }
              }
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.boxShadow = "0 4px 18px rgba(61,53,50,0.28)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 2px 10px rgba(61,53,50,0.18)";
              }}
            >
              {userData.profilePhoto ? (
                <img
                  src={userData.profilePhoto}
                  alt={userData.username || "Profile"}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }}
                />
              ) : (
                userData.username
                  ? userData.username.charAt(0).toUpperCase()
                  : "✦"
              )}
            </div>
          </div>
        </div>

        <header className="dash-header">
          <div className="dash-header-eyebrow">Wellness Dashboard</div>
          <h1>{greeting}, {userData.username || "there"}.</h1>
          <p>Your wellness ecosystem is synchronized.</p>
        </header>

        <div className="stats-grid">
          <div className="card card-animate" style={{ animationDelay: "0.1s" }}>
            <h4>Atmospheric</h4>
            <h3>UV Index: 4</h3>
            <h3 style={{ fontSize: '1.2rem', marginTop: '6px' }}>24°C · Mumbai, IN</h3>
            <span className="card-hint">Moderate · Reapply SPF every 3h</span>
          </div>

          <div className="card card-animate" style={{ animationDelay: "0.2s" }}>
            <h4>Consistency</h4>
            <h3>{STREAK_FILLED} Days</h3>
            <div className="streak-dots">
              {Array.from({ length: STREAK_TOTAL }).map((_, i) => (
                <div key={i} className={`dot${i < STREAK_FILLED ? " filled" : ""}`} />
              ))}
            </div>
          </div>

          <div className="card quote-card card-animate" style={{ animationDelay: "0.3s" }}>
            <h4>Insight</h4>
            <h3>"{insight}"</h3>
          </div>
        </div>

        {/* ── Bento Curated Section ── */}
        <div className="recommend-section">
          <div className="section-header-row">
            <h2>Curated for You</h2>
            <span className="section-count">03 disciplines</span>
          </div>

          <div className="bento-grid">
            {disciplines.map((item, i) => (
              <div
                key={item.id}
                className="bento-card card-animate"
                style={{ animationDelay: `${0.2 * (i + 1)}s` }}
                onClick={() => setActiveTab(item.id)}
              >
                <img
                  src={item.img}
                  alt={item.label}
                  loading="lazy"
                  style={{ objectPosition: item.imgPosition }}
                />
                <div className="bento-overlay">
                  <div className="bento-content">
                    <span className="bento-tag">{item.label}</span>
                    <h3>{item.label}</h3>
                    <p>{item.sub}</p>
                    <span className="bento-arrow">
                      Explore <span className="arrow-icon">→</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ─────────────────── */}
        <footer className="footer">
          <div className="footer-left">
            <div className="footer-brand">
              <span className="footer-italiana-logo">auracare</span>
            </div>
            <p>Personalized wellness ecosystem designed for mindful living.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Explore</h4>
              <p onClick={() => setActiveTab("skincare")}>Skincare</p>
              <p onClick={() => setActiveTab("haircare")}>Haircare</p>
              <p onClick={() => setActiveTab("wellness")}>Wellness</p>
            </div>
            <div>
              <h4>Company</h4>
              <p>About</p>
              <p>Contact</p>
              <p>Privacy</p>
            </div>
          </div>
        </footer>
      </div>

      {activeTab && (
        <div className="popup-overlay" onClick={() => setActiveTab("")}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setActiveTab("")}>✕</button>
            {activeTab === "skincare" && <SkincareSpace userData={userData} />}
            {activeTab === "haircare" && <HaircareSpace userData={userData} />}
            {activeTab === "wellness" && <SelfcareSpace userData={userData} />}
          </div>
        </div>
      )}

      {profileOpen && (
        <ProfilePage
          userData={userData}
          onClose={() => setProfileOpen(false)}
          onSave={(updated) => {
            setUserData(updated);
            setProfileOpen(false);
          }}
          onLogout={onLogout}
        />
      )}

      <AuraAssistant
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        userData={userData}
      />

      {/* ── Inline styles ── */}
      <style>{`
        .nav-italiana-logo {
          cursor: pointer;
        }

        .section-header-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 28px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .section-header-row h2 {
          font-size: 1.6rem;
          font-weight: 400;
          color: #3d3532;
          margin: 0;
          font-family: 'Playfair Display', serif;
        }

        .section-count {
          font-size: 0.75rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #a39b95;
          font-family: 'Playfair Display', serif;
        }

        /* ── Bento Grid ── */
        .bento-grid {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 20px;
          height: 520px;
        }

        .bento-card {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 24px rgba(61,53,50,0.08);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .bento-card:nth-child(1) {
          grid-row: 1 / 3;
        }

        .bento-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 24px 48px rgba(61,53,50,0.18);
        }

        .bento-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          display: block;
        }

        .bento-card:hover img {
          transform: scale(1.1);
        }

        .bento-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 36px;
          background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0) 100%);
        }

        .bento-content {
          position: relative;
          z-index: 2;
        }

        .bento-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 7px 16px;
          border-radius: 40px;
          font-size: 0.68rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.95);
          margin-bottom: 16px;
          width: fit-content;
          font-family: 'Playfair Display', serif;
        }

        .bento-content h3 {
          font-size: 1.9rem;
          font-weight: 400;
          color: white;
          margin: 0 0 10px 0;
          font-family: 'Playfair Display', serif;
          line-height: 1.2;
        }

        .bento-content p {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.75);
          font-weight: 300;
          margin: 0 0 24px 0;
          line-height: 1.6;
          max-width: 280px;
        }

        .bento-arrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          font-family: 'Playfair Display', serif;
          transition: gap 0.3s ease;
        }

        .arrow-icon {
          transition: transform 0.3s ease;
          display: inline-block;
        }

        .bento-card:hover .bento-arrow {
          gap: 14px;
        }

        .bento-card:hover .arrow-icon {
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .bento-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            height: auto;
          }

          .bento-card:nth-child(1) {
            grid-row: auto;
            height: 340px;
          }

          .bento-card:nth-child(2),
          .bento-card:nth-child(3) {
            height: 220px;
          }

          .bento-overlay {
            padding: 28px;
          }

          .bento-content h3 {
            font-size: 1.5rem;
          }
        }

        .review-avatar-fallback {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 400;
          color: white;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;