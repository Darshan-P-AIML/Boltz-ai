const fs = require('fs');
const path = require('path');
const vm = require('vm');

const compiledJs = fs.readFileSync(path.join(__dirname, 'app.compiled.js'), 'utf8');
const reactCode = fs.readFileSync(path.join(__dirname, 'vendor', 'react.development.js'), 'utf8');

console.log('Testing App render in Node context...');

try {
  const sandbox = {
    console,
    window: {},
    document: {
      getElementById: (id) => {
        if (id === 'root') {
          return {
            innerHTML: '',
            appendChild: () => {}
          };
        }
        return null;
      },
      createElement: () => ({ style: {}, appendChild: () => {} }),
      body: { appendChild: () => {} }
    },
    navigator: { userAgent: 'Node', clipboard: { writeText: () => {} } },
    localStorage: {
      getItem: () => null,
      setItem: () => {}
    },
    fetch: () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ items: [], total: 0, totalPages: 1 })
    })
  };

  sandbox.window = sandbox;
  sandbox.global = sandbox;

  vm.createContext(sandbox);

  // Load React
  vm.runInContext(reactCode, sandbox);
  console.log('React loaded in sandbox:', Boolean(sandbox.React));

  // Load App Compiled Bundle
  let renderedOutput = null;
  sandbox.ReactDOM = {
    createRoot: (el) => ({
      render: (element) => {
        console.log('ReactDOM.createRoot().render() CALLED successfully!');
        renderedOutput = element;
      }
    })
  };

  vm.runInContext(compiledJs, sandbox);

  if (renderedOutput) {
    console.log('✅ App component created and rendered to root successfully!');
  } else {
    console.error('❌ ReactDOM.createRoot().render() was NOT called!');
  }

} catch (err) {
  console.error('❌ Render Error:', err);
}
