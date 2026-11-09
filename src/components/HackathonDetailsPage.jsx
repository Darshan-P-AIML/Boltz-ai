import React, { useState } from 'react';
import CountdownTimer from './CountdownTimer';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Trophy, 
  Users, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Check, 
  ShieldCheck, 
  Code,
  Sparkles
} from './Icons';
import confetti from 'canvas-confetti';

export default function HackathonDetailsPage({ 
  hackathon, 
  isBookmarked, 
  onToggleBookmark, 
  onBack 
}) {
  const [copied, setCopied] = useState(false);

  if (!hackathon) return null;

  const handleApply = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    const targetUrl = hackathon.registrationUrl || hackathon.sourceUrl;
    if (targetUrl && targetUrl !== '#') {
      window.open(targetUrl, '_blank');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* Back Button */}
      <button 
        className="btn btn-secondary btn-sm" 
        onClick={onBack}
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} />
        <span>Back to Discover</span>
      </button>

      {/* Main Details Panel */}
      <div className="glass-panel cyber-card" style={{ overflow: 'hidden', padding: 0, position: 'relative' }}>
        <div className="hud-corner top-left" />
        <div className="hud-corner top-right" />
        <div className="hud-corner bottom-left" />
        <div className="hud-corner bottom-right" />

        {/* Banner Header */}
        <div style={{ 
          height: 240, 
          width: '100%', 
          position: 'relative', 
          backgroundImage: `url(${hackathon.image})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}>
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(180deg, rgba(11, 16, 32, 0.4) 0%, rgba(17, 24, 39, 0.95) 100%)' 
          }} />

          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-india">🇮🇳 INDIA</span>
              <span className="badge badge-online">{hackathon.mode}</span>
              <span className="badge badge-source">Source: {hackathon.platform}</span>
              <CountdownTimer targetDate={hackathon.registrationDeadline} />
            </div>

            <h1 className="glitch-text" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
              {hackathon.title}
            </h1>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Organized by <strong style={{ color: 'var(--text-primary)' }}>{hackathon.organizer}</strong>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '2rem' }}>
          <div className="modal-grid-2col">
            {/* Left Main Column */}
            <div>
              {/* Recommendation Explanation Box */}
              {hackathon.recommendation && (
                <div style={{
                  padding: '1rem 1.25rem',
                  background: 'linear-gradient(135deg, rgba(0,240,255,0.1), rgba(139,92,246,0.15))',
                  border: '1px solid var(--accent-cyan)',
                  borderRadius: '16px',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={16} /> Why this event is recommended for you (⚡ {hackathon.recommendation.score}% Match)
                    </h4>
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {hackathon.recommendation.reasons && hackathon.recommendation.reasons.map((r, i) => (
                      <li key={i} style={{ marginBottom: '0.2rem' }}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Verified Trust Badge */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.6rem 1rem', 
                background: 'rgba(99, 91, 255, 0.1)', 
                border: '1px solid rgba(99, 91, 255, 0.25)', 
                borderRadius: 'var(--radius-md)', 
                fontSize: '0.825rem', 
                color: '#A5B4FC', 
                marginBottom: '1.5rem' 
              }}>
                <ShieldCheck size={16} color="var(--accent-indigo)" />
                <span>Verified Source listing from <strong>{hackathon.platform}</strong></span>
              </div>

              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--accent-indigo)" />
                About this Hackathon
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.75rem' }}>
                {hackathon.description}
              </p>

              {/* Eligibility */}
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Eligibility & Requirements</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                {hackathon.eligibility}
              </p>

              {/* Tracks */}
              {hackathon.tracks && hackathon.tracks.length > 0 && (
                <div style={{ marginBottom: '1.75rem' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Themes & Tracks</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {hackathon.tracks.map((t) => (
                      <span key={t} className="tag-pill" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {hackathon.technologies && hackathon.technologies.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Technologies & Stacks</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {hackathon.technologies.map((tc) => (
                      <span key={tc} className="tag-pill" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                        <Code size={12} style={{ marginRight: 4 }} />
                        {tc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Panel */}
            <div>
              <div className="glass-panel cyber-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'var(--bg-subtle)', position: 'relative' }}>
                <div className="hud-corner top-left" />
                <div className="hud-corner top-right" />
                <div className="hud-corner bottom-left" />
                <div className="hud-corner bottom-right" />

                {/* Prize */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Prize Pool</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>
                    <Trophy size={20} style={{ display: 'inline', marginRight: 6 }} />
                    {hackathon.prizePool}
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registration Deadline</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-orange)', marginTop: '0.25rem' }}>
                    {hackathon.registrationDeadline ? new Date(hackathon.registrationDeadline).toLocaleString() : 'Not provided'}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Location & Mode</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                    <MapPin size={16} color="var(--accent-orange)" />
                    📍 {hackathon.location} ({hackathon.mode})
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Event Dates</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                    <Calendar size={16} color="var(--accent-cyan)" />
                    📅 {hackathon.startDate} to {hackathon.endDate}
                  </div>
                </div>

                {/* Participants */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Participants</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                    <Users size={16} color="var(--accent-indigo)" />
                    👥 {typeof hackathon.participants === 'number' ? `${hackathon.participants.toLocaleString()} registered` : hackathon.participants}
                  </div>
                </div>

                <hr style={{ borderColor: 'var(--border-subtle)' }} />

                {/* Holographic Register CTA */}
                <button
                  className="btn btn-holographic"
                  style={{ width: '100%', padding: '0.95rem', fontSize: '0.95rem' }}
                  onClick={handleApply}
                >
                  <ExternalLink size={18} color="var(--accent-cyan)" />
                  <span>Register on Official Website →</span>
                </button>

                {/* Actions Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onToggleBookmark(hackathon.id)}
                  >
                    <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} color={isBookmarked ? 'var(--accent-indigo)' : 'currentColor'} />
                    <span>{isBookmarked ? 'Saved ❤️' : 'Save'}</span>
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleShare}
                  >
                    {copied ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
                    <span>{copied ? 'Copied Link' : 'Share'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
