import React, { useState } from 'react';
import './SpaceShared.css';

const careSteps = [
  { day: "Day 1", name: "Scalp Detox Shampoo", desc: "Deep cleanse to remove buildup and rebalance the scalp microbiome.", tag: "Cleanse" },
  { day: "Day 1", name: "Protein Treatment Mask", desc: "Strengthen and repair damaged hair bonds from within.", tag: "Repair" },
  { day: "Day 2–4", name: "Co-wash or Rinse", desc: "Refresh without stripping natural oils between wash days.", tag: "Refresh" },
  { day: "Day 2–4", name: "Leave-in Conditioner", desc: "Seal moisture and detangle for soft, manageable strands.", tag: "Hydrate" },
  { day: "Daily", name: "Scalp Serum", desc: "Nourish follicles and stimulate healthy growth with actives.", tag: "Treat" },
  { day: "Weekly", name: "Hot Oil Treatment", desc: "Deeply moisturise and add shine to dry, brittle hair.", tag: "Nourish" },
];

const products = [
  { name: "Scalp Therapy Serum", brand: "Kérastase", concern: "Hair Fall", rating: "4.7" },
  { name: "Repair Bond Mask", brand: "Olaplex", concern: "Damaged Hair", rating: "4.9" },
  { name: "Anti-Frizz Serum", brand: "Moroccanoil", concern: "Frizz / Humidity", rating: "4.8" },
  { name: "Biotin Scalp Drops", brand: "The Inkey List", concern: "Growth", rating: "4.5" },
  { name: "Hydrating Co-Wash", brand: "As I Am", concern: "Curly / Coily", rating: "4.6" },
  { name: "Dandruff Control", brand: "Ducray", concern: "Dandruff", rating: "4.7" },
];

const healthMetrics = [
  { label: "Scalp Moisture", value: 68, color: "#b5cba8" },
  { label: "Strand Strength", value: 54, color: "#c9b99a" },
  { label: "Growth Rate", value: 72, color: "#a8bfd6" },
];

function HaircareSpace({ userData }) {
  const [activeDay, setActiveDay] = useState("All");
  const days = ["All", "Day 1", "Day 2–4", "Daily", "Weekly"];
  const filtered = activeDay === "All" ? careSteps : careSteps.filter(s => s.day === activeDay);

  return (
    <div className="space-wrapper">
      <div className="space-hero haircare-hero">
        <div className="space-hero-text">
          <span className="space-tag">Haircare</span>
          <h2>Scalp & Strand Health</h2>
          <p>A {userData?.hairType || "personalised"}-hair regimen for follicle strength and shine.</p>
        </div>
      </div>

      <div className="space-body">
        <h3 className="section-title">Hair Health Index</h3>
        <div className="metrics-row">
          {healthMetrics.map((m, i) => (
            <div className="metric-item" key={i}>
              <div className="metric-bar-wrap">
                <div className="metric-bar" style={{ width: `${m.value}%`, background: m.color }} />
              </div>
              <div className="metric-label-row">
                <span className="metric-label">{m.label}</span>
                <span className="metric-value">{m.value}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="section-row" style={{ marginTop: "40px" }}>
          <h3 className="section-title">Care Schedule</h3>
          <div className="filter-tabs">
            {days.map(d => (
              <button key={d} className={`filter-tab${activeDay === d ? " active" : ""}`} onClick={() => setActiveDay(d)}>{d}</button>
            ))}
          </div>
        </div>

        <div className="routine-list">
          {filtered.map((item, i) => (
            <div className="routine-item" key={i}>
              <div className="routine-step-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="routine-info">
                <div className="routine-name-row">
                  <span className="routine-name">{item.name}</span>
                  <span className="routine-badge">{item.tag}</span>
                </div>
                <p className="routine-desc">{item.desc}</p>
              </div>
              <div className="routine-time">{item.day}</div>
            </div>
          ))}
        </div>

        <h3 className="section-title" style={{ marginTop: "44px" }}>Recommended Products</h3>
        <div className="product-grid">
          {products.map((p, i) => (
            <div className="product-card" key={i}>
              <div className="product-dot" />
              <div className="product-info">
                <span className="product-name">{p.name}</span>
                <span className="product-brand">{p.brand}</span>
              </div>
              <div className="product-meta">
                <span className="product-concern">{p.concern}</span>
                <span className="product-rating">★ {p.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HaircareSpace;
