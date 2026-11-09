// BOLTZ AI Authentication & User Profile Management Service

export const AVAILABLE_INTERESTS = [
  'AI/ML',
  'Web Development',
  'App Development',
  'Cybersecurity',
  'Cloud Computing',
  'Data Science',
  'Robotics',
  'IoT',
  'Blockchain',
  'Game Development',
  'Design',
  'Entrepreneurship',
  'Research',
  'Hackathons'
];

export const INDIAN_CITIES = [
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Kochi',
  'Mysuru',
  'Chandigarh'
];

const DEFAULT_DEMO_USER = {
  id: 'usr-boltz-01',
  name: 'Aarav Sharma',
  email: 'aarav.dev@boltz.ai',
  college: 'IIT Bombay / Tech Founder',
  course: 'Computer Science & Engineering',
  year: '3rd Year',
  city: 'Bengaluru',
  interests: ['AI/ML', 'Hackathons', 'Web Development']
};

/**
 * Retrieves current active user from localStorage or returns default demo user.
 */
export function getCurrentUser() {
  try {
    const saved = localStorage.getItem('boltz_user');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading boltz_user from localStorage:', e);
  }
  return null;
}

/**
 * Handles User Registration / Signup
 */
export function signupUser(userData) {
  const newUser = {
    id: `usr-${Date.now()}`,
    name: userData.name || 'Gen Z Builder',
    email: userData.email,
    college: userData.college || 'Engineering College',
    course: userData.course || 'B.Tech CS',
    year: userData.year || '3rd Year',
    city: userData.city || 'Bengaluru',
    interests: Array.isArray(userData.interests) && userData.interests.length > 0 
      ? userData.interests 
      : ['AI/ML', 'Hackathons', 'Web Development'],
    createdAt: new Date().toISOString()
  };

  try {
    localStorage.setItem('boltz_user', JSON.stringify(newUser));
  } catch (e) {
    console.error('Error saving user to localStorage:', e);
  }

  return newUser;
}

/**
 * Handles User Login
 */
export function loginUser(email, password) {
  // If user already exists in localStorage, log them in
  const existing = getCurrentUser();
  if (existing && existing.email.toLowerCase() === email.toLowerCase()) {
    return existing;
  }

  // Create clean user session for new login
  const loggedInUser = {
    ...DEFAULT_DEMO_USER,
    email: email,
    name: email.split('@')[0] || 'Gen Z Builder'
  };

  try {
    localStorage.setItem('boltz_user', JSON.stringify(loggedInUser));
  } catch (e) {}

  return loggedInUser;
}

/**
 * Updates User Profile / Interests
 */
export function updateUserProfile(updatedFields) {
  const current = getCurrentUser() || DEFAULT_DEMO_USER;
  const updatedUser = { ...current, ...updatedFields };

  try {
    localStorage.setItem('boltz_user', JSON.stringify(updatedUser));
  } catch (e) {
    console.error('Failed to update profile:', e);
  }

  return updatedUser;
}

/**
 * Handles User Logout
 */
export function logoutUser() {
  try {
    localStorage.removeItem('boltz_user');
  } catch (e) {}
  return null;
}
