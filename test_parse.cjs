const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, 'app.jsx'), 'utf8');
console.log('App.jsx size:', code.length, 'bytes');

// Check for any potential syntax issues or missing closing tags
try {
  // Simple check for unclosed brackets or strings
  let openBraces = 0, openParens = 0, openSquare = 0;
  for (let i = 0; i < code.length; i++) {
    if (code[i] === '{') openBraces++;
    if (code[i] === '}') openBraces--;
    if (code[i] === '(') openParens++;
    if (code[i] === ')') openParens--;
    if (code[i] === '[') openSquare++;
    if (code[i] === ']') openSquare--;
  }
  console.log(`Braces balance: ${openBraces}, Parens balance: ${openParens}, Square balance: ${openSquare}`);
} catch (e) {
  console.error('Check error:', e);
}
