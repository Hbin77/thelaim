import json
import os
from datetime import datetime, timezone
from pathlib import Path

import pytest
from sqlalchemy import Column, MetaData, Table, create_engine, inspect, text
from sqlmodel import Session, SQLModel, select

from app.models.category import Category
from app.models.product import Product

SEED_DIR = Path(__file__).resolve().parents[1] / "app" / "seed"
SEED_PRODUCTS = json.loads((SEED_DIR / "products.json").read_text(encoding="utf-8"))
SEED_CATEGORIES = json.loads((SEED_DIR / "categories.json").read_text(encoding="utf-8"))
FRONTEND = Path(__file__).resolve().parents[2] / "frontend"
LOCALES = ["ko", "en", "zh", "ja"]


def test_health(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_products_empty(client):
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0


def test_list_products(client, sample_product):
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert len(data["items"]) == 1
    assert data["items"][0]["slug"] == "test-jacket"
    assert data["items"][0]["name"] == "테스트 자켓"


def test_list_products_english(client, sample_product):
    response = client.get("/api/v1/products?lang=en")
    assert response.status_code == 200
    data = response.json()
    assert data["items"][0]["name"] == "Test Jacket"
    assert data["items"][0]["description"] == "A test jacket"


def test_list_products_chinese(client, sample_product):
    response = client.get("/api/v1/products?lang=zh")
    assert response.status_code == 200
    data = response.json()
    assert data["items"][0]["name"] == "测试夹克"


def test_list_products_filter_by_category(client, sample_product):
    response = client.get("/api/v1/products?category=winter")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1

    response = client.get("/api/v1/products?category=summer")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0


def test_featured_products(client, sample_product):
    response = client.get("/api/v1/products/featured")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["is_featured"] is True


def test_get_product_by_slug(client, sample_product):
    response = client.get("/api/v1/products/test-jacket")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "test-jacket"
    assert data["image_urls"] == ["/images/test1.jpg", "/images/test2.jpg"]
    assert data["specifications"]["material"] == "cotton"


def test_get_product_not_found(client):
    response = client.get("/api/v1/products/nonexistent")
    assert response.status_code == 404


def test_list_categories(client, sample_category):
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["slug"] == "winter"
    assert data[0]["name"] == "겨울의류"


def test_list_categories_english(client, sample_category):
    response = client.get("/api/v1/categories?lang=en")
    assert response.status_code == 200
    data = response.json()
    assert data[0]["name"] == "Winter Clothing"


def test_pagination(client, session, sample_category):
    for i in range(5):
        product = Product(
            slug=f"product-{i}",
            name_ko=f"제품 {i}",
            name_en=f"Product {i}",
            name_zh=f"产品 {i}",
            category_id=sample_category.id,
        )
        session.add(product)
    session.commit()

    response = client.get("/api/v1/products?page=1&limit=2")
    data = response.json()
    assert data["total"] == 5
    assert len(data["items"]) == 2
    assert data["page"] == 1
    assert data["limit"] == 2

    response = client.get("/api/v1/products?page=3&limit=2")
    data = response.json()
    assert len(data["items"]) == 1


def test_list_products_japanese_fallback(client, sample_product):
    # ja 값이 비어 있으면 ko로 폴백
    response = client.get("/api/v1/products?lang=ja")
    assert response.status_code == 200
    data = response.json()
    assert data["items"][0]["name"] == "테스트 자켓"


def test_seeder_sync_idempotent(session):
    from app.seed.seed_data import run_seeder
    from sqlmodel import select

    run_seeder(session)
    products = session.exec(select(Product)).all()
    categories = session.exec(select(Category)).all()
    assert len(products) == len(SEED_PRODUCTS)
    assert len(categories) == 5
    assert {c.slug for c in categories} == {"dress", "long-pants", "shorts", "top", "set"}

    # 재실행해도 중복 생성 없음
    run_seeder(session)
    assert len(session.exec(select(Product)).all()) == len(SEED_PRODUCTS)

    # 시드 수정 반영: 이름 바꿔놓고 다시 sync하면 원복
    gingham = session.exec(select(Product).where(Product.slug == "check-gingham-pants")).one()
    assert gingham.name_ko == "면체크 와이드"
    assert gingham.name_ja != ""
    gingham.name_ko = "임시 이름"
    session.commit()
    run_seeder(session)
    session.refresh(gingham)
    assert gingham.name_ko == "면체크 와이드"

    # 구 데이터(시드에 없는 slug)는 제거됨
    session.add(Product(slug="stale-product", name_ko="구버전", name_en="Stale", name_zh="旧"))
    session.commit()
    run_seeder(session)
    stale = session.exec(select(Product).where(Product.slug == "stale-product")).first()
    assert stale is None


def test_seeder_prunes_stale_category_with_stale_products(session):
    # 구 카테고리 + 구 상품이 있어도 한 번의 sync 사이클에 모두 정리되어야 한다
    from app.seed.seed_data import run_seeder
    from sqlmodel import select

    old_cat = Category(slug="winter", name_ko="겨울의류", name_en="Winter", name_zh="冬季")
    session.add(old_cat)
    session.commit()
    session.add(Product(slug="old-coat", name_ko="구코트", name_en="Old Coat", name_zh="旧大衣", category_id=old_cat.id))
    session.commit()

    run_seeder(session)

    assert session.exec(select(Product).where(Product.slug == "old-coat")).first() is None
    assert session.exec(select(Category).where(Category.slug == "winter")).first() is None
    assert len(session.exec(select(Category)).all()) == 5


def test_products_follow_seed_order(client, session):
    # products.json 순서 = API(화면) 순서
    from app.seed.seed_data import run_seeder

    run_seeder(session)
    items = client.get("/api/v1/products?limit=100").json()["items"]
    assert [p["slug"] for p in items] == [p["slug"] for p in SEED_PRODUCTS]

    featured = client.get("/api/v1/products/featured").json()
    assert [p["slug"] for p in featured] == [p["slug"] for p in SEED_PRODUCTS if p["is_featured"]]


def test_list_orders_by_sort_order_then_id(client, session, sample_category):
    # 순서값이 같으면 먼저 들어온 행(id)이 앞
    for slug, order in [("c", 2), ("a", 0), ("b2", 1), ("b1", 1)]:
        session.add(Product(slug=slug, name_ko=slug, name_en=slug, name_zh=slug, sort_order=order, category_id=sample_category.id))
        session.commit()
    items = client.get("/api/v1/products").json()["items"]
    assert [p["slug"] for p in items] == ["a", "b2", "b1", "c"]


@pytest.fixture(params=["sqlite", "postgresql"])
def blank_engine(request, tmp_path):
    # 빈 DB. postgresql은 TEST_POSTGRES_URL(버려도 되는 DB)이 있을 때만 — 프로덕션과 같은 경로 확인용
    if request.param == "sqlite":
        engine = create_engine(f"sqlite:///{tmp_path / 'old.db'}")
    else:
        url = os.environ.get("TEST_POSTGRES_URL")
        if not url:
            pytest.skip("TEST_POSTGRES_URL 없음")
        engine = create_engine(url)
    SQLModel.metadata.drop_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)
    engine.dispose()


def test_startup_upgrades_pre_sort_order_database(blank_engine, monkeypatch):
    # sort_order가 없던 기존 DB(지금 프로덕션 모양)에서 시작해도 컬럼이 보충되고, 시드 순서대로 나온다
    from app import database
    from app.seed.seed_data import run_seeder

    old = Table(
        "product",
        MetaData(),
        *[
            Column(c.name, c.type, primary_key=c.primary_key, nullable=c.nullable, unique=c.unique)
            for c in Product.__table__.columns
            if c.name != "sort_order"
        ],
    )
    old.create(blank_engine)
    now = datetime.now(timezone.utc)
    with blank_engine.begin() as conn:
        conn.execute(old.insert().values(
            slug="old", name_ko="구", name_en="Old", name_zh="旧", name_ja="",
            description_ko="", description_en="", description_zh="", description_ja="",
            image_url="", image_urls="[]", specifications="{}", is_featured=False, created_at=now, updated_at=now,
        ))
    monkeypatch.setattr(database, "engine", blank_engine)

    database.create_db_and_tables()
    database.create_db_and_tables()  # 시작할 때마다 불려도 안전

    col = next(c for c in inspect(blank_engine).get_columns("product") if c["name"] == "sort_order")
    assert col["nullable"] is False
    assert "0" in str(col["default"])
    with blank_engine.connect() as conn:
        assert conn.execute(text("SELECT sort_order FROM product WHERE slug = 'old'")).scalar_one() == 0

    with Session(blank_engine) as session:
        run_seeder(session)
        rows = session.exec(select(Product).order_by(Product.sort_order, Product.id)).all()
        assert [p.slug for p in rows] == [p["slug"] for p in SEED_PRODUCTS]


def test_reorder_alone_keeps_updated_at(session, tmp_path, monkeypatch):
    # 시드에서 자리만 바뀌면 sort_order만 바뀌고 updated_at은 그대로, 내용이 바뀌면 갱신
    from app.seed import seed_data

    seed_data.run_seeder(session)
    slug = SEED_PRODUCTS[0]["slug"]
    row = session.exec(select(Product).where(Product.slug == slug)).one()
    stamp = row.updated_at

    (tmp_path / "categories.json").write_text(json.dumps(SEED_CATEGORIES, ensure_ascii=False), encoding="utf-8")
    reordered = list(reversed(SEED_PRODUCTS))
    (tmp_path / "products.json").write_text(json.dumps(reordered, ensure_ascii=False), encoding="utf-8")
    monkeypatch.setattr(seed_data, "SEED_DIR", tmp_path)
    seed_data.run_seeder(session)
    session.refresh(row)
    assert row.sort_order == len(SEED_PRODUCTS) - 1
    assert row.updated_at == stamp

    reordered[-1] = {**reordered[-1], "name_ko": "바뀐 이름"}
    (tmp_path / "products.json").write_text(json.dumps(reordered, ensure_ascii=False), encoding="utf-8")
    seed_data.run_seeder(session)
    session.refresh(row)
    assert row.name_ko == "바뀐 이름"
    assert row.updated_at != stamp


def test_seed_products_are_complete():
    # 시드의 모든 상품: 카테고리 존재, slug 중복 없음, 사진 파일 존재, 사양 JSON 유효
    category_slugs = {c["slug"] for c in SEED_CATEGORIES}
    slugs = [p["slug"] for p in SEED_PRODUCTS]
    assert len(slugs) == len(set(slugs))
    for p in SEED_PRODUCTS:
        assert p["category_slug"] in category_slugs, p["slug"]
        for loc in LOCALES:
            assert p[f"name_{loc}"] and p[f"description_{loc}"], (p["slug"], loc)
        urls = json.loads(p["image_urls"])
        assert urls and urls[0] == p["image_url"], p["slug"]
        assert isinstance(json.loads(p["specifications"]), dict)
        if FRONTEND.exists():
            for url in urls:
                assert (FRONTEND / "public" / url.lstrip("/")).is_file(), url


def test_seed_products_have_locale_copy():
    # 프론트는 messages/*.json의 productItems로 이름·설명·사양을 덮어쓴다 — 4개 언어 모두 있어야 한다
    if not FRONTEND.exists():
        pytest.skip("frontend 폴더 없음")
    for loc in LOCALES:
        items = json.loads((FRONTEND / "src" / "messages" / f"{loc}.json").read_text(encoding="utf-8"))["productItems"]
        for p in SEED_PRODUCTS:
            item = items.get(p["slug"])
            assert item and item["name"] and item["desc"] and item["specs"], (loc, p["slug"])
            assert len(item["specs"]) == len(json.loads(p["specifications"])), (loc, p["slug"])
