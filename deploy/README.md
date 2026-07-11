# 배포 (Synology NAS)

프로덕션은 Synology NAS의 `/volume1/docker/thelaim-web`에서 구동된다 (이 저장소의 클론).

## 배포 절차

```sh
ssh abcd   # ~/.ssh/config 참조
cd /volume1/docker/thelaim-web
git pull
sudo /usr/local/bin/docker compose build
sudo /usr/local/bin/docker compose up -d
```

상품/카테고리 **스키마**(컬럼)가 바뀐 경우는 `backend/MIGRATIONS.md` 참고.
시드 **데이터**만 바뀐 경우는 backend 재시작만으로 동기화된다.

## 워치독

`watchdog.sh`는 NAS에서 `thelaim-watchdog` 컨테이너(restart=always)로 상시 실행된다.
5분마다 nginx(:8087)를 확인하고, 응답이 없으면 스택 컨테이너를 `docker start`한다.
로그: `/volume1/docker/thelaim-web/watchdog.log`

최초 설치(또는 재설치):

```sh
sudo /usr/local/bin/docker run -d --name thelaim-watchdog --restart=always --network=host \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /volume1/docker/thelaim-web:/watchdog \
  docker:cli sh /watchdog/watchdog.sh
```

## 외부 트래픽 경로

Cloudflare(프록시) → NAS nginx(:8087) → frontend(:3000) / backend(:8000, `/api/`)
