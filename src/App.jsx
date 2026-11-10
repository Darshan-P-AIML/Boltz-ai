import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import FilterBar from './components/FilterBar';
import HackathonCard from './components/HackathonCard';
import MapView from './components/MapView';
import CalendarView from './components/CalendarView';
import TeammateFinder from './components/TeammateFinder';
import HackathonModal from './components/HackathonModal';
import SubmitModal from './components/SubmitModal';
import BookmarksDrawer from './components/BookmarksDrawer';
import HomeSections from './components/HomeSections';
import HackathonDetailsPage from './components/HackathonDetailsPage';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import AiAssistant from './components/AiAssistant';
import { SkeletonGrid, ErrorState } from './components/SkeletonLoader';
import GeometricBackground from './components/GeometricBackground';
import AnalyticsDashboard from './components/AnalyticsDashboard';

import { initialTeammateRequests, initialHackathons } from './data/hackathons.js';
import { getCurrentUser } from './services/auth';
import { fetchEventsService, getUpcomingDeadlines, deriveSections, deriveStats } from './services/events';
import { calculateRecommendationScore, sortEventsByRecommendation } from './services/recommendation';
import { Sparkles, SearchX, Globe, Heart, Clock, Trophy, MapPin, User, CheckCircle2 } from './components/Icons';

export default function App() {
  // Authentication & User Profile State
  const [user, setUser] = useState(() => getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  // Data States
  const [hackathons, setHackathons] = useState([]);
  const [sections, setSections] = useState(null);
  const [stats, setStats] = useState({ totalActiveHackathons: 10, totalPrizeSumFormatted: '₹50 Lakhs+', totalCities: 12 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Saved Bookmarks from localStorage
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('boltz_bookmarks');
    return saved ? JSON.parse(saved) : ['devfolio-hackspire-2026', 'devfolio-ethindia-2026'];
  });

  // Community Teammate Requests from localStorage
  const [teammateRequests, setTeammateRequests] = useState(() => {
    const saved = localStorage.getItem('boltz_teammates');
    return saved ? JSON.parse(saved) : initialTeammateRequests;
  });

  // UI Views
  const [activeView, setActiveView] = useState('grid'); // 'grid' | 'recommendations' | 'map' | 'calendar' | 'teammates'
  const [detailedHackathon, setDetailedHackathon] = useState(null);
  const [selectedHackathonModal, setSelectedHackathonModal] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showBookmarksDrawer, setShowBookmarksDrawer] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Tracks');
  const [selectedLocation, setSelectedLocation] = useState('🇮🇳 All India');
  const [selectedMode, setSelectedMode] = useState('All Modes');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('deadline');

  // Sync bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem('boltz_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Sync teammates to localStorage
  useEffect(() => {
    localStorage.setItem('boltz_teammates', JSON.stringify(teammateRequests));
  }, [teammateRequests]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch real data from Backend REST API or Event Service Layer
  const fetchHackathonsData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchEventsService({
        q: debouncedSearch,
        mode: selectedMode,
        track: selectedCategory,
        location: selectedLocation,
        status: selectedStatus,
        sortBy,
        page,
        limit: 12
      });

      const resolvedItems = data.items && data.items.length > 0 ? data.items : initialHackathons;
      setHackathons(resolvedItems);
      setTotalPages(data.totalPages || 1);

      // Fetch Sections — fall back to client-side derivation if API unavailable (e.g. Vercel)
      let resolvedSections = null;
      try {
        const secRes = await fetch('/api/hackathons/sections');
        if (secRes.ok) {
          const secData = await secRes.json();
          resolvedSections = secData;
        }
      } catch (e) {}
      setSections(resolvedSections || deriveSections(resolvedItems));

      // Fetch Platform Stats — fall back to client-side derivation if API unavailable
      try {
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        } else {
          setStats(deriveStats(resolvedItems));
        }
      } catch (e) {
        setStats(deriveStats(resolvedItems));
      }

    } catch (err) {
      console.error('Error loading BOLTZ AI events data:', err);
      const fallback = initialHackathons;
      setHackathons(fallback);
      setSections(deriveSections(fallback));
      setStats(deriveStats(fallback));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedMode, selectedCategory, selectedLocation, selectedStatus, sortBy, page]);

  useEffect(() => {
    fetchHackathonsData();
  }, [fetchHackathonsData]);

  // Trigger manual API Data Ingestion Sync
  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/sync', { method: 'POST' });
      await fetchHackathonsData();
    } catch (e) {
      console.error('Data sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Bookmark Toggle Helper
  const handleToggleBookmark = (id) => {
    setBookmarks((prev) => 
      prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id]
    );
  };

  const handleAddHackathon = (newHackathon) => {
    setHackathons((prev) => [newHackathon, ...prev]);
  };

  const handleAddTeammateRequest = (newRequest) => {
    setTeammateRequests((prev) => [newRequest, ...prev]);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedCategory('All Tracks');
    setSelectedLocation('🇮🇳 All India');
    setSelectedMode('All Modes');
    setSelectedStatus('All');
    setSortBy('deadline');
    setPage(1);
  };

  const openAuth = (mode = 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const bookmarkedItems = hackathons.filter((h) => bookmarks.includes(h.id));
  const upcomingDeadlinesList = getUpcomingDeadlines(hackathons);
  const recommendedHackathons = sortEventsByRecommendation(hackathons, user);

  const isFiltering = debouncedSearch !== '' || selectedCategory !== 'All Tracks' || selectedLocation !== '🇮🇳 All India' || selectedMode !== 'All Modes' || selectedStatus !== 'All';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Animated Futuristic Geometric Background */}
      <GeometricBackground />

      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={(v) => { setActiveView(v); setDetailedHackathon(null); }}
        bookmarksCount={bookmarks.length}
        onOpenBookmarks={() => setShowBookmarksDrawer(true)}
        onOpenSubmit={() => setShowSubmitModal(true)}
        onSyncData={handleSyncData}
        isSyncing={isSyncing}
        user={user}
        onOpenAuth={openAuth}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenAiAssistant={() => setAiAssistantOpen(true)}
      />

      {/* Main Container */}
      <main style={{ flex: 1 }}>
        {detailedHackathon ? (
          /* Single Hackathon Details Page View */
          <HackathonDetailsPage
            hackathon={{
              ...detailedHackathon,
              recommendation: calculateRecommendationScore(detailedHackathon, user)
            }}
            isBookmarked={bookmarks.includes(detailedHackathon.id)}
            onToggleBookmark={handleToggleBookmark}
            onBack={() => setDetailedHackathon(null)}
          />
        ) : (
          <div className="container" style={{ paddingTop: '1rem', paddingBottom: '3rem' }}>
            {/* Hero Section */}
            {(activeView === 'grid' || activeView === 'recommendations' || activeView === 'map') && (
              <HeroBanner 
                totalHackathons={stats.totalActiveHackathons || hackathons.length}
                totalPrizesFormatted={stats.totalPrizeSumFormatted || '₹50 Lakhs+'}
                totalCities={stats.totalCities || 12}
                totalParticipantsFormatted={stats.totalParticipantsFormatted || '45k+'}
                onExplore={() => {
                  setActiveView('grid');
                  const filterEl = document.querySelector('.filter-bar');
                  if (filterEl) filterEl.scrollIntoView({ behavior: 'smooth' });
                }}
                onGetStarted={() => {
                  if (user) {
                    setActiveView('recommendations');
                  } else {
                    openAuth('signup');
                  }
                }}
                user={user}
              />
            )}

            {/* UPCOMING DEADLINES DASHBOARD BANNER */}
            {upcomingDeadlinesList.length > 0 && activeView === 'grid' && !isFiltering && (
              <div 
                className="glass-panel" 
                style={{
                  padding: '1.25rem 1.5rem',
                  marginBottom: '2rem',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(139, 92, 246, 0.15))',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={18} color="#ef4444" />
                    Upcoming Registration Deadlines
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Closing Soonest First</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                  {upcomingDeadlinesList.map((item) => {
                    const daysLeft = Math.ceil((new Date(item.registrationDeadline) - new Date()) / (1000 * 60 * 60 * 24));
                    return (
                      <div
                        key={item.id}
                        onClick={() => setDetailedHackathon(item)}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: '12px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 800 }}>
                            {daysLeft <= 1 ? '⚠️ Closes Tomorrow!' : `⏳ Closes in ${daysLeft} Days`}
                          </span>
                          <span className="badge badge-india" style={{ fontSize: '0.65rem' }}>{item.mode}</span>
                        </div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{item.title}</h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Prize: {item.prizePool}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter Bar */}
            {(activeView === 'grid' || activeView === 'recommendations' || activeView === 'map') && (
              <FilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={(c) => { setSelectedCategory(c); setPage(1); }}
                selectedLocation={selectedLocation}
                setSelectedLocation={(l) => { setSelectedLocation(l); setPage(1); }}
                selectedMode={selectedMode}
                setSelectedMode={(m) => { setSelectedMode(m); setPage(1); }}
                selectedStatus={selectedStatus}
                setSelectedStatus={(s) => { setSelectedStatus(s); setPage(1); }}
                sortBy={sortBy}
                setSortBy={setSortBy}
                onResetFilters={handleResetFilters}
              />
            )}

            {/* DEDICATED AI RECOMMENDATIONS VIEW */}
            {activeView === 'recommendations' && (
              <div style={{ marginBottom: '2.5rem' }}>
                <div 
                  className="glass-panel" 
                  style={{
                    padding: '1.5rem',
                    marginBottom: '1.5rem',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(0,240,255,0.1), rgba(255,0,127,0.1))',
                    border: '1px solid var(--accent-cyan)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={22} color="var(--accent-pink)" />
                        BOLTZ AI Personalized Recommendations for {user ? user.name : 'Gen Z Builder'}
                      </h2>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                        Matches calculated dynamically based on active tech interests: {user && user.interests ? user.interests.join(', ') : 'AI/ML, Hackathons, Web Development'} (City: {user?.city || 'Bengaluru'})
                      </p>
                    </div>

                    <button className="btn btn-secondary btn-sm" onClick={() => setProfileModalOpen(true)}>
                      Edit My Interests ⚡
                    </button>
                  </div>
                </div>

                <div className="hackathons-grid">
                  {recommendedHackathons.map((item) => (
                    <HackathonCard
                      key={item.id}
                      hackathon={item}
                      recommendation={item.recommendation}
                      isBookmarked={bookmarks.includes(item.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onSelect={(hack) => setDetailedHackathon(hack)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* VIEW RENDER BRANCHING */}
            {activeView === 'grid' && (
              <>
                {loading ? (
                  <SkeletonGrid count={6} />
                ) : error ? (
                  <ErrorState message={error} onRetry={fetchHackathonsData} />
                ) : isFiltering ? (
                  /* Active Filter / Search Grid Results */
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <h3 style={{ fontSize: '1.2rem' }}>
                        Matching Events ({hackathons.length})
                      </h3>
                    </div>

                    {hackathons.length === 0 ? (
                      <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', margin: '1.5rem 0' }}>
                        <SearchX size={44} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Matching Events Found</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                          Try clearing your search query or broadening location and track filters.
                        </p>
                        <button className="btn btn-primary" onClick={handleResetFilters}>
                          Reset All Filters
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="hackathons-grid">
                          {hackathons.map((item) => (
                            <HackathonCard
                              key={item.id}
                              hackathon={item}
                              recommendation={calculateRecommendationScore(item, user)}
                              isBookmarked={bookmarks.includes(item.id)}
                              onToggleBookmark={handleToggleBookmark}
                              onSelect={(hack) => setDetailedHackathon(hack)}
                            />
                          ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              disabled={page <= 1}
                              onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                              Previous Page
                            </button>
                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              Page {page} of {totalPages}
                            </span>
                            <button
                              className="btn btn-secondary btn-sm"
                              disabled={page >= totalPages}
                              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            >
                              Next Page
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  /* Curated Home Page Sections */
                  <HomeSections
                    sections={sections}
                    bookmarks={bookmarks}
                    onToggleBookmark={handleToggleBookmark}
                    onSelectHackathon={(hack) => setDetailedHackathon(hack)}
                  />
                )}
              </>
            )}

            {activeView === 'map' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe color="var(--accent-cyan)" />
                    Showing In-Person & Remote Hackathon Pins
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Click pins to view real location details
                  </span>
                </div>
                <MapView 
                  hackathons={hackathons} 
                  onSelectHackathon={(hack) => setDetailedHackathon(hack)} 
                />
              </div>
            )}

            {activeView === 'calendar' && (
              <CalendarView 
                hackathons={hackathons}
                onSelectHackathon={(hack) => setDetailedHackathon(hack)}
              />
            )}

            {activeView === 'teammates' && (
              <TeammateFinder
                teammateRequests={teammateRequests}
                onAddTeammateRequest={handleAddTeammateRequest}
                hackathons={hackathons}
              />
            )}

            {/* High-Tech Radar HUD & Modular Analytics Dashboard */}
            {activeView === 'dashboard' && (
              <AnalyticsDashboard
                hackathons={hackathons}
                onSelectCategory={(track) => {
                  setSelectedCategory(track);
                  setActiveView('grid');
                }}
                onSelectLocation={(city) => {
                  setSelectedLocation(city);
                  setActiveView('grid');
                }}
                onSelectHackathon={(hack) => setDetailedHackathon(hack)}
                onSwitchView={(v) => setActiveView(v)}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(newUser) => {
          setUser(newUser);
          setActiveView('recommendations');
        }}
      />

      <UserProfileModal
        isOpen={profileModalOpen}
        user={user}
        onClose={() => setProfileModalOpen(false)}
        onUpdateUser={(updated) => setUser(updated)}
        onLogout={() => setUser(null)}
      />

      <AiAssistant
        isOpen={aiAssistantOpen}
        events={hackathons}
        userProfile={user}
        onClose={() => setAiAssistantOpen(false)}
        onSelectHackathon={(hack) => setDetailedHackathon(hack)}
      />

      <HackathonModal
        hackathon={selectedHackathonModal}
        isBookmarked={selectedHackathonModal ? bookmarks.includes(selectedHackathonModal.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onClose={() => setSelectedHackathonModal(null)}
      />

      {showSubmitModal && (
        <SubmitModal
          onClose={() => setShowSubmitModal(false)}
          onSubmitHackathon={handleAddHackathon}
        />
      )}

      <BookmarksDrawer
        isOpen={showBookmarksDrawer}
        onClose={() => setShowBookmarksDrawer(false)}
        bookmarkedHackathons={bookmarkedItems}
        onRemoveBookmark={handleToggleBookmark}
        onSelectHackathon={(hack) => setDetailedHackathon(hack)}
      />

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '3.5rem 0 2rem',
        marginTop: 'auto'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            {/* Brand Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Sparkles size={22} color="var(--accent-pink)" />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                  BOLTZ <span className="gradient-text">AI</span>
                </span>
                <span className="badge badge-india" style={{ fontSize: '0.68rem' }}>🇮🇳 Gen Z</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.5, fontWeight: 600 }}>
                Redefining Event Discovery for Gen Z.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                AI-powered developer platform tracking verified hackathons & tech summits across Bengaluru, Mumbai, Delhi, Hyderabad & top tech hubs.
              </p>
            </div>

            {/* Navigation Column */}
            <div>
              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '1rem' }}>Navigation</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('grid'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Discover Events</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('recommendations'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>AI Recommendations</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('map'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>India Map View</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('calendar'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Calendar Schedule</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('teammates'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Find Teammates</a></li>
              </ul>
            </div>

            {/* Sources Column */}
            <div>
              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '1rem' }}>Verified Sources</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <li>Devfolio Ecosystem</li>
                <li>Unstop Competitions</li>
                <li>Devpost India</li>
                <li>Smart India Hackathon (SIH)</li>
              </ul>
            </div>

            {/* Legal & Submit Column */}
            <div>
              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '1rem' }}>Account & Submissions</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {user ? (
                  <li><a href="#" onClick={(e) => { e.preventDefault(); setProfileModalOpen(true); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Manage Profile</a></li>
                ) : (
                  <li><a href="#" onClick={(e) => { e.preventDefault(); openAuth('signup'); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Create Account</a></li>
                )}
                <li><a href="#" onClick={(e) => { e.preventDefault(); setAiAssistantOpen(true); }} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>BOLTZ AI Assistant</a></li>
              </ul>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowSubmitModal(true)}>
                <span>Submit an Event</span>
              </button>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <div>
              © 2026 BOLTZ AI Inc. All rights reserved. • Redefining Event Discovery for Gen Z.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Built with <Heart size={14} color="var(--accent-pink)" fill="var(--accent-pink)" /> for Gen Z builders.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
