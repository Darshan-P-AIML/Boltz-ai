import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Trophy, 
  Users, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Check, 
  Download,
  Award,
  Building,
  Sparkles
} from './Icons';
import confetti from 'canvas-confetti';

export default function HackathonModal({ 
  hackathon, 
  isBookmarked, 
  onToggleBookmark, 
  onClose 
}) {
  const [copied, setCopied] = useState(false);
  const [registered, setRegistered] = useState(false);

  if (!hackathon) return null;

  const handleApply = () => {
    setRegistered(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadICS = () => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BOLTZ AI//EN
BEGIN:VEVENT
SUMMARY:${hackathon.title}
DESCRIPTION:${hackathon.description}
LOCATION:${hackathon.location}
DTSTART:${hackathon.startDate.replace(/-/g, '')}T090000Z
DTEND:${hackathon.endDate.replace(/-/g, '')}T180000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${hackathon.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Banner */}
        <div className="modal-header-banner" style={{ background: hackathon.bannerBg }}>
          <button className="modal-close-btn" onClick={onClose} title="Close Modal">
            <X size={20} />
          </button>
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span className="badge badge-open" style={{ marginBottom: '0.5rem', display: 'inline-flex' }}>
              {hackathon.mode} • {hackathon.status}
            </span>
            <h2 style={{ fontSize: '1.8rem', color: '#fff' }}>{hackathon.title}</h2>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Hosted by {hackathon.host}</div>
          </div>
        </div>

        {/* Body Grid */}
        <div className="modal-body">
          <div className="modal-grid-2col">
            {/* Left Column: Details & Schedule */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="var(--accent-primary)" />
                About the Hackathon
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                {hackathon.description}
              </p>

              {/* Eligibility */}
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Eligibility & Requirements</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                {hackathon.eligibility}
              </p>

              {/* Prizes List */}
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={18} color="var(--accent-emerald)" />
                Prizes Breakdown ({hackathon.prizePool})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {hackathon.prizes.map((p, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 1rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={14} color="var(--accent-amber)" />
                      {p.rank}
                    </span>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem' }}>
                      {p.prize}
                    </span>
                  </div>
                ))}
              </div>

              {/* Schedule Timeline */}
              {hackathon.schedule && (
                <>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={18} color="var(--accent-secondary)" />
                    Schedule Highlights
                  </h3>
                  <div style={{ borderLeft: '2px solid var(--accent-primary)', paddingLeft: '1rem', marginLeft: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {hackathon.schedule.map((item, idx) => (
                      <div key={idx}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-accent)', fontWeight: 600 }}>{item.date}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{item.event}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Sponsors */}
              {hackathon.sponsors && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Sponsors & Partners</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {hackathon.sponsors.map((s) => (
                      <span key={s} className="tag-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Building size={12} /> {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Quick Info Panel */}
            <div>
              <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                    <MapPin size={16} color="var(--accent-cyan)" />
                    {hackathon.location}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dates</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                    <Calendar size={16} color="var(--accent-secondary)" />
                    {hackathon.startDate} to {hackathon.endDate}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registration Deadline</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-amber)', marginTop: '0.2rem' }}>
                    {hackathon.deadline}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Participants</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                    <Users size={16} color="var(--accent-emerald)" />
                    {hackathon.participantsCount.toLocaleString()} hackers registered
                  </div>
                </div>

                <hr style={{ borderColor: 'var(--border-subtle)', margin: '0.25rem 0' }} />

                {/* Apply Button */}
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                  onClick={handleApply}
                >
                  {registered ? (
                    <>
                      <Check size={18} />
                      <span>Registration Complete! 🎉</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink size={18} />
                      <span>Apply & Join Hackathon</span>
                    </>
                  )}
                </button>

                {/* Secondary Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => onToggleBookmark(hackathon.id)}
                    title="Bookmark"
                  >
                    <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
                    <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                  </button>

                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={handleShare}
                    title="Share Link"
                  >
                    {copied ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
                    <span>{copied ? 'Copied' : 'Share'}</span>
                  </button>

                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={handleDownloadICS}
                    title="Add to Calendar"
                  >
                    <Download size={14} />
                    <span>.ICS</span>
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
