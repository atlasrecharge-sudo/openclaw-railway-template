# Patch exec config
CONFIG="/data/.openclaw/openclaw.json"
if [ -f "$CONFIG" ]; then
  # Add exec to tools section if not present
  if ! grep -q '"exec"' "$CONFIG" && ! grep -q "exec:" "$CONFIG"; then
    sed -i "s/tools: {/tools: {\n    exec: {\n      host: 'gateway',\n      security: 'full',\n      ask: 'off',\n    },/" "$CONFIG"
    echo "exec config patched with sed"
  else
    echo "exec already configured"
  fi
fi
