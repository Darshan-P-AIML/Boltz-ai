const fs = require('fs');
const path = require('path');

const files = [
  'src/components/Icons.jsx',
  'src/data/hackathons.js',
  'src/components/CountdownTimer.jsx',
  'src/components/SkeletonLoader.jsx',
  'src/components/Navbar.jsx',
  'src/components/HeroBanner.jsx',
  'src/components/FilterBar.jsx',
  'src/components/HackathonCard.jsx',
  'src/components/HomeSections.jsx',
  'src/components/HackathonDetailsPage.jsx',
  'src/components/MapView.jsx',
  'src/components/CalendarView.jsx',
  'src/components/TeammateFinder.jsx',
  'src/components/HackathonModal.jsx',
  'src/components/SubmitModal.jsx',
  'src/components/BookmarksDrawer.jsx',
  'src/components/GeometricBackground.jsx',
  'src/components/AnalyticsDashboard.jsx',
  'src/App.jsx'
];

let concatenated = `// HackRadar Unified Browser Bundle\n\n`;

files.forEach((relPath) => {
  const fullPath = path.join(__dirname, relPath);
  let code = fs.readFileSync(fullPath, 'utf8');

  // Remove import statements
  code = code.replace(/^import\s+[\s\S]*?;/gm, '');
  
  // Remove export keywords
  code = code.replace(/export\s+default\s+/g, '');
  code = code.replace(/export\s+const\s+/g, 'const ');
  code = code.replace(/export\s+function\s+/g, 'function ');

  concatenated += `\n/* --- File: ${relPath} --- */\n` + code + '\n';

  // Inject aliases right after Icons.jsx is concatenated
  if (relPath === 'src/components/Icons.jsx') {
    concatenated += `
// Global React Hooks & Icon Aliases
const { useState, useEffect, useRef, useMemo, useCallback, Component } = React;
const CalendarIcon = Calendar;
const confetti = window.confetti || function() {};
const L = window.L;
\n`;
  }
});

concatenated += `
/* --- Render App --- */
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
}
`;

fs.writeFileSync(path.join(__dirname, 'app.jsx'), concatenated, 'utf8');
console.log('✅ Successfully regenerated d:\\VS\\app.jsx with clean React 18 createRoot!');
