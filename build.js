const fs = require('fs');
const path = require('path');

const files = [
  'src/data/hackathons.js',
  'src/components/Navbar.jsx',
  'src/components/HeroBanner.jsx',
  'src/components/FilterBar.jsx',
  'src/components/HackathonCard.jsx',
  'src/components/MapView.jsx',
  'src/components/CalendarView.jsx',
  'src/components/TeammateFinder.jsx',
  'src/components/HackathonModal.jsx',
  'src/components/SubmitModal.jsx',
  'src/components/BookmarksDrawer.jsx',
  'src/App.jsx'
];

let concatenated = `// HackRadar Unified Browser Bundle\n\n`;

files.forEach((relPath) => {
  const fullPath = path.join(__dirname, relPath);
  let code = fs.readFileSync(fullPath, 'utf8');

  // Remove import statements
  code = code.replace(/^import\s+[\s\S]*?;/gm, '');
  
  // Remove export default & export const keywords
  code = code.replace(/export\s+default\s+/g, '');
  code = code.replace(/export\s+const\s+/g, 'const ');

  concatenated += `\n/* --- File: ${relPath} --- */\n` + code + '\n';
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
console.log('✅ Successfully generated d:\\VS\\app.jsx standalone bundle!');
