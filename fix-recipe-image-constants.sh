#!/usr/bin/env bash
set -euo pipefail

FILE="src/data/recipes.ts"

if [[ ! -f "$FILE" ]]; then
  echo "❌ Not found: $FILE"
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP=".backup-fix-image-constants-$STAMP"
mkdir -p "$BACKUP"
cp "$FILE" "$BACKUP/recipes.ts"

echo "📦 Backed up $FILE -> $BACKUP/recipes.ts"

awk '
BEGIN {
  # Map constant name -> filename
  map["chickenSoupImg"]        = "static-1762110012058-chicken-soup.webp"
  map["cookiesImg"]            = "static-1762110012745-cookies.webp"
  map["carrotJuiceImg"]        = "static-1762110012990-carrot-juice.webp"
  map["lentilSoupImg"]         = "static-1762110013195-lentil-soup.webp"
  map["applePieImg"]           = "static-1762110013449-apple-pie.webp"
  map["gardenSaladImg"]        = "static-1762110013670-garden-salad.webp"
  map["roastBeefDinnerImg"]    = "static-1762110013907-roast-beef-dinner.webp"
  map["legOfLambImg"]          = "static-1762110014147-leg-of-lamb.webp"
  map["roastPorkImg"]          = "static-1762110014437-roast-pork.webp"
  map["roastChickenImg"]       = "static-1762110014708-roast-chicken.webp"
}

{
  # Fix broken lines like:
  # const chickenSoupImg = `${STORAGE_BASE}/;`;
  if ($0 ~ /^const[[:space:]]+[A-Za-z0-9_]+[[:space:]]*=[[:space:]]*`\\$\\{STORAGE_BASE\\}\\/;`;/) {
    # Extract var name (2nd token)
    var = $2
    if (var in map) {
      # Replace "/;`;" with "/<filename>`;"
      sub(/\/;`;/, "/" map[var] "`;")
    }
  }

  print $0
}
' "$FILE" > "$FILE.tmp" && mv "$FILE.tmp" "$FILE"

echo "✅ Fixed image constants in $FILE"
echo "📦 Backup stored at: $BACKUP/recipes.ts"

