import React, { useState } from 'react';
import { X, Sparkles, Send, ArrowRight, ExternalLink, Calendar, MapPin, Trophy, ShieldCheck } from './Icons';
import { queryEventsAI } from '../services/events';
import { calculateRecommendationScore } from '../services/recommendation';

export default function AiAssistant({ isOpen, onClose, events = [], userProfile, onSelectHackathon }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Hey ${userProfile?.name || 'there'}! ⚡ I'm your **BOLTZ AI Discovery Assistant**.\nWhat kind of hackathons or tech events are you looking for today?`,
      results: []
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text: query };
    const matchedEvents = queryEventsAI(query, events);

    const botMsg = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: matchedEvents.length > 0 
        ? `I analyzed verified hackathons across Devfolio, Unstop, and Devpost. Found ${matchedEvents.length} events matching your search:`
        : `I searched across active hackathon registries for "${query}". No direct matches found, but here are top trending events for you:`,
      results: matchedEvents.length > 0 ? matchedEvents : events.slice(0, 3)
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    if (!textToSend) setInputQuery('');
  };

  const samplePrompts = [
    "Find AI hackathons for me",
    "I am interested in cybersecurity",
    "Show online hackathons",
    "Which hackathons match my interests?",
    "Find events closing soon"
  ];

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ justifyContent: 'flex-end', zIndex: 1100 }}>
      <div 
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
          borderLeft: '1px solid rgba(0, 240, 255, 0.3)',
          background: '#090d1f',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.8)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.8)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-pink), var(--accent-indigo))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                BOLTZ AI <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>Agentic Assistant</span>
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time Event Recommendation Engine</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Conversation Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%',
                padding: '0.85rem 1.1rem',
                borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.sender === 'user' 
                  ? 'linear-gradient(135deg, var(--accent-indigo), rgba(139,92,246,0.8))' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-line'
              }}>
                {msg.text}
              </div>

              {/* Event Cards Carousel inside message */}
              {msg.results && msg.results.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem', width: '100%' }}>
                  {msg.results.map((event) => {
                    const rec = calculateRecommendationScore(event, userProfile);
                    return (
                      <div 
                        key={event.id}
                        className="glass-panel"
                        onClick={() => { onSelectHackathon(event); onClose(); }}
                        style={{
                          padding: '1rem',
                          borderRadius: '14px',
                          border: '1px solid rgba(0, 240, 255, 0.25)',
                          background: 'rgba(15, 23, 42, 0.9)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                          <span className="badge badge-cyan" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                            ⚡ {rec.score}% Match
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{event.mode}</span>
                        </div>

                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
                          {event.title}
                        </h4>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                          Organized by {event.organizer}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={12} color="var(--accent-pink)" /> {event.city}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Trophy size={12} color="var(--accent-yellow)" /> {event.prizePool}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggested Prompts */}
        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.4)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Quick AI Prompts:</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {samplePrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: '16px',
                  fontSize: '0.74rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '0.5rem',
            background: 'rgba(15, 23, 42, 0.95)'
          }}
        >
          <input
            type="text"
            placeholder="Ask BOLTZ AI (e.g. Find AI hackathons in Bangalore)..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '0.85rem'
            }}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ padding: '0.75rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
