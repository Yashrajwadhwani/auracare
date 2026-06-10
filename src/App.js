import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import ProfilePage from "./components/ProfilePage";
import WriteReview from "./components/WriteReview";
import CameraCapture from "./components/CameraCapture";


const initialReviews = [
  {
    name: "Priya Sharma",
    handle: "@priyaskincare",
    rating: 5,
    text: "AuraCare completely transformed my skincare routine. The personalized recommendations are spot on for my combination skin. I've seen visible results in just 3 weeks.",
    tag: "Skincare",
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face&q=80"
  },
  {
    name: "Meera Joshi",
    handle: "@meerawellness",
    rating: 5,
    text: "The wellness rituals section is incredible. I love how everything is curated to my lifestyle. The AI assistant feels like talking to a real beauty expert.",
    tag: "Wellness",
    img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face&q=80"
  },
  {
    name: "Ananya Patel",
    handle: "@ananyabeauty",
    rating: 5,
    text: "Finally an app that understands Indian skin tones and concerns. My haircare routine is finally working thanks to AuraCare's tailored approach.",
    tag: "Haircare",
    img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop&crop=face&q=80"
  },
  {
    name: "Nisha Kapoor",
    handle: "@nishaglows",
    rating: 5,
    text: "The streak tracking keeps me motivated every single day. My skin barrier has healed significantly since I started following the PM routine suggestions.",
    tag: "Skincare",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face&q=80"
  },
  {
    name: "Kavitha Reddy",
    handle: "@kavithareddy",
    rating: 5,
    text: "I was skeptical at first but the personalized analysis was so accurate. The chatbot gives better advice than most generic skincare blogs out there.",
    tag: "Wellness",
    img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=100&h=100&fit=crop&crop=face&q=80"
  },
  {
    name: "Divya Menon",
    handle: "@divyaselfcare",
    rating: 5,
    text: "Absolutely love the minimal, premium design and the thoughtfulness behind every recommendation. AuraCare has become my daily wellness companion.",
    tag: "Haircare",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face&q=80"
  }
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

// ── localStorage helpers ───────────────────────────────────────────────────
const STORAGE_KEY = "auracare_session";
const VIEW_KEY = "auracare_view";

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSession(loggedIn, userData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ loggedIn, userData }));
  } catch {}
}

function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function loadView() {
  try {
    return localStorage.getItem(VIEW_KEY) || "landing";
  } catch {
    return "landing";
  }
}

function saveView(view) {
  try {
    localStorage.setItem(VIEW_KEY, view);
  } catch {}
}

function clearView() {
  try {
    localStorage.removeItem(VIEW_KEY);
  } catch {}
}

// ── Default empty user data ──────────────────────────────────────────────
const EMPTY_USER = {
  username: "",
  email: "",
  password: "",
  skinType: "",
  hairType: "",
  waterIntake: "",
  sleep: "",
  skinConcerns: [],
  hairConcerns: [],
  goals: [],
  profilePhoto: null,
};

function App() {
  const [introPhase, setIntroPhase] = useState("visible");
  const [authPage, setAuthPage] = useState(null);
  const [authScreen, setAuthScreen] = useState("login");
  const [view, setView] = useState(() => loadView());
  const [profileOpen, setProfileOpen] = useState(false);
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [newReviewKey, setNewReviewKey] = useState(null);

  const session = loadSession();
  const [loggedIn, setLoggedIn] = useState(session?.loggedIn || false);
  const [userData, setUserData] = useState(session?.userData || { ...EMPTY_USER });
  const [reviews, setReviews] = useState(initialReviews);

  const authBoxRef = useRef(null);
  const surveyPhotoInputRef = useRef(null);
  const surveyCameraInputRef = useRef(null);

  // ── Update document title & favicon ──
  useEffect(() => {
    document.title = "auracare.ai";
    const existingFavicon = document.querySelector("link[rel~='icon']");
    if (existingFavicon) {
      existingFavicon.href = "/logo.jpeg";
    } else {
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/jpeg";
      link.href = "/logo.jpeg";
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => { saveView(view); }, [view]);

  useEffect(() => {
    const logoTimer = setTimeout(() => setIntroPhase("fading"), 4100);
    const doneTimer = setTimeout(() => setIntroPhase("done"), 5300);
    return () => { clearTimeout(logoTimer); clearTimeout(doneTimer); };
  }, []);

  useEffect(() => {
    if (loggedIn) saveSession(loggedIn, userData);
  }, [loggedIn, userData]);

  useEffect(() => {
    if (authBoxRef.current) authBoxRef.current.scrollTop = 0;
  }, [authScreen]);

  const openSignIn = () => { setAuthScreen("login"); setAuthPage("open"); };
  const closeAuth = () => { setAuthPage(null); };
  const handleLoginSuccess = () => { setLoggedIn(true); closeAuth(); };
  const handleSurveyFinish = () => { setLoggedIn(true); closeAuth(); };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserData({ ...EMPTY_USER });
    clearSession();
    setView("landing");
    clearView();
    setProfileOpen(false);
  };

  const handleNewReview = (review) => {
    const reviewWithId = { ...review, _isNew: true, _id: Date.now() };
    setReviews(prev => [reviewWithId, ...prev]);
    setNewReviewKey(reviewWithId._id);
    setTimeout(() => setNewReviewKey(null), 3000);
  };

  const toggleConcern = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleSurveyPhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUserData(prev => ({ ...prev, profilePhoto: ev.target.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const avatarColor = getAvatarColor(userData.username);

  return (
    <div className="App">
      {/* ── Splash Screen ── */}
      {introPhase !== "done" && view === "landing" && (
        <div className={`splash-screen${introPhase === "fading" ? " fade-out" : ""}`}>
          <div className="splash-inner">
            <svg className="splash-waves" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path d="M0,100 Q250,50 500,100 T1000,100 T1500,100" fill="none" stroke="#D3CBBB" strokeWidth="1" />
              <path d="M0,150 Q250,100 500,150 T1000,150 T1500,150" fill="none" stroke="#D3CBBB" strokeWidth="1" />
              <path d="M0,200 Q250,150 500,200 T1000,200 T1500,200" fill="none" stroke="#D3CBBB" strokeWidth="1" />
              <path d="M0,250 Q250,200 500,250 T1000,250 T1500,250" fill="none" stroke="#D3CBBB" strokeWidth="1" />
            </svg>
            <div className="splash-logo-container">
              <div className="splash-italiana-wrap">
                {"auracare".split("").map((letter, i) => (
                  <span key={i} className="splash-letter" style={{ animationDelay: `${0.5 + i * 0.18}s` }}>
                    {letter}
                  </span>
                ))}
              </div>
              <div className="splash-underline-wrap">
                <svg viewBox="0 0 300 20" preserveAspectRatio="none" className="splash-underline-svg">
                  <path d="M 0,10 Q 75,0 150,10 T 300,10" fill="none" stroke="#1A1A1A" strokeWidth="0.8" strokeLinecap="round" className="splash-underline-path" />
                </svg>
              </div>
            </div>
            <p className="splash-subtitle">your wellness ecosystem</p>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
         LANDING PAGE
         ════════════════════════════════════════════════════ */}
      <div className="app-container">
        {/* ── Top Bar ── */}
        <div className="top-bar">
          <div className="brand-name-wrap">
            <img
              src="/logo.jpeg"
              alt="AuraCare"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: "9px",
                verticalAlign: "middle",
                boxShadow: "0 2px 8px rgba(61,53,50,0.15)",
                flexShrink: 0,
              }}
            />
            <span className="nav-italiana-logo">auracare</span>
          </div>
          <div className="top-bar-right">
            {!loggedIn && (
              <button className="auth-trigger" onClick={openSignIn}>Sign In</button>
            )}
            {loggedIn && (
              <div
                className="profile-circle"
                onClick={() => setProfileOpen(true)}
                title={`${userData.username || "Profile"}`}
                style={
                  userData.profilePhoto
                    ? { cursor: "pointer", border: `2px solid ${avatarColor}66`, boxShadow: "0 2px 10px rgba(61,53,50,0.18)", overflow: "hidden", padding: 0 }
                    : { background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}cc)`, cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "17px", fontWeight: "500", color: "white", border: `2px solid ${avatarColor}66`, boxShadow: "0 2px 10px rgba(61,53,50,0.18)", transition: "transform 0.2s ease, box-shadow 0.2s ease", userSelect: "none" }
                }
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(61,53,50,0.28)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(61,53,50,0.18)"; }}
              >
                {userData.profilePhoto ? (
                  <img src={userData.profilePhoto} alt={userData.username || "Profile"} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", display: "block" }} />
                ) : (
                  userData.username ? userData.username.charAt(0).toUpperCase() : "✦"
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Hero ── */}
        <header className="landing-hero">
          <span className="dash-header-eyebrow" style={{ animationDelay: "0.1s" }}>
            Welcome to AuraCare
          </span>
          <h1>Where wellness meets intention.</h1>
          <p className="landing-desc">
            AuraCare is a personalized wellness ecosystem designed for mindful living.
            We blend ancient self-care wisdom with modern science to curate skincare,
            haircare, and wellness rituals that honor your unique biology, environment,
            and rhythm. Every recommendation is tailored, every ritual is intentional,
            and every journey is yours alone.
          </p>
          <div className="landing-cta-wrap">
            {loggedIn ? (
              <button className="landing-cta" onClick={() => setView("dashboard")}>Go to Dashboard</button>
            ) : (
              <button className="landing-cta" onClick={() => { setAuthScreen("register"); setAuthPage("open"); }}>
                Begin Your Journey
              </button>
            )}
            <span className="landing-cta-hint">
              {loggedIn ? "Your wellness dashboard awaits." : "Join 50,000+ mindful members."}
            </span>
          </div>
        </header>

        {/* ── Reviews ── */}
        <section className="reviews-section">
          <div className="reviews-header">
            <span className="reviews-eyebrow">Community</span>
            <h2>Real Results, Real People</h2>
            <p>Thousands of users transforming their wellness journey with AuraCare.</p>

            {loggedIn && (
              <button className="write-review-btn" onClick={() => setWriteReviewOpen(true)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Write a Review
              </button>
            )}
          </div>

          <div className="reviews-grid">
            {reviews.map((review, i) => (
              <div
                className={`review-card card-animate${review._id && review._id === newReviewKey ? " review-card--new" : ""}`}
                key={review._id || i}
                style={{ animationDelay: `${0.08 * (i + 1)}s` }}
              >
                {review._id && review._id === newReviewKey && (
                  <div className="review-new-badge">✦ Just added</div>
                )}
                <div className="review-top">
                  <div className="review-avatar-wrap">
                    {review.img ? (
                      <img src={review.img} alt={review.name} className="review-avatar" />
                    ) : (
                      <div
                        className="review-avatar-fallback"
                        style={{ background: `linear-gradient(135deg, ${getAvatarColor(review.name)}, ${getAvatarColor(review.name)}bb)` }}
                      >
                        {review.name ? review.name.charAt(0).toUpperCase() : "✦"}
                      </div>
                    )}
                    <div className="review-avatar-ring" />
                  </div>
                  <div className="review-user-info">
                    <span className="review-name">{review.name}</span>
                    <span className="review-handle">{review.handle}</span>
                  </div>
                  <span className="review-tag-badge">{review.tag}</span>
                </div>
                <div className="review-stars">
                  {Array.from({ length: review.rating }).map((_, si) => (
                    <span key={si} className="review-star">★</span>
                  ))}
                </div>
                <p className="review-text">"{review.text}"</p>
              </div>
            ))}
          </div>

          <div className="reviews-summary">
            <div className="summary-stat">
              <span className="summary-num">50K+</span>
              <span className="summary-label">Active Users</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-stat">
              <span className="summary-num">4.9</span>
              <span className="summary-label">Average Rating</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-stat">
              <span className="summary-num">98%</span>
              <span className="summary-label">Satisfaction</span>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="footer landing-footer">
          <div className="footer-main">
            <div className="footer-left">
              <div className="footer-brand">
                <img
                  src="/logo.jpeg"
                  alt="AuraCare"
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "9px",
                    verticalAlign: "middle",
                    boxShadow: "0 2px 6px rgba(61,53,50,0.12)",
                    flexShrink: 0,
                  }}
                />
                <span className="footer-italiana-logo">auracare</span>
              </div>
              <p className="footer-desc">
                Personalized wellness ecosystem designed for mindful living.
                Curated rituals for skincare, haircare, and inner balance.
              </p>
              <div className="footer-contact">
                <div className="footer-contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>AuraCare HQ, Bandra West, Mumbai 400050, IN</span>
                </div>
                <div className="footer-contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>+91 98765 43210</span>
                </div>
                <div className="footer-contact-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>hello@auracare.ai</span>
                </div>
              </div>
            </div>

            <div className="footer-links">
              <div>
                <h4>Explore</h4>
                <p onClick={loggedIn ? () => setView("dashboard") : openSignIn}>Dashboard</p>
                <p onClick={loggedIn ? () => setView("dashboard") : openSignIn}>Skincare</p>
                <p onClick={loggedIn ? () => setView("dashboard") : openSignIn}>Haircare</p>
                <p onClick={loggedIn ? () => setView("dashboard") : openSignIn}>Wellness</p>
              </div>
              <div>
                <h4>Company</h4>
                <p>About</p>
                <p>Contact</p>
                <p>Privacy</p>
                <p>Terms</p>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-social">
              <a href="https://instagram.com/auracare" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://twitter.com/auracare" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
              <a href="https://pinterest.com/auracare" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Pinterest">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="8" x2="12" y2="21" />
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M10.61 19.89a11 11 0 0 1-1.95-2.46" />
                  <path d="M15.39 19.89a11 11 0 0 0 1.95-2.46" />
                  <path d="M17.67 16.56a11 11 0 0 1-2.08-1.3" />
                  <path d="M6.33 16.56a11 11 0 0 0 2.08-1.3" />
                  <circle cx="12" cy="8" r="2" />
                </svg>
              </a>
              <a href="https://linkedin.com/company/auracare" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
            <span className="footer-copyright">© 2026 auracare.ai. All rights reserved.</span>
          </div>
        </footer>
      </div>

      {/* ── Auth Popup ── */}
      {authPage && (
        <div className="auth-popup-overlay" onClick={closeAuth}>
          <div className="modern-auth-box" ref={authBoxRef} onClick={e => e.stopPropagation()}>
            <button className="close-popup" onClick={closeAuth}>✕</button>

            {(authScreen === "register" || authScreen === "survey") && (
              <div className="auth-progress">
                <div className={`progress-step${authScreen === "register" || authScreen === "survey" ? " done" : ""}`}>
                  <div className="progress-dot" />
                  <span>Account</span>
                </div>
                <div className="progress-line" />
                <div className={`progress-step${authScreen === "survey" ? " done" : ""}`}>
                  <div className="progress-dot" />
                  <span>Analysis</span>
                </div>
              </div>
            )}

            {authScreen === "login" && (
              <div className="auth-form fade-in" key="login">
                <div className="auth-brand-mark">
                  <img
                    src="/logo.jpeg"
                    alt="AuraCare"
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "8px",
                      verticalAlign: "middle",
                      boxShadow: "0 2px 6px rgba(61,53,50,0.15)",
                    }}
                  />
                  auracare
                </div>
                <h1>welcome back</h1>
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" placeholder="Enter your email" onChange={e => setUserData(prev => ({ ...prev, email: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <input type="password" placeholder="Enter your password" />
                </div>
                <button className="login-btn" onClick={handleLoginSuccess}>Login</button>
                <p className="switch-text">New to AuraCare?</p>
                <button className="switch-btn" onClick={() => setAuthScreen("register")}>Register Now</button>
              </div>
            )}

            {authScreen === "register" && (
              <div className="auth-form fade-in" key="register">
                <div className="auth-brand-mark">
                  <img
                    src="/logo.jpeg"
                    alt="AuraCare"
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: "8px",
                      verticalAlign: "middle",
                      boxShadow: "0 2px 6px rgba(61,53,50,0.15)",
                    }}
                  />
                  auracare
                </div>
                <h1>create account</h1>
                <div className="input-group">
                  <label>Username</label>
                  <input type="text" placeholder="Enter username" onChange={e => setUserData(prev => ({ ...prev, username: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" placeholder="Enter email" onChange={e => setUserData(prev => ({ ...prev, email: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <input type="password" placeholder="Create password" />
                </div>
                <button className="login-btn" onClick={() => setAuthScreen("survey")}>Begin Analysis</button>
                <p className="switch-text">Already have an account?</p>
                <button className="switch-btn" onClick={() => setAuthScreen("login")}>Login</button>
              </div>
            )}

            {authScreen === "survey" && (
              <div className="auth-form fade-in" key="survey">
                <h1>Wellness Analysis</h1>

                <input ref={surveyPhotoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleSurveyPhotoSelect} />
                <input ref={surveyCameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handleSurveyPhotoSelect} />

                <div className="survey-photo-section">
                  <div
                    className="survey-photo-circle"
                    onClick={() => surveyPhotoInputRef.current?.click()}
                    style={
                      userData.profilePhoto
                        ? { backgroundImage: `url(${userData.profilePhoto})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : { background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}bb)` }
                    }
                  >
                    {!userData.profilePhoto && (
                      <span className="survey-photo-initial">
                        {userData.username ? userData.username.charAt(0).toUpperCase() : "✦"}
                      </span>
                    )}
                    <div className="survey-photo-overlay">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(252,250,247,0.95)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                    </div>
                  </div>
                  <div className="survey-photo-info">
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                      <button className="survey-photo-btn" onClick={() => surveyPhotoInputRef.current?.click()}>
                        {userData.profilePhoto ? "Change Photo" : "Upload Photo"}
                      </button>
                      <button className="survey-photo-btn" onClick={() => setCameraOpen(true)}>Take Photo</button>
                      {userData.profilePhoto && (
                        <button className="survey-photo-remove" onClick={() => setUserData(prev => ({ ...prev, profilePhoto: null }))}>Remove</button>
                      )}
                    </div>
                    <p className="survey-photo-note">✦ Profile picture only — not used for skin or hair analysis</p>
                  </div>
                </div>

                <select value={userData.skinType} onChange={e => setUserData(prev => ({ ...prev, skinType: e.target.value }))}>
                  <option value="">Skin Type</option>
                  <option>Dry</option>
                  <option>Oily</option>
                  <option>Combination</option>
                  <option>Sensitive</option>
                </select>
                <div className="checkbox-group">
                  <p>Skin Concerns</p>
                  <div className="checkbox-options">
                    {["Acne", "Pigmentation", "Dryness", "Dark Circles"].map(concern => (
                      <label key={concern} className={userData.skinConcerns.includes(concern) ? "checked" : ""}>
                        <input type="checkbox" checked={userData.skinConcerns.includes(concern)} onChange={() => toggleConcern("skinConcerns", concern)} />
                        {concern}
                      </label>
                    ))}
                  </div>
                </div>
                <select value={userData.hairType} onChange={e => setUserData(prev => ({ ...prev, hairType: e.target.value }))}>
                  <option value="">Hair Type</option>
                  <option>Straight</option>
                  <option>Wavy</option>
                  <option>Curly</option>
                  <option>Coily</option>
                </select>
                <div className="checkbox-group">
                  <p>Hair Concerns</p>
                  <div className="checkbox-options">
                    {["Hair Fall", "Dandruff", "Frizz", "Dry Scalp"].map(concern => (
                      <label key={concern} className={userData.hairConcerns.includes(concern) ? "checked" : ""}>
                        <input type="checkbox" checked={userData.hairConcerns.includes(concern)} onChange={() => toggleConcern("hairConcerns", concern)} />
                        {concern}
                      </label>
                    ))}
                  </div>
                </div>
                <select value={userData.waterIntake} onChange={e => setUserData(prev => ({ ...prev, waterIntake: e.target.value }))}>
                  <option value="">Water Intake</option>
                  <option>Less than 1L</option>
                  <option>1–2L</option>
                  <option>3L+</option>
                </select>
                <select value={userData.sleep} onChange={e => setUserData(prev => ({ ...prev, sleep: e.target.value }))}>
                  <option value="">Sleep Hours</option>
                  <option>4–5 Hours</option>
                  <option>6–7 Hours</option>
                  <option>8+ Hours</option>
                </select>
                <div className="checkbox-group">
                  <p>Goals</p>
                  <div className="checkbox-options">
                    {["Glowing Skin", "Healthy Hair", "Reduce Acne", "Stress Relief"].map(goal => (
                      <label key={goal} className={userData.goals.includes(goal) ? "checked" : ""}>
                        <input type="checkbox" checked={userData.goals.includes(goal)} onChange={() => toggleConcern("goals", goal)} />
                        {goal}
                      </label>
                    ))}
                  </div>
                </div>
                <button className="finish-btn" onClick={handleSurveyFinish}>Finish Analysis</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Popup */}
      {profileOpen && loggedIn && (
        <ProfilePage
          userData={userData}
          onClose={() => setProfileOpen(false)}
          onSave={(updated) => { setUserData(updated); setProfileOpen(false); }}
          onLogout={handleLogout}
          onBackToHome={() => setView("landing")}
        />
      )}

      {/* Write Review Modal */}
      {writeReviewOpen && loggedIn && (
        <WriteReview
          userData={userData}
          onSubmit={handleNewReview}
          onClose={() => setWriteReviewOpen(false)}
        />
      )}

      <CameraCapture
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(dataUrl) => setUserData(prev => ({ ...prev, profilePhoto: dataUrl }))}
        title="Take Photo"
      />

      {/* ── Dashboard Viewport ── */}
      {view === "dashboard" && loggedIn && (
        <div className="dashboard-viewport">
          <Dashboard
            userData={userData}
            setUserData={setUserData}
            reviews={reviews}
            onNewReview={handleNewReview}
            onLogout={handleLogout}
            onBackToHome={() => setView("landing")}
            avatarColor={avatarColor}
          />
        </div>
      )}

      {/* ── Inline Styles ── */}
      <style>{`
        /* ── Brand wrap ── */
        .brand-name-wrap {
          display: flex;
          align-items: center;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        .auth-brand-mark {
          display: flex;
          align-items: center;
        }

        /* ── Hero ── */
        .landing-hero {
          margin: 60px auto 100px;
          text-align: center;
          max-width: 680px;
          animation: fadeIn 0.8s ease 0.1s both;
        }
        .landing-hero h1 {
          font-size: clamp(2.4rem, 5.5vw, 3.6rem);
          font-weight: 400;
          color: var(--espresso);
          line-height: 1.15;
          margin-bottom: 20px;
          margin-top: 14px;
          font-family: var(--font);
        }
        .landing-desc {
          font-size: 1.05rem;
          color: var(--text-secondary);
          font-weight: 300;
          line-height: 1.8;
          max-width: 560px;
          margin: 0 auto 32px;
        }
        .landing-cta-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }
        .landing-cta {
          display: inline-block;
          background: var(--espresso);
          color: white;
          border: none;
          padding: 16px 40px;
          border-radius: 40px;
          font-family: var(--font);
          font-size: 0.95rem;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }
        .landing-cta:hover {
          background: var(--espresso-light);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .landing-cta-hint {
          font-size: 0.8rem;
          color: var(--muted);
          letter-spacing: 0.5px;
          font-weight: 300;
        }

        /* ── Reviews ── */
        .write-review-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 24px;
          padding: 12px 28px;
          background: transparent;
          border: 1px solid var(--espresso, #3d3532);
          border-radius: 40px;
          font-family: 'Playfair Display', serif;
          font-size: 0.88rem;
          color: var(--espresso, #3d3532);
          cursor: pointer;
          letter-spacing: 0.4px;
          transition: 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .write-review-btn:hover {
          background: var(--espresso, #3d3532);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 10px 36px rgba(61,53,50,0.14);
        }
        .write-review-btn svg { transition: transform 0.25s ease; flex-shrink: 0; }
        .write-review-btn:hover svg { transform: rotate(-6deg) scale(1.1); }

        @keyframes reviewSlideIn {
          from { opacity: 0; transform: translateY(-14px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .review-card--new {
          animation: reviewSlideIn 0.45s cubic-bezier(0.4,0,0.2,1) forwards !important;
          border-color: #c9a97a !important;
          background: #fdf9f4 !important;
          box-shadow: 0 8px 28px rgba(201,169,122,0.18) !important;
          position: relative;
        }
        .review-new-badge {
          display: inline-block;
          font-family: 'Playfair Display', serif;
          font-size: 0.62rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #a07040;
          background: #fdf0e0;
          border: 1px solid #e8d4b8;
          border-radius: 40px;
          padding: 3px 10px;
          margin-bottom: 12px;
          font-weight: 400;
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

        /* ── Footer ── */
        .landing-footer {
          margin-top: 110px;
          padding: 60px 0 40px;
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .footer-main {
          display: flex;
          justify-content: space-between;
          gap: 60px;
          margin-bottom: 50px;
        }
        .footer-desc {
          max-width: 300px;
          color: var(--text-secondary);
          line-height: 1.75;
          font-size: 0.9rem;
          font-weight: 300;
          margin-bottom: 24px;
        }
        .footer-contact { display: flex; flex-direction: column; gap: 12px; }
        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 300;
          transition: color 0.2s ease;
        }
        .footer-contact-item svg { color: var(--muted); flex-shrink: 0; }
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 28px;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
          gap: 20px;
        }
        .footer-social { display: flex; align-items: center; gap: 14px; }
        .footer-social-link {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: var(--transition);
          text-decoration: none;
        }
        .footer-social-link:hover {
          background: var(--espresso);
          color: white;
          border-color: var(--espresso);
          transform: translateY(-2px);
        }
        .footer-copyright {
          font-size: 0.78rem;
          color: var(--muted);
          font-weight: 300;
          letter-spacing: 0.5px;
        }

        /* ── Survey photo ── */
        .survey-photo-section {
          display: flex;
          align-items: center;
          gap: 18px;
          background: var(--paper, #fcfaf7);
          border: 1px solid var(--border, #e8e3df);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .survey-photo-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          flex-shrink: 0;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(61,53,50,0.16);
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .survey-photo-circle:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(61,53,50,0.24); }
        .survey-photo-initial {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 400;
          color: white;
          line-height: 1;
          position: relative;
          z-index: 1;
        }
        .survey-photo-overlay {
          position: absolute;
          inset: 0;
          background: rgba(61,53,50,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s ease;
          z-index: 2;
        }
        .survey-photo-circle:hover .survey-photo-overlay { opacity: 1; }
        .survey-photo-info { flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .survey-photo-btn {
          width: fit-content;
          background: var(--espresso, #3d3532);
          color: white;
          border: none;
          padding: 9px 20px;
          border-radius: 40px;
          font-family: 'Playfair Display', serif;
          font-size: 0.82rem;
          font-weight: 300;
          cursor: pointer;
          transition: 0.25s cubic-bezier(0.4,0,0.2,1);
          letter-spacing: 0.3px;
        }
        .survey-photo-btn:hover { background: var(--espresso-light, #4b3d36); transform: translateY(-1px); }
        .survey-photo-remove {
          width: fit-content;
          background: transparent;
          color: var(--muted, #a39b95);
          border: 1px solid var(--border, #e8e3df);
          padding: 6px 14px;
          border-radius: 40px;
          font-family: 'Playfair Display', serif;
          font-size: 0.75rem;
          cursor: pointer;
          transition: 0.2s ease;
        }
        .survey-photo-remove:hover { color: #9a4040; border-color: #d4b8b8; background: #fdf5f5; }
        .survey-photo-note {
          font-family: 'Playfair Display', serif;
          font-size: 0.68rem;
          color: var(--muted, #a39b95);
          font-weight: 300;
          font-style: italic;
          letter-spacing: 0.2px;
          line-height: 1.5;
          margin: 0;
        }

        /* ── Dashboard viewport ── */
        .dashboard-viewport {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: var(--paper);
          overflow-y: auto;
          animation: fadeIn 0.4s ease;
        }

        /* ── Responsive ── */
        @media (max-width: 840px) {
          .footer-main { flex-direction: column; gap: 40px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 540px) {
          .landing-hero { margin: 40px auto 60px; }
        }
      `}</style>
    </div>
  );
}

export default App;