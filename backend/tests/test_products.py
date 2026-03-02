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
