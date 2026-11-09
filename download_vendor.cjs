const fs = require('fs');
const https = require('https');
const path = require('path');
const { URL } = require('url');

const VENDOR_DIR = path.join(__dirname, 'vendor');
if (!fs.existsSync(VENDOR_DIR)) {
  fs.mkdirSync(VENDOR_DIR, { recursive: true });
}

const vendorFiles = [
  { url: 'https://unpkg.com/react@18/umd/react.development.js', file: 'react.development.js' },
  { url: 'https://unpkg.com/react-dom@18/umd/react-dom.development.js', file: 'react-dom.development.js' },
  { url: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', file: 'leaflet.js' },
  { url: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', file: 'leaflet.css' },
  { url: 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js', file: 'confetti.browser.min.js' }
];

function downloadFile(targetUrl, filename) {
  return new Promise((resolve, reject) => {
    const dest = path.join(VENDOR_DIR, filename);
    const fileStream = fs.createWriteStream(dest);

    https.get(targetUrl, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        let redirect = res.headers.location;
        if (redirect.startsWith('/')) {
          const parsed = new URL(targetUrl);
          redirect = `${parsed.protocol}//${parsed.host}${redirect}`;
        }
        return downloadFile(redirect, filename).then(resolve).catch(reject);
      }
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`✅ Downloaded ${filename} (${fs.statSync(dest).size} bytes)`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      console.error(`Failed to download ${filename}:`, err.message);
      resolve();
    });
  });
}

(async () => {
  console.log('Downloading vendor JS/CSS libraries locally...');
  for (const item of vendorFiles) {
    await downloadFile(item.url, item.file);
  }
  console.log('🎉 Local vendor assets ready!');
})();
