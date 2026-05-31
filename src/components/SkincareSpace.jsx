import React, { useState } from 'react';
import './SpaceShared.css';

const routineSteps = [
  { time: "AM", step: "01", name: "Gentle Cleanser", desc: "Remove overnight buildup without stripping moisture barrier.", tag: "Cleanse" },
  { time: "AM", step: "02", name: "Niacinamide Serum", desc: "Brightens, minimizes pores, and balances oil production.", tag: "Treat" },
  { time: "AM", step: "03", name: "Lightweight Moisturiser", desc: "Lock in hydration and prep skin for the day.", tag: "Hydrate" },
  { time: "AM", step: "04", name: "SPF 50+ Sunscreen", desc: "Broad-spectrum UV protection. Non-negotiable daily step.", tag: "Protect" },
  { time: "PM", step: "05", name: "Micellar Cleanse", desc: "Dissolve SPF, makeup, and environmental residue.", tag: "Cleanse" },
  { time: "PM", step: "06", name: "Retinol Serum", desc: "Accelerate cell turnover and improve texture overnight.", tag: "Treat" },
  { time: "PM", step: "07", name: "Barrier Repair Cream", desc: "Rich overnight recovery for a plump, rested complexion.", tag: "Repair" },
];

const products = [
  { name: "Hydrating Cleanser", brand: "CeraVe", rating: "4.8", concern: "All Types" },
  { name: "Niacinamide 10%", brand: "The Ordinary", rating: "4.7", concern: "Oily / Acne" },
  { name: "SPF 50 Fluid", brand: "La Roche-Posay", rating: "4.9", concern: "Daily Shield" },
  { name: "Retinol 0.5%", brand: "Paula's Choice", rating: "4.6", concern: "Anti-Aging" },
  { name: "Ceramide Moisturiser", brand: "CeraVe", rating: "4.8", concern: "Dry / Sensitive" },
  { name: "Vitamin C Serum", brand: "Skinceuticals", rating: "4.7", concern: "Brightening" },
];

function SkincareSpace({ userData }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "AM", "PM"];
  const filtered = activeFilter === "All" ? routineSteps : routineSteps.filter(s => s.time === activeFilter);

  return (
    <div className="space-wrapper">
      <div className="space-hero skincare-hero">
        <div className="space-hero-text">
          <span className="space-tag">Skincare</span>
          <h2>Your Glow Protocol</h2>
          <p>A {userData?.skinType || "personalised"}-skin routine, built around your concerns and lifestyle.</p>
        </div>
      </div>

      <div className="space-body">
        <div className="section-row">
          <h3 className="section-title">Daily Routine</h3>
          <div className="filter-tabs">
            {filters.map(f => (
              <button key={f} className={`filter-tab${activeFilter === f ? " active" : ""}`} onClick={() => setActiveFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div className="routine-list">
          {filtered.map((item) => (
            <div className="routine-item" key={item.step}>
              <div className="routine-step-num">{item.step}</div>
              <div className="routine-info">
                <div className="routine-name-row">
                  <span className="routine-name">{item.name}</span>
                  <span className="routine-badge">{item.tag}</span>
                </div>
                <p className="routine-desc">{item.desc}</p>
              </div>
              <div className="routine-time">{item.time}</div>
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

export default SkincareSpace;
