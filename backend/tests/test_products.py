from app.models.category import Category
from app.models.product import Product


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
    assert len(products) == 18
    assert len(categories) == 5
    assert {c.slug for c in categories} == {"dress", "long-pants", "shorts", "top", "set"}

    # 재실행해도 중복 생성 없음
    run_seeder(session)
    assert len(session.exec(select(Product)).all()) == 18

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
