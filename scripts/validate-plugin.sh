#!/usr/bin/env bash
set -euo pipefail

PLUGIN_ID=$(node -e "console.log(require('./src/plugin.json').id)")

cp -r dist "$PLUGIN_ID"
zip -qr "$PLUGIN_ID.zip" "$PLUGIN_ID"

cleanup() { rm -rf "$PLUGIN_ID" "$PLUGIN_ID.zip"; }
trap cleanup EXIT

npx --yes @grafana/plugin-validator@latest -sourceCodeUri file://. "$PLUGIN_ID.zip"
