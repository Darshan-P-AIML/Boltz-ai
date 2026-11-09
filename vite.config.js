import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const dbManager = require('./server/db.cjs');
const { syncHackathonData } = require('./server/ingestion.cjs');

// Run data sync on server start
try {
  syncHackathonData();
} catch (e) {
  console.error('Initial DB sync warning:', e.message);
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-server-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url.startsWith('/api')) {
            return next();
          }

          const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
          const pathname = parsedUrl.pathname;
          const query = Object.fromEntries(parsedUrl.searchParams.entries());

          res.setHeader('Content-Type', 'application/json; charset=UTF-8');
          res.setHeader('Access-Control-Allow-Origin', '*');

          try {
            if (pathname === '/api/hackathons' && req.method === 'GET') {
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

            if (pathname === '/api/hackathons/sections' && req.method === 'GET') {
              const sections = dbManager.getSections();
              return res.end(JSON.stringify(sections));
            }

            if (pathname.startsWith('/api/hackathons/') && req.method === 'GET') {
              const id = pathname.replace('/api/hackathons/', '');
              const item = dbManager.getById(id);
              if (item) {
                return res.end(JSON.stringify(item));
              } else {
                res.statusCode = 404;
                return res.end(JSON.stringify({ error: 'Hackathon not found' }));
              }
            }

            if (pathname === '/api/stats' && req.method === 'GET') {
              const stats = dbManager.getStats();
              return res.end(JSON.stringify(stats));
            }

            if (pathname === '/api/sync' && req.method === 'POST') {
              const stats = await syncHackathonData();
              return res.end(JSON.stringify({ message: 'Sync complete', stats }));
            }

            next();
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      }
    }
  ],
  server: {
    port: 3000,
    open: true
  }
});
