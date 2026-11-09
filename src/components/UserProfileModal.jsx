import React, { useState } from 'react';
import { X, Check, Sparkles, User, Building2, MapPin, GraduationCap, LogOut, Save, Edit3 } from './Icons';
import { AVAILABLE_INTERESTS, INDIAN_CITIES, updateUserProfile, logoutUser } from '../services/auth';

export default function UserProfileModal({ isOpen, onClose, user, onUpdateUser, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [course, setCourse] = useState(user?.course || '');
  const [year, setYear] = useState(user?.year || '3rd Year');
  const [city, setCity] = useState(user?.city || 'Bengaluru');
  const [selectedInterests, setSelectedInterests] = useState(user?.interests || ['AI/ML', 'Hackathons']);

  if (!isOpen || !user) return null;

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = updateUserProfile({
      name,
      college,
      course,
      year,
      city,
      interests: selectedInterests
    });
    onUpdateUser(updated);
    setIsEditing(false);
  };

  const handleLogoutClick = () => {
    logoutUser();
    onLogout();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 560,
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.25rem',
          borderRadius: '24px',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
        }}
      >
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        {/* Header Avatar & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-pink))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#fff',
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)'
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'G'}
          </div>

          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {user.name}
              <span className="badge badge-india" style={{ fontSize: '0.7rem' }}>🇮🇳 Verified Builder</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{user.email}</p>
            <p style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem', marginTop: '0.2rem', fontWeight: 600 }}>
              {user.college} • {user.year}
            </p>
          </div>
        </div>

        {!isEditing ? (
          /* READ VIEW */
          <div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem', marginBottom: '0.2rem' }}>College / University</span>
                <span style={{ fontWeight: 600 }}>{user.college}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem', marginBottom: '0.2rem' }}>Branch / Degree</span>
                <span style={{ fontWeight: 600 }}>{user.course}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem', marginBottom: '0.2rem' }}>Year of Study</span>
                <span style={{ fontWeight: 600 }}>{user.year}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem', marginBottom: '0.2rem' }}>Location</span>
                <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>📍 {user.city}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles size={16} color="var(--accent-pink)" /> Active Interests ({user.interests ? user.interests.length : 0})
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Powers AI Recommendations</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {user.interests && user.interests.map((interest) => (
                  <span
                    key={interest}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: 'rgba(139, 92, 246, 0.2)',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                      color: '#fff'
                    }}
                  >
                    ⚡ {interest}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <button 
                onClick={() => setIsEditing(true)} 
                className="btn btn-secondary" 
                style={{ flex: 1, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Edit3 size={16} /> Edit Profile & Interests
              </button>

              <button 
                onClick={handleLogoutClick} 
                className="btn" 
                style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        ) : (
          /* EDIT FORM */
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: '#fff' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>College</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: '#fff' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>City / Location</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', background: '#0f172a', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: '#fff' }}
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}>
                Update Tech Interests:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: 150, overflowY: 'auto', padding: '0.5rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                {AVAILABLE_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: isSelected ? '1px solid var(--accent-pink)' : '1px solid rgba(255,255,255,0.1)',
                        background: isSelected ? 'linear-gradient(135deg, rgba(255,0,127,0.25), rgba(139,92,246,0.3))' : 'rgba(255,255,255,0.03)',
                        color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      {isSelected && <Check size={12} color="var(--accent-cyan)" />}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Save size={16} /> Save Changes
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ borderRadius: '12px' }}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
