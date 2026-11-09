const fs = require('fs');
const path = require('path');
const vm = require('vm');

const reactCode = fs.readFileSync(path.join(__dirname, 'vendor', 'react.development.js'), 'utf8');
const reactDomCode = fs.readFileSync(path.join(__dirname, 'vendor', 'react-dom.development.js'), 'utf8');

console.log('--- DEBUG DOM SIMULATION FOR REACT 18 ---');

try {
  const rootObj = {
    id: 'root',
    nodeType: 1,
    style: {},
    appendChild: () => {},
    setAttribute: () => {},
    addEventListener: () => {},
    removeEventListener: () => {}
  };

  const sandbox = {
    console,
    window: {
      location: { protocol: 'http:', href: 'http://localhost:3000' }
    },
    document: {
      createElement: (tag) => ({
        tagName: tag,
        style: {},
        appendChild: () => {},
        setAttribute: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      }),
      getElementById: (id) => (id === 'root' ? rootObj : null),
      body: { appendChild: () => {} }
    },
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    navigator: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0', clipboard: { writeText: () => {} } },
    localStorage: { getItem: () => null, setItem: () => {} },
    fetch: () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ items: [], total: 0, totalPages: 1 })
    })
  };

  sandbox.window.window = sandbox.window;
  sandbox.window.document = sandbox.document;
  sandbox.window.navigator = sandbox.navigator;
  sandbox.window.localStorage = sandbox.localStorage;
  sandbox.window.setTimeout = sandbox.setTimeout;
  sandbox.window.clearTimeout = sandbox.clearTimeout;
  sandbox.window.setInterval = sandbox.setInterval;
  sandbox.window.clearInterval = sandbox.clearInterval;
  sandbox.global = sandbox;
  sandbox.globalThis = sandbox;

  vm.createContext(sandbox);

  // Load React & ReactDOM into sandbox
  vm.runInContext(reactCode, sandbox);
  vm.runInContext(reactDomCode, sandbox);

  console.log('React available:', Boolean(sandbox.React));
  console.log('ReactDOM available:', Boolean(sandbox.ReactDOM));

  // Load app.compiled.js
  const compiledJs = fs.readFileSync(path.join(__dirname, 'app.compiled.js'), 'utf8');
  vm.runInContext(compiledJs, sandbox);

  console.log('🎉 Execution completed without crashing!');
} catch (err) {
  console.error('💥 EXACT CRASH ERROR DETECTED:');
  console.error(err);
}
