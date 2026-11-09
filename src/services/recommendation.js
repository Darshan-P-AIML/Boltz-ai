// BOLTZ AI Recommendation Engine - Explainable Match Scoring

/**
 * Calculates a personalized match score (0-100%) for an event based on user profile.
 * @param {Object} hackathon Event object
 * @param {Object|null} userProfile Active logged-in user profile
 * @returns {Object} { score: number, reasons: string[], badgeText: string, isTopMatch: boolean }
 */
export function calculateRecommendationScore(hackathon, userProfile) {
  if (!userProfile || !userProfile.interests || userProfile.interests.length === 0) {
    // Default fallback scoring for guest users based on popularity & upcoming deadline
    const defaultScore = Math.min(95, 75 + (hackathon.studentFriendly ? 10 : 0) + (hackathon.mode === 'Online' ? 5 : 0));
    return {
      score: defaultScore,
      reasons: ['Trending in India', hackathon.mode === 'Online' ? 'Global Online Access' : 'Popular Location'],
      badgeText: `${defaultScore}% Match • Trending`,
      isTopMatch: defaultScore >= 85
    };
  }

  const { interests = [], city = '' } = userProfile;
  let score = 30; // Base score
  const matchedInterests = [];
  const reasons = [];

  // 1. Interest & Track Overlap (Up to 50 points)
  const eventTracks = Array.isArray(hackathon.tracks) ? hackathon.tracks : [];
  const eventTechs = Array.isArray(hackathon.technologies) ? hackathon.technologies : [];
  const allEventTags = [...eventTracks, ...eventTechs].map(t => String(t).toLowerCase());

  interests.forEach(interest => {
    const interestLower = interest.toLowerCase();
    const isMatched = allEventTags.some(tag => 
      tag.includes(interestLower) || 
      interestLower.includes(tag) ||
      (interestLower.includes('ai') && (tag.includes('python') || tag.includes('machine') || tag.includes('llm'))) ||
      (interestLower.includes('web') && (tag.includes('react') || tag.includes('javascript') || tag.includes('software'))) ||
      (interestLower.includes('app') && (tag.includes('flutter') || tag.includes('android') || tag.includes('mobile'))) ||
      (interestLower.includes('cyber') && tag.includes('security')) ||
      (interestLower.includes('cloud') && (tag.includes('devops') || tag.includes('docker') || tag.includes('kubernetes')))
    );

    if (isMatched) {
      if (!matchedInterests.includes(interest)) {
        matchedInterests.push(interest);
      }
    }
  });

  if (matchedInterests.length > 0) {
    const interestPoints = Math.min(50, matchedInterests.length * 20);
    score += interestPoints;
    reasons.push(`Matches your interest in ${matchedInterests.join(', ')}`);
  }

  // 2. Location Proximity (Up to 20 points)
  if (hackathon.mode === 'Online' || hackathon.location.toLowerCase().includes('online')) {
    score += 15;
    reasons.push('Available remotely anywhere in India');
  } else if (city && (hackathon.city.toLowerCase().includes(city.toLowerCase()) || hackathon.location.toLowerCase().includes(city.toLowerCase()))) {
    score += 20;
    reasons.push(`Located near you in ${city}`);
  }

  // 3. Deadline / Recency Urgency (Up to 15 points)
  if (hackathon.registrationDeadline) {
    const deadlineDate = new Date(hackathon.registrationDeadline);
    const now = new Date();
    const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0 && diffDays <= 14) {
      score += 10;
      reasons.push(`Registration closes soon (in ${diffDays} days)`);
    } else if (diffDays > 14) {
      score += 5;
    }
  }

  // 4. Student Friendliness & Prizes (Up to 10 points)
  if (hackathon.studentFriendly) {
    score += 5;
  }
  if (hackathon.prizeNumeric && hackathon.prizeNumeric >= 500000) {
    score += 5;
    reasons.push('High prize pool event');
  }

  // Cap score between 60 and 99
  const finalScore = Math.min(99, Math.max(60, score));
  const mainInterestReason = matchedInterests.length > 0 
    ? `Based on ${matchedInterests.slice(0, 2).join(' & ')}` 
    : 'Recommended based on your profile';

  return {
    score: finalScore,
    reasons,
    badgeText: `${finalScore}% Match • ${mainInterestReason}`,
    isTopMatch: finalScore >= 80,
    matchedInterests
  };
}

/**
 * Sorts hackathons by recommendation match score for a given user profile.
 */
export function sortEventsByRecommendation(hackathons, userProfile) {
  return [...hackathons].map(event => {
    const rec = calculateRecommendationScore(event, userProfile);
    return { ...event, recommendation: rec };
  }).sort((a, b) => b.recommendation.score - a.recommendation.score);
}
