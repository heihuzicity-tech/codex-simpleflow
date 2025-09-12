#!/usr/bin/env bash
set -euo pipefail

root="${1:-.}"
exclude_dirs=(".git" "node_modules" ".pnpm-store" ".venv" ".python" "dist" "build")

prune_expr=()
for d in "${exclude_dirs[@]}"; do prune_expr+=( -path "$root/$d" -prune -o ); done

mapfile -t found < <(eval find "$root" \( "${prune_expr[@]}" . \) -type f \( -name "*.ps1" -o -name "*.bat" \) -print)

if [[ ${#found[@]} -gt 0 ]]; then
  echo "win-script-guard: forbidden files detected:" >&2
  for f in "${found[@]}"; do echo "  $f" >&2; done
  exit 2
fi

echo "win-script-guard: OK"
