#!/bin/bash
set -e
chown -R openclaw:openclaw /data
chmod 700 /data
if [ ! -d /data/.linuxbrew ]; then
  cp -a /home/linuxbrew/.linuxbrew /data/.linuxbrew
fi
rm -rf /home/linuxbrew/.linuxbrew
ln -sfn /data/.linuxbrew /home/linuxbrew/.linuxbrew

# Patch exec config
CONFIG="/data/.openclaw/openclaw.json"
if [ -f "$CONFIG" ]; then
  node -e "
    const fs = require('fs');
    const config = JSON.parse(fs.readFileSync('$CONFIG', 'utf8'));
    if (!config.tools) config.tools = {};
    config.tools.exec = { host: 'gateway', security: 'full', ask: 'off' };
    fs.writeFileSync('$CONFIG', JSON.stringify(config, null, 2));
    console.log('exec config patched');
  "
fi

exec gosu openclaw node src/server.js
