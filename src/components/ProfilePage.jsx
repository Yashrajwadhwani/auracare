import React, { useState, useEffect, useRef } from "react";
import CameraCapture from "./CameraCapture";

const SKIN_TYPES = ["Dry", "Oily", "Combination", "Sensitive"];
const HAIR_TYPES = ["Straight", "Wavy", "Curly", "Coily"];
const WATER_OPTIONS = ["Less than 1L", "1–2L", "3L+"];
const SLEEP_OPTIONS = ["4–5 Hours", "6–7 Hours", "8+ Hours"];
const SKIN_CONCERNS = ["Acne", "Pigmentation", "Dryness", "Dark Circles"];
const HAIR_CONCERNS = ["Hair Fall", "Dandruff", "Frizz", "Dry Scalp"];
const GOALS = ["Glowing Skin", "Healthy Hair", "Reduce Acne", "Stress Relief"];

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

export default function ProfilePage({ userData, onClose, onSave, onLogout }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...userData });
  const [saved, setSaved] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => { setDraft({ ...userData }); }, [userData]);

  const avatarColor = getAvatarColor(draft.username);
  const initial = draft.username ? draft.username.charAt(0).toUpperCase() : "✦";

  const toggleItem = (field, value) => {
    setDraft(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleSave = () => {
    onSave(draft);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDraft(prev => ({ ...prev, profilePhoto: ev.target.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const completionFields = [
    draft.username, draft.skinType, draft.hairType,
    draft.waterIntake, draft.sleep,
    draft.skinConcerns?.length > 0,
    draft.hairConcerns?.length > 0,
    draft.goals?.length > 0
  ];
  const completion = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  const sections = [
    { id: "profile",  label: "Profile"  },
    { id: "skin",     label: "Skin"     },
    { id: "hair",     label: "Hair"     },
    { id: "wellness", label: "Wellness" },
  ];

  return (
    <>
      <style>{`
        .pp-overlay {
          position: fixed;
          inset: 0;
          background: rgba(30, 22, 19, 0.32);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: pp-fadeIn 0.25s ease;
          font-family: 'Playfair Display', serif;
        }
        @keyframes pp-fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .pp-panel {
          background: var(--paper, #fcfaf7);
          border-radius: 28px;
          width: 100%;
          max-width: 760px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(61, 53, 50, 0.14);
          animation: pp-scaleIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Playfair Display', serif;
        }
        @keyframes pp-scaleIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }

        .pp-header {
          background: var(--paper-dark, #f5f0ec);
          border-bottom: 1px solid var(--border, #e8e3df);
          padding: 36px 40px 28px;
          flex-shrink: 0;
        }
        .pp-header-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .pp-close {
          background: var(--paper, #fcfaf7);
          border: 1px solid var(--border, #e8e3df);
          color: var(--muted, #a39b95);
          width: 32px; height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 13px;
          display: flex; align-items: center; justify-content: center;
          transition: 0.3s cubic-bezier(0.4,0,0.2,1);
          flex-shrink: 0;
          font-family: 'Playfair Display', serif;
        }
        .pp-close:hover {
          background: var(--paper-mid, #f0ebe5);
          color: var(--espresso, #3d3532);
        }

        .pp-identity { display: flex; align-items: center; gap: 20px; }

        .pp-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .pp-avatar {
          width: 68px; height: 68px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 400;
          color: white;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(61,53,50,0.18);
          transition: 0.3s ease;
        }
        .pp-avatar img {
          width: 100%; height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        .pp-avatar-overlay {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(61,53,50,0.55);
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: opacity 0.25s ease;
          pointer-events: none;
        }
        .pp-avatar-wrap:hover .pp-avatar-overlay {
          opacity: 1;
        }
        .pp-avatar-wrap:hover .pp-avatar {
          box-shadow: 0 6px 22px rgba(61,53,50,0.28);
        }
        .pp-avatar-edit-hint {
          font-size: 0.55rem;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(252,250,247,0.9);
          text-align: center;
          font-family: 'Playfair Display', serif;
          margin-top: 3px;
          line-height: 1.2;
        }

        .pp-name-block h2 {
          font-family: 'Playfair Display', serif;
          font-weight: 400; font-size: 2rem;
          color: var(--espresso, #3d3532);
          margin: 0 0 5px;
          letter-spacing: 0.3px;
          line-height: 1.2;
        }
        .pp-name-block p {
          font-size: 0.78rem;
          color: var(--muted, #a39b95);
          margin: 0;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 300;
          font-family: 'Playfair Display', serif;
        }

        .pp-completion-label {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 0.65rem; color: var(--muted, #a39b95);
          margin-bottom: 8px; letter-spacing: 2.5px;
          text-transform: uppercase;
          font-family: 'Playfair Display', serif;
        }
        .pp-completion-label span:last-child {
          color: var(--espresso, #3d3532);
          font-weight: 400;
        }
        .pp-completion-track {
          height: 2px;
          background: var(--border, #e8e3df);
          border-radius: 10px; overflow: hidden;
        }
        .pp-completion-fill {
          height: 100%;
          background: var(--espresso, #3d3532);
          border-radius: 10px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pp-nav {
          display: flex;
          border-bottom: 1px solid var(--border, #e8e3df);
          background: var(--paper, #fcfaf7);
          padding: 0 32px;
          flex-shrink: 0;
        }
        .pp-nav-btn {
          background: none; border: none;
          padding: 16px 18px;
          font-family: 'Playfair Display', serif;
          font-size: 0.85rem; font-weight: 300;
          color: var(--muted, #a39b95);
          cursor: pointer; position: relative;
          transition: color 0.3s; letter-spacing: 0.5px;
          white-space: nowrap;
        }
        .pp-nav-btn.active {
          color: var(--espresso, #3d3532);
          font-weight: 400;
        }
        .pp-nav-btn.active::after {
          content: '';
          position: absolute; bottom: -1px; left: 0; right: 0;
          height: 1px;
          background: var(--espresso, #3d3532);
        }
        .pp-nav-btn:hover:not(.active) {
          color: var(--text-secondary, #726861);
        }

        .pp-body {
          flex: 1; overflow-y: auto;
          padding: 36px 40px 40px;
          scrollbar-width: thin;
          scrollbar-color: var(--border, #e8e3df) transparent;
          background: var(--paper, #fcfaf7);
        }
        .pp-body::-webkit-scrollbar { width: 4px; }
        .pp-body::-webkit-scrollbar-thumb {
          background: var(--border, #e8e3df); border-radius: 4px;
        }

        .pp-action-bar {
          display: flex; justify-content: flex-end;
          gap: 10px; margin-bottom: 32px;
        }
        .pp-btn-edit {
          background: transparent;
          border: 1px solid var(--border, #e8e3df);
          color: var(--espresso, #3d3532);
          padding: 10px 24px; border-radius: 40px;
          font-family: 'Playfair Display', serif;
          font-size: 0.85rem; font-weight: 300;
          cursor: pointer;
          transition: 0.3s cubic-bezier(0.4,0,0.2,1);
          letter-spacing: 0.5px;
        }
        .pp-btn-edit:hover {
          background: var(--espresso, #3d3532);
          color: white;
          border-color: var(--espresso, #3d3532);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(61,53,50,0.1);
        }
        .pp-btn-save {
          background: var(--espresso, #3d3532);
          border: 1px solid var(--espresso, #3d3532);
          color: white;
          padding: 10px 24px; border-radius: 40px;
          font-family: 'Playfair Display', serif;
          font-size: 0.85rem; font-weight: 300;
          cursor: pointer;
          transition: 0.3s cubic-bezier(0.4,0,0.2,1);
          letter-spacing: 0.5px;
        }
        .pp-btn-save:hover {
          background: var(--espresso-light, #4b3d36);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(61,53,50,0.14);
        }
        .pp-btn-cancel {
          background: transparent;
          border: 1px solid var(--border, #e8e3df);
          color: var(--muted, #a39b95);
          padding: 10px 20px; border-radius: 40px;
          font-family: 'Playfair Display', serif;
          font-size: 0.85rem; font-weight: 300;
          cursor: pointer;
          transition: 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .pp-btn-cancel:hover {
          background: var(--paper-mid, #f0ebe5);
          color: var(--espresso, #3d3532);
        }

        .pp-toast {
          position: fixed; bottom: 32px; left: 50%;
          transform: translateX(-50%);
          background: var(--espresso, #3d3532); color: white;
          padding: 12px 28px; border-radius: 40px;
          font-family: 'Playfair Display', serif;
          font-size: 0.88rem; font-weight: 300;
          letter-spacing: 0.5px; z-index: 99999;
          animation: pp-toastIn 0.3s ease, pp-toastOut 0.3s ease 2.1s forwards;
          box-shadow: 0 8px 24px rgba(61,53,50,0.2);
          white-space: nowrap;
        }
        @keyframes pp-toastIn {
          from { opacity:0; transform: translateX(-50%) translateY(12px); }
          to   { opacity:1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes pp-toastOut {
          to { opacity:0; transform: translateX(-50%) translateY(8px); }
        }

        .pp-heading {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem; font-weight: 300;
          color: var(--espresso, #3d3532);
          margin: 0 0 20px;
          letter-spacing: 0.3px;
          line-height: 1.3;
        }
        .pp-eyebrow {
          font-size: 0.6rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--muted, #a39b95);
          font-weight: 400;
          font-family: 'Playfair Display', serif;
          display: block;
          margin-bottom: 6px;
        }
        .pp-divider {
          height: 1px;
          background: var(--border, #e8e3df);
          margin: 28px 0;
        }

        .pp-field-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 20px; margin-bottom: 28px;
        }
        .pp-field { display: flex; flex-direction: column; gap: 8px; }
        .pp-label {
          font-size: 0.6rem; letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--muted, #a39b95); font-weight: 400;
          font-family: 'Playfair Display', serif;
        }
        .pp-value {
          font-size: 0.95rem;
          color: var(--espresso, #3d3532);
          font-weight: 300;
          min-height: 40px; display: flex; align-items: center;
          padding: 0 2px;
          border-bottom: 1px solid var(--border, #e8e3df);
          font-family: 'Playfair Display', serif;
          transition: border-color 0.2s;
        }
        .pp-value.empty {
          color: var(--muted, #a39b95);
          font-style: italic; font-size: 0.88rem;
        }
        .pp-input {
          font-size: 0.95rem; color: var(--espresso, #3d3532);
          background: none; border: none;
          border-bottom: 1px solid var(--espresso, #3d3532);
          padding: 8px 2px;
          font-family: 'Playfair Display', serif;
          width: 100%; outline: none;
          font-weight: 300;
          transition: border-color 0.2s;
        }
        .pp-input::placeholder { color: var(--muted, #a39b95); }
        .pp-select {
          font-size: 0.95rem; color: var(--espresso, #3d3532);
          background: var(--paper, #fcfaf7);
          border: 1px solid var(--border, #e8e3df);
          border-radius: 14px; padding: 12px 36px 12px 14px;
          font-family: 'Playfair Display', serif;
          width: 100%; outline: none; cursor: pointer;
          font-weight: 300;
          transition: border-color 0.3s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23a39b95' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
        }
        .pp-select:focus { border-color: var(--espresso, #3d3532); }

        .pp-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-bottom: 28px;
        }
        .pp-stat {
          background: var(--paper-dark, #f5f0ec);
          border-radius: 20px;
          padding: 24px 20px;
          text-align: center;
          border: 1px solid var(--border, #e8e3df);
          transition: 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .pp-stat:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 36px rgba(61,53,50,0.08);
          border-color: #ddd7d2;
        }
        .pp-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 2rem; font-weight: 300;
          color: var(--espresso, #3d3532);
          display: block; line-height: 1;
          margin-bottom: 6px;
        }
        .pp-stat-lbl {
          font-size: 0.6rem;
          color: var(--muted, #a39b95);
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 400;
          font-family: 'Playfair Display', serif;
        }

        .pp-tag-cloud {
          display: flex; flex-wrap: wrap; gap: 8px; margin-top: 2px;
        }
        .pp-chip {
          display: inline-flex; align-items: center;
          padding: 7px 16px; border-radius: 40px;
          font-size: 0.78rem; letter-spacing: 0.3px;
          font-family: 'Playfair Display', serif;
          font-weight: 300;
          transition: 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .pp-chip.display {
          background: var(--paper-dark, #f5f0ec);
          color: var(--text-secondary, #726861);
          border: 1px solid var(--border, #e8e3df);
        }
        .pp-chip.selectable {
          background: var(--paper, #fcfaf7);
          color: var(--text-secondary, #726861);
          border: 1px solid var(--border, #e8e3df);
          cursor: pointer;
        }
        .pp-chip.selectable:hover:not(.sel) {
          background: var(--paper-mid, #f0ebe5);
          border-color: #ddd7d2;
          color: var(--espresso, #3d3532);
        }
        .pp-chip.selectable.sel {
          background: var(--espresso, #3d3532);
          color: white;
          border-color: var(--espresso, #3d3532);
        }

        .pp-empty {
          font-size: 0.88rem;
          color: var(--muted, #a39b95);
          font-style: italic;
          font-weight: 300;
          padding: 4px 0;
          font-family: 'Playfair Display', serif;
        }

        .pp-concerns-row {
          display: flex; flex-direction: column;
          gap: 10px; width: 100%;
        }

        .pp-photo-edit-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          padding: 20px;
          background: var(--paper-dark, #f5f0ec);
          border: 1px solid var(--border, #e8e3df);
          border-radius: 18px;
        }
        .pp-photo-edit-avatar {
          width: 60px; height: 60px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-size: 24px; color: white;
          box-shadow: 0 2px 10px rgba(61,53,50,0.15);
        }
        .pp-photo-edit-avatar img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .pp-photo-edit-info {
          flex: 1;
        }
        .pp-photo-edit-title {
          font-size: 0.88rem;
          color: var(--espresso, #3d3532);
          font-family: 'Playfair Display', serif;
          font-weight: 300;
          margin-bottom: 4px;
        }
        .pp-photo-edit-hint {
          font-size: 0.72rem;
          color: var(--muted, #a39b95);
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.3px;
        }
        .pp-photo-upload-btn {
          background: var(--paper, #fcfaf7);
          border: 1px solid var(--border, #e8e3df);
          color: var(--espresso, #3d3532);
          padding: 9px 18px;
          border-radius: 40px;
          font-family: 'Playfair Display', serif;
          font-size: 0.78rem;
          font-weight: 300;
          cursor: pointer;
          transition: 0.25s cubic-bezier(0.4,0,0.2,1);
          display: flex; align-items: center; gap: 7px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .pp-photo-upload-btn:hover {
          background: var(--espresso, #3d3532);
          color: white;
          border-color: var(--espresso, #3d3532);
          transform: translateY(-1px);
        }
        .pp-photo-remove-btn {
          background: transparent;
          border: 1px solid var(--border, #e8e3df);
          color: var(--muted, #a39b95);
          padding: 9px 14px;
          border-radius: 40px;
          font-family: 'Playfair Display', serif;
          font-size: 0.75rem;
          cursor: pointer;
          transition: 0.25s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .pp-photo-remove-btn:hover {
          color: #9a4040;
          border-color: #d4b8b8;
          background: #fdf5f5;
        }

        .pp-btn-logout {
          background: transparent;
          border: 1px solid #d4b8b8;
          color: #9a4040;
          padding: 10px 24px;
          border-radius: 40px;
          font-family: 'Playfair Display', serif;
          font-size: 0.85rem;
          font-weight: 300;
          cursor: pointer;
          transition: 0.3s cubic-bezier(0.4,0,0.2,1);
          letter-spacing: 0.5px;
        }
        .pp-btn-logout:hover {
          background: #fdf5f5;
          border-color: #9a4040;
          color: #7a3030;
          transform: translateY(-1px);
        }

        @media (max-width: 580px) {
          .pp-field-grid { grid-template-columns: 1fr; }
          .pp-body { padding: 24px 24px 32px; }
          .pp-header { padding: 28px 24px 22px; }
          .pp-nav { padding: 0 16px; }
          .pp-nav-btn { padding: 14px 12px; font-size: 0.8rem; }
          .pp-stats { grid-template-columns: repeat(3, 1fr); }
          .pp-heading { font-size: 1.3rem; }
          .pp-photo-edit-row { flex-wrap: wrap; }
        }
      `}</style>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handlePhotoSelect}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handlePhotoSelect}
      />

      <div className="pp-overlay" onClick={onClose}>
        <div className="pp-panel" onClick={e => e.stopPropagation()}>

          <div className="pp-header">
            <div className="pp-header-top">
              <div className="pp-identity">
                <div
                  className="pp-avatar-wrap"
                  onClick={editing ? () => fileInputRef.current?.click() : undefined}
                  title={editing ? "Change profile photo" : "Profile photo"}
                  style={editing ? { cursor: "pointer" } : { cursor: "default" }}
                >
                  <div
                    className="pp-avatar"
                    style={!draft.profilePhoto ? { background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}bb)` } : {}}
                  >
                    {draft.profilePhoto
                      ? <img src={draft.profilePhoto} alt="profile" />
                      : initial
                    }
                  </div>
                  {editing && (
                    <div className="pp-avatar-overlay">
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(252,250,247,0.95)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                        <span className="pp-avatar-edit-hint">Change</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pp-name-block">
                  <h2>{draft.username || "Your Profile"}</h2>
                  <p>{draft.email || "AuraCare Member"}</p>
                </div>
              </div>
              <button className="pp-close" onClick={onClose}>✕</button>
            </div>

            <div className="pp-completion">
              <div className="pp-completion-label">
                <span>Profile Completion</span>
                <span>{completion}%</span>
              </div>
              <div className="pp-completion-track">
                <div className="pp-completion-fill" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>

          <div className="pp-nav">
            {sections.map(s => (
              <button
                key={s.id}
                className={`pp-nav-btn${activeSection === s.id ? " active" : ""}`}
                onClick={() => setActiveSection(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="pp-body">
            <div className="pp-action-bar">
              {editing ? (
                <>
                  <button className="pp-btn-cancel" onClick={() => { setDraft({ ...userData }); setEditing(false); }}>
                    Cancel
                  </button>
                  <button className="pp-btn-save" onClick={handleSave}>Save Changes</button>
                </>
              ) : (
                <>
                  <button className="pp-btn-logout" onClick={onLogout}>Log Out</button>
                  <button className="pp-btn-edit" onClick={() => setEditing(true)}>Edit Profile</button>
                </>
              )}
            </div>

            {activeSection === "profile" && (
              <div>
                <div className="pp-stats">
                  <div className="pp-stat">
                    <span className="pp-stat-num">12</span>
                    <span className="pp-stat-lbl">Day Streak</span>
                  </div>
                  <div className="pp-stat">
                    <span className="pp-stat-num">{draft.goals?.length || 0}</span>
                    <span className="pp-stat-lbl">Goals Set</span>
                  </div>
                  <div className="pp-stat">
                    <span className="pp-stat-num">{completion}%</span>
                    <span className="pp-stat-lbl">Complete</span>
                  </div>
                </div>

                {editing && (
                  <div className="pp-photo-edit-row">
                    <div
                      className="pp-photo-edit-avatar"
                      style={!draft.profilePhoto ? { background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}bb)` } : {}}
                    >
                      {draft.profilePhoto
                        ? <img src={draft.profilePhoto} alt="profile" />
                        : initial
                      }
                    </div>
                    <div className="pp-photo-edit-info">
                      <div className="pp-photo-edit-title">Profile Photo</div>
                      <div className="pp-photo-edit-hint">
                        {draft.profilePhoto ? "Photo uploaded" : "Upload from camera or gallery"}
                      </div>
                    </div>
                    <button
                      className="pp-photo-upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      {draft.profilePhoto ? "Change" : "Upload"}
                    </button>
                    <button
                      className="pp-photo-upload-btn"
                      onClick={() => setCameraOpen(true)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      Camera
                    </button>
                    {draft.profilePhoto && (
                      <button
                        className="pp-photo-remove-btn"
                        onClick={() => setDraft(prev => ({ ...prev, profilePhoto: null }))}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}

                <span className="pp-eyebrow">Account Details</span>
                <p className="pp-heading">Personal Information</p>
                <div className="pp-field-grid">
                  <div className="pp-field">
                    <span className="pp-label">Username</span>
                    {editing
                      ? <input className="pp-input" value={draft.username} onChange={e => setDraft({ ...draft, username: e.target.value })} placeholder="Enter username" />
                      : <span className={`pp-value${!draft.username ? " empty" : ""}`}>{draft.username || "Not set"}</span>
                    }
                  </div>
                  <div className="pp-field">
                    <span className="pp-label">Email</span>
                    {editing
                      ? <input className="pp-input" type="email" value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} placeholder="Enter email" />
                      : <span className={`pp-value${!draft.email ? " empty" : ""}`}>{draft.email || "Not set"}</span>
                    }
                  </div>
                </div>

                <div className="pp-divider" />
                <span className="pp-eyebrow">Aspirations</span>
                <p className="pp-heading">Wellness Goals</p>
                {editing ? (
                  <div className="pp-tag-cloud">
                    {GOALS.map(g => (
                      <span
                        key={g}
                        className={`pp-chip selectable${draft.goals?.includes(g) ? " sel" : ""}`}
                        onClick={() => toggleItem("goals", g)}
                      >{g}</span>
                    ))}
                  </div>
                ) : draft.goals?.length > 0 ? (
                  <div className="pp-tag-cloud">
                    {draft.goals.map(g => <span key={g} className="pp-chip display">{g}</span>)}
                  </div>
                ) : (
                  <p className="pp-empty">No goals set yet</p>
                )}
              </div>
            )}

            {activeSection === "skin" && (
              <div>
                <span className="pp-eyebrow">Your Skin</span>
                <p className="pp-heading">Skin Profile</p>
                <div className="pp-field-grid">
                  <div className="pp-field">
                    <span className="pp-label">Skin Type</span>
                    {editing ? (
                      <select className="pp-select" value={draft.skinType} onChange={e => setDraft({ ...draft, skinType: e.target.value })}>
                        <option value="">Select skin type</option>
                        {SKIN_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    ) : (
                      <span className={`pp-value${!draft.skinType ? " empty" : ""}`}>{draft.skinType || "Not specified"}</span>
                    )}
                  </div>
                </div>
                <div className="pp-concerns-row">
                  <span className="pp-label">Skin Concerns</span>
                  {editing ? (
                    <div className="pp-tag-cloud" style={{ marginTop: 4 }}>
                      {SKIN_CONCERNS.map(c => (
                        <span
                          key={c}
                          className={`pp-chip selectable${draft.skinConcerns?.includes(c) ? " sel" : ""}`}
                          onClick={() => toggleItem("skinConcerns", c)}
                        >{c}</span>
                      ))}
                    </div>
                  ) : draft.skinConcerns?.length > 0 ? (
                    <div className="pp-tag-cloud" style={{ marginTop: 4 }}>
                      {draft.skinConcerns.map(c => <span key={c} className="pp-chip display">{c}</span>)}
                    </div>
                  ) : (
                    <p className="pp-empty">No concerns selected</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === "hair" && (
              <div>
                <span className="pp-eyebrow">Your Hair</span>
                <p className="pp-heading">Hair Profile</p>
                <div className="pp-field-grid">
                  <div className="pp-field">
                    <span className="pp-label">Hair Type</span>
                    {editing ? (
                      <select className="pp-select" value={draft.hairType} onChange={e => setDraft({ ...draft, hairType: e.target.value })}>
                        <option value="">Select hair type</option>
                        {HAIR_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    ) : (
                      <span className={`pp-value${!draft.hairType ? " empty" : ""}`}>{draft.hairType || "Not specified"}</span>
                    )}
                  </div>
                </div>
                <div className="pp-concerns-row">
                  <span className="pp-label">Hair Concerns</span>
                  {editing ? (
                    <div className="pp-tag-cloud" style={{ marginTop: 4 }}>
                      {HAIR_CONCERNS.map(c => (
                        <span
                          key={c}
                          className={`pp-chip selectable${draft.hairConcerns?.includes(c) ? " sel" : ""}`}
                          onClick={() => toggleItem("hairConcerns", c)}
                        >{c}</span>
                      ))}
                    </div>
                  ) : draft.hairConcerns?.length > 0 ? (
                    <div className="pp-tag-cloud" style={{ marginTop: 4 }}>
                      {draft.hairConcerns.map(c => <span key={c} className="pp-chip display">{c}</span>)}
                    </div>
                  ) : (
                    <p className="pp-empty">No concerns selected</p>
                  )}
                </div>
              </div>
            )}

            {activeSection === "wellness" && (
              <div>
                <span className="pp-eyebrow">Daily Habits</span>
                <p className="pp-heading">Wellness Snapshot</p>
                <div className="pp-stats">
                  <div className="pp-stat">
                    <span className="pp-stat-num" style={{ fontSize: "1.1rem", paddingTop: 4 }}>{draft.waterIntake || "–"}</span>
                    <span className="pp-stat-lbl">Water / Day</span>
                  </div>
                  <div className="pp-stat">
                    <span className="pp-stat-num" style={{ fontSize: "1.1rem", paddingTop: 4 }}>{draft.sleep || "–"}</span>
                    <span className="pp-stat-lbl">Sleep</span>
                  </div>
                  <div className="pp-stat">
                    <span className="pp-stat-num">{(draft.skinConcerns?.length || 0) + (draft.hairConcerns?.length || 0)}</span>
                    <span className="pp-stat-lbl">Tracked</span>
                  </div>
                </div>

                <div className="pp-divider" />
                <p className="pp-heading" style={{ marginBottom: 20 }}>Daily Habits</p>
                <div className="pp-field-grid">
                  <div className="pp-field">
                    <span className="pp-label">Water Intake</span>
                    {editing ? (
                      <select className="pp-select" value={draft.waterIntake} onChange={e => setDraft({ ...draft, waterIntake: e.target.value })}>
                        <option value="">Select water intake</option>
                        {WATER_OPTIONS.map(w => <option key={w}>{w}</option>)}
                      </select>
                    ) : (
                      <span className={`pp-value${!draft.waterIntake ? " empty" : ""}`}>{draft.waterIntake || "Not specified"}</span>
                    )}
                  </div>
                  <div className="pp-field">
                    <span className="pp-label">Sleep Hours</span>
                    {editing ? (
                      <select className="pp-select" value={draft.sleep} onChange={e => setDraft({ ...draft, sleep: e.target.value })}>
                        <option value="">Select sleep hours</option>
                        {SLEEP_OPTIONS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    ) : (
                      <span className={`pp-value${!draft.sleep ? " empty" : ""}`}>{draft.sleep || "Not specified"}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {saved && <div className="pp-toast">✓ Profile updated successfully</div>}
      <CameraCapture
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(dataUrl) => setDraft(prev => ({ ...prev, profilePhoto: dataUrl }))}
        title="Take Photo"
      />
    </>
  );
}