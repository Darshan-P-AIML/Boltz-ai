const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const dbManager = require('./server/db.cjs');
const { syncHackathonData } = require('./server/ingestion.cjs');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const USE_DIST = fs.existsSync(path.join(DIST_DIR, 'index.html'));
const PUBLIC_DIR = USE_DIST ? DIST_DIR : __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.jsx': 'text/jsx; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

// Sync database on startup
syncHackathonData();

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = parsedUrl.pathname;
  const query = Object.fromEntries(parsedUrl.searchParams.entries());

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // --- API ROUTER ---

  // 1. GET /api/hackathons (Search, Filter, Sort, Paginate)
  if (pathname === '/api/hackathons' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
    const result = dbManager.query({
      q: query.q || '',
      mode: query.mode || 'All',
      track: query.track || 'All',
      location: query.location || 'All',
      status: query.status || 'All',
      sort_by: query.sort_by || query.sortBy || 'deadline',
      student_friendly: query.student_friendly || query.studentFriendly || 'false',
      min_prize: query.min_prize || 0,
      page: query.page || 1,
      limit: query.limit || 12
    });
    return res.end(JSON.stringify(result));
  }

  // 2. GET /api/hackathons/sections (Home Sections)
  if (pathname === '/api/hackathons/sections' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
    const sections = dbManager.getSections();
    return res.end(JSON.stringify(sections));
  }

  // 3. GET /api/hackathons/:id (Single Details)
  if (pathname.startsWith('/api/hackathons/') && req.method === 'GET') {
    const id = pathname.replace('/api/hackathons/', '');
    const item = dbManager.getById(id);
    if (item) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
      return res.end(JSON.stringify(item));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=UTF-8' });
      return res.end(JSON.stringify({ error: 'Hackathon not found' }));
    }
  }

  // 4. GET /api/stats (Real Platform Statistics)
  if (pathname === '/api/stats' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
    const stats = dbManager.getStats();
    return res.end(JSON.stringify(stats));
  }

  // 5. POST /api/sync (Trigger Ingestion Sync)
  if (pathname === '/api/sync' && req.method === 'POST') {
    syncHackathonData().then((stats) => {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify({ message: 'Sync complete', stats }));
    }).catch((err) => {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify({ error: err.message }));
    });
    return;
  }

  // --- STATIC FILE SERVER ---
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath) && fs.existsSync(path.join(__dirname, pathname))) {
    filePath = path.join(__dirname, pathname);
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`⚡ BOLTZ AI Production Backend & Web App live on http://localhost:${PORT}`);
});
