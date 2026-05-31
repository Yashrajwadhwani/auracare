import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import SkincareSpace from "./components/SkincareSpace";
import HaircareSpace from "./components/HaircareSpace";
import SelfcareSpace from "./components/SelfcareSpace";
import ProfilePage from "./components/ProfilePage";
import AuraAssistant from "./components/AuraAssistant"; // Ensure this matches your file path

const reviews = [
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

function App() {
  const [introPhase, setIntroPhase] = useState("visible");
  const [authPage, setAuthPage] = useState(null);
  const [authScreen, setAuthScreen] = useState("login");
  const [activeTab, setActiveTab] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  
  const authBoxRef = useRef(null);

  const [userData, setUserData] = useState({
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
  });

  useEffect(() => {
    const logoTimer = setTimeout(() => setIntroPhase("fading"), 2000);
    const doneTimer = setTimeout(() => setIntroPhase("done"), 3200);
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    if (authBoxRef.current) authBoxRef.current.scrollTop = 0;
  }, [authScreen]);

  const currentHour = new Date().getHours();
  let greeting = "Good evening";
  if (currentHour < 12) greeting = "Good morning";
  else if (currentHour < 18) greeting = "Good afternoon";

  const toggleConcern = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const disciplines = [
    { id: "skincare", label: "Skincare", sub: "Personalized glow rituals.", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80" },
    { id: "haircare", label: "Haircare", sub: "Scalp & strand recovery.", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80" },
    { id: "wellness", label: "Wellness", sub: "Mind & body restoration.", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80" }
  ];

  const openSignIn = () => {
    setAuthScreen("login");
    setAuthPage("open");
  };

  const closeAuth = () => {
    setAuthPage(null);
  };

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    closeAuth();
  };

  const handleSurveyFinish = () => {
    setLoggedIn(true);
    closeAuth();
  };

  const avatarColor = getAvatarColor(userData.username);

  return (
    <div className="App">
      {introPhase !== "done" && (
        <div className={`splash-screen${introPhase === "fading" ? " fade-out" : ""}`}>
          <div className="splash-inner">
            <div className="splash-logo-wrap">
              <svg className="splash-logo-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="28" stroke="#3d3532" strokeWidth="1.2"/>
                <path d="M32 18 C26 22 20 28 20 34 C20 41 25.5 46 32 46 C38.5 46 44 41 44 34 C44 28 38 22 32 18Z" fill="#3d3532" fillOpacity="0.08" stroke="#3d3532" strokeWidth="1.2" strokeLinejoin="round"/>
                <path d="M32 18 C32 24 36 30 40 34 C38 40 35 43 32 46" stroke="#3d3532" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5"/>
                <circle cx="32" cy="30" r="3.5" fill="#3d3532" fillOpacity="0.6"/>
                <line x1="32" y1="10" x2="32" y2="14" stroke="#3d3532" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="20.5" y1="14" x2="22.5" y2="17.5" stroke="#3d3532" strokeWidth="1" strokeLinecap="round"/>
                <line x1="43.5" y1="14" x2="41.5" y2="17.5" stroke="#3d3532" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              <h1 className="brand-logo">auracare</h1>
            </div>
            <p className="splash-sub">your wellness ecosystem</p>
            <div className="splash-line" />
          </div>
        </div>
      )}

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
                <div className="auth-logo-mark">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 8 C16 11 12 16 12 20.5 C12 25.5 15.5 29 20 29 C24.5 29 28 25.5 28 20.5 C28 16 24 11 20 8Z" fill="#3d3532" fillOpacity="0.12" stroke="#3d3532" strokeWidth="1.2"/>
                    <circle cx="20" cy="19" r="2.5" fill="#3d3532" fillOpacity="0.7"/>
                  </svg>
                </div>
                <h1>welcome back</h1>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    onChange={e => setUserData(prev => ({ ...prev, email: e.target.value }))}
                  />
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
                <h1>create account</h1>
                <div className="input-group">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    onChange={e => setUserData(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    onChange={e => setUserData(prev => ({ ...prev, email: e.target.value }))}
                  />
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

      <div className="app-container">
        <div className="top-bar">
          <div className="brand-name-wrap">
            <svg className="nav-logo-icon" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 5 C12 8 8 13 8 17.5 C8 22.5 11.5 26 16 26 C20.5 26 24 22.5 24 17.5 C24 13 20 8 16 5Z" fill="#3d3532" fillOpacity="0.1" stroke="#3d3532" strokeWidth="1.1"/>
              <circle cx="16" cy="16" r="2.2" fill="#3d3532" fillOpacity="0.65"/>
            </svg>
            <div className="brand-name">AuraCare AI</div>
          </div>
          <div className="top-bar-right">
            {!loggedIn && (
              <button className="auth-trigger" onClick={openSignIn}>Sign In</button>
            )}
            {loggedIn && userData.username ? (
              <div
                className="profile-circle"
                onClick={() => setProfileOpen(true)}
                title={`${userData.username}'s Profile`}
                style={{
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
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.boxShadow = "0 4px 18px rgba(61,53,50,0.28)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 2px 10px rgba(61,53,50,0.18)";
                }}
              >
                {userData.username.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="profile-circle">✦</div>
            )}
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
            <span className="card-hint">Moderate · Reapply SPF every 3h</span>
          </div>
          <div className="card card-animate" style={{ animationDelay: "0.2s" }}>
            <h4>Consistency</h4>
            <h3>12 Days</h3>
            <div className="streak-dots">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={`dot${i < 5 ? " filled" : ""}`} />
              ))}
            </div>
          </div>
          <div className="card quote-card card-animate" style={{ animationDelay: "0.3s" }}>
            <h4>Insight</h4>
            <h3>"True wellness is quiet harmony."</h3>
          </div>
        </div>

        <div className="recommend-section">
          <h2>Recommendations</h2>
          <div className="discipline-grid">
            {disciplines.map((item, i) => (
              <div
                key={item.id}
                className="discipline-card card-animate"
                style={{ animationDelay: `${0.15 * (i + 1)}s` }}
                onClick={() => setActiveTab(item.id)}
              >
                <img src={item.img} alt={item.label} loading="lazy" />
                <div className="overlay">
                  <h3>{item.label}</h3>
                  <p>{item.sub}</p>
                  <span className="explore-link">Explore →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="reviews-section">
          <div className="reviews-header">
            <span className="reviews-eyebrow">Community</span>
            <h2>Real Results, Real People</h2>
            <p>Thousands of users transforming their wellness journey with AuraCare.</p>
          </div>
          <div className="reviews-grid">
            {reviews.map((review, i) => (
              <div className="review-card card-animate" key={i} style={{ animationDelay: `${0.1 * (i + 1)}s` }}>
                <div className="review-top">
                  <div className="review-avatar-wrap">
                    <img src={review.img} alt={review.name} className="review-avatar" />
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

        {/* Profile Page Popup */}
        {profileOpen && (
          <ProfilePage
            userData={userData}
            onClose={() => setProfileOpen(false)}
            onSave={(updated) => {
              setUserData(updated);
              setProfileOpen(false);
            }}
          />
        )}

        {/* The New Minimalist Assistant Overlay Component */}
        <AuraAssistant 
          chatOpen={chatOpen} 
          setChatOpen={setChatOpen} 
          userData={userData} 
        />

        <footer className="footer">
          <div className="footer-left">
            <div className="footer-brand">
              <svg className="footer-logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3 C9 5.5 6 9 6 12 C6 15.5 8.5 18 12 18 C15.5 18 18 15.5 18 12 C18 9 15 5.5 12 3Z" fill="#3d3532" fillOpacity="0.1" stroke="#3d3532" strokeWidth="1"/>
                <circle cx="12" cy="11" r="2" fill="#3d3532" fillOpacity="0.55"/>
              </svg>
              <h3>AuraCare AI</h3>
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
    </div>
  );
}

export default App;