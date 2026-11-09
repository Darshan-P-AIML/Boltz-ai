const http = require('http');

http.get('http://127.0.0.1:9222/json', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const targets = JSON.parse(data);
      console.log('DevTools Targets:', JSON.stringify(targets, null, 2));
    } catch (e) {
      console.error('JSON parse error:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('DevTools HTTP error:', err.message);
});
