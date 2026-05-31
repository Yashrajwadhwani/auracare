import React from 'react';

const Hometab = ({ onNavigate }) => {
  return (
    <div className="dashboard-wrapper">
      <header className="dash-header">
        <h1>Good morning, Julianne.</h1>
        <p>Your wellness ecosystem is synchronized.</p>
      </header>

      <section className="stats-grid">
        <div className="card">
          <h4>Atmospheric</h4>
          <h3>UV Index: 4</h3>
          <span className="card-hint">Moderate · Reapply SPF every 3h</span>
        </div>
        <div className="card">
          <h4>Consistency</h4>
          <h3>12 Days</h3>
        </div>
        <div className="card quote-card">
          <h4>Insight</h4>
          <h3>"True wellness is quiet harmony."</h3>
        </div>
      </section>

      <h2>Curated Disciplines</h2>
      <section className="discipline-grid">
        <div className="discipline-card" onClick={() => onNavigate('skincare')}>Skincare</div>
        <div className="discipline-card" onClick={() => onNavigate('haircare')}>Haircare</div>
        <div className="discipline-card" onClick={() => onNavigate('selfcare')}>Self-Care</div>
      </section>
    </div>
  );
};

export default Hometab;
