#!/usr/bin/env bash
set -euo pipefail

utc_ts() { date -u +"%Y-%m-%dT%H%M%SZ"; }

latest_session() {
  local slug="$1" base=".specs/features/$slug/sessions"
  [[ -d "$base" ]] || return 1
  ls -1 "$base" 2>/dev/null | sort | tail -n1
}

resolve_session_dir() {
  local slug="$1" sid="${2:-}" base=".specs/features/$slug/sessions"
  if [[ -n "${sid:-}" && -d "$base/$sid" ]]; then
    mkdir -p "$base/$sid"
    printf '%s' "$base/$sid"
  else
    mkdir -p "$base/_pending"
    printf '%s' "$base/_pending"
  fi
}

# Read active slug from .specs/project.yml -> flow.current.feature (best-effort, no PyYAML)
read_current_slug() {
  local yml=".specs/project.yml"; [[ -f "$yml" ]] || return 0
  awk '
    BEGIN{in=0}
    /^[ \t]*#/ {next}
    /^[^ \t]/ { sect=$1; }
    /[\s]*current:/ { in=1; next }
    in && /[\s]*feature:/ {
      sub(/.*feature:[ \t]*/,"",$0); gsub(/[\r\n]/,"",$0); gsub(/"/,"",$0); print $0; exit
    }
  ' "$yml" | tr -d '\r' | sed 's/^null$//; s/^[ \t]*//; s/[ \t]*$//'
}

# Try to find a port from runtime state (first port if unspecified)
read_runtime_port() {
  local slug_filter="${1:-}" json=".specs/runtime/serve.json"; [[ -f "$json" ]] || return 0
  # If there is a single numeric port, use the first one
  local p
  if [[ -n "$slug_filter" ]]; then
    # naive proximity search: take the first port near the slug mention
    p=$(awk -v s="$slug_filter" '
      BEGIN{port=""}
      index($0,s){ seen=NR }
      /"port"[ \t]*:/ && (seen>0) && (NR-seen<10) {
        sub(/.*"port"[ \t]*:[ \t]*/,"",$0); sub(/[^0-9].*$/,"",$0); print $0; exit
      }
    ' "$json" | head -n1)
  fi
  if [[ -z "${p:-}" ]]; then
    p=$(sed -n 's/.*"port"[[:space:]]*:[[:space:]]*\([0-9][0-9]*\).*/\1/p' "$json" | head -n1)
  fi
  [[ -n "${p:-}" ]] && printf '%s' "$p"
}

port_listen() {
  local port="$1"
  if command -v ss >/dev/null 2>&1; then
    ss -ltn "( sport = :$port )" 2>/dev/null | grep -q ":$port" && return 0 || return 1
  elif command -v lsof >/dev/null 2>&1; then
    lsof -iTCP -sTCP:LISTEN -n -P 2>/dev/null | grep -q ":$port " && return 0 || return 1
  elif command -v netstat >/dev/null 2>&1; then
    netstat -tuln 2>/dev/null | grep -q ":$port " && return 0 || return 1
  else
    return 1
  fi
}

http_status() {
  local url="$1"
  if command -v curl >/dev/null 2>&1; then
    curl -s -o /dev/null -w "%{http_code}" "$url" || true
  else
    echo -1
  fi
}

smoke() {
  local slug="$1" port="$2" sid session_dir ts build_rc=1
  sid="$(latest_session "$slug" 2>/dev/null || true)"
  session_dir="$(resolve_session_dir "$slug" "$sid")"
  ts="$(utc_ts)"
  if [[ -d app ]]; then
    npm --prefix app install --no-fund --no-audit >"$session_dir/smoke-install-$ts.log" 2>&1 || true
    if npm --prefix app run build --silent >"$session_dir/smoke-build-$ts.log" 2>&1; then build_rc=0; else build_rc=$?; fi
  else
    echo "app directory missing" >"$session_dir/smoke-build-$ts.log"
  fi
  local pv status
  if port_listen "$port"; then
    status="$(http_status "http://localhost:$port/")"
    if [[ "$status" == "200" ]]; then pv="OK"; else pv="HTTP=$status"; fi
  else
    pv="NO_LISTEN"
  fi
  printf 'build=%s preview=%s session_dir=%s\n' "$([[ $build_rc -eq 0 ]] && echo SUCCESS || echo FAILED)" "$pv" "$session_dir"
}

serve_status() {
  local port="$1"
  if port_listen "$port"; then echo "port=$port status=LISTEN"; else echo "port=$port status=CLOSED"; fi
}

serve_stop() {
  local port="$1" killed=0
  if command -v lsof >/dev/null 2>&1; then
    mapfile -t pids < <(lsof -ti ":$port" 2>/dev/null || true)
    if [[ ${#pids[@]} -gt 0 ]]; then
      kill -9 "${pids[@]}" 2>/dev/null || true
      killed=${#pids[@]}
    fi
  elif command -v fuser >/dev/null 2>&1; then
    fuser -k "${port}/tcp" 2>/dev/null || true
    killed=1
  fi
  sleep 0.3
  if port_listen "$port"; then echo "stop=FAIL port=$port killed=$killed status=LISTEN"; else echo "stop=OK port=$port killed=$killed status=CLOSED"; fi
}

usage() {
  echo "usage: quiet.sh <smoke|serve-status|serve-stop|task-state> [--slug <slug>] [--port <port>] [task-state options]" >&2
}

cmd="${1:-}"; shift || true
slug=""; port=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --slug) slug="$2"; shift 2;;
    --port) port="$2"; shift 2;;
    *) break;;
  esac
done

if [[ -z "${slug:-}" ]]; then
  slug="$(read_current_slug || true)"
fi
if [[ -z "${slug:-}" ]]; then slug="unknown"; fi

if [[ -z "${port:-}" ]]; then
  port="$(read_runtime_port "$slug" || true)"
fi
if [[ -z "${port:-}" ]]; then port=4173; fi

task_state() {
  local stage="" task=""
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --stage) stage="$2"; shift 2;;
      --task) task="$2"; shift 2;;
      *) echo "task-state 不支持的参数: $1" >&2; usage; exit 1;;
    esac
  done
  if [[ -z "$stage" ]]; then
    echo "task-state 需要 --stage 参数 (start|await|complete)" >&2
    exit 1
  fi
  local args=("--stage" "$stage")
  if [[ -n "$task" ]]; then
    args+=("--task" "$task")
  fi
  python3 .codex/flow/tools/cc_next_state.py "${args[@]}"
}

case "$cmd" in
  smoke)        smoke "$slug" "$port" ;;
  serve-status) serve_status "$port" ;;
  serve-stop)   serve_stop "$port" ;;
  task-state)   task_state "$@" ;;
  *) usage; exit 1;;
esac
