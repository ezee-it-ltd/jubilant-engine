#!/usr/bin/env bash
set -euo pipefail

OLD_PROJECT="xipgwsckilciddoqrfsj"
SEARCH_PATTERN="https://${OLD_PROJECT}\.supabase\.co/storage"
BACKUP_DIR=".backup-image-removal-$(date +%Y%m%d-%H%M%S)"

echo "🔍 Searching for old Supabase storage URLs..."
echo "   Project: $OLD_PROJECT"
echo

mkdir -p "$BACKUP_DIR"

# Find files containing the old storage URL
FILES=$(rg -l "$SEARCH_PATTERN" . || true)

if [[ -z "$FILES" ]]; then
  echo "✅ No old storage URLs found. Nothing to do."
  exit 0
fi

echo "📁 Backing up affected files to: $BACKUP_DIR"
echo

for file in $FILES; do
  echo "🧹 Processing: $file"

  # Backup
  mkdir -p "$BACKUP_DIR/$(dirname "$file")"
  cp "$file" "$BACKUP_DIR/$file"

  # Comment out lines containing the old URL
  awk -v pattern="$SEARCH_PATTERN" '
    {
      if ($0 ~ pattern) {
        print "// TODO: removed hard-coded image URL (old Supabase project)";
        print "// " $0;
      } else {
        print $0;
      }
    }
  ' "$file" > "$file.tmp"

  mv "$file.tmp" "$file"
done

echo
echo "✅ Cleanup complete."
echo "📦 Backups stored in: $BACKUP_DIR"
echo "🔎 Review changes before committing."

