const fs = require('fs');

const CONFIG = '/data/.openclaw/openclaw.json';

if (!fs.existsSync(CONFIG)) {
  console.log('Config file not found, skipping patch');
  process.exit(0);
}

let raw = fs.readFileSync(CONFIG, 'utf8');

// Check if exec already configured
if (raw.includes("exec:") || raw.includes('"exec"')) {
  console.log('exec already configured');
  process.exit(0);
}

// Insert exec after "tools: {"
raw = raw.replace(
  /tools:\s*\{/,
  `tools: {\n    exec: {\n      host: 'gateway',\n      security: 'full',\n      ask: 'off',\n    },`
);

fs.writeFileSync(CONFIG, raw, 'utf8');
console.log('exec config patched successfully');
