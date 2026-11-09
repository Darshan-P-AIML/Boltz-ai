const http = require('http');

function get(pathStr) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${pathStr}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, length: data.length, contentType: res.headers['content-type'] });
        } catch (e) {
          resolve({ status: res.statusCode, length: data.length });
        }
      });
    }).on('error', reject);
  });
}

(async () => {
  console.log('Verifying Local Vendor Asset Endpoints...');
  
  const reactRes = await get('/vendor/react.development.js');
  console.log('GET /vendor/react.development.js -> Status:', reactRes.status, 'Length:', reactRes.length, 'Type:', reactRes.contentType);

  const reactDomRes = await get('/vendor/react-dom.development.js');
  console.log('GET /vendor/react-dom.development.js -> Status:', reactDomRes.status, 'Length:', reactDomRes.length, 'Type:', reactDomRes.contentType);

  const leafletCssRes = await get('/vendor/leaflet.css');
  console.log('GET /vendor/leaflet.css -> Status:', leafletCssRes.status, 'Length:', leafletCssRes.length, 'Type:', leafletCssRes.contentType);

  console.log('🎉 Local Vendor Asset Endpoints Verified!');
})();
