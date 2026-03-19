#!/bin/bash
# Install the daily report as a macOS LaunchAgent (runs at 7:15am every day).
#
# Usage: bash scripts/install-launchagent.sh
#
# To uninstall:
#   launchctl unload ~/Library/LaunchAgents/com.aiwithmichal.daily-report.plist
#   rm ~/Library/LaunchAgents/com.aiwithmichal.daily-report.plist

set -euo pipefail

LABEL="com.aiwithmichal.daily-report"
PLIST_PATH="$HOME/Library/LaunchAgents/${LABEL}.plist"
LOG_DIR="$HOME/Library/Logs"
LOG_FILE="${LOG_DIR}/aiwithmichal-daily-report.log"
ERR_FILE="${LOG_DIR}/aiwithmichal-daily-report.error.log"

# Resolve the project root (directory containing this script's parent)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Resolve the node executable used in the current shell
NODE_PATH="$(command -v node 2>/dev/null || echo "")"
if [[ -z "$NODE_PATH" ]]; then
  echo "Error: 'node' not found on PATH. Install Node.js first." >&2
  exit 1
fi

echo "Project root:  $PROJECT_ROOT"
echo "Node binary:   $NODE_PATH"
echo "Plist:         $PLIST_PATH"
echo "Log file:      $LOG_FILE"
echo ""

# Unload existing agent if already installed
if launchctl list "$LABEL" &>/dev/null; then
  echo "Unloading existing LaunchAgent..."
  launchctl unload "$PLIST_PATH" 2>/dev/null || true
fi

# Write the plist
cat > "$PLIST_PATH" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LABEL}</string>

  <key>ProgramArguments</key>
  <array>
    <string>${NODE_PATH}</string>
    <string>--env-file=.env</string>
    <string>scripts/daily-report.mjs</string>
  </array>

  <key>WorkingDirectory</key>
  <string>${PROJECT_ROOT}</string>

  <!-- Run at 7:15am every day -->
  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key>
    <integer>7</integer>
    <key>Minute</key>
    <integer>15</integer>
  </dict>

  <key>StandardOutPath</key>
  <string>${LOG_FILE}</string>

  <key>StandardErrorPath</key>
  <string>${ERR_FILE}</string>

  <!-- Run at next opportunity if the machine was asleep at 7:15am -->
  <key>RunAtLoad</key>
  <false/>
</dict>
</plist>
PLIST

# Load the agent
launchctl load "$PLIST_PATH"

echo "LaunchAgent installed and loaded."
echo ""
echo "The daily report will run every morning at 7:15am."
echo "Logs:   $LOG_FILE"
echo "Errors: $ERR_FILE"
echo ""
echo "To test immediately (runs now, not scheduled):"
echo "  node --env-file=.env scripts/daily-report.mjs"
echo ""
echo "To uninstall:"
echo "  launchctl unload $PLIST_PATH && rm $PLIST_PATH"
