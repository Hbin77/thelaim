#!/bin/sh
# thelaim-watchdog 컨테이너 안에서 실행되는 루프.
# 5분마다 nginx(8087) 확인, 죽어 있으면 스택 컨테이너를 docker start.
LOG=/watchdog/watchdog.log
while true; do
  code=$(wget -q -T 10 -O /dev/null -S "http://localhost:8087/" 2>&1 | awk "/HTTP\//{print \$2; exit}")
  case "$code" in
    2*|3*) : ;;
    *)
      echo "$(date "+%Y-%m-%d %H:%M:%S") unhealthy (http=${code:-none}) — docker start" >> "$LOG"
      docker start thelaim-web-db-1 thelaim-web-backend-1 thelaim-web-frontend-1 thelaim-web-nginx-1 >> "$LOG" 2>&1
      ;;
  esac
  if [ -f "$LOG" ] && [ "$(wc -l < "$LOG")" -gt 1000 ]; then
    tail -n 500 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
  fi
  sleep 300
done
