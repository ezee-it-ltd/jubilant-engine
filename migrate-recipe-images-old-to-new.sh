#!/usr/bin/env bash
set -euo pipefail

OLD_SUPABASE_URL="https://xipgwsckilciddoqrfsj.supabase.co"
NEW_SUPABASE_URL="${NEW_SUPABASE_URL:-https://iyrvuapyntydvtsgiofa.supabase.co}"
NEW_SERVICE_ROLE_KEY="${NEW_SERVICE_ROLE_KEY:-}"
BUCKET="recipe-images"

FILES=(
  "static-1762110012058-chicken-soup.webp"
  "static-1762110012745-cookies.webp"
  "static-1762110012990-carrot-juice.webp"
  "static-1762110013195-lentil-soup.webp"
  "static-1762110013449-apple-pie.webp"
  "static-1762110013670-garden-salad.webp"
  "static-1762110013907-roast-beef-dinner.webp"
  "static-1762110014147-leg-of-lamb.webp"
  "static-1762110014437-roast-pork.webp"
  "static-1762110014708-roast-chicken.webp"
)

if [[ -z "$NEW_SERVICE_ROLE_KEY" ]]; then
  echo "❌ NEW_SERVICE_ROLE_KEY is not set."
  echo "   Put it in .env.secrets.local like:"
  echo "   NEW_SERVICE_ROLE_KEY=eyJhbGciOi..."
  exit 1
fi

TMP_DIR=".tmp-recipe-images-migrate-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$TMP_DIR"

echo "🔁 Migrating ${#FILES[@]} images"
echo "   OLD: $OLD_SUPABASE_URL"
echo "   NEW: $NEW_SUPABASE_URL"
echo "   BUCKET: $BUCKET"
echo "   TMP: $TMP_DIR"
echo

fail_count=0

for f in "${FILES[@]}"; do
  src="${OLD_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${f}"
  upload="${NEW_SUPABASE_URL}/storage/v1/object/${BUCKET}/${f}"
  pub="${NEW_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${f}"

  echo "➡️  $f"
  echo "   ⬇️  download: $src"
  curl -fLsS "$src" -o "${TMP_DIR}/${f}"

  echo "   ⬆️  upload:   $upload"
  curl -fLsS -X PUT "$upload" \
    -H "Authorization: Bearer ${NEW_SERVICE_ROLE_KEY}" \
    -H "apikey: ${NEW_SERVICE_ROLE_KEY}" \
    -H "x-upsert: true" \
    -H "content-type: image/webp" \
    --data-binary @"${TMP_DIR}/${f}" >/dev/null

  echo "   🔎 verify:   $pub"
  if curl -fsSI "$pub" >/dev/null; then
    echo "   ✅ OK"
  else
    echo "   ❌ VERIFY FAILED"
    fail_count=$((fail_count+1))
  fi
  echo
done

echo "🎉 Migration complete."
if [[ "$fail_count" -gt 0 ]]; then
  echo "⚠️  $fail_count file(s) failed verification."
  exit 2
fi

echo "✅ All files verified public."
echo "Example:"
echo "${NEW_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${FILES[0]}"
#!/usr/bin/env bash
set -euo pipefail

OLD_SUPABASE_URL="https://xipgwsckilciddoqrfsj.supabase.co"
NEW_SUPABASE_URL="https://iyrvuapyntydvtsgiofa.supabase.co"
BUCKET="recipe-images"

: "${NEW_SERVICE_ROLE_KEY:?NEW_SERVICE_ROLE_KEY is not set. Export it first.}"

FILES=(
  "static-1762110012058-chicken-soup.webp"
  "static-1762110012745-cookies.webp"
  "static-1762110012990-carrot-juice.webp"
  "static-1762110013195-lentil-soup.webp"
  "static-1762110013449-apple-pie.webp"
  "static-1762110013670-garden-salad.webp"
  "static-1762110013907-roast-beef-dinner.webp"
  "static-1762110014147-leg-of-lamb.webp"
  "static-1762110014437-roast-pork.webp"
  "static-1762110014708-roast-chicken.webp"
)

TMP_DIR=".tmp-recipe-images-migrate-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$TMP_DIR"

echo "🔁 Migrating ${#FILES[@]} images"
echo "   OLD: $OLD_SUPABASE_URL"
echo "   NEW: $NEW_SUPABASE_URL"
echo "   BUCKET: $BUCKET"
echo "   TMP: $TMP_DIR"
echo

for f in "${FILES[@]}"; do
  src="${OLD_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${f}"
  dst="${NEW_SUPABASE_URL}/storage/v1/object/${BUCKET}/${f}"

  echo "➡️  $f"
  echo "   ⬇️  download: $src"
  curl -fLsS "$src" -o "${TMP_DIR}/${f}"

  echo "   ⬆️  upload:   $dst"
  curl -fLsS -X PUT "$dst" \
    -H "Authorization: Bearer ${NEW_SERVICE_ROLE_KEY}" \
    -H "apikey: ${NEW_SERVICE_ROLE_KEY}" \
    -H "x-upsert: true" \
    -H "content-type: image/webp" \
    --data-binary @"${TMP_DIR}/${f}" >/dev/null

  echo "   ✅ done"
  echo
done

echo "🎉 Migration complete."
echo "Test a URL:"
echo "${NEW_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${FILES[0]}"
