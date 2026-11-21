from datetime import datetime, timezone

from sqlmodel import Field, Relationship, SQLModel

from app.models.category import Category


class Product(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    name_ko: str
    name_en: str
    name_zh: str
    name_ja: str = ""
    description_ko: str = ""
    description_en: str = ""
    description_zh: str = ""
    description_ja: str = ""
    category_id: int | None = Field(default=None, foreign_key="category.id")
    category: Category | None = Relationship(back_populates="products")
    image_url: str = ""
    image_urls: str = "[]"
    specifications: str = "{}"
    is_featured: bool = False
    # DB 기본값도 0으로 둔다(시작 시 ALTER로 넣은 프로덕션 컬럼과 같은 모양 → 예전 코드로 되돌려도 INSERT 가능)
    sort_order: int = Field(default=0, sa_column_kwargs={"server_default": "0"})
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
