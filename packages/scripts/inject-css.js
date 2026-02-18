const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const cssPath = path.join(distDir, 'styles.css');
const jsPathCJS = path.join(distDir, 'index.js');
const jsPathESM = path.join(distDir, 'index.mjs');

console.log('Starting CSS injection...');

if (!fs.existsSync(cssPath)) {
  console.error('Error: dist/styles.css not found. Make sure to run build:css first.');
  process.exit(1);
}

const css = fs.readFileSync(cssPath, 'utf8');
const escapedCss = css.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

const injectionCode = `
// Injected CSS
if (typeof document !== 'undefined') {
  try {
    const styleId = 'react-editor-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = \`${escapedCss}\`;
      document.head.appendChild(style);
    }
  } catch (e) {
    console.error('Failed to inject react-editor styles:', e);
  }
}
`;

function inject(filePath) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Prepend or Append? 
    // Appending is safer for "directives" like "use client" which must be at top.
    // However, we want styles to load essentially immediately when imported.
    fs.appendFileSync(filePath, injectionCode);
    console.log(`Injected CSS into ${path.basename(filePath)}`);
  } else {
    console.log(`Skipping ${path.basename(filePath)} (not found)`);
  }
}

inject(jsPathCJS);
inject(jsPathESM);

console.log('CSS injection complete.');
