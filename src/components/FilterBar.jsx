import React, { useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, RotateCcw } from './Icons';
import { CATEGORIES, LOCATIONS, MODES } from '../data/hackathons.js';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  selectedMode,
  setSelectedMode,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  onResetFilters
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="filter-bar cyber-glass">
      {/* Top Search & Select Row */}
      <div className="filter-row-top">
        {/* Search Field */}
        <div className="search-box-wrap">
          <div className="input-group">
            <Search size={18} className="input-icon" color="var(--accent-cyan)" />
            <input
              ref={inputRef}
              type="text"
              className="input-field cyber-input"
              placeholder="Search events, tech, cities, vibes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-shortcut-badge" onClick={() => inputRef.current?.focus()}>
              Press <kbd>/</kbd>
            </span>
          </div>
        </div>

        {/* Location Dropdown */}
        <select
          className="select-field cyber-select"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          title="Filter by City / Location"
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        {/* Mode Dropdown */}
        <select
          className="select-field cyber-select"
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value)}
          title="Filter by Mode"
        >
          {MODES.map((mode) => (
            <option key={mode} value={mode}>{mode}</option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          className="select-field cyber-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          title="Filter by Status"
        >
          <option value="All">All Statuses</option>
          <option value="Open">Registration Open</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Live">Live Now</option>
        </select>

        {/* Sort By Dropdown */}
        <select
          className="select-field cyber-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          title="Sort By"
        >
          <option value="deadline">Deadline Soonest</option>
          <option value="newest">Newest Added</option>
          <option value="prize">Highest Prize Pool</option>
          <option value="participants">Most Participants</option>
          <option value="starting_soon">Starting Soon</option>
        </select>

        {/* Reset Button */}
        <button
          className="btn btn-secondary btn-icon cyber-btn"
          onClick={onResetFilters}
          title="Reset all filters"
        >
          <RotateCcw size={16} color="var(--accent-cyan)" />
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="filter-row-chips">
        <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginRight: '0.25rem' }}>
          <SlidersHorizontal size={14} color="var(--accent-cyan)" /> TRACKS:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`chip-btn cyber-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
