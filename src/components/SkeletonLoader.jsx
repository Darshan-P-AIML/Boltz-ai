import React from 'react';
import { RotateCcw, AlertTriangle } from './Icons';

export function CardSkeleton() {
  return (
    <div className="hackathon-card" style={{ opacity: 0.8, animation: 'pulse 1.5s infinite ease-in-out' }}>
      <div style={{ height: 140, background: '#1E293B', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ height: 14, width: '40%', background: '#334155', borderRadius: 4 }} />
        <div style={{ height: 22, width: '80%', background: '#334155', borderRadius: 4 }} />
        <div style={{ height: 14, width: '100%', background: '#1E293B', borderRadius: 4 }} />
        <div style={{ height: 14, width: '60%', background: '#1E293B', borderRadius: 4 }} />
        <div style={{ height: 40, width: '100%', background: '#1E293B', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="hackathons-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function ErrorState({ message = "Unable to refresh hackathon data.", onRetry }) {
  return (
    <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 2rem', margin: '2rem 0', background: 'var(--bg-surface)' }}>
      <AlertTriangle size={44} color="var(--accent-orange)" style={{ margin: '0 auto 1rem' }} />
      <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{message}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Please check your network connection or server status.
      </p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          <RotateCcw size={16} />
          <span>Retry Loading Data</span>
        </button>
      )}
    </div>
  );
}
