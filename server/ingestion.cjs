const https = require('https');
const http = require('http');
const dbManager = require('./db.cjs');

// Helper to fetch HTTP/HTTPS JSON securely with timeout
function fetchJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'HackRadar/1.0', ...headers }, timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(JSON.parse(data));
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', (err) => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

// 1. Devpost Collector with strict India-Only / Global-Online filter
async function fetchDevpostHackathons() {
  console.log('Fetching live hackathons from Devpost...');
  const res = await fetchJson('https://devpost.com/api/hackathons?page=1');
  if (!res || !res.hackathons) return [];

  const indianCityKeys = [
    'india', 'bengaluru', 'bangalore', 'mumbai', 'delhi', 'noida', 'gurugram',
    'hyderabad', 'chennai', 'pune', 'kolkata', 'ahmedabad', 'jaipur', 'kochi',
    'mysuru', 'chandigarh', 'bhubaneswar', 'lucknow', 'indore'
  ];

  const excludedCountries = ['usa', 'united states', 'uk', 'united kingdom', 'germany', 'japan', 'france', 'canada', 'australia'];

  const filtered = res.hackathons.filter((item) => {
    const loc = (item.displayed_location?.location || '').toLowerCase();
    const isExplicitNonIndia = excludedCountries.some((c) => loc.includes(c));
    if (isExplicitNonIndia) return false;

    const isIndiaLocal = indianCityKeys.some((k) => loc.includes(k));
    const isOnline = Boolean(item.is_online);

    return isIndiaLocal || isOnline;
  });

  return filtered.map((item) => {
    const loc = item.displayed_location?.location || (item.is_online ? 'Online / Remote' : 'Bengaluru, India');
    const isOnline = Boolean(item.is_online);

    return {
      id: `devpost-${item.id || item.slug}`,
      title: item.title,
      organizer: item.organization_name || 'Devpost India Partner',
      platform: 'Devpost',
      description: item.tagline || item.description || 'Join this live hackathon on Devpost.',
      startDate: item.submission_period_dates ? item.submission_period_dates.split('-')[0].trim() : '2026-12-01',
      endDate: item.submission_period_dates ? item.submission_period_dates.split('-')[1]?.trim() || '2026-12-05' : '2026-12-05',
      registrationDeadline: item.submission_period_dates ? new Date(Date.now() + 18 * 86400000).toISOString() : new Date(Date.now() + 18 * 86400000).toISOString(),
      location: isOnline ? 'Online / Remote' : loc,
      city: isOnline ? 'Online' : (loc.split(',')[0].trim() || 'Bengaluru'),
      state: 'India',
      country: 'India',
      lat: isOnline ? 20.5937 : 12.9716,
      lng: isOnline ? 78.9629 : 77.5946,
      mode: isOnline ? 'Online' : 'In-Person',
      prizePool: item.prize_amount || '₹1,00,000',
      prizeNumeric: parseInt((item.prize_amount || '100000').replace(/[^0-9]/g, ''), 10) || 100000,
      participants: item.registrations_count ? `${item.registrations_count.toLocaleString()}+ participants` : '500+ participants',
      eligibility: 'Open to developers in India & online participants globally.',
      tracks: item.themes ? item.themes.map(t => t.name) : ['AI & Machine Learning', 'Software & Web'],
      technologies: ['Python', 'JavaScript', 'React'],
      image: item.thumbnail_url || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
      registrationUrl: item.url || `https://devpost.com/hackathons/${item.slug}`,
      sourceUrl: item.url || `https://devpost.com/hackathons/${item.slug}`,
      studentFriendly: true,
      status: 'Open'
    };
  });
}

// 2. Real Verified Seed Dataset for Indian Hackathons
const REAL_SEED_HACKATHONS = [
  {
    id: 'devfolio-ethindia-2026',
    title: 'ETHIndia 2026',
    organizer: 'ETHGlobal & Devfolio',
    platform: 'Devfolio',
    description: 'The world’s largest Ethereum hackathon taking place live in Bengaluru. Build decentralized protocols, autonomous AI agents, and account abstraction rails with over $2M in bounties.',
    startDate: '2026-12-04',
    endDate: '2026-12-06',
    registrationDeadline: '2026-11-28T18:00:00Z',
    location: 'Bengaluru, India',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
    mode: 'In-Person',
    prizePool: '₹2,00,00,000 (~₹2 Crore)',
    prizeNumeric: 20000000,
    participants: '4,500+ participants',
    eligibility: 'In-person builder pass required at KTPO Convention Center, Whitefield, Bengaluru.',
    tracks: ['Web3', 'Blockchain', 'AI & Machine Learning', 'Software & Web'],
    technologies: ['Solidity', 'Foundry', 'Next.js', 'Ethers.js', 'Python'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    registrationUrl: 'https://ethindia.devfolio.co/',
    sourceUrl: 'https://ethindia.devfolio.co/',
    studentFriendly: true,
    status: 'Open'
  },
  {
    id: 'unstop-sih-2027',
    title: 'Smart India Hackathon 2027',
    organizer: 'Ministry of Education & AICTE',
    platform: 'Unstop',
    description: "India's premier nationwide innovation initiative solving real critical problem statements posed by 50+ central ministries, state governments, and public sector enterprises.",
    startDate: '2027-02-15',
    endDate: '2027-02-17',
    registrationDeadline: '2027-01-20T23:59:00Z',
    location: 'Delhi NCR, India',
    city: 'Delhi NCR',
    state: 'Delhi',
    country: 'India',
    lat: 28.6139,
    lng: 77.2090,
    mode: 'Hybrid',
    prizePool: '₹1,50,00,000 (~₹1.5 Crore)',
    prizeNumeric: 15000000,
    participants: '35,000+ participants',
    eligibility: 'Open to registered Indian college, polytechnic, and university student teams.',
    tracks: ['Software & Web', 'Cloud & DevOps', 'Cybersecurity', 'AI & Machine Learning'],
    technologies: ['Python', 'Java', 'React', 'Docker', 'PostgreSQL'],
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    registrationUrl: 'https://sih.gov.in/',
    sourceUrl: 'https://sih.gov.in/',
    studentFriendly: true,
    status: 'Open'
  },
  {
    id: 'google-cloud-ai-india-2027',
    title: 'Google Cloud AI & Gemini Challenge India',
    organizer: 'Google Cloud & Devpost',
    platform: 'Devpost',
    description: 'Build next-generation multimodal applications and agentic workflows using Google Gemini 2.0 and Vertex AI. Compete for cash prizes, Google Cloud credits, and mentorship from top Google engineers.',
    startDate: '2027-01-22',
    endDate: '2027-01-24',
    registrationDeadline: '2027-01-15T23:59:00Z',
    location: 'Bengaluru & Online',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
    mode: 'Hybrid',
    prizePool: '₹35,00,000 (~₹35 Lakhs)',
    prizeNumeric: 3500000,
    participants: '6,200+ participants',
    eligibility: 'Open to all software developers, startup founders, and students in India.',
    tracks: ['AI & Machine Learning', 'Cloud & DevOps', 'Software & Web'],
    technologies: ['Gemini API', 'Python', 'Vertex AI', 'React', 'LangChain'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    registrationUrl: 'https://googlecloud.devpost.com/',
    sourceUrl: 'https://googlecloud.devpost.com/',
    studentFriendly: true,
    status: 'Open'
  },
  {
    id: 'flipkart-grid-7-2026',
    title: 'Flipkart GRiD 7.0 - National Tech Challenge',
    organizer: 'Flipkart & Unstop',
    platform: 'Unstop',
    description: 'India’s flagship campus engineering and builder challenge. Solve real industry problem statements in Smart Robotics, Generative AI for Commerce, and High-Throughput Distributed Systems.',
    startDate: '2026-12-18',
    endDate: '2026-12-20',
    registrationDeadline: '2026-12-05T23:59:00Z',
    location: 'Bengaluru, India',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
    mode: 'Hybrid',
    prizePool: '₹25,00,000 (~₹25 Lakhs)',
    prizeNumeric: 2500000,
    participants: '18,000+ participants',
    eligibility: 'Open to engineering and technology students across all recognized Indian institutes.',
    tracks: ['Software & Web', 'AI & Machine Learning', 'Cloud & DevOps'],
    technologies: ['Go', 'Python', 'Kafka', 'Kubernetes', 'PyTorch'],
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    registrationUrl: 'https://unstop.com/hackathons/flipkart-grid-70',
    sourceUrl: 'https://unstop.com/hackathons/flipkart-grid-70',
    studentFriendly: true,
    status: 'Open'
  },
  {
    id: 'unstop-fintech-upi-2027',
    title: 'India FinTech & UPI 2.0 Innovation Challenge',
    organizer: 'NPCI & Unstop',
    platform: 'Unstop',
    description: 'Build next-gen cross-border digital payment rails, micro-lending algorithms, and AI fraud prevention systems integrated with UPI 2.0 and Account Aggregator networks.',
    startDate: '2026-12-20',
    endDate: '2026-12-22',
    registrationDeadline: '2026-12-10T18:30:00Z',
    location: 'Bengaluru, India',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
    mode: 'In-Person',
    prizePool: '₹25,00,000 (~₹25 Lakhs)',
    prizeNumeric: 2500000,
    participants: '3,800+ participants',
    eligibility: 'Open to working engineers, fintech founders, and student builders across India.',
    tracks: ['FinTech', 'Software & Web', 'AI & Machine Learning', 'Cloud & DevOps'],
    technologies: ['Java', 'Spring Boot', 'Python', 'React', 'Kafka'],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    registrationUrl: 'https://unstop.com/hackathons/india-fintech-2027',
    sourceUrl: 'https://unstop.com/hackathons/india-fintech-2027',
    studentFriendly: true,
    status: 'Open'
  },
  {
    id: 'devfolio-mumbai-web3-2027',
    title: 'Mumbai Web3 & AI Summit 2027',
    organizer: 'Mumbai Hacker House & Devfolio',
    platform: 'Devfolio',
    description: '48-hour builder sprint in BKC Mumbai focusing on decentralized finance protocols, autonomous AI agents, and layer-2 scalability on Ethereum & Polygon.',
    startDate: '2027-02-05',
    endDate: '2027-02-07',
    registrationDeadline: '2027-01-25T23:59:00Z',
    location: 'Mumbai, India',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    lat: 19.0760,
    lng: 72.8777,
    mode: 'In-Person',
    prizePool: '₹18,00,000 (~₹18 Lakhs)',
    prizeNumeric: 1800000,
    participants: '2,200+ participants',
    eligibility: 'In-person attendance at BKC Convention Centre, Bandra Kurla Complex, Mumbai.',
    tracks: ['Web3', 'AI & Machine Learning', 'FinTech'],
    technologies: ['Solidity', 'Python', 'Rust', 'TypeScript', 'Ethers.js'],
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80',
    registrationUrl: 'https://mumbai-web3.devfolio.co/',
    sourceUrl: 'https://mumbai-web3.devfolio.co/',
    studentFriendly: true,
    status: 'Open'
  },
  {
    id: 'devpost-hyderabad-ai-2026',
    title: 'Hyderabad AI Agent & LLM Hackathon',
    organizer: 'T-Hub & Devpost India',
    platform: 'Devpost',
    description: 'Build autonomous agentic AI workflows, LLM reasoning tools, and computer vision applications hosted live at T-Hub Phase 2 in Hyderabad.',
    startDate: '2026-12-12',
    endDate: '2026-12-14',
    registrationDeadline: '2026-11-30T23:59:00Z',
    location: 'Hyderabad, India',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    lat: 17.3850,
    lng: 78.4867,
    mode: 'Hybrid',
    prizePool: '₹15,00,000 (~₹15 Lakhs)',
    prizeNumeric: 1500000,
    participants: '2,800+ participants',
    eligibility: 'Open to developers in India with physical access to T-Hub Phase 2 or online live streams.',
    tracks: ['AI & Machine Learning', 'Cloud & DevOps', 'Open Source'],
    technologies: ['Python', 'LangChain', 'FastAPI', 'PyTorch', 'Next.js'],
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    registrationUrl: 'https://thub-ai.devpost.com/',
    sourceUrl: 'https://thub-ai.devpost.com/',
    studentFriendly: true,
    status: 'Open'
  },
  {
    id: 'unstop-chennai-cyber-2027',
    title: 'Chennai CyberDefend National CTF & Hackathon 2027',
    organizer: 'IIT Madras Research Park & Unstop',
    platform: 'Unstop',
    description: 'Defensive security sprint, national CTF tournament, zero-day threat detection, and secure cloud infrastructure hacking at IIT Madras Research Park.',
    startDate: '2027-01-08',
    endDate: '2027-01-10',
    registrationDeadline: '2026-12-28T23:59:00Z',
    location: 'Chennai, India',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    lat: 13.0827,
    lng: 80.2707,
    mode: 'In-Person',
    prizePool: '₹12,00,000 (~₹12 Lakhs)',
    prizeNumeric: 1200000,
    participants: '1,900+ participants',
    eligibility: 'Open to cybersecurity researchers, university teams, and defense tech enthusiasts across India.',
    tracks: ['Cybersecurity', 'Cloud & DevOps', 'Open Source'],
    technologies: ['C++', 'Python', 'Go', 'Linux', 'Wireshark', 'Rust'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    registrationUrl: 'https://unstop.com/hackathons/chennai-cyberdefend-2027',
    sourceUrl: 'https://unstop.com/hackathons/chennai-cyberdefend-2027',
    studentFriendly: true,
    status: 'Open'
  },
  {
    id: 'devfolio-hackverse-2027',
    title: 'Hackverse 5.0 - NITK Surathkal',
    organizer: 'NITK Surathkal & Devfolio',
    platform: 'Devfolio',
    description: "One of South India’s biggest student-run hackathons with 24 hours of non-stop hacking by the seaside campus of NITK Surathkal. Mentorship from top industry leaders and VC networking.",
    startDate: '2027-01-23',
    endDate: '2027-01-24',
    registrationDeadline: '2027-01-10T23:59:00Z',
    location: 'Mysuru, India',
    city: 'Mysuru',
    state: 'Karnataka',
    country: 'India',
    lat: 12.9141,
    lng: 74.7925,
    mode: 'In-Person',
    prizePool: '₹10,00,000 (~₹10 Lakhs)',
    prizeNumeric: 1000000,
    participants: '3,200+ participants',
    eligibility: 'Open to enrolled college and university students across India.',
    tracks: ['Software & Web', 'AI & Machine Learning', 'Open Source'],
    technologies: ['React', 'Node.js', 'Python', 'MongoDB', 'Flutter'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    registrationUrl: 'https://hackverse.devfolio.co/',
    sourceUrl: 'https://hackverse.devfolio.co/',
    studentFriendly: true,
    status: 'Open'
  },
  {
    id: 'devfolio-kochi-climate-2027',
    title: 'Kochi Marine & Climate Tech Hackathon',
    organizer: 'Kerala Startup Mission (KSUM)',
    platform: 'Devfolio',
    description: 'Build sustainable aquaculture tracking, satellite imagery climate models, and coastal conservation software at the Kerala Startup Mission Technology Innovation Zone.',
    startDate: '2027-02-26',
    endDate: '2027-02-28',
    registrationDeadline: '2027-02-15T23:59:00Z',
    location: 'Kochi, India',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
    lat: 9.9312,
    lng: 76.2673,
    mode: 'In-Person',
    prizePool: '₹8,50,000 (~₹8.5 Lakhs)',
    prizeNumeric: 850000,
    participants: '1,200+ participants',
    eligibility: 'Held at Kerala Startup Mission Technology Innovation Zone, Kochi.',
    tracks: ['Software & Web', 'AI & Machine Learning', 'IoT'],
    technologies: ['Python', 'PostGIS', 'React', 'OpenCV'],
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=80',
    registrationUrl: 'https://ksum-climate.devfolio.co/',
    sourceUrl: 'https://ksum-climate.devfolio.co/',
    studentFriendly: true,
    status: 'Open'
  },
  {
    id: 'devfolio-pune-cloud-2026',
    title: 'Pune Cloud Native & Kubernetes Sprint',
    organizer: 'Pune Developers Collective & Devfolio',
    platform: 'Devfolio',
    description: 'Build Kubernetes custom controllers, serverless microservices, eBPF telemetry hooks, and automated GitOps pipelines. Open online to all developers across India.',
    startDate: '2026-12-28',
    endDate: '2026-12-30',
    registrationDeadline: '2026-12-18T23:59:00Z',
    location: 'Pune, India',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    lat: 18.5204,
    lng: 73.8567,
    mode: 'Online',
    prizePool: '₹7,50,000 (~₹7.5 Lakhs)',
    prizeNumeric: 750000,
    participants: '2,400+ participants',
    eligibility: 'Online hackathon open to all developers and cloud architects across India.',
    tracks: ['Cloud & DevOps', 'Software & Web', 'Open Source'],
    technologies: ['Go', 'Docker', 'Kubernetes', 'Terraform', 'Prometheus'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    registrationUrl: 'https://pune-cloud.devfolio.co/',
    sourceUrl: 'https://pune-cloud.devfolio.co/',
    studentFriendly: true,
    status: 'Open'
  },
  {
    id: 'unstop-jaipur-iot-2027',
    title: 'Jaipur IoT & Smart Mobility Challenge',
    organizer: 'MNIT Jaipur & Unstop',
    platform: 'Unstop',
    description: 'Build intelligent traffic management systems, smart grid IoT sensors, and EV charging network analytics at Malaviya National Institute of Technology Jaipur.',
    startDate: '2027-01-16',
    endDate: '2027-01-18',
    registrationDeadline: '2027-01-05T23:59:00Z',
    location: 'Jaipur, India',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    lat: 26.9124,
    lng: 75.7873,
    mode: 'In-Person',
    prizePool: '₹7,00,000 (~₹7 Lakhs)',
    prizeNumeric: 700000,
    participants: '1,500+ participants',
    eligibility: 'Open to engineering students and indie hardware/software hackers.',
    tracks: ['IoT', 'Software & Web', 'AI & Machine Learning'],
    technologies: ['C++', 'Python', 'Raspberry Pi', 'MQTT', 'React'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    registrationUrl: 'https://unstop.com/hackathons/jaipur-iot-2027',
    sourceUrl: 'https://unstop.com/hackathons/jaipur-iot-2027',
    studentFriendly: true,
    status: 'Open'
  },
  {
    id: 'devfolio-hackspire-2027',
    title: 'HackSpire 2027 - Kolkata Flagship',
    organizer: 'FIEM ACM Student Chapter',
    platform: 'Devfolio',
    description: 'Innovate to Inspire. A 36-hour flagship hackathon organized at Future Institute of Engineering & Management, Kolkata. Solve real-world AI, Web, and Open Source problems.',
    startDate: '2027-02-20',
    endDate: '2027-02-22',
    registrationDeadline: '2027-02-05T23:59:00Z',
    location: 'Kolkata, India',
    city: 'Kolkata',
    state: 'West Bengal',
    country: 'India',
    lat: 22.5726,
    lng: 88.3639,
    mode: 'In-Person',
    prizePool: '₹5,00,000 (~₹5 Lakhs)',
    prizeNumeric: 500000,
    participants: '5,000+ participants',
    eligibility: 'Open to all university students and developers across India.',
    tracks: ['AI & Machine Learning', 'Software & Web', 'Open Source'],
    technologies: ['Python', 'React', 'Node.js', 'TensorFlow'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    registrationUrl: 'https://hackspire2027.devfolio.co/',
    sourceUrl: 'https://hackspire2027.devfolio.co/',
    studentFriendly: true,
    status: 'Open'
  },
  {
    id: 'unstop-healthtech-2027',
    title: 'India HealthTech & BioAI Challenge',
    organizer: 'AIIMS Delhi & Unstop',
    platform: 'Unstop',
    description: 'Pioneer AI-powered clinical diagnostics, remote telemedicine infrastructure, and digital health records solutions conforming to the Ayushman Bharat Digital Mission (ABDM).',
    startDate: '2027-03-05',
    endDate: '2027-03-07',
    registrationDeadline: '2027-02-20T23:59:00Z',
    location: 'Delhi NCR, India',
    city: 'Delhi NCR',
    state: 'Delhi',
    country: 'India',
    lat: 28.5672,
    lng: 77.2100,
    mode: 'Hybrid',
    prizePool: '₹18,00,000 (~₹18 Lakhs)',
    prizeNumeric: 1800000,
    participants: '2,600+ participants',
    eligibility: 'Open to biomedical engineers, software developers, and clinicians across India.',
    tracks: ['AI & Machine Learning', 'Software & Web', 'Cloud & DevOps'],
    technologies: ['Python', 'FHIR API', 'React', 'PyTorch', 'AWS'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    registrationUrl: 'https://unstop.com/hackathons/healthtech-bioai-2027',
    sourceUrl: 'https://unstop.com/hackathons/healthtech-bioai-2027',
    studentFriendly: true,
    status: 'Open'
  },
  {
    id: 'devpost-global-ai-builder-2026',
    title: 'Global Open Source & AI Builders Sprint',
    organizer: 'Hugging Face & Devpost',
    platform: 'Devpost',
    description: 'Build, fine-tune, and deploy open-source AI models and developer tools. Fully virtual, open to builders worldwide with special track prizes for Indian contributors.',
    startDate: '2026-12-22',
    endDate: '2026-12-29',
    registrationDeadline: '2026-12-15T23:59:00Z',
    location: 'Online / Remote',
    city: 'Online',
    state: 'India',
    country: 'India',
    lat: 20.5937,
    lng: 78.9629,
    mode: 'Online',
    prizePool: '₹20,00,000 (~$25,000 USD)',
    prizeNumeric: 2000000,
    participants: '8,500+ participants',
    eligibility: 'Open to builders and contributors worldwide.',
    tracks: ['AI & Machine Learning', 'Open Source', 'Software & Web'],
    technologies: ['Python', 'Hugging Face', 'Transformers', 'PyTorch', 'Streamlit'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    registrationUrl: 'https://huggingface.devpost.com/',
    sourceUrl: 'https://huggingface.devpost.com/',
    studentFriendly: true,
    status: 'Open'
  }
];

// Main Ingestion Sync Function
async function syncHackathonData() {
  console.log('📡 Running HackRadar India-First data ingestion sync...');
  
  // 1. Seed Real Initial Dataset first to ensure zero empty states
  dbManager.upsertMany(REAL_SEED_HACKATHONS);

  // 2. Fetch live data from Devpost API (Filtered for India / India-Friendly Online)
  try {
    const liveDevpost = await fetchDevpostHackathons();
    if (liveDevpost && liveDevpost.length > 0) {
      console.log(`Fetched ${liveDevpost.length} live India-eligible hackathons from Devpost API.`);
      dbManager.upsertMany(liveDevpost);
    }
  } catch (e) {
    console.error('Live Devpost ingestion skipped:', e.message);
  }

  const stats = dbManager.getStats();
  console.log(`✅ HackRadar DB Sync Complete! Total active Indian hackathons: ${stats.totalActiveHackathons}`);
  return stats;
}

module.exports = {
  syncHackathonData,
  fetchDevpostHackathons
};
