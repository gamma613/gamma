#!/usr/bin/env bash
set -euo pipefail

mode="${1:-}"
action="${2:-}"
local_media="developer-assets/media"
remote_media="gamma-media:gamma-media"

if [[ "$mode" != "push" && "$mode" != "pull" ]] || [[ $# -gt 2 ]]; then
  echo "Usage: bash scripts/sync-media.sh <push|pull> [--execute]" >&2
  exit 2
fi

if [[ "$action" != "" && "$action" != "--execute" ]]; then
  echo "Usage: bash scripts/sync-media.sh <push|pull> [--execute]" >&2
  exit 2
fi

if ! command -v rclone >/dev/null 2>&1; then
  echo "rclone is required but was not found in PATH" >&2
  exit 1
fi

if [[ "$mode" == "push" ]]; then
  source="$local_media"
  destination="$remote_media"
else
  source="$remote_media"
  destination="$local_media"
fi

report_file="$(mktemp)"
candidate_file="$(mktemp)"
selection_file="$(mktemp)"
trap 'rm -f "$report_file" "$candidate_file" "$selection_file"' EXIT

copy_options=(
  --checksum
  --s3-no-check-bucket
)

media_filters=(
  --include "*.mp3"
  --include "*.mp4"
  --include "*.m4a"
  --include "*.flac"
  --include "*.wav"
)

echo "Checking media ($mode): $source -> $destination"
rclone copy "$source" "$destination" \
  "${copy_options[@]}" \
  "${media_filters[@]}" \
  --combined "$report_file" \
  --dry-run

while IFS= read -r report_line; do
  marker="${report_line:0:1}"
  if [[ "$marker" == "+" || "$marker" == "*" ]]; then
    printf '%s\n' "${report_line:2}" >> "$candidate_file"
  fi
done < "$report_file"

candidate_count="$(wc -l < "$candidate_file" | tr -d '[:space:]')"
if [[ "$candidate_count" == "0" ]]; then
  echo "No media files need transferring in this direction; the source has no supported media or all matching files are already identical."
  exit 0
fi

echo "Transfer candidates ($candidate_count):"
number=0
while IFS= read -r candidate; do
  number=$((number + 1))
  printf '  %d) %s\n' "$number" "$candidate"
done < "$candidate_file"

if [[ "$action" != "--execute" ]]; then
  echo "Preview only. Rerun with --execute to choose all candidates or one candidate."
  exit 0
fi

printf '\nChoose [a]ll, a candidate number, or [q]uit: '
read -r choice
case "$choice" in
  a|A)
    cp "$candidate_file" "$selection_file"
    selected_count="$candidate_count"
    ;;
  q|Q)
    echo "No files transferred."
    exit 0
    ;;
  *)
    if [[ ! "$choice" =~ ^[0-9]+$ ]] || (( choice < 1 || choice > candidate_count )); then
      echo "Invalid selection. No files transferred." >&2
      exit 2
    fi
    awk -v selected="$choice" 'NR == selected { print; exit }' "$candidate_file" > "$selection_file"
    selected_count=1
    ;;
esac

echo "Transferring $selected_count media file(s) ($mode)."
rclone copy "$source" "$destination" \
  "${copy_options[@]}" \
  --files-from-raw "$selection_file" \
  --progress
