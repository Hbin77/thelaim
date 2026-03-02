import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.database import get_session
from app.main import app
from app.models.category import Category
from app.models.product import Product


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="sample_category")
def sample_category_fixture(session: Session):
    category = Category(
        slug="winter",
        name_ko="겨울의류",
        name_en="Winter Clothing",
        name_zh="冬季服装",
        description_ko="고품질 겨울 의류",
        description_en="Premium winter clothing",
        description_zh="优质冬季服装",
        icon="snowflake",
        sort_order=1,
    )
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


@pytest.fixture(name="sample_product")
def sample_product_fixture(session: Session, sample_category: Category):
    product = Product(
        slug="test-jacket",
        name_ko="테스트 자켓",
        name_en="Test Jacket",
        name_zh="测试夹克",
        description_ko="테스트용 자켓입니다",
        description_en="A test jacket",
        description_zh="测试用夹克",
        category_id=sample_category.id,
        image_url="/images/test.jpg",
        image_urls='["/images/test1.jpg", "/images/test2.jpg"]',
        specifications='{"material": "cotton", "sizes": ["S", "M", "L"]}',
        is_featured=True,
    )
    session.add(product)
    session.commit()
    session.refresh(product)
    return product
