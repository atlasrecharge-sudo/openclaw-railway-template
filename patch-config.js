const fs = require('fs');

const CONFIG = '/data/.openclaw/openclaw.json';

if (!fs.existsSync(CONFIG)) {
  console.log('Config file not found, skipping patch');
  process.exit(0);
}

let raw = fs.readFileSync(CONFIG, 'utf8');

// Fix provider in anthropic:default profile
raw = raw.replace(
  /'anthropic:default':\s*\{\s*provider:\s*'openrouter'/,
  "'anthropic:default': {\n      provider: 'anthropic'"
);

// Change primary model to anthropic direct
raw = raw.replace(
  /primary:\s*'openrouter\/anthropic\/claude-sonnet-4-6'/,
  "primary: 'anthropic/claude-sonnet-4-6'"
);

// Fix models list
raw = raw.replace(
  /'openrouter\/anthropic\/claude-sonnet-4-6':\s*\{\}/,
  "'anthropic/claude-sonnet-4-6': {}"
);

// Add exec if not present
if (!raw.includes("exec:") && !raw.includes('"exec"')) {
  raw = raw.replace(
    /tools:\s*\{/,
    "tools: {\n    exec: {\n      host: 'gateway',\n      security: 'full',\n      ask: 'off',\n    },"
  );
}

fs.writeFileSync(CONFIG, raw, 'utf8');
console.log('Config patched successfully');
