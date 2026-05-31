import React, { useState } from 'react';
import './SpaceShared.css';

const rituals = [
  { time: "Morning", icon: "☀", name: "Mindful Wake", desc: "5 minutes of gratitude journaling before checking your phone. Set the tone for the day.", duration: "5 min" },
  { time: "Morning", icon: "🫁", name: "Box Breathing", desc: "Inhale 4s · Hold 4s · Exhale 4s · Hold 4s. Reduces cortisol and sharpens focus.", duration: "4 min" },
  { time: "Afternoon", icon: "🌿", name: "Hydration Check", desc: "Mid-day water intake reminder. Add lemon or cucumber for mineral support.", duration: "2 min" },
  { time: "Afternoon", icon: "🚶", name: "Movement Break", desc: "A 10-minute walk outside resets your nervous system and boosts serotonin.", duration: "10 min" },
  { time: "Evening", icon: "🌙", name: "Digital Sunset", desc: "Step away from screens 90 minutes before bed to protect your melatonin cycle.", duration: "Ongoing" },
  { time: "Evening", icon: "🛁", name: "Recovery Bath", desc: "Warm bath with Epsom salts and lavender oil for muscle recovery and deep sleep.", duration: "20 min" },
];

const quotes = [
  "True wellness is the quiet harmony between the choices we make and the intentions we hold.",
  "Rest is not a reward, it is a requirement.",
  "Your skin, your hair, your body — they remember everything you give them.",
  "Small rituals, practised consistently, become the architecture of a beautiful life.",
];

const moodOptions = [
  { emoji: "🌸", label: "Radiant" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😔", label: "Low" },
  { emoji: "😤", label: "Stressed" },
];

function SelfcareSpace({ userData }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [activeTime, setActiveTime] = useState("All");
  const times = ["All", "Morning", "Afternoon", "Evening"];
  const filtered = activeTime === "All" ? rituals : rituals.filter(r => r.time === activeTime);
  const todayQuote = quotes[new Date().getDay() % quotes.length];

  return (
    <div className="space-wrapper">
      <div className="space-hero wellness-hero">
        <div className="space-hero-text">
          <span className="space-tag">Wellness</span>
          <h2>Mind & Body Rituals</h2>
          <p>Daily micro-practices that restore calm, build resilience, and elevate your wellbeing.</p>
        </div>
      </div>

      <div className="space-body">
        <div className="mood-section">
          <h3 className="section-title">How are you feeling today?</h3>
          <div className="mood-row">
            {moodOptions.map((m, i) => (
              <button
                key={i}
                className={`mood-btn${selectedMood === i ? " selected" : ""}`}
                onClick={() => setSelectedMood(i)}
              >
                <span className="mood-emoji">{m.emoji}</span>
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>
          {selectedMood !== null && (
            <p className="mood-response fade-in">
              {selectedMood <= 1
                ? `Wonderful, ${userData?.username || "there"}. Keep nourishing that energy. 🌿`
                : selectedMood === 2
                ? "A steady baseline is a solid foundation. Let's build on it. ✨"
                : "It's okay. Be gentle with yourself today. Your rituals are here for you. 🌙"}
            </p>
          )}
        </div>

        <div className="daily-quote">
          <span className="quote-mark">"</span>
          <p>{todayQuote}</p>
        </div>

        <div className="section-row" style={{ marginTop: "44px" }}>
          <h3 className="section-title">Daily Rituals</h3>
          <div className="filter-tabs">
            {times.map(t => (
              <button key={t} className={`filter-tab${activeTime === t ? " active" : ""}`} onClick={() => setActiveTime(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="ritual-grid">
          {filtered.map((item, i) => (
            <div className="ritual-card" key={i}>
              <div className="ritual-icon">{item.icon}</div>
              <div className="ritual-info">
                <div className="ritual-name-row">
                  <span className="ritual-name">{item.name}</span>
                  <span className="ritual-duration">{item.duration}</span>
                </div>
                <p className="ritual-desc">{item.desc}</p>
                <span className="ritual-time-badge">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SelfcareSpace;
