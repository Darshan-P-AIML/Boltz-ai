import React, { useState } from 'react';
import { Users, Plus, Mail, Code, Sparkles, Send } from './Icons';

export default function TeammateFinder({ teammateRequests, onAddTeammateRequest, hackathons }) {
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('All');

  const [formData, setFormData] = useState({
    hackathonId: hackathons[0]?.id || '',
    author: '',
    roleNeeded: '',
    myRole: '',
    bio: '',
    skills: '',
    contact: ''
  });

  const allSkills = ['All', 'Python', 'React', 'Solidity', 'Flutter', 'FastAPI', 'Figma', 'LangChain', 'Go'];

  const filteredRequests = teammateRequests.filter((req) => {
    if (selectedSkillFilter === 'All') return true;
    return req.skills.some((s) => s.toLowerCase().includes(selectedSkillFilter.toLowerCase()));
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.author || !formData.roleNeeded || !formData.contact) return;

    const matchedHack = hackathons.find((h) => h.id === formData.hackathonId) || hackathons[0];

    const newPost = {
      id: `tm-${Date.now()}`,
      hackathonId: matchedHack.id,
      hackathonTitle: matchedHack.title,
      author: formData.author,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      roleNeeded: formData.roleNeeded,
      myRole: formData.myRole || 'Developer',
      bio: formData.bio || 'Excited to hack and build innovative solutions!',
      skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()) : ['React', 'JavaScript'],
      contact: formData.contact,
      postedTime: 'Just now'
    };

    onAddTeammateRequest(newPost);
    setShowPostModal(false);
    setFormData({
      hackathonId: hackathons[0]?.id || '',
      author: '',
      roleNeeded: '',
      myRole: '',
      bio: '',
      skills: '',
      contact: ''
    });
  };

  return (
    <div style={{ marginBottom: '3rem' }}>
      {/* Header & Post CTA */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users color="var(--accent-primary)" />
            Find Hackathon Teammates & Co-Founders
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Connect with developers, designers, and AI researchers looking to assemble winning teams.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowPostModal(true)}>
          <Plus size={16} />
          <span>Post Teammate Request</span>
        </button>
      </div>

      {/* Skill Filter Chips */}
      <div className="filter-row-chips" style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter by Skill:</span>
        {allSkills.map((sk) => (
          <button
            key={sk}
            className={`chip-btn ${selectedSkillFilter === sk ? 'active' : ''}`}
            onClick={() => setSelectedSkillFilter(sk)}
          >
            {sk}
          </button>
        ))}
      </div>

      {/* Teammate Requests Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {filteredRequests.map((req) => (
          <div key={req.id} className="glass-panel glass-panel-hover" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <img
                src={req.avatar}
                alt={req.author}
                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
              />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{req.author}</h4>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-accent)' }}>My Role: {req.myRole}</div>
              </div>
              <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {req.postedTime}
              </span>
            </div>

            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              color: 'var(--text-primary)',
              fontWeight: 600,
              marginBottom: '0.75rem'
            }}>
              🎯 Looking for: <span style={{ color: 'var(--accent-emerald)' }}>{req.roleNeeded}</span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Hackathon: <strong style={{ color: 'var(--text-secondary)' }}>{req.hackathonTitle}</strong>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
              "{req.bio}"
            </p>

            {/* Skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
              {req.skills.map((s) => (
                <span key={s} className="tag-pill">
                  <Code size={10} style={{ marginRight: 4 }} />
                  {s}
                </span>
              ))}
            </div>

            {/* Contact Action */}
            <a
              href={`mailto:${req.contact}`}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', textDecoration: 'none' }}
            >
              <Mail size={14} />
              <span>Contact Builder ({req.contact})</span>
            </a>
          </div>
        ))}
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles color="var(--accent-primary)" size={20} />
                Post Teammate Request
              </h3>
              <button className="btn btn-icon btn-sm" onClick={() => setShowPostModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Target Hackathon</label>
                <select
                  className="select-field"
                  style={{ width: '100%' }}
                  value={formData.hackathonId}
                  onChange={(e) => setFormData({ ...formData, hackathonId: e.target.value })}
                >
                  {hackathons.map((h) => (
                    <option key={h.id} value={h.id}>{h.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Your Name / Handle</label>
                <input
                  type="text"
                  className="input-field"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="e.g. Alex Chen"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Your Current Role</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="e.g. AI Engineer"
                    value={formData.myRole}
                    onChange={(e) => setFormData({ ...formData, myRole: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Role Needed</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="e.g. Frontend Dev / UI Designer"
                    required
                    value={formData.roleNeeded}
                    onChange={(e) => setFormData({ ...formData, roleNeeded: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Project Pitch / Bio</label>
                <textarea
                  className="input-field"
                  style={{ paddingLeft: '1rem', height: 80, resize: 'none' }}
                  placeholder="Describe what you plan to build..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Required Skills (comma separated)</label>
                <input
                  type="text"
                  className="input-field"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="e.g. React, Python, PyTorch, Figma"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Contact Info (Email / Twitter)</label>
                <input
                  type="text"
                  className="input-field"
                  style={{ paddingLeft: '1rem' }}
                  placeholder="e.g. alex@gmail.com"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <Send size={16} />
                <span>Publish Request</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
