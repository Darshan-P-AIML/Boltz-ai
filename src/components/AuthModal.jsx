import React, { useState } from 'react';
import { X, Check, Sparkles, User, Lock, Mail, Building2, MapPin, GraduationCap, ArrowRight } from './Icons';
import { AVAILABLE_INTERESTS, INDIAN_CITIES, signupUser, loginUser } from '../services/auth';

export default function AuthModal({ isOpen, onClose, initialMode = 'signup', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year');
  const [city, setCity] = useState('Bengaluru');
  const [selectedInterests, setSelectedInterests] = useState(['AI/ML', 'Hackathons', 'Web Development']);

  if (!isOpen) return null;

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    const user = loginUser(loginEmail, loginPassword);
    onAuthSuccess(user);
    onClose();
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    const user = signupUser({
      name,
      email,
      password,
      college: college || 'Engineering College',
      course,
      year,
      city,
      interests: selectedInterests
    });

    onAuthSuccess(user);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 580,
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          borderRadius: '24px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Close Button */}
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

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-pink))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)'
          }}>
            <Sparkles size={28} color="#FFFFFF" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            {mode === 'signup' ? 'Join BOLTZ AI' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {mode === 'signup'
              ? 'Redefining Event Discovery for Gen Z Builders'
              : 'Sign in to access your personalized recommendations'}
          </p>

          {/* Tab Switcher */}
          <div style={{
            display: 'inline-flex',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '4px',
            marginTop: '1.25rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setMode('signup')}
              className={`btn btn-sm ${mode === 'signup' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none', borderRadius: '8px', padding: '0.4rem 1.25rem' }}
            >
              Get Started / Signup
            </button>
            <button
              onClick={() => setMode('login')}
              className={`btn btn-sm ${mode === 'login' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none', borderRadius: '8px', padding: '0.4rem 1.25rem' }}
            >
              Log In
            </button>
          </div>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={16} /> Email Address
              </label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="aarav@college.edu"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: '#fff' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={16} /> Password
              </label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: '#fff' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              Sign In to BOLTZ AI <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={16} /> Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: '#fff' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={16} /> Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="aarav@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lock size={16} /> Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: '#fff' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={16} /> College / University
                </label>
                <input
                  type="text"
                  placeholder="IIT Bombay / BITS Pilani / RVCE"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '12px', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <GraduationCap size={14} /> Course
                </label>
                <input
                  type="text"
                  placeholder="B.Tech CS"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.75rem', background: '#0f172a', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Post Graduate">Post Graduate</option>
                </select>
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={14} /> City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.75rem', background: '#0f172a', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }}
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* INTEREST SELECTION */}
            <div style={{ marginTop: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'block' }}>
                Select Your Tech Interests (Powers Recommendation Engine):
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
                        gap: '0.3rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isSelected && <Check size={12} color="var(--accent-cyan)" />}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                marginTop: '0.5rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              Complete Profile & Start Discovery <ArrowRight size={18} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
