#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"

cd "$ROOT_DIR"

echo "=== 1. Railway auth check ==="
if ! railway whoami &>/dev/null; then
  echo "Error: Not logged in to Railway. Run 'railway login' first."
  exit 1
fi

echo "=== 2. Build ==="
npm run build

echo "=== 3. Sync .env to Railway ==="
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Warning: .env not found. Skipping env sync."
else
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%%#*}"
    line="$(echo "$line" | xargs)"
    [[ -z "$line" ]] && continue
    if [[ "$line" == *=* ]]; then
      key="${line%%=*}"
      key="$(echo "$key" | xargs)"
      value="${line#*=}"
      value="$(echo "$value" | xargs)"
      value="${value%\"}"
      value="${value#\"}"
      value="${value%\'}"
      value="${value#\'}"
      [[ -n "$key" ]] && railway variable set --skip-deploys "${key}=${value}"
    fi
  done < "$ENV_FILE"
  echo "Env vars synced."
fi

echo "=== 4. Run migrations ==="
if ! railway run npm run migration:run; then
  echo "Error: Migration failed. Deploy aborted."
  exit 1
fi

echo "=== 5. Deploy ==="
railway up

echo "=== 6. Run seeds (if any) ==="
if [[ -d "$ROOT_DIR/src/database/seeds" ]]; then
  if grep -q '"seed"' package.json 2>/dev/null; then
    railway run npm run seed
    echo "Seeds completed."
  else
    echo "Seeds dir exists but no 'seed' script in package.json. Skip."
  fi
else
  echo "No seeds directory. Skip."
fi

echo "=== Deploy finished ==="
