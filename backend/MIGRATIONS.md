# DB 스키마 변경 정책

현재 이 프로젝트는 **alembic 마이그레이션을 사용하지 않는다.**

- 테이블 생성: 앱 시작 시 `SQLModel.metadata.create_all()` (`app/main.py` lifespan)
- 상품/카테고리 데이터: 앱 시작 시 `app/seed/{categories,products}.json`과 DB를 동기화
  (slug 기준 upsert + 시드에서 빠진 행 제거). 시드 JSON을 수정하고 재시작하면 반영된다.
- `contact_inquiry` 테이블은 실사용 데이터이므로 시더가 건드리지 않는다.

## 컬럼 추가/변경이 필요할 때

`create_all()`은 기존 테이블에 컬럼을 추가하지 못한다. 선택지:

1. **product / category 테이블**: 데이터 원본이 시드 JSON이므로 프로덕션에서 테이블을
   드롭 후 재시작하면 새 스키마로 재생성 + 재시드된다.
   ```
   docker compose exec db psql -U thelaim -d thelaim -c 'DROP TABLE product; DROP TABLE category;'
   docker compose restart backend
   ```
2. **contact_inquiry 테이블**: 실데이터가 있으므로 드롭 금지. 수동 `ALTER TABLE` 또는
   그 시점에 alembic을 정식 도입할 것 (`alembic/` 골격은 준비되어 있음).

## 참고

- 2026-07-11: name_ja/description_ja 컬럼 추가 + 카테고리 체계 개편(dress/long-pants/
  shorts/top/set)을 위해 프로덕션 product/category 테이블을 위 방법 1로 재생성함.
