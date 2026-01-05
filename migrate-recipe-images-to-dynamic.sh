#!/usr/bin/env bash
set -euo pipefail

FILE="src/data/recipes.ts"
BACKUP_DIR=".backup-dynamic-images-$(date +%Y%m%d-%H%M%S)"

if [[ ! -f "$FILE" ]]; then
  echo "❌ Can't find $FILE (run from repo root)."
  exit 1
fi

mkdir -p "$BACKUP_DIR"
cp "$FILE" "$BACKUP_DIR/recipes.ts"

echo "📦 Backed up $FILE -> $BACKUP_DIR/recipes.ts"

# 1) Extract filenames from commented-out old URLs, e.g.
# // const chickenSoupImg = "https://.../static-...-chicken-soup.webp";
#
# We grab the final path segment ending in .webp/.png/.jpg/.jpeg
FILENAMES=$(rg -n --no-filename '^\s*//\s*const\s+\w+\s*=\s*".*xipgwsckilciddoqrfsj\.supabase\.co.*\.(webp|png|jpg|jpeg)"\s*;?\s*$' "$FILE" \
  | sed -E 's/.*"(.*)".*/\1/' \
  | sed -E 's|.*/||' \
  | sort -u)

if [[ -z "${FILENAMES:-}" ]]; then
  echo "❌ No commented-out old image constants found in $FILE."
  echo "   (Did you run the first script already? Are the lines still present?)"
  exit 1
fi

echo "🔍 Found image filenames:"
echo "$FILENAMES" | sed 's/^/ - /'
echo

# 2) Build replacement block
TMP_BLOCK="$(mktemp)"
{
  echo ""
  echo "// -----------------------------"
  echo "// Dynamic recipe image base URL"
  echo "// -----------------------------"
  echo "const STORAGE_BASE = \`\${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/recipe-images\`;"
  echo ""
} > "$TMP_BLOCK"

# 3) Replace any commented-out image constants with dynamic ones
# We will:
# - remove the TODO + commented lines that were created by your cleanup
# - reinsert new constants using STORAGE_BASE and the extracted filename mapping
#
# Mapping rule:
#   keep the original constant name (e.g. chickenSoupImg) but use the filename.
#
# To do this, we re-scan the file for the commented-out const lines, and for each,
# extract the variable name + filename, then output a new const line.

awk -v oldproj="xipgwsckilciddoqrfsj" -v blockfile="$TMP_BLOCK" '
BEGIN { inserted_block = 0 }

function maybe_insert_block() {
  if (inserted_block == 0) {
    while ((getline line < blockfile) > 0) print line
    close(blockfile)
    inserted_block = 1
  }
}

{
  # Skip the TODO marker we added before
  if ($0 ~ /^\/\/ TODO: removed hard-coded image URL \(old Supabase project\)/) next

  # Replace commented-out old const lines pointing at the old project
  if ($0 ~ /^[[:space:]]*\/\/[[:space:]]*const[[:space:]]+[A-Za-z0-9_]+[[:space:]]*=[[:space:]]*".*xipgwsckilciddoqrfsj\.supabase\.co\/storage\/v1\/object\/public\/recipe-images\/.*\.(webp|png|jpg|jpeg)"/) {
    maybe_insert_block()

    line = $0

    # Extract var name: from "const NAME =" (strip everything else)
    varname = line
    sub(/^[[:space:]]*\/\/[[:space:]]*const[[:space:]]+/, "", varname)
    sub(/[[:space:]]*=.*$/, "", varname)

    # Extract URL inside quotes
    url = line
    sub(/^.*"/, "", url)
    sub(/".*$/, "", url)

    # Extract filename as last path segment
    filename = url
    sub(/^.*\//, "", filename)

    print "const " varname " = `${STORAGE_BASE}/" filename "`;"
    next
  }

  print $0
}
' "$FILE" > "$FILE.tmp"

mv "$FILE.tmp" "$FILE"
rm -f "$TMP_BLOCK"

echo "✅ Updated $FILE with dynamic image base + regenerated constants."
echo "📦 Backup stored at: $BACKUP_DIR/recipes.ts"
echo
echo "Next: run your build to confirm:"
echo "  npm run build"

