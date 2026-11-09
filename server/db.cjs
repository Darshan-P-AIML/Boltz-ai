const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'hackathons_db.json');

class DatabaseManager {
  constructor() {
    this.ensureDbExists();
  }

  ensureDbExists() {
    const dataDir = path.dirname(DB_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
    }
  }

  load() {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading database file:', err);
      return [];
    }
  }

  save(items) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(items, null, 2), 'utf8');
    } catch (err) {
      console.error('Error writing database file:', err);
    }
  }

  // Deduplicate and upsert hackathons
  upsertMany(newHackathons) {
    const db = this.load();
    const now = new Date();
    let addedCount = 0;
    let updatedCount = 0;

    newHackathons.forEach((item) => {
      let computedStatus = item.status || 'Open';
      if (item.registrationDeadline) {
        const deadlineDate = new Date(item.registrationDeadline);
        if (!isNaN(deadlineDate.getTime()) && deadlineDate < now) {
          computedStatus = 'CLOSED';
        }
      }

      const normalizedItem = {
        id: item.id || `hk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: item.title,
        organizer: item.organizer || item.host || 'Not provided',
        platform: item.platform || 'Devfolio',
        description: item.description || 'No description provided.',
        startDate: item.startDate || 'Not provided',
        endDate: item.endDate || 'Not provided',
        registrationDeadline: item.registrationDeadline || null,
        location: item.location || 'Online / Remote',
        city: item.city || 'Bengaluru',
        state: item.state || 'India',
        country: item.country || 'India',
        lat: item.lat || 12.9716,
        lng: item.lng || 77.5946,
        mode: item.mode || 'Online', // 'Online', 'In-Person', 'Hybrid'
        prizePool: item.prizePool || 'Not provided',
        prizeNumeric: typeof item.prizeNumeric === 'number' ? item.prizeNumeric : 0,
        participants: item.participants !== undefined ? item.participants : '500+ participants',
        eligibility: item.eligibility || 'Open to all developers across India',
        tracks: Array.isArray(item.tracks) ? item.tracks : (item.tags || ['Software & Web']),
        technologies: Array.isArray(item.technologies) ? item.technologies : ['Python', 'JavaScript'],
        image: item.image || item.bannerBg || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
        registrationUrl: item.registrationUrl || item.sourceUrl || '#',
        sourceUrl: item.sourceUrl || item.registrationUrl || '#',
        studentFriendly: item.studentFriendly !== undefined ? Boolean(item.studentFriendly) : true,
        lastUpdated: new Date().toISOString(),
        status: computedStatus
      };

      // Check duplicate by sourceUrl or normalized title
      const existingIdx = db.findIndex(
        (existing) =>
          (existing.sourceUrl && existing.sourceUrl === normalizedItem.sourceUrl) ||
          existing.title.toLowerCase().trim() === normalizedItem.title.toLowerCase().trim()
      );

      if (existingIdx !== -1) {
        db[existingIdx] = { ...db[existingIdx], ...normalizedItem, id: db[existingIdx].id };
        updatedCount++;
      } else {
        db.push(normalizedItem);
        addedCount++;
      }
    });

    this.save(db);
    return { addedCount, updatedCount, totalCount: db.length };
  }

  getById(id) {
    const db = this.load();
    return db.find((item) => item.id === id) || null;
  }

  query({
    q = '',
    mode = 'All',
    track = 'All',
    location = 'All',
    status = 'All',
    sort_by = 'deadline',
    city = 'All',
    page = 1,
    limit = 12
  }) {
    let db = this.load();
    const now = new Date();

    // Auto update expired statuses
    db = db.map((item) => {
      if (item.registrationDeadline) {
        const d = new Date(item.registrationDeadline);
        if (!isNaN(d.getTime()) && d < now && item.status !== 'CLOSED') {
          return { ...item, status: 'CLOSED' };
        }
      }
      return item;
    });

    // 1. Keyword Search
    if (q && q.trim() !== '') {
      const queryStr = q.toLowerCase().trim();
      db = db.filter((item) => {
        const matchTitle = item.title.toLowerCase().includes(queryStr);
        const matchOrg = item.organizer.toLowerCase().includes(queryStr);
        const matchLoc = item.location.toLowerCase().includes(queryStr);
        const matchCity = (item.city || '').toLowerCase().includes(queryStr);
        const matchTracks = item.tracks.some((t) => t.toLowerCase().includes(queryStr));
        const matchTech = item.technologies.some((tc) => tc.toLowerCase().includes(queryStr));
        return matchTitle || matchOrg || matchLoc || matchCity || matchTracks || matchTech;
      });
    }

    // 2. Mode Filter (Online, In-Person, Hybrid)
    if (mode && mode !== 'All' && mode !== 'All Modes') {
      db = db.filter((item) => item.mode.toLowerCase() === mode.toLowerCase());
    }

    // 3. Track / Technology Filter
    if (track && track !== 'All' && track !== 'All Tracks') {
      db = db.filter((item) => 
        item.tracks.some((t) => t.toLowerCase().includes(track.toLowerCase())) ||
        item.technologies.some((tc) => tc.toLowerCase().includes(track.toLowerCase()))
      );
    }

    // 4. City / Location Filter
    const targetLoc = (city !== 'All' && city !== 'All India') ? city : location;
    if (targetLoc && targetLoc !== 'All' && targetLoc !== 'All India' && targetLoc !== 'All Locations') {
      if (targetLoc === 'Online / Remote' || targetLoc === 'Online') {
        db = db.filter((item) => item.mode === 'Online');
      } else {
        const cleanKey = targetLoc.replace('🇮🇳', '').split(',')[0].trim().toLowerCase();
        db = db.filter((item) => 
          (item.city && item.city.toLowerCase().includes(cleanKey)) ||
          item.location.toLowerCase().includes(cleanKey)
        );
      }
    }

    // 5. Status Filter
    if (status && status !== 'All') {
      if (status === 'Open') {
        db = db.filter((item) => item.status === 'Open' || item.status === '● Reg Open');
      } else {
        db = db.filter((item) => item.status.toLowerCase() === status.toLowerCase());
      }
    }

    // 6. Sorting
    db.sort((a, b) => {
      if (sort_by === 'deadline' || sort_by === 'deadline_soonest') {
        if (!a.registrationDeadline) return 1;
        if (!b.registrationDeadline) return -1;
        return new Date(a.registrationDeadline) - new Date(b.registrationDeadline);
      }
      if (sort_by === 'prize' || sort_by === 'highest_prize') {
        return (b.prizeNumeric || 0) - (a.prizeNumeric || 0);
      }
      if (sort_by === 'participants' || sort_by === 'most_participants') {
        const pA = parseInt(String(a.participants).replace(/[^0-9]/g, ''), 10) || 0;
        const pB = parseInt(String(b.participants).replace(/[^0-9]/g, ''), 10) || 0;
        return pB - pA;
      }
      if (sort_by === 'newest') {
        return new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0);
      }
      if (sort_by === 'starting_soon') {
        return new Date(a.startDate || 0) - new Date(b.startDate || 0);
      }
      return 0;
    });

    const total = db.length;
    const p = Math.max(1, parseInt(page, 10));
    const l = Math.max(1, parseInt(limit, 10));
    const startIndex = (p - 1) * l;
    const paginatedItems = db.slice(startIndex, startIndex + l);

    return {
      items: paginatedItems,
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l)
    };
  }

  getSections() {
    const db = this.load();
    const openItems = db.filter((i) => i.status !== 'CLOSED');

    return {
      trending: [...openItems].sort((a, b) => (b.prizeNumeric || 0) - (a.prizeNumeric || 0)).slice(0, 6),
      closingSoon: [...openItems]
        .filter((i) => i.registrationDeadline)
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
        i.tracks.some((t) => t.toLowerCase().includes('web3') || t.toLowerCase().includes('blockchain') || t.toLowerCase().includes('crypto'))
      ).slice(0, 6),
      student: openItems.filter((i) => i.studentFriendly).slice(0, 6),
      nearYou: openItems.filter((i) => i.mode === 'In-Person' || i.mode === 'Hybrid').slice(0, 6)
    };
  }

  getStats() {
    const db = this.load();
    const openCount = db.filter((i) => i.status !== 'CLOSED').length;
    const totalPrizeSum = db.reduce((acc, curr) => acc + (curr.prizeNumeric || 0), 0);
    
    // Unique Indian cities
    const cities = [...new Set(db.map((i) => i.city).filter((c) => c && c !== 'Online'))];
    
    // Sum total participant numbers
    const totalParticipants = db.reduce((acc, curr) => {
      const num = parseInt(String(curr.participants).replace(/[^0-9]/g, ''), 10) || 0;
      return acc + num;
    }, 0);

    let prizeFormatted = `₹${(totalPrizeSum / 100000).toFixed(0)} Lakhs+`;
    if (totalPrizeSum >= 10000000) {
      prizeFormatted = `₹${(totalPrizeSum / 10000000).toFixed(1)} Crore+`;
    }

    return {
      totalActiveHackathons: openCount || db.length,
      totalPrizeSum,
      totalPrizeSumFormatted: prizeFormatted,
      totalCities: cities.length || 12,
      totalParticipantsFormatted: `${(totalParticipants / 1000).toFixed(0)}k+`
    };
  }
}

module.exports = new DatabaseManager();
