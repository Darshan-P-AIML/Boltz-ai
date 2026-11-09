import React from 'react';
import { Compass, Trophy, MapPin, Users2, Calendar, Sparkles, ArrowRight } from './Icons';

export default function HeroBanner({ 
  totalHackathons, 
  totalPrizesFormatted, 
  totalCities, 
  totalParticipantsFormatted, 
  onExplore, 
  onGetStarted,
  user
}) {
  return (
    <section className="hero-section">
      {/* Animated Subtle Grid Background */}
      <div className="hero-grid-bg" />
      <div className="hero-radial-glow" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Live Radar Badge */}
        <div className="hero-badge">
          <span className="live-radar-dot" />
          <span>⚡ BOLTZ AI • REDEFINING EVENT DISCOVERY FOR GEN Z</span>
        </div>

        {/* Main Heading with Cyberpunk Glitch Effect */}
        <h1 className="hero-title">
          Discover Events. <span className="gradient-text holographic-glow glitch-text" data-text="Find Your Vibe.">Find Your Vibe.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          AI-Powered Personalized Event & Hackathon Discovery Platform for Gen Z Builders. Instantly match upcoming AI competitions, developer summits, and tech challenges across India.
        </p>

        {/* Floating Small Tech Tags */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem', marginBottom: '2.25rem', flexWrap: 'wrap' }}>
          <span className="floating-tag tag-cyan" style={{ animationDelay: '0s' }}>⚡ Gen Z Vibez</span>
          <span className="floating-tag tag-pink" style={{ animationDelay: '0.4s' }}>🤖 AI & ML</span>
          <span className="floating-tag tag-green" style={{ animationDelay: '0.8s' }}>🌐 Web3 & Crypto</span>
          <span className="floating-tag tag-purple" style={{ animationDelay: '1.2s' }}>🔐 Cybersecurity</span>
          <span className="floating-tag tag-orange" style={{ animationDelay: '1.6s' }}>💻 Hackathons</span>
          <span className="floating-tag tag-cyan" style={{ animationDelay: '2.0s' }}>📡 Tech Summits</span>
          <span className="floating-tag tag-green" style={{ animationDelay: '2.4s' }}>🚀 Startups & Devs</span>
        </div>

        {/* Action Buttons */}
        <div className="hero-cta-group" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-holographic" 
            style={{ padding: '0.85rem 2rem', fontSize: '1rem', letterSpacing: '0.02em', borderRadius: '14px' }}
            onClick={onExplore || (() => {
              const filterEl = document.querySelector('.filter-bar');
              if (filterEl) filterEl.scrollIntoView({ behavior: 'smooth' });
            })}
          >
            <Sparkles size={18} color="var(--accent-cyan)" />
            <span>Explore Events</span>
          </button>

          <button 
            className="btn btn-secondary btn-cyber" 
            style={{ padding: '0.85rem 1.85rem', fontSize: '0.95rem', borderRadius: '14px' }}
            onClick={onGetStarted}
          >
            <span>{user ? '⚡ My Recommendations' : 'Get Started'}</span>
            <ArrowRight size={18} color="var(--accent-pink)" />
          </button>
        </div>

        {/* Real Statistic Cards with HUD Corners */}
        <div className="stats-grid">
          <div className="stat-card cyber-card" style={{ position: 'relative' }}>
            <div className="hud-corner top-left" />
            <div className="hud-corner top-right" />
            <div className="hud-corner bottom-left" />
            <div className="hud-corner bottom-right" />
            <div className="stat-card-accent cyan-accent" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Compass size={24} color="var(--accent-cyan)" />
              <span className="stat-number stat-cyan">{totalHackathons || 15}</span>
            </div>
            <div className="stat-label">Verified Live Events</div>
          </div>

          <div className="stat-card cyber-card" style={{ position: 'relative' }}>
            <div className="hud-corner top-left" />
            <div className="hud-corner top-right" />
            <div className="hud-corner bottom-left" />
            <div className="hud-corner bottom-right" />
            <div className="stat-card-accent green-accent" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Trophy size={24} color="var(--accent-emerald)" />
              <span className="stat-number stat-green">
                {totalPrizesFormatted || '₹5.6 Crore+'}
              </span>
            </div>
            <div className="stat-label">Total Prize Pool</div>
          </div>

          <div className="stat-card cyber-card" style={{ position: 'relative' }}>
            <div className="hud-corner top-left" />
            <div className="hud-corner top-right" />
            <div className="hud-corner bottom-left" />
            <div className="hud-corner bottom-right" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <MapPin size={24} color="var(--accent-orange)" />
              <span className="stat-number stat-orange">{totalCities || 10}</span>
            </div>
            <div className="stat-label">Indian Tech Hubs</div>
          </div>

          <div className="stat-card cyber-card">
            <div className="stat-card-accent pink-accent" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Users2 size={24} color="var(--accent-pink)" />
              <span className="stat-number stat-pink">{totalParticipantsFormatted || '45k+'}</span>
            </div>
            <div className="stat-label">Gen Z Builders</div>
          </div>
        </div>
      </div>
    </section>
  );
}
