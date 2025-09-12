#!/usr/bin/env bash
set -euo pipefail

utc_ts() { date -u +"%Y-%m-%dT%H%M%SZ"; }

latest_session() {
  local slug="$1" base=".specs/features/$slug/sessions"
  [[ -d "$base" ]] || return 1
  ls -1 "$base" 2>/dev/null | sort | tail -n1
}

ensure_reports_dir() {
  local slug="$1" sid="${2:-}" dir
  if [[ -n "${sid:-}" && -d ".specs/features/$slug/sessions/$sid" ]]; then
      dir=".specs/features/$slug/sessions/$sid/reports"
  else
      dir=".specs/features/$slug/reports"
  fi
  mkdir -p "$dir"
  printf '%s' "$dir"
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
  local slug="$1" port="$2" sid reports ts build_rc=1
  sid="$(latest_session "$slug" 2>/dev/null || true)"
  reports="$(ensure_reports_dir "$slug" "$sid")"
  ts="$(utc_ts)"
  if [[ -d app ]]; then
    npm --prefix app install --no-fund --no-audit >"$reports/smoke-install-$ts.log" 2>&1 || true
    if npm --prefix app run build --silent >"$reports/smoke-build-$ts.log" 2>&1; then build_rc=0; else build_rc=$?; fi
  else
    echo "app directory missing" >"$reports/smoke-build-$ts.log"
  fi
  local pv status
  if port_listen "$port"; then
    status="$(http_status "http://localhost:$port/")"
    if [[ "$status" == "200" ]]; then pv="OK"; else pv="HTTP=$status"; fi
  else
    pv="NO_LISTEN"
  fi
  printf 'build=%s preview=%s reports=%s\n' "$([[ $build_rc -eq 0 ]] && echo SUCCESS || echo FAILED)" "$pv" "$reports"
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
  echo "usage: quiet.sh <smoke|serve-status|serve-stop> [--slug <slug>] [--port <port>]" >&2
}

cmd="${1:-}"; shift || true
slug="simple-login"; port=4173
while [[ $# -gt 0 ]]; do
  case "$1" in
    --slug) slug="$2"; shift 2;;
    --port) port="$2"; shift 2;;
    *) break;;
  esac
done

case "$cmd" in
  smoke)        smoke "$slug" "$port" ;;
  serve-status) serve_status "$port" ;;
  serve-stop)   serve_stop "$port" ;;
  *) usage; exit 1;;
esac

