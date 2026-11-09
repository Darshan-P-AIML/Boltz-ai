import React from 'react';
import CountdownTimer from './CountdownTimer';
import { 
  MapPin, 
  Users, 
  Bookmark, 
  ArrowRight,
  Trophy,
  Calendar,
  Sparkles,
  CheckCircle2,
  ExternalLink
} from './Icons';

export default function HackathonCard({ 
  hackathon, 
  isBookmarked, 
  onToggleBookmark, 
  onSelect,
  recommendation
}) {
  const isOnline = hackathon.mode === 'Online';
  const platformName = (hackathon.platform || 'Devfolio').toUpperCase();
  const regUrl = hackathon.registrationUrl || hackathon.sourceUrl;

  return (
    <div className="hackathon-card cyber-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div className="hud-corner top-left" />
      <div className="hud-corner top-right" />
      <div className="hud-corner bottom-left" />
      <div className="hud-corner bottom-right" />

      {/* Banner Header with Badges */}
      <div 
        className="card-banner" 
        style={{ 
          backgroundImage: hackathon.image && hackathon.image.startsWith('http') ? `url(${hackathon.image})` : 'none',
          background: hackathon.image && hackathon.image.startsWith('http') ? 'none' : 'linear-gradient(135deg, rgba(99, 91, 255, 0.15) 0%, rgba(0, 184, 255, 0.15) 100%)'
        }}
      >
        <div className="card-banner-overlay" />
        
        {/* Badges Top */}
        <div className="card-badge-top" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {/* Recommendation Match Badge */}
          {recommendation && (
            <span className="badge badge-cyan" style={{ fontWeight: 800, background: 'rgba(0, 240, 255, 0.25)', border: '1px solid var(--accent-cyan)' }}>
              ⚡ {recommendation.score}% Match
            </span>
          )}

          {/* Mode Badge [ONLINE] / [IN-PERSON] / [HYBRID] */}
          <span className={`badge ${isOnline ? 'badge-online' : 'badge-india'}`}>
            {isOnline ? 'ONLINE' : (hackathon.mode === 'Hybrid' ? 'HYBRID' : 'IN-PERSON')}
          </span>

          {/* Source Platform Badge */}
          <span className="badge badge-source">
            {platformName}
          </span>
        </div>

        {/* Bookmark Action */}
        <button
          className="card-bookmark-btn"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(hackathon.id);
          }}
          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Hackathon'}
        >
          <Bookmark 
            size={15} 
            fill={isBookmarked ? 'var(--accent-indigo)' : 'none'} 
            color={isBookmarked ? 'var(--accent-indigo)' : 'var(--text-secondary)'} 
          />
        </button>
      </div>

      {/* Card Body */}
      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Recommendation Reason Pill */}
        {recommendation && recommendation.badgeText && (
          <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={12} color="var(--accent-cyan)" /> {recommendation.badgeText}
          </div>
        )}

        {/* Organizer & Verified Source Badge */}
        <div className="card-host" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.35rem' }}>
          <span>Organized by <strong>{hackathon.organizer || hackathon.host}</strong></span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.725rem', color: '#A5B4FC' }}>
            <CheckCircle2 size={12} color="var(--accent-indigo)" /> Verified
          </span>
        </div>

        {/* Title */}
        <h3 className="card-title" onClick={() => onSelect(hackathon)} style={{ cursor: 'pointer' }}>
          {hackathon.title}
        </h3>

        {/* Short Description */}
        <p className="card-description">
          {hackathon.description}
        </p>

        {/* Technology / Track Tags */}
        <div className="card-tags" style={{ marginBottom: '0.75rem' }}>
          {(hackathon.tracks || hackathon.tags || hackathon.technologies || []).slice(0, 3).map((tag) => (
            <span key={tag} className="tag-pill">
              {tag}
            </span>
          ))}
        </div>

        {/* Meta Grid (Dates, Location, Prize, Participants) */}
        <div className="card-meta-list" style={{ marginBottom: '1rem' }}>
          <div className="card-meta-item">
            <Calendar size={14} color="var(--accent-cyan)" />
            <span>📅 {hackathon.startDate ? `${hackathon.startDate} - ${hackathon.endDate || ''}` : 'Oct 2-3, 2026'}</span>
          </div>

          <div className="card-meta-item">
            <MapPin size={14} color="var(--accent-orange)" />
            <span>📍 {hackathon.location || `${hackathon.city || 'Bengaluru'}, India`}</span>
          </div>

          <div className="card-meta-item">
            <Trophy size={14} color="var(--accent-emerald)" />
            <span>💰 Prize Pool: <strong style={{ color: 'var(--accent-emerald)', fontWeight: 800 }}>{hackathon.prizePool}</strong></span>
          </div>

          <div className="card-meta-item">
            <Users size={14} color="var(--accent-indigo)" />
            <span>👥 {typeof hackathon.participants === 'number' ? `${hackathon.participants.toLocaleString()} participants` : hackathon.participants}</span>
          </div>
        </div>

        {/* Footer with Countdown & Dual Action Buttons */}
        <div className="card-footer" style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <CountdownTimer targetDate={hackathon.registrationDeadline} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onSelect(hackathon)}
              style={{ width: '100%', fontSize: '0.78rem', padding: '0.45rem 0.5rem', justifyContent: 'center' }}
            >
              <span>View Details</span>
            </button>

            {regUrl && regUrl !== '#' ? (
              <a
                href={regUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ width: '100%', fontSize: '0.78rem', padding: '0.45rem 0.5rem', justifyContent: 'center', textDecoration: 'none' }}
              >
                <span>Register</span>
                <ExternalLink size={12} />
              </a>
            ) : (
              <button
                disabled
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', fontSize: '0.78rem', opacity: 0.6 }}
              >
                <span>Reg Closed</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
