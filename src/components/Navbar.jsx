import React, { useState } from 'react';
import { 
  Sparkles, 
  LayoutGrid, 
  MapPin, 
  Calendar, 
  Users, 
  Bookmark, 
  PlusCircle, 
  RotateCcw,
  User,
  LogOut,
  X,
  BarChart3
} from './Icons';

export default function Navbar({ 
  activeView, 
  setActiveView, 
  bookmarksCount, 
  onOpenBookmarks, 
  onOpenSubmit,
  onSyncData,
  isSyncing,
  user,
  onOpenAuth,
  onOpenProfile,
  onOpenAiAssistant
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Logo with Tagline */}
        <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); handleNavClick('grid'); }}>
          <div className="nav-logo-icon" style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-pink))' }}>
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="nav-logo-text" style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                BOLTZ <span className="gradient-text holographic-glow">AI</span>
              </span>
              <span className="badge badge-india" style={{ fontSize: '0.62rem', padding: '0.1rem 0.35rem' }}>
                🇮🇳 Gen Z
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '-2px' }}>
              Redefining Event Discovery for Gen Z
            </span>
          </div>
        </a>

        {/* Central Navigation Tabs (Desktop) */}
        <nav className="nav-tabs">
          <button 
            className={`nav-tab ${activeView === 'grid' ? 'active' : ''}`}
            onClick={() => handleNavClick('grid')}
            title="Discover Events"
          >
            <LayoutGrid size={16} />
            <span>Explore</span>
          </button>

          <button 
            className={`nav-tab ${activeView === 'recommendations' ? 'active' : ''}`}
            onClick={() => handleNavClick('recommendations')}
            title="Personalized AI Recommendations"
          >
            <Sparkles size={16} color="var(--accent-cyan)" />
            <span>Recommendations</span>
          </button>

          <button 
            className={`nav-tab ${activeView === 'map' ? 'active' : ''}`}
            onClick={() => handleNavClick('map')}
            title="India Map View"
          >
            <MapPin size={16} />
            <span>India Map</span>
          </button>

          <button 
            className={`nav-tab ${activeView === 'calendar' ? 'active' : ''}`}
            onClick={() => handleNavClick('calendar')}
            title="Calendar Schedule"
          >
            <Calendar size={16} />
            <span>Calendar</span>
          </button>

          <button 
            className={`nav-tab ${activeView === 'teammates' ? 'active' : ''}`}
            onClick={() => handleNavClick('teammates')}
            title="Find Teammates"
          >
            <Users size={16} />
            <span>Teammates</span>
          </button>

          <button 
            className={`nav-tab ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
            title="Radar HUD & Analytics Dashboard"
          >
            <BarChart3 size={16} color="var(--accent-cyan)" />
            <span>Radar HUD</span>
          </button>
        </nav>

        {/* Right Actions & User Profile */}
        <div className="nav-actions">
          {/* BOLTZ AI Assistant Launcher */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenAiAssistant}
            style={{ border: '1px solid var(--accent-pink)', background: 'rgba(255, 0, 127, 0.1)', color: '#fff' }}
            title="Ask BOLTZ AI Assistant"
          >
            <Sparkles size={14} color="var(--accent-pink)" />
            <span>Ask AI</span>
          </button>

          {/* Saved Bookmarks Button */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenBookmarks}
            title="Saved Hackathons"
          >
            <Bookmark size={14} fill={bookmarksCount > 0 ? "var(--accent-indigo)" : "none"} color={bookmarksCount > 0 ? "var(--accent-indigo)" : "currentColor"} />
            <span>Saved ({bookmarksCount})</span>
          </button>

          {/* AUTHENTICATION STATE */}
          {user ? (
            <button
              className="btn btn-secondary btn-sm"
              onClick={onOpenProfile}
              style={{ borderRadius: '20px', padding: '0.3rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--accent-cyan)' }}
            >
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-pink))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: '#fff' }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onOpenAuth('login')}
              >
                Login
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onOpenAuth('signup')}
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            title="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <LayoutGrid size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer open">
          <button 
            className={`nav-tab ${activeView === 'grid' ? 'active' : ''}`}
            onClick={() => handleNavClick('grid')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <LayoutGrid size={16} />
            <span>Explore Events</span>
          </button>

          <button 
            className={`nav-tab ${activeView === 'recommendations' ? 'active' : ''}`}
            onClick={() => handleNavClick('recommendations')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Sparkles size={16} color="var(--accent-cyan)" />
            <span>Recommendations</span>
          </button>

          <button 
            className={`nav-tab ${activeView === 'map' ? 'active' : ''}`}
            onClick={() => handleNavClick('map')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <MapPin size={16} />
            <span>India Map View</span>
          </button>

          <button 
            className={`nav-tab ${activeView === 'calendar' ? 'active' : ''}`}
            onClick={() => handleNavClick('calendar')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Calendar size={16} />
            <span>Schedule Calendar</span>
          </button>

          <button 
            className={`nav-tab ${activeView === 'teammates' ? 'active' : ''}`}
            onClick={() => handleNavClick('teammates')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Users size={16} />
            <span>Find Teammates</span>
          </button>

          <button 
            className={`nav-tab ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <BarChart3 size={16} color="var(--accent-cyan)" />
            <span>Radar HUD & Analytics</span>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => { onOpenAiAssistant(); setMobileMenuOpen(false); }}
            style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
          >
            <Sparkles size={14} color="var(--accent-pink)" />
            <span>Ask BOLTZ AI Assistant</span>
          </button>

          {user ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => { onOpenProfile(); setMobileMenuOpen(false); }}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <User size={14} />
              <span>{user.name} (Profile)</span>
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => { onOpenAuth('signup'); setMobileMenuOpen(false); }}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Get Started</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
