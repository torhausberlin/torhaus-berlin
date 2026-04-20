#!/bin/bash
set -e

# Ensure correct Node and pnpm in non-interactive shells
export NVM_DIR="$HOME/.nvm"
# Load nvm if it exists
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
  nvm use 22
fi

# Ensure pnpm is on PATH for non-interactive shells
export PATH="$HOME/.local/share/pnpm:$PATH"

echo "=== Deploying torhaus-berlin ==="

# Adjust these paths/names to match your VPS layout
APP_DIR="/home/web/torhaus-berlin"        # directory where this repo lives on the server
PM2_NAME="torhaus-berlin"                   # PM2 process name
BRANCH="main"                         # git branch to deploy

echo "App directory: $APP_DIR"
echo "PM2 process:  $PM2_NAME"
echo "Branch:       $BRANCH"
echo

cd "$APP_DIR"

echo "-> Updating git repo..."
git fetch origin
git reset --hard "origin/$BRANCH"

echo "-> Installing dependencies..."
pnpm install --frozen-lockfile

echo "-> Building Next.js app..."
pnpm build

echo "-> Starting / restarting PM2 process (next start uses port 4000 per package.json)..."

# Try to restart, if it fails start a new process
if pm2 restart "$PM2_NAME" --update-env; then
  echo "PM2: restarted existing $PM2_NAME"
else
  echo "PM2: process not found, starting new one"
  pm2 start "pnpm start" --name "$PM2_NAME" --update-env
fi

pm2 save

echo
echo "✅ Deploy complete. App should now be running on port 4000."

