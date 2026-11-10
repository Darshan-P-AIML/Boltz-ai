// BOLTZ AI Events Service Layer

import { initialHackathons } from '../data/hackathons.js';

/**
 * Derives homepage sections purely from a local hackathon dataset.
 * Used as a fallback when /api/hackathons/sections is unavailable (e.g. Vercel).
 */
export function deriveSections(items = initialHackathons) {
  const now = new Date();
  const openItems = items.filter((i) => i.status !== 'CLOSED');

  return {
    trending: [...openItems]
      .sort((a, b) => (b.prizeNumeric || 0) - (a.prizeNumeric || 0))
      .slice(0, 6),
    closingSoon: [...openItems]
      .filter((i) => i.registrationDeadline && new Date(i.registrationDeadline) > now)
      .sort((a, b) => new Date(a.registrationDeadline) - new Date(b.registrationDeadline))
      .slice(0, 6),
    aiMl: openItems.filter((i) =>
      i.tracks.some((t) => t.toLowerCase().includes('ai') || t.toLowerCase().includes('machine')) ||
      i.technologies.some((t) => t.toLowerCase().includes('python') || t.toLowerCase().includes('pytorch'))
    ).slice(0, 6),
    softwareWeb: openItems.filter((i) =>
      i.tracks.some((t) => t.toLowerCase().includes('web') || t.toLowerCase().includes('software')) ||
      i.technologies.some((t) => t.toLowerCase().includes('react') || t.toLowerCase().includes('javascript'))
    ).slice(0, 6),
    cybersecurity: openItems.filter((i) =>
      i.tracks.some((t) => t.toLowerCase().includes('cyber') || t.toLowerCase().includes('security'))
    ).slice(0, 6),
    cloudDevops: openItems.filter((i) =>
      i.tracks.some((t) => t.toLowerCase().includes('cloud') || t.toLowerCase().includes('devops'))
    ).slice(0, 6),
    web3: openItems.filter((i) =>
      i.tracks.some((t) =>
        t.toLowerCase().includes('web3') ||
        t.toLowerCase().includes('blockchain') ||
        t.toLowerCase().includes('crypto')
      )
    ).slice(0, 6),
    student: openItems.filter((i) => i.studentFriendly).slice(0, 6),
    nearYou: openItems.filter((i) => i.mode === 'In-Person' || i.mode === 'Hybrid').slice(0, 6)
  };
}

/**
 * Derives platform statistics purely from a local hackathon dataset.
 * Used as a fallback when /api/stats is unavailable (e.g. Vercel).
 */
export function deriveStats(items = initialHackathons) {
  const openItems = items.filter((i) => i.status !== 'CLOSED');
  const totalPrizeSum = items.reduce((acc, curr) => acc + (curr.prizeNumeric || 0), 0);
  const cities = [...new Set(items.map((i) => i.city).filter((c) => c && c !== 'Online'))];
  const totalParticipants = items.reduce((acc, curr) => {
    const num = parseInt(String(curr.participants).replace(/[^0-9]/g, ''), 10) || 0;
    return acc + num;
  }, 0);

  let prizeFormatted = `₹${(totalPrizeSum / 100000).toFixed(0)} Lakhs+`;
  if (totalPrizeSum >= 10000000) {
    prizeFormatted = `₹${(totalPrizeSum / 10000000).toFixed(1)} Crore+`;
  }

  return {
    totalActiveHackathons: openItems.length || items.length,
    totalPrizeSum,
    totalPrizeSumFormatted: prizeFormatted,
    totalCities: cities.length || 12,
    totalParticipantsFormatted: `${(totalParticipants / 1000).toFixed(0)}k+`
  };
}

/**
 * Fetches hackathons from REST API or falls back to verified client seed dataset.
 */
export async function fetchEventsService(filters = {}) {
  const {
    q = '',
    mode = 'All Modes',
    track = 'All Tracks',
    location = '🇮🇳 All India',
    status = 'All',
    sortBy = 'deadline',
    page = 1,
    limit = 12
  } = filters;

  const params = new URLSearchParams({
    q,
    mode,
    track,
    location,
    status,
    sort_by: sortBy,
    page: page.toString(),
    limit: limit.toString()
  });

  try {
    const res = await fetch(`/api/hackathons?${params.toString()}`);
    if (res.ok) {
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          return {
            items: data.items,
            total: data.total || data.items.length,
            totalPages: data.totalPages || 1,
            isLiveApi: true
          };
        }
      } catch (e) {}
    }
  } catch (err) {
    console.warn('Live events API unreachable, using client event layer:', err.message);
  }

  // Client-side fallback filtering over verified hackathons
  let items = [...initialHackathons];

  if (q && q.trim() !== '') {
    const queryStr = q.toLowerCase().trim();
    items = items.filter(h =>
      h.title.toLowerCase().includes(queryStr) ||
      h.organizer.toLowerCase().includes(queryStr) ||
      h.location.toLowerCase().includes(queryStr) ||
      (h.city || '').toLowerCase().includes(queryStr) ||
      h.tracks.some(t => t.toLowerCase().includes(queryStr)) ||
      h.technologies.some(tc => tc.toLowerCase().includes(queryStr))
    );
  }

  if (mode && mode !== 'All' && mode !== 'All Modes') {
    items = items.filter(h => h.mode.toLowerCase() === mode.toLowerCase());
  }

  if (track && track !== 'All' && track !== 'All Tracks') {
    const cleanTrack = track.toLowerCase();
    items = items.filter(h =>
      h.tracks.some(t => t.toLowerCase().includes(cleanTrack)) ||
      h.technologies.some(tc => tc.toLowerCase().includes(cleanTrack))
    );
  }

  if (location && location !== 'All' && location !== '🇮🇳 All India' && location !== 'All Locations') {
    const cleanLoc = location.replace('🇮🇳', '').split(',')[0].trim().toLowerCase();
    items = items.filter(h =>
      (h.city && h.city.toLowerCase().includes(cleanLoc)) ||
      h.location.toLowerCase().includes(cleanLoc)
    );
  }

  if (status && status !== 'All') {
    if (status === 'Open') {
      items = items.filter(h => h.status === 'Open');
    }
  }

  // Sorting
  items.sort((a, b) => {
    if (sortBy === 'deadline') {
      if (!a.registrationDeadline) return 1;
      if (!b.registrationDeadline) return -1;
      return new Date(a.registrationDeadline) - new Date(b.registrationDeadline);
    }
    if (sortBy === 'prize') {
      return (b.prizeNumeric || 0) - (a.prizeNumeric || 0);
    }
    return 0;
  });

  return {
    items,
    total: items.length,
    totalPages: 1,
    isLiveApi: false
  };
}

/**
 * Returns upcoming events sorted by nearest registration deadline.
 */
export function getUpcomingDeadlines(events = []) {
  const now = new Date();
  return [...events]
    .filter(e => e.registrationDeadline && new Date(e.registrationDeadline) > now)
    .sort((a, b) => new Date(a.registrationDeadline) - new Date(b.registrationDeadline))
    .slice(0, 4);
}

/**
 * AI Assistant query execution over event dataset
 */
export function queryEventsAI(userPrompt, events = []) {
  const promptLower = userPrompt.toLowerCase().trim();
  const dataset = events.length > 0 ? events : initialHackathons;

  if (promptLower.includes('ai') || promptLower.includes('machine learning') || promptLower.includes('ml') || promptLower.includes('llm')) {
    return dataset.filter(e => 
      e.tracks.some(t => t.toLowerCase().includes('ai') || t.toLowerCase().includes('machine')) ||
      e.technologies.some(tc => tc.toLowerCase().includes('python') || tc.toLowerCase().includes('pytorch') || tc.toLowerCase().includes('langchain')) ||
      e.title.toLowerCase().includes('ai')
    );
  }

  if (promptLower.includes('online') || promptLower.includes('remote') || promptLower.includes('virtual')) {
    return dataset.filter(e => e.mode === 'Online');
  }

  if (promptLower.includes('bengaluru') || promptLower.includes('bangalore')) {
    return dataset.filter(e => e.city === 'Bengaluru' || e.location.includes('Bengaluru'));
  }

  if (promptLower.includes('cyber') || promptLower.includes('security')) {
    return dataset.filter(e => e.tracks.some(t => t.toLowerCase().includes('cyber') || t.toLowerCase().includes('security')));
  }

  if (promptLower.includes('web3') || promptLower.includes('blockchain') || promptLower.includes('crypto')) {
    return dataset.filter(e => e.tracks.some(t => t.toLowerCase().includes('web3') || t.toLowerCase().includes('blockchain')));
  }

  if (promptLower.includes('soon') || promptLower.includes('deadline') || promptLower.includes('closing')) {
    return getUpcomingDeadlines(dataset);
  }

  // General match
  return dataset.filter(e => 
    e.title.toLowerCase().includes(promptLower) ||
    e.description.toLowerCase().includes(promptLower) ||
    e.tracks.some(t => t.toLowerCase().includes(promptLower)) ||
    e.technologies.some(tc => tc.toLowerCase().includes(promptLower))
  ).slice(0, 5);
}
