const fs = require('fs');
const https = require('https');
const path = require('path');
const vm = require('vm');

const appJsx = fs.readFileSync(path.join(__dirname, 'app.jsx'), 'utf8');

console.log('Fetching Babel Standalone to test compilation...');

https.get('https://unpkg.com/@babel/standalone@7.24.0/babel.min.js', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Babel Standalone fetched. Size:', body.length);
    try {
      const sandbox = { console };
      vm.createContext(sandbox);
      vm.runInContext(body, sandbox);

      const Babel = sandbox.Babel;
      console.log('Babel loaded successfully. Transforming app.jsx...');
      
      const result = Babel.transform(appJsx, {
        presets: ['react'],
        filename: 'app.jsx'
      });

      console.log('✅ Transformation successful! Compiled output size:', result.code.length);
      fs.writeFileSync(path.join(__dirname, 'app.compiled.js'), result.code, 'utf8');

      // Test executing the compiled JS in Node with mock DOM globals
      console.log('Testing execution of compiled app in mock environment...');

      const execSandbox = {
        console,
        window: {},
        document: { getElementById: () => ({}) },
        React: {
          createElement: () => ({}),
          useState: (initial) => [initial, () => {}],
          useEffect: () => {},
          useRef: () => ({ current: null }),
          useMemo: (fn) => fn(),
          Component: class Component {},
          createRoot: () => ({ render: () => {} }),
          StrictMode: 'div'
        },
        ReactDOM: { createRoot: () => ({ render: () => {} }) },
        L: {
          map: () => ({ addLayer: () => {}, tileLayer: () => ({ addTo: () => {} }), remove: () => {} }),
          tileLayer: () => ({ addTo: () => {} }),
          divIcon: () => ({}),
          marker: () => ({ addTo: () => ({ bindPopup: () => {}, on: () => {} }) })
        },
        localStorage: { getItem: () => null, setItem: () => {} },
        navigator: { clipboard: { writeText: () => {} } },
        confetti: () => {}
      };

      execSandbox.window = execSandbox;
      vm.createContext(execSandbox);
      vm.runInContext(result.code, execSandbox);

      console.log('🎉 Execution test PASSED with zero errors!');
    } catch (err) {
      console.error('❌ Babel/Execution Error:', err);
    }
  });
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});
