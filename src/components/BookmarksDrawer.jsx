import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, Trophy } from './Icons';

export default function BookmarksDrawer({ 
  isOpen, 
  onClose, 
  bookmarkedHackathons, 
  onRemoveBookmark, 
  onSelectHackathon 
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      
      <div className="drawer-panel" style={{ padding: '1.5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bookmark size={20} color="var(--accent-primary)" fill="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem' }}>Saved Hackathons ({bookmarkedHackathons.length})</h3>
          </div>
          <button className="btn btn-icon btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookmarkedHackathons.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 1rem' }}>
              <Bookmark size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>No saved hackathons yet.</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Click the bookmark icon on any card to save it for quick access!</p>
            </div>
          ) : (
            bookmarkedHackathons.map((h) => (
              <div 
                key={h.id} 
                className="glass-panel" 
                style={{ padding: '1rem', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge badge-open" style={{ fontSize: '0.65rem' }}>{h.mode}</span>
                  <button 
                    className="btn btn-icon btn-sm" 
                    onClick={() => onRemoveBookmark(h.id)}
                    title="Remove from saved"
                    style={{ width: 28, height: 28 }}
                  >
                    <Trash2 size={14} color="var(--accent-rose)" />
                  </button>
                </div>

                <h4 
                  style={{ fontSize: '1rem', cursor: 'pointer' }} 
                  onClick={() => { onSelectHackathon(h); onClose(); }}
                >
                  {h.title}
                </h4>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  📍 {h.location} • Deadline: <strong style={{ color: 'var(--accent-amber)' }}>{h.deadline}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    <Trophy size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {h.prizePool}
                  </span>

                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => { onSelectHackathon(h); onClose(); }}
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                  >
                    <span>View</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
