import React, { useState } from 'react';
import { X, Sparkles, Send } from './Icons';
import { CATEGORIES, MODES } from '../data/hackathons';
import confetti from 'canvas-confetti';

export default function SubmitModal({ onClose, onSubmitHackathon }) {
  const [formData, setFormData] = useState({
    title: '',
    host: '',
    mode: 'Online',
    status: 'Open',
    startDate: '2026-11-01',
    endDate: '2026-11-03',
    deadline: '2026-10-30',
    location: 'Online / Remote',
    city: 'Global',
    lat: 37.7749,
    lng: -122.4194,
    prizePool: '$50,000',
    prizeNumeric: 50000,
    tags: ['AI & Generative Tech'],
    description: '',
    eligibility: 'Open to all developers and builders worldwide.',
    sponsors: 'Community Hosted'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.host) return;

    const newHackathon = {
      ...formData,
      id: `hk-${Date.now()}`,
      participantsCount: 1,
      featured: false,
      bannerBg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
      prizes: [
        { rank: '1st Place', prize: formData.prizePool }
      ],
      sponsors: formData.sponsors ? formData.sponsors.split(',').map((s) => s.trim()) : ['Community']
    };

    onSubmitHackathon(newHackathon);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--accent-primary)" />
            Submit an Event to BOLTZ AI
          </h3>
          <button className="btn btn-icon btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Hackathon Title</label>
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '1rem' }}
              placeholder="e.g. SF AI Agents Hackathon 2026"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Organizer / Host Name</label>
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '1rem' }}
                placeholder="e.g. OpenAI Builders Hub"
                required
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Event Mode</label>
              <select
                className="select-field"
                style={{ width: '100%' }}
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
              >
                {MODES.filter((m) => m !== 'All Modes').map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Location / City</label>
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '1rem' }}
                placeholder="e.g. San Francisco, USA or Online"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Total Prize Pool ($)</label>
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '1rem' }}
                placeholder="e.g. $100,000"
                required
                value={formData.prizePool}
                onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Reg Deadline</label>
              <input
                type="date"
                className="input-field"
                style={{ paddingLeft: '0.75rem' }}
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Start Date</label>
              <input
                type="date"
                className="input-field"
                style={{ paddingLeft: '0.75rem' }}
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>End Date</label>
              <input
                type="date"
                className="input-field"
                style={{ paddingLeft: '0.75rem' }}
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Main Track / Category</label>
            <select
              className="select-field"
              style={{ width: '100%' }}
              onChange={(e) => setFormData({ ...formData, tags: [e.target.value] })}
            >
              {CATEGORIES.filter((c) => c !== 'All Tracks').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Description</label>
            <textarea
              className="input-field"
              style={{ paddingLeft: '1rem', height: 90, resize: 'none' }}
              placeholder="What makes this hackathon exciting?"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            <Send size={16} />
            <span>Publish Hackathon Listing</span>
          </button>
        </form>
      </div>
    </div>
  );
}
