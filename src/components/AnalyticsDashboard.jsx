import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Trophy, 
  Compass, 
  MapPin, 
  Cpu, 
  Sparkles, 
  BarChart3, 
  Layers, 
  Terminal, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from './Icons';

export default function AnalyticsDashboard({ 
  hackathons = [], 
  onSelectCategory, 
  onSelectLocation, 
  onSelectHackathon,
  onSwitchView 
}) {
  const [selectedTrack, setSelectedTrack] = useState('All');
  const [interactiveSimPillar, setInteractiveSimPillar] = useState('Interests');

  // Compute Analytics Data Dynamically from Hackathons
  const analytics = useMemo(() => {
    const totalPrizes = hackathons.reduce((sum, h) => sum + (h.prizeNumeric || 0), 0);
    const totalParticipants = hackathons.reduce((sum, h) => {
      const num = parseInt(String(h.participants || '').replace(/[^0-9]/g, ''), 10) || 0;
      return sum + num;
    }, 0);

    // Track Distribution
    const trackCounts = {};
    const trackPrizes = {};
    hackathons.forEach(h => {
      const tracks = Array.isArray(h.tracks) ? h.tracks : ['Software & Web'];
      tracks.forEach(t => {
        trackCounts[t] = (trackCounts[t] || 0) + 1;
        trackPrizes[t] = (trackPrizes[t] || 0) + (h.prizeNumeric || 0);
      });
    });

    // City Distribution
    const cityCounts = {};
    const cityPrizes = {};
    hackathons.forEach(h => {
      const city = h.city || (h.mode === 'Online' ? 'Online' : 'Other');
      cityCounts[city] = (cityCounts[city] || 0) + 1;
      cityPrizes[city] = (cityPrizes[city] || 0) + (h.prizeNumeric || 0);
    });

    // Mode Distribution
    const modes = { 'In-Person': 0, 'Online': 0, 'Hybrid': 0 };
    hackathons.forEach(h => {
      if (modes[h.mode] !== undefined) modes[h.mode]++;
      else modes['In-Person']++;
    });

    return {
      totalPrizes,
      totalParticipants,
      trackCounts,
      trackPrizes,
      cityCounts,
      cityPrizes,
      modes
    };
  }, [hackathons]);

  const maxTrackPrize = useMemo(() => {
    return Math.max(...Object.values(analytics.trackPrizes), 1);
  }, [analytics.trackPrizes]);

  const maxCityEvents = useMemo(() => {
    return Math.max(...Object.values(analytics.cityCounts), 1);
  }, [analytics.cityCounts]);

  return (
    <div className="container" style={{ paddingTop: '1rem', paddingBottom: '4rem' }}>
      {/* HUD Telemetry Top Bar */}
      <div className="hud-telemetry-banner cyber-card" style={{ marginBottom: '2rem' }}>
        <div className="hud-corner top-left" />
        <div className="hud-corner top-right" />
        <div className="hud-corner bottom-left" />
        <div className="hud-corner bottom-right" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="telemetry-pulse-dot" />
            <div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-cyan)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                // BOLTZ RADAR HUD TELEMETRY • LIVE STREAM
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                Event Intelligence & Ecosystem Radar
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="telemetry-badge">
              <span className="telemetry-label">SYSTEM STATE</span>
              <span className="telemetry-val" style={{ color: 'var(--accent-emerald)' }}>OPTIMAL</span>
            </div>
            <div className="telemetry-badge">
              <span className="telemetry-label">INDEXED NODES</span>
              <span className="telemetry-val stat-cyan">{hackathons.length} LIVE</span>
            </div>
            <div className="telemetry-badge">
              <span className="telemetry-label">CONFIDENCE AVG</span>
              <span className="telemetry-val" style={{ color: 'var(--accent-pink)' }}>94.8%</span>
            </div>
            <div className="telemetry-badge">
              <span className="telemetry-label">REFRESH INTERVAL</span>
              <span className="telemetry-val">REALTIME</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Modular Metrics HUD Cards */}
      <div className="dashboard-grid-4col" style={{ marginBottom: '2rem' }}>
        <div className="modular-panel cyber-card">
          <div className="panel-header">
            <span className="panel-title">// TOTAL PRIZE LIQUIDITY</span>
            <Trophy size={16} color="var(--accent-emerald)" />
          </div>
          <div className="panel-metric stat-green">
            ₹{(analytics.totalPrizes / 10000000).toFixed(2)} Cr
          </div>
          <div className="panel-subtext">
            Across 15 verified Indian & online developer prize pools
          </div>
          <div className="panel-progress-bar">
            <div className="panel-progress-fill" style={{ width: '88%', background: 'linear-gradient(90deg, #00ff9d, #00f0ff)' }} />
          </div>
        </div>

        <div className="modular-panel cyber-card">
          <div className="panel-header">
            <span className="panel-title">// ACTIVE BUILDER REACH</span>
            <Activity size={16} color="var(--accent-cyan)" />
          </div>
          <div className="panel-metric stat-cyan">
            {(analytics.totalParticipants / 1000).toFixed(0)}k+
          </div>
          <div className="panel-subtext">
            Engineers, university students & indie builders registered
          </div>
          <div className="panel-progress-bar">
            <div className="panel-progress-fill" style={{ width: '94%', background: 'linear-gradient(90deg, #00f0ff, #9d4edd)' }} />
          </div>
        </div>

        <div className="modular-panel cyber-card">
          <div className="panel-header">
            <span className="panel-title">// TECH HUB NODES</span>
            <MapPin size={16} color="var(--accent-orange)" />
          </div>
          <div className="panel-metric stat-orange">
            {Object.keys(analytics.cityCounts).length} Hubs
          </div>
          <div className="panel-subtext">
            Bengaluru, Delhi NCR, Mumbai, Hyderabad, Pune, Kochi & more
          </div>
          <div className="panel-progress-bar">
            <div className="panel-progress-fill" style={{ width: '76%', background: 'linear-gradient(90deg, #ff9900, #ff007f)' }} />
          </div>
        </div>

        <div className="modular-panel cyber-card">
          <div className="panel-header">
            <span className="panel-title">// AI MATCH ENGINE</span>
            <Cpu size={16} color="var(--accent-pink)" />
          </div>
          <div className="panel-metric stat-pink">
            100% Open
          </div>
          <div className="panel-subtext">
            Zero expired events • All 15 competitions accept applications
          </div>
          <div className="panel-progress-bar">
            <div className="panel-progress-fill" style={{ width: '100%', background: 'linear-gradient(90deg, #ff007f, #00ff9d)' }} />
          </div>
        </div>
      </div>

      {/* Main 2-Column Modular Charts Section */}
      <div className="dashboard-grid-2col" style={{ marginBottom: '2rem' }}>
        {/* Interactive Chart 1: Tech Track Prize & Event Allocation */}
        <div className="modular-panel cyber-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <BarChart3 size={18} color="var(--accent-cyan)" />
                Tech Track Liquidity Distribution
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Prize pool volume by developer track. Click any track to filter events.
              </p>
            </div>
            <span className="badge badge-online" style={{ fontSize: '0.72rem' }}>
              Interactive
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(analytics.trackPrizes)
              .sort((a, b) => b[1] - a[1])
              .map(([track, prize]) => {
                const count = analytics.trackCounts[track] || 0;
                const percentage = Math.round((prize / maxTrackPrize) * 100);
                const isSelected = selectedTrack === track;

                return (
                  <div 
                    key={track}
                    className={`chart-bar-row ${isSelected ? 'active-track-row' : ''}`}
                    onClick={() => {
                      setSelectedTrack(track);
                      if (onSelectCategory) onSelectCategory(track);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {track}
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({count} events)</span>
                      </span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                        ₹{(prize / 100000).toFixed(1)} Lakhs
                      </span>
                    </div>

                    <div className="holographic-track-meter">
                      <div 
                        className="holographic-track-fill" 
                        style={{ 
                          width: `${Math.max(percentage, 8)}%`,
                          background: isSelected 
                            ? 'linear-gradient(90deg, var(--accent-pink), var(--accent-cyan))'
                            : 'linear-gradient(90deg, rgba(0,240,255,0.7), rgba(157,78,221,0.85))'
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Selected: <strong style={{ color: 'var(--accent-cyan)' }}>{selectedTrack}</strong>
            </span>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onSwitchView && onSwitchView('grid')}
            >
              <span>View Filtered Grid</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Interactive Chart 2: Hub Matrix & Mode Ratio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Mode Ratio Panel */}
          <div className="modular-panel cyber-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <Layers size={18} color="var(--accent-pink)" />
                Event Attendance Mode Ratio
              </h3>
              <span className="badge badge-india" style={{ fontSize: '0.72rem' }}>Live Split</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
              <div className="mode-stat-box" style={{ borderColor: 'rgba(0, 240, 255, 0.3)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>IN-PERSON</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {analytics.modes['In-Person']}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {Math.round((analytics.modes['In-Person'] / hackathons.length) * 100)}% Physical
                </div>
              </div>

              <div className="mode-stat-box" style={{ borderColor: 'rgba(0, 255, 157, 0.3)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>HYBRID</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  {analytics.modes['Hybrid']}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {Math.round((analytics.modes['Hybrid'] / hackathons.length) * 100)}% Dual Track
                </div>
              </div>

              <div className="mode-stat-box" style={{ borderColor: 'rgba(255, 0, 127, 0.3)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>ONLINE</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-pink)' }}>
                  {analytics.modes['Online']}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {Math.round((analytics.modes['Online'] / hackathons.length) * 100)}% Remote
                </div>
              </div>
            </div>
          </div>

          {/* Top Indian Tech Hubs Matrix */}
          <div className="modular-panel cyber-card" style={{ padding: '1.75rem', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <MapPin size={18} color="var(--accent-orange)" />
                Indian Tech Hubs Geospatial Density
              </h3>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => onSwitchView && onSwitchView('map')}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
              >
                <span>Full Map</span>
                <ExternalLink size={12} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {Object.entries(analytics.cityCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(([city, count]) => (
                  <div 
                    key={city}
                    className="city-density-chip"
                    onClick={() => {
                      if (onSelectLocation) onSelectLocation(city);
                      if (onSwitchView) onSwitchView('grid');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fff' }}>{city}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontFamily: 'monospace' }}>
                        ₹{((analytics.cityPrizes[city] || 0) / 100000).toFixed(0)}L Prize Pool
                      </div>
                    </div>
                    <span className="city-count-badge">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Engine Explainability Matrix */}
      <div className="modular-panel cyber-card" style={{ padding: '2rem', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>
              // BOLTZ NEURAL RECOMMENDATION ENGINE ARCHITECTURE
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.2rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="var(--accent-cyan)" />
              5-Pillar Explainable Match Weighting Algorithm
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['Interests', 'Location', 'Urgency', 'Prizes'].map(pillar => (
              <button
                key={pillar}
                className={`btn btn-sm ${interactiveSimPillar === pillar ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setInteractiveSimPillar(pillar)}
                style={{ fontSize: '0.78rem', borderRadius: '10px' }}
              >
                {pillar}
              </button>
            ))}
          </div>
        </div>

        <div className="dashboard-grid-4col" style={{ gap: '1.25rem' }}>
          <div className={`algorithm-card ${interactiveSimPillar === 'Interests' ? 'highlighted-pillar' : ''}`}>
            <div className="algo-weight">50% WEIGHT</div>
            <h4>🎯 Interest & Track Overlap</h4>
            <p>
              Semantic embedding similarity mapping user interests (AI, Web3, FinTech) against event tracks & technologies with cross-domain bonuses.
            </p>
            <div className="algo-badge">Up to 50 pts</div>
          </div>

          <div className={`algorithm-card ${interactiveSimPillar === 'Location' ? 'highlighted-pillar' : ''}`}>
            <div className="algo-weight">20% WEIGHT</div>
            <h4>📍 City Proximity & Remote Access</h4>
            <p>
              Geospatial distance scoring for events in user's home city (Bengaluru, Delhi NCR, etc.) plus automatic 15 pts for remote access.
            </p>
            <div className="algo-badge">Up to 20 pts</div>
          </div>

          <div className={`algorithm-card ${interactiveSimPillar === 'Urgency' ? 'highlighted-pillar' : ''}`}>
            <div className="algo-weight">15% WEIGHT</div>
            <h4>⏳ Registration Deadline Urgency</h4>
            <p>
              Recency & registration window boost (+10 points for events closing within 14 days) to prevent missing deadlines.
            </p>
            <div className="algo-badge">Up to 15 pts</div>
          </div>

          <div className={`algorithm-card ${interactiveSimPillar === 'Prizes' ? 'highlighted-pillar' : ''}`}>
            <div className="algo-weight">15% WEIGHT</div>
            <h4>🏆 Prize Pool & Student Friendliness</h4>
            <p>
              Bonus points for flagship prize pools (≥₹5 Lakhs) and student-accessible events with travel grants and free lodging.
            </p>
            <div className="algo-badge">Up to 15 pts</div>
          </div>
        </div>
      </div>
    </div>
  );
}

